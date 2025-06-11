const mongoose = require('mongoose');

const ScenarioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  key: {
    type: String,
    required: true,
    unique: true,
    enum: ['space-colony', 'post-apocalyptic', 'fantasy', 'historical', 'cyberpunk']
  },
  description: {
    type: String,
    required: true
  },
  initialPrompt: {
    type: String,
    required: true
  },
  systemInstructions: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Scenario', ScenarioSchema);

