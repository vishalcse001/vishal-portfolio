const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Guard (Middleware) ko import kiya
const authMiddleware = require('../middleware/authMiddleware'); 

// 1. GET Request: Projects dekhne ke liye (Isme guard NAHI hai, kyunki public ko projects dikhne chahiye)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. POST Request: Naya project add karne ke liye (Isme guard LAGAYA hai)
router.post('/', authMiddleware, async (req, res) => {
  const project = new Project(req.body);
  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. DELETE Request: Project delete karne ke liye (Isme bhi guard LAGAYA hai)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;