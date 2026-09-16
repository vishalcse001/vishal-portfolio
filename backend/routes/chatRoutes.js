const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');
const Project = require('../models/Project');
const Experience = require('../models/Experience');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
      - Role: Full-Stack Web Developer & AI/ML Enthusiast
      - Education & Timeline (From Database):
      ${experienceText}

      Projects Built (From Database):
      ${projectsText}

      User Question: ${message}
    `;
    // Calling Gemini Model
    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash', 
      contents: livePortfolioContext,
    });

    res.json({ reply: response.text });
  } catch (err) {
    console.error("Chatbot RAG Error:", err);
    res.status(500).json({ reply: "Sorry, I am having trouble connecting to AI right now." });
  }
});

module.exports = router;