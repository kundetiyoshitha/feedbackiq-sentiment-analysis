const { pool } = require('../config/db');

const FeedbackModel = {
  async create({ name, email, category, rating, message, sentiment_label, sentiment_score, positive_score, negative_score, neutral_score }) {
    const sql = `
      INSERT INTO feedbacks 
        (name, email, category, rating, message, sentiment_label, sentiment_score, positive_score, negative_score, neutral_score)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(sql, [
      name,
      email,
      category || null,
      rating || 0,
      message,
      sentiment_label,
      sentiment_score,
      positive_score,
      negative_score,
      neutral_score
    ]);

    return result;
  },

  async getAll() {
    const [rows] = await pool.execute(
      'SELECT * FROM feedbacks ORDER BY created_at DESC'
    );
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM feedbacks WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM feedbacks WHERE id = ?',
      [id]
    );
    return result;
  },

  async getAnalytics() {
    const [totalRows] = await pool.execute(
      'SELECT COUNT(*) as total FROM feedbacks'
    );

    const [positiveRows] = await pool.execute(
      "SELECT COUNT(*) as count FROM feedbacks WHERE sentiment_label = 'Positive'"
    );

    const [negativeRows] = await pool.execute(
      "SELECT COUNT(*) as count FROM feedbacks WHERE sentiment_label = 'Negative'"
    );

    const [neutralRows] = await pool.execute(
      "SELECT COUNT(*) as count FROM feedbacks WHERE sentiment_label = 'Neutral'"
    );

    const [avgRows] = await pool.execute(
      'SELECT AVG(sentiment_score) as avg_score FROM feedbacks'
    );

    // Safe conversion to number
    const avgScore = Number(avgRows?.[0]?.avg_score || 0);

    return {
      total: totalRows[0].total,
      positive: positiveRows[0].count,
      negative: negativeRows[0].count,
      neutral: neutralRows[0].count,
      avg_score: Number(avgScore.toFixed(4))
    };
  }
};

module.exports = FeedbackModel;