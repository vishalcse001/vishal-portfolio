const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');
const authMiddleware = require('../middleware/authMiddleware'); // Tumhara Security Guard

// 1. GET: Public ke dekhne ke liye (No Guard)
router.get('/', async (req, res) => {
  try {
    const experiences = await Experience.find();
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. POST: Admin dwara naya Add karne ke liye (Guard Lagaya)
router.post('/', authMiddleware, async (req, res) => {
  const experience = new Experience(req.body);
  try {
    const newExperience = await experience.save();
    res.status(201).json(newExperience);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. DELETE: Admin dwara Delete karne ke liye (Guard Lagaya)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ message: "Experience deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;