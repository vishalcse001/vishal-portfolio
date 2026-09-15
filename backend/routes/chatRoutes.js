const express = require('express');
const router = express.Router();
const { GoogleGenAI } = require('@google/genai');

// Gemini AI Setup (Using official @google/genai SDK)
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ reply: "Please ask a question!" });

    // Tumhara Professional Context (AI ko batane ke liye ki tum kaun ho)
    const portfolioContext = `
      You are an AI assistant for Vishal Yadav's professional portfolio website. 
      Answer questions strictly based on Vishal's profile. Be polite, professional, and concise.
      
      Profile Details:
      - Name: Vishal Yadav
      - Role: Full-Stack Web Developer & AI/ML Enthusiast
      - Education: B.Tech in Computer Science and Engineering from Rajarshi Rananjaya Sinh Institute of Management and Technology, Amethi (Graduating 2026). Completed 10th & 12th from Shri Shiv Pratap Inter College, Amethi (UP Board).
      - Technical Skills: JavaScript, Python, C, C++, Java, MERN Stack (MongoDB, Express.js, React.js, Node.js), Docker, Kubernetes, Git, Postman, VS Code.
      - Projects: 
        1. Real-Time AI Gym Trainer (Python, OpenCV, MediaPipe for posture monitoring).
        2. Intelligent AI Attendance System (Facial recognition, Python, OpenCV).
        3. Kubernetes-Based Container Deployment Platform (Docker, Kubernetes orchestration).
        4. Full-Stack Social Media Web App (React, Node, Express, MongoDB, JWT auth).
        5. Umang AI (Custom AI voice project using ElevenLabs).
      - Experience: Completed a 6-month MERN stack internship at Softpro India in Lucknow.
      - Contact: Recruiters can reach out via the contact form or email.

      User Question: ${message}
    `;

    // Calling Gemini Model
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: portfolioContext,
    });

    res.json({ reply: response.text });
  } catch (err) {
    console.error("Chatbot Error:", err);
    res.status(500).json({ reply: "Sorry, I am having trouble connecting to AI right now." });
  }
});

module.exports = router;