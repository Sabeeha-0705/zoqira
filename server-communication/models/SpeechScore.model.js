const mongoose = require("mongoose");

const wordIssueSchema = new mongoose.Schema({
  word: String,
  expected: String,
  type: String, // substitution / omission / insertion
});

const speechScoreSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ConversationSession",
      required: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    pronunciation: { type: Number, min: 0, max: 100 },
    fluency: { type: Number, min: 0, max: 100 },
    grammar: { type: Number, min: 0, max: 100 },
    fillerWordsCount: { type: Number, default: 0 },
    wordIssues: [wordIssueSchema],
  },
  { timestamps: true }
);

const SpeechScore = mongoose.model("SpeechScore", speechScoreSchema);
module.exports = SpeechScore;
