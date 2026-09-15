const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  category: { 
    type: String, 
    required: true, 
    enum: ['Experience', 'Education', 'Certification'] // Ye 3 options allowed hain
  },
  role: { type: String, required: true },
  company: { type: String, required: true },
  duration: { type: String, required: true },
  location: { type: String, required: true },
  current: { type: Boolean, default: false },
  description: { type: [String], required: true }
});

module.exports = mongoose.model('Experience', experienceSchema);