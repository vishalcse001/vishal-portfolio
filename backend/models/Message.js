const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  replied: { type: Boolean, default: false } // Check karne ke liye ki reply kiya ya nahi
}, { timestamps: true }); // Isse date aur time apne aap save ho jayega

module.exports = mongoose.model('Message', messageSchema);