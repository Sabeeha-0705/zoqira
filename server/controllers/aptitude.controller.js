const AptitudeQuestion = require('../models/AptitudeQuestion.model');
const QuizAttempt = require('../models/QuizAttempt.model');
const UserProgress = require('../models/UserProgress.model');

// @desc Get all categories and topics
// GET /api/aptitude/categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await AptitudeQuestion.aggregate([
      {
        $group: {
          _id: '$category',
          topics: { $addToSet: '$topic' },
          count: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get questions by topic with random selection
// GET /api/aptitude/topics/:topic/questions?difficulty=easy&limit=10
exports.getQuestionsByTopic = async (req, res, next) => {
  try {
    const { topic } = req.params;
    const { difficulty, limit = 10 } = req.query;

    const filter = { topic };
    if (difficulty) filter.difficulty = difficulty;

    const questions = await AptitudeQuestion.find(filter)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Submit quiz attempt and calculate score
// POST /api/aptitude/attempts
// Body: { topic, category, questions: [{ questionId, selectedOptionIndex }], duration }
exports.submitAttempt = async (req, res, next) => {
  try {
    const { topic, category, questions, duration } = req.body;
    const userId = req.user.id;

    if (!topic || !category || !questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'topic, category, and questions are required',
      });
    }

    // Validate and score each question
    const scoredQuestions = [];
    let correctCount = 0;
    let pointsEarned = 0;

    for (const q of questions) {
      const question = await AptitudeQuestion.findById(q.questionId);
      if (!question) {
        return res.status(400).json({
          success: false,
          message: `Question ${q.questionId} not found`,
        });
      }

      const isCorrect = q.selectedOptionIndex === question.correctOptionIndex;
      if (isCorrect) {
        correctCount += 1;
        // Scoring: easy = 10, medium = 20, hard = 30
        const difficultyPoints = {
          easy: 10,
          medium: 20,
          hard: 30,
        };
        pointsEarned += difficultyPoints[question.difficulty] || 10;
      }

      scoredQuestions.push({
        questionId: question._id,
        selectedOptionIndex: q.selectedOptionIndex,
        correctOptionIndex: question.correctOptionIndex,
        isCorrect,
      });
    }

    const score = (correctCount / questions.length) * 100;

    // Save attempt
    const attempt = await QuizAttempt.create({
      user: userId,
      topic,
      category,
      questions: scoredQuestions,
      score,
      pointsEarned,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      duration: duration || 0,
    });

    // Update user progress
    let progress = await UserProgress.findOne({ user: userId });
    if (!progress) {
      progress = new UserProgress({ user: userId });
    }

    // Initialize topic stats if not exists
    if (!progress.topicStats.has(topic)) {
      progress.topicStats.set(topic, {
        attempts: 0,
        correct: 0,
        wrong: 0,
        streak: 0,
        lastAttempt: null,
        nextReview: null,
      });
    }

    const stats = progress.topicStats.get(topic);
    stats.attempts += 1;
    stats.correct += correctCount;
    stats.wrong += questions.length - correctCount;
    stats.lastAttempt = new Date();

    // Simple SRS: if correct, increase review time; if wrong, reset
    if (isCorrect) {
      stats.streak = (stats.streak || 0) + 1;
      const reviewDays = [1, 3, 7, 14][Math.min(stats.streak - 1, 3)];
      stats.nextReview = new Date(Date.now() + reviewDays * 24 * 60 * 60 * 1000);
    } else {
      stats.streak = 0;
      stats.nextReview = new Date(Date.now() + 1 * 24 * 60 * 60 * 1000); // 1 day
    }

    progress.topicStats.set(topic, stats);
    progress.totalPoints = (progress.totalPoints || 0) + pointsEarned;
    progress.totalAttempts = (progress.totalAttempts || 0) + 1;

    // Simple level assignment based on points
    if (progress.totalPoints >= 500) progress.level = 'advanced';
    else if (progress.totalPoints >= 200) progress.level = 'intermediate';
    else progress.level = 'beginner';

    await progress.save();

    res.status(201).json({
      success: true,
      message: 'Attempt submitted successfully',
      data: {
        attempt,
        progress: {
          totalPoints: progress.totalPoints,
          totalAttempts: progress.totalAttempts,
          level: progress.level,
          topicStats: Object.fromEntries(progress.topicStats),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get user's quiz attempts
// GET /api/aptitude/attempts?topic=...
exports.getAttempts = async (req, res, next) => {
  try {
    const { topic } = req.query;
    const userId = req.user.id;

    const filter = { user: userId };
    if (topic) filter.topic = topic;

    const attempts = await QuizAttempt.find(filter)
      .populate('user', 'name email username')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: attempts.length,
      data: attempts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get user progress
// GET /api/aptitude/progress
exports.getProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;

    let progress = await UserProgress.findOne({ user: userId });
    if (!progress) {
      progress = new UserProgress({ user: userId });
      await progress.save();
    }

    res.status(200).json({
      success: true,
      data: {
        totalPoints: progress.totalPoints,
        totalAttempts: progress.totalAttempts,
        level: progress.level,
        topicStats: Object.fromEntries(progress.topicStats),
      },
    });
  } catch (error) {
    next(error);
  }
};
};

// @desc    Get single aptitude question
// @route   GET /api/aptitude/:id
// @access  Public
exports.getQuestionById = async (req, res, next) => {
  try {
    const question = await AptitudeQuestion.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: question
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Delete aptitude question
// @route   DELETE /api/aptitude/:id
// @access  Private/Admin
exports.deleteQuestion = async (req, res, next) => {
  try {
    const question = await AptitudeQuestion.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }

    await question.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Question deleted successfully'
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Save aptitude attempt for current user
// @route   POST /api/aptitude/attempt
// @access  Private
exports.saveAttempt = async (req, res, next) => {
  try {
    const { category, difficulty, correctCount, totalCount } = req.body;

    if (!category || !difficulty || typeof correctCount !== 'number' || typeof totalCount !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'category, difficulty, correctCount and totalCount are required'
      });
    }

    const attempt = await AptitudeAttempt.create({
      user: req.user._id,
      category,
      difficulty,
      correctCount,
      totalCount
    });

    return res.status(201).json({
      success: true,
      data: attempt
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Get stats for current user
// @route   GET /api/aptitude/stats/me
// @access  Private
exports.getMyStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const attempts = await AptitudeAttempt.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10);

    const aggregate = await AptitudeAttempt.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalCorrect: { $sum: '$correctCount' },
          totalQuestions: { $sum: '$totalCount' },
          totalAttempts: { $sum: 1 }
        }
      }
    ]);

    const summary = aggregate[0] || { totalCorrect: 0, totalQuestions: 0, totalAttempts: 0 };
    const accuracy = summary.totalQuestions > 0
      ? Math.round((summary.totalCorrect / summary.totalQuestions) * 100)
      : 0;

    return res.status(200).json({
      success: true,
      stats: {
        totalAttempts: summary.totalAttempts,
        totalCorrect: summary.totalCorrect,
        totalQuestions: summary.totalQuestions,
        accuracy
      },
      attempts
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Get aptitude leaderboard (top users by correct answers)
// @route   GET /api/aptitude/leaderboard
// @access  Private
exports.getLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await AptitudeAttempt.aggregate([
      {
        $group: {
          _id: '$user',
          totalCorrect: { $sum: '$correctCount' },
          totalQuestions: { $sum: '$totalCount' },
          totalAttempts: { $sum: 1 }
        }
      },
      {
        $addFields: {
          accuracy: {
            $cond: [
              { $gt: ['$totalQuestions', 0] },
              { $multiply: [{ $divide: ['$totalCorrect', '$totalQuestions'] }, 100] },
              0
            ]
          }
        }
      },
      { $sort: { totalCorrect: -1, accuracy: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          user: {
            id: '$user._id',
            name: '$user.name',
            email: '$user.email',
            role: '$user.role'
          },
          totalCorrect: 1,
          totalQuestions: 1,
          totalAttempts: 1,
          accuracy: 1
        }
      }
    ]);

    return res.status(200).json({
      success: true,
      leaderboard
    });
  } catch (error) {
    return next(error);
  }
};

