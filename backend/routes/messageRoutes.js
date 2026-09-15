const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const authMiddleware = require('../middleware/authMiddleware');
const nodemailer = require('nodemailer');

// Email bhejne ka setup (Tumhare .env wale email aur password se)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 1. GET: Saare Inbox Messages dekhna (Sirf Admin ke liye)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }); // Naye messages upar
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. DELETE: Message ko delete karna
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. POST: Dashboard se user ko Email Reply karna
router.post('/reply/:id', authMiddleware, async (req, res) => {
  try {
    const { replyText } = req.body;
    const msg = await Message.findById(req.params.id);
    if (!msg) return res.status(404).json({ message: "Message not found" });

    // User ko email ka format
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: msg.email,
      subject: `Reply to your inquiry on Vishal's Portfolio`,
      text: `Hi ${msg.name},\n\n${replyText}\n\nBest Regards,\nVishal Yadav\nFull-Stack Developer`
    };

    await transporter.sendMail(mailOptions); // Email bhej do
    
    msg.replied = true; // Database me tick laga do ki reply ho gaya
    await msg.save();

    res.json({ message: "Reply sent successfully to user's Email!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;