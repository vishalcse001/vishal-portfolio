const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// REGISTER ROUTE: Sirf ek baar admin account banane ke liye
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check agar admin pehle se hai
    const adminExists = await Admin.findOne({ email });
    if (adminExists) return res.status(400).json({ message: "Admin already exists" });

    // Password ko secure (hash) karna
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Naya admin save karna
    const newAdmin = new Admin({ email, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: "Admin created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGIN ROUTE: Admin panel me ghusne ke liye
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Email check karo
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Invalid Credentials" });

    // Password match karo
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

    // Token banao (Digital ID card)
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, admin: { email: admin.email } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;