const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'New Adventure'
  },
  scenario: {
    type: String,
    enum: ['space-colony', 'post-apocalyptic', 'fantasy', 'historical', 'cyberpunk'],
    default: 'space-colony'
  },
  character: {
    name: { type: String, default: 'Commander' },
    role: { type: String, default: 'Colony Leader' }
  },
  history: [
    {
      role: {
        type: String,
        enum: ['user', 'ai', 'system'],
        required: true
      },
      text: {
        type: String,
        required: true
      },
      // For user inputs, this can be 'action' or 'continue'
      inputType: {
        type: String,
        enum: ['action', 'continue', 'narration'],
        default: 'narration'
      },
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Session', SessionSchema);

