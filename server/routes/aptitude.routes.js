const express = require('express');
const router = express.Router();

const {
  createQuestion,
  getQuestions,
  getQuestionById,
  deleteQuestion,
  saveAttempt,
  getMyStats,
  getLeaderboard
} = require('../controllers/aptitude.controller');

const { protect, authorize } = require('../middleware/auth.middleware');

router
  .route('/')
  .post(protect, authorize('admin'), createQuestion)
  .get(getQuestions);

router.post('/attempt', protect, saveAttempt);
router.get('/stats/me', protect, getMyStats);
router.get('/leaderboard', protect, getLeaderboard);

router
  .route('/:id')
  .get(getQuestionById)
  .delete(protect, authorize('admin'), deleteQuestion);

module.exports = router;

