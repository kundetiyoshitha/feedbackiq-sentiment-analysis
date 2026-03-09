const FeedbackModel = require('../models/feedbackModel');
const { analyzeSentiment } = require('../utils/sentimentAnalyzer');

const FeedbackController = {
  async submitFeedback(req, res, next) {
    try {
      const { name, email, category, rating, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({
          success: false,
          error: 'Name, email, and message are required.'
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email address.'
        });
      }

      const sentiment = analyzeSentiment(message);

      await FeedbackModel.create({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        category: category || null,
        rating: rating || 0,
        message: message.trim(),
        sentiment_label: sentiment.label,
        sentiment_score: sentiment.compound,
        positive_score: sentiment.positive,
        negative_score: sentiment.negative,
        neutral_score: sentiment.neutral
      });

      res.status(201).json({
        success: true,
        message: 'Feedback submitted successfully!',
        sentiment
      });
    } catch (err) {
      next(err);
    }
  },

  async getAllFeedback(req, res, next) {
    try {
      const feedbacks = await FeedbackModel.getAll();
      res.json({ success: true, data: feedbacks });
    } catch (err) {
      next(err);
    }
  },

  async deleteFeedback(req, res, next) {
    try {
      const { id } = req.params;
      const result = await FeedbackModel.delete(id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, error: 'Feedback not found.' });
      }
      res.json({ success: true, message: 'Feedback deleted successfully.' });
    } catch (err) {
      next(err);
    }
  },

  async getAnalytics(req, res, next) {
    try {
      const analytics = await FeedbackModel.getAnalytics();
      res.json({ success: true, data: analytics });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = FeedbackController;
