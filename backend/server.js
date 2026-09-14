const express = require('express')
const cors = require('cors')
const { Resend } = require('resend')
require('dotenv').config()
const mongoose = require('mongoose');
const projectRoutes = require('./routes/projectRoutes');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

const app = express()
const resend = new Resend(process.env.RESEND_API_KEY)

// Rate limiting for API requests to prevent spam
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 contact requests per hour
  message: 'Too many contact requests from this IP, please try again later'
});

app.use(cors())
app.use(express.json())
app.use('/api/', apiLimiter);
app.use('/api/projects', projectRoutes);

app.post('/api/contact', contactLimiter, [
  body('name').trim().notEmpty().withMessage('Name is required').escape(),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('message').trim().notEmpty().withMessage('Message is required').escape()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }

  const { name, email, message } = req.body

  try {
    await resend.emails.send({
      from: 'Portfolio Contact Form <onboarding@resend.dev>',
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Portfolio Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    })

    res.status(200).json({ success: 'Message sent successfully!' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to send message' })
  }
})

mongoose.connect(process.env.MONGO_URI, {
  family: 4 // Ye line Node.js ko strictly IPv4 use karne ko bolegi
})
.then(() => console.log("MongoDB Connected successfully!"))
.catch((err) => console.log("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})