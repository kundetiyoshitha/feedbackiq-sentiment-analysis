const express = require('express');
const router = express.Router();
const {
  submitFeedback,
  getAllFeedback,
  getAnalytics,
  deleteFeedback
} = require('../controllers/feedbackController');

// GET  /api/feedback/analytics  — must be before /:id
router.get('/analytics', getAnalytics);

// GET  /api/feedback
router.get('/', getAllFeedback);

// POST /api/feedback
router.post('/', submitFeedback);

// DELETE /api/feedback/:id
router.delete('/:id', deleteFeedback);

module.exports = router;
