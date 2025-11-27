const express = require('express');
const router = express.Router();

const {
  getMyProfile,
  updateMyProfile,
  startConversation,
  sendMessage,
  getMyConversations,
} = require('../controllers/communication.controller');

const { protect } = require('../middleware/auth.middleware');

router.get('/profile/me', protect, getMyProfile);
router.put('/profile/me', protect, updateMyProfile);

router.post('/conversations', protect, startConversation);
router.post('/conversations/:id/message', protect, sendMessage);
router.get('/conversations', protect, getMyConversations);

module.exports = router;


