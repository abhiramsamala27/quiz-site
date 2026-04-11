const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  timeTaken: { type: String, required: true },
  resume: { type: String }, // Store uploaded CV (optional)
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);
