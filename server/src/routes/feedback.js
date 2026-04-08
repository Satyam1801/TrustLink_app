const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedback');
const auth = require('../middleware/auth');

// 🔱 POST: Add new feedback (Protected)
router.post('/', auth, feedbackController.addFeedback);

// 🔱 GET: Fetch all feedbacks (Admin Protected)
router.get('/', auth, feedbackController.getFeedbacks);

module.exports = router;
