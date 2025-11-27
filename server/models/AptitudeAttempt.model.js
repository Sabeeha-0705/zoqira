const mongoose = require('mongoose');

const aptitudeAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Quantitative', 'Logical', 'Verbal', 'Mixed']
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard', 'mixed'],
    required: true
  },
  correctCount: {
    type: Number,
    default: 0
  },
  totalCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AptitudeAttempt', aptitudeAttemptSchema);

// (Nothing to fix. The invalid/non-JS content has been removed. No code needed here.)