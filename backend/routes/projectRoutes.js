const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // Naya Upload Guard import kiya

// 1. GET: Public ke dekhne ke liye
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. POST: Admin dwara naya Project Add karna (File upload ke sath)
// upload.single('image') ka matlab hai ki request me 'image' naam ki ek file aayegi
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const projectData = {
      title: req.body.title,
      description: req.body.description,
      techStack: req.body.techStack ? req.body.techStack.split(',').map(tech => tech.trim()) : [],
      githubLink: req.body.githubLink,
      liveLink: req.body.liveLink,
    };

    // Agar photo upload hui hai, toh Cloudinary ka URL data me jod do
    if (req.file && req.file.path) {
      projectData.image = req.file.path; 
    }

    const project = new Project(projectData);
    const newProject = await project.save();
    res.status(201).json(newProject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 3. DELETE: Admin dwara Delete karne ke liye
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;