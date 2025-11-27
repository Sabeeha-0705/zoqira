const UserProfile = require('../models/UserProfile.model');
const Conversation = require('../models/Conversation.model');
const { generateCoachReply } = require('../utils/communicationCoach.util');

// @desc    Get current user's communication profile (create default if missing)
// @route   GET /api/communication/profile/me
// @access  Private
exports.getMyProfile = async (req, res, next) => {
  try {
    let profile = await UserProfile.findOne({ user: req.user._id });

    if (!profile) {
      profile = await UserProfile.create({
        user: req.user._id,
      });
    }

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Update current user's communication profile
// @route   PUT /api/communication/profile/me
// @access  Private
exports.updateMyProfile = async (req, res, next) => {
  try {
    const allowedFields = ['level', 'goal', 'preferredAccent'];
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    let profile = await UserProfile.findOne({ user: req.user._id });

    if (!profile) {
      profile = await UserProfile.create({
        user: req.user._id,
        ...updates,
      });
    } else {
      Object.assign(profile, updates);
      await profile.save();
    }

    return res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Start a new conversation
// @route   POST /api/communication/conversations
// @access  Private
exports.startConversation = async (req, res, next) => {
  try {
    const { context } = req.body;

    const conversation = await Conversation.create({
      user: req.user._id,
      context: context || 'general',
      messages: [],
    });

    return res.status(201).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Append user message and stub AI reply
// @route   POST /api/communication/conversations/:id/message
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required',
      });
    }

    const conversation = await Conversation.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found',
      });
    }

    // Get user profile to adjust reply tone
    const profile = await UserProfile.findOne({ user: req.user._id });

    const userMessage = {
      role: 'user',
      content: content.trim(),
      createdAt: new Date(),
    };

    const coachReplyText = generateCoachReply({
      goal: profile?.goal,
      context: conversation.context,
      userMessage: content.trim(),
    });

    const assistantMessage = {
      role: 'assistant',
      content: coachReplyText,
      createdAt: new Date(),
    };

    conversation.messages.push(userMessage, assistantMessage);
    await conversation.save();

    return res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    return next(error);
  }
};

// @desc    Get recent conversations for current user
// @route   GET /api/communication/conversations
// @access  Private
exports.getMyConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    return next(error);
  }
};


