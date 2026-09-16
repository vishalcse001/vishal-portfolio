const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');
const Project = require('../models/Project');
const Experience = require('../models/Experience');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Agar primary model overload (503) ho jaye, toh inhe try karo
const MODEL_CHAIN = [
  'models/gemini-2.5-flash',
  'models/gemini-2.5-flash-lite',
  'models/gemini-1.5-flash',
];

// Helper: check karo ki error "overloaded / high demand" wala hai ya nahi
function isOverloadedError(err) {
  const status = err?.error?.code || err?.status || err?.status_code;
  const statusText = err?.error?.status;
  return status === 503 || statusText === 'UNAVAILABLE';
}

// Helper: exponential backoff ke saath ek model try karo
async function tryModelWithRetry(modelName, contents, maxRetries = 2) {
  let lastError;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await ai.models.generateContent({
        model: modelName,
        contents,
      });
    } catch (err) {
      lastError = err;
      if (isOverloadedError(err) && attempt < maxRetries - 1) {
        const delay = 800 * Math.pow(2, attempt); // 800ms, 1600ms...
        console.warn(`[${modelName}] overloaded, retrying in ${delay}ms (attempt ${attempt + 1})`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

// Helper: pura model chain try karo (fallback ke saath)
async function generateContentWithFallback(contents) {
  let lastError;
  for (const modelName of MODEL_CHAIN) {
    try {
      return await tryModelWithRetry(modelName, contents);
    } catch (err) {
      lastError = err;
      if (isOverloadedError(err)) {
        console.warn(`Model ${modelName} overloaded, trying next fallback model...`);
        continue; // agla model try karo
      }
      // Agar overload wala error nahi hai (jaise auth ya bad request), turant fail ho jao
      throw err;
    }
  }
  throw lastError;
}

router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ reply: "Please ask a question!" });

    // history = [{ role: 'user'|'assistant', text: '...' }, ...]  (optional, sent by frontend)
    const safeHistory = Array.isArray(history) ? history.slice(-10) : []; // last 10 turns is enough context

    // 1. RAG: Database se live projects aur timeline fetch karo
    const projects = await Project.find();
    const experiences = await Experience.find();

    // 2. Data ko text format me convert karo taaki AI samajh sake
    const projectsText = projects.map(p =>
      `- Title: ${p.title}\n  Description: ${p.description}\n  Tech Stack: ${p.techStack.join(', ')}${p.link ? `\n  Link: ${p.link}` : ''}`
    ).join('\n');

    const experienceText = experiences.map(e =>
      `- [${e.category}] Role: ${e.role} at ${e.company} (${e.duration}, ${e.location}). Details: ${e.description.join(' ')}`
    ).join('\n');

    // 3. Conversation history ko text me convert karo taaki model ko context mile
    const historyText = safeHistory.length
      ? safeHistory.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.text}`).join('\n')
      : '(No previous messages in this conversation.)';

    // 4. Smart, detailed system prompt
    const systemPrompt = `
You are "Vishal's AI Assistant" — a sharp, friendly, and knowledgeable AI recruiter-assistant embedded on Vishal Yadav's personal portfolio website. Your job is to help recruiters, hiring managers, and visitors quickly understand why Vishal is a strong candidate, using ONLY the live data given below.

## Personality & Tone
- Talk like a smart, confident human assistant — not a robotic FAQ bot.
- Be warm, concise, and professional. Avoid generic filler like "I am an AI and cannot..." — just answer helpfully.
- Match the user's language/style: if they write in Hinglish (Hindi + English mix), reply naturally in Hinglish. If they write in plain English, reply in English.
- Keep answers tight: 2-5 sentences for simple questions, a short bulleted list for anything with multiple points (skills, projects, experience). Never dump the entire database at once — pick what's relevant to the question.

## How to Answer
- Use conversation history to understand follow-up questions (e.g. if they previously asked about "SmartResume AI" and now ask "what tech stack did he use", answer about that specific project, not a random one).
- If asked something comparative or evaluative ("is he good for a backend role?", "why should we hire him?"), reason over the actual skills/projects/experience data and give a genuine, specific answer — don't just repeat the resume text.
- If asked something NOT covered by the data below (e.g. salary expectations, personal opinions, unrelated general knowledge), politely say you don't have that info and suggest contacting Vishal directly.
- If the question is vague, briefly ask a clarifying question OR give the most helpful general answer and offer to go deeper.
- Never invent projects, companies, dates, or skills that aren't in the data below.
- If asked for contact details, share them directly and offer to help with anything else.

## CRITICAL FACTUAL RULE
Vishal has COMPLETED his B.Tech degree (Duration: 2022-2026). NEVER say "pursuing" or imply he is currently studying — always state he has completed his B.Tech in Computer Science and Engineering.

## Candidate Profile
- Name: Vishal Yadav
- Role: Full-Stack Web Developer & AI/ML Enthusiast
- Contact: +919336191749 | vishalyadav.95055@gmail.com

## Education & Experience Timeline (Live from database)
${experienceText || '(No data available)'}

## Projects Built (Live from database)
${projectsText || '(No data available)'}

## Conversation so far
${historyText}

## Current user message
User: ${message}

Now reply as Vishal's AI Assistant, following all rules above. Reply with only the assistant's message — no labels, no "Assistant:" prefix.
    `;

    // 5. Gemini call, retry + fallback ke saath
    const response = await generateContentWithFallback(systemPrompt);

    res.json({ reply: response.text });
  } catch (err) {
    console.error("Chatbot RAG Error:", err);

    const overloaded = isOverloadedError(err);
    res.status(overloaded ? 503 : 500).json({
      reply: overloaded
        ? "AI thoda busy hai abhi (high demand). Please 10-15 seconds baad dobara try karein!"
        : "Sorry, I am having trouble connecting to AI right now.",
    });
  }
});

module.exports = router;