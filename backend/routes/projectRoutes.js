const express = require('express');
const router = express.Router();
const Project = require('../models/Project'); // Apna banaya hua model import kiya

// GET Request: Database se saare projects fetch karne ke liye (Frontend yahi use karega)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST Request: Naya project database me add karne ke liye (Hum Postman se test karenge)
router.post('/', async (req, res) => {
  const project = new Project(req.body);
  try {
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;