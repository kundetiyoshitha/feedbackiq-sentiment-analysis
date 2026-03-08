import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000
});

// Response interceptor for unified error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export const feedbackService = {
  /**
   * Submit new feedback with NLP sentiment analysis
   * @param {{ name: string, email: string, message: string }} data
   */
  async submit(data) {
    const res = await api.post('/feedback', data);
    return res.data;
  },

  /**
   * Fetch all feedback entries
   */
  async getAll() {
    const res = await api.get('/feedback');
    return res.data;
  },

  /**
   * Fetch analytics summary (totals per sentiment)
   */
  async getAnalytics() {
    const res = await api.get('/feedback/analytics');
    return res.data;
  },

  /**
   * Delete a feedback entry by ID
   * @param {number} id
   */
  async delete(id) {
    const res = await api.delete(`/feedback/${id}`);
    return res.data;
  }
};

export default api;
