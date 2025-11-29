const mongoose = require("mongoose");

const quizAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["verbal", "quantitative", "logical"],
      required: true,
    },
    questions: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        selectedOptionIndex: Number,
        correctOptionIndex: Number,
        isCorrect: Boolean,
      },
    ],
    score: {
      type: Number,
      default: 0,
    },
    pointsEarned: {
      type: Number,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
    correctAnswers: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number, // in seconds
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);
