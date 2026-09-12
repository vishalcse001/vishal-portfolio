const express = require('express')
const cors = require('cors')
const { Resend } = require('resend')
require('dotenv').config()
const mongoose = require('mongoose');
const projectRoutes = require('./routes/projectRoutes');

const app = express()
const resend = new Resend(process.env.RESEND_API_KEY)

app.use(cors())
app.use(express.json())
app.use('/api/projects', projectRoutes);

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' })
  }

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

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolioDB')
  .then(() => console.log("✅ MongoDB Connected successfully!"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})