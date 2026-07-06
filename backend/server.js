const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer')
require('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })

    await transporter.sendMail({
  from: `"Portfolio Contact Form" <${process.env.EMAIL_USER}>`,
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

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})