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
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "Please ask a question!" });

    // 1. RAG: Database se live projects aur timeline fetch karo
    const projects = await Project.find();
    const experiences = await Experience.find();

    // 2. Data ko text format me convert karo taaki AI samajh sake
    const projectsText = projects.map(p => `- Title: ${p.title}\n  Description: ${p.description}\n  Tech Stack: ${p.techStack.join(', ')}`).join('\n');
    const experienceText = experiences.map(e => `- [${e.category}] Role: ${e.role} at ${e.company} (${e.duration}, ${e.location}). Details: ${e.description.join(' ')}`).join('\n');

    // 3. Dynamic Context Design
    const livePortfolioContext = `
      You are an expert AI recruiter assistant for Vishal Yadav's professional portfolio website. 
      Answer questions strictly and accurately based on the live database information provided below. Be polite, professional, and concise.
      
      CRITICAL INSTRUCTION: Vishal has COMPLETED his B.Tech degree (Duration: 2022-2026). Never use the word "pursuing" or say he is currently studying; always state that he has completed his B.Tech in Computer Science and Engineering.

      Candidate Profile:
      - Name: Vishal Yadav
      - Contact Number: +919336191749
      - Email:vishalyadav.95055@gmail.com
      - Role: Full-Stack Web Developer & AI/ML Enthusiast
      - Education & Timeline (From Database):
      ${experienceText}

      Projects Built (From Database):
      ${projectsText}

      User Question: ${message}
    `;

    // 4. Gemini call, retry + fallback ke saath
    const response = await generateContentWithFallback(livePortfolioContext);

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