const mongoose = require('mongoose');

const aptitudeQuestionSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['Quantitative', 'Logical', 'Verbal']
  },
  topic: {
    type: String,
    required: true,
    trim: true
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  options: {
    type: [String],
    validate: {
      validator: function(value) {
        return Array.isArray(value) && value.length === 4;
      },
      message: 'Options must be an array of exactly 4 strings'
    },
    required: true
  },
  correctOptionIndex: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'easy'
  },
  explanation: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AptitudeQuestion', aptitudeQuestionSchema);

