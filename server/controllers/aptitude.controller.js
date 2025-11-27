const AptitudeQuestion = require('../models/AptitudeQuestion.model');
const AptitudeAttempt = require('../models/AptitudeAttempt.model');

// @desc    Create new aptitude question
// @route   POST /api/aptitude
// @access  Private/Admin
exports.createQuestion = async (req, res, next) => {
  try {
    const question = await AptitudeQuestion.create(req.body);

    return res.status(201).json({
      success: true,
      data: question
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Get aptitude questions (with optional filters)
// @route   GET /api/aptitude
// @access  Public
exports.getQuestions = async (req, res, next) => {
  try {
    const { category, topic, difficulty } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;

    const questions = await AptitudeQuestion.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    return next(error);
  }
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

