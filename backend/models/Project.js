const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  techStack: {
    type: [String], // Array of strings (e.g., ['React', 'Node.js', 'Python'])
    required: true
  },
  githubLink: {
    type: String
  },
  liveLink: {
    type: String
  },
  image: {
    type: String // URL string for project image
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);