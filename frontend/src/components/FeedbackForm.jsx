import React, { useState } from "react";
import { feedbackService } from "../services/api.js";

const MAX_MESSAGE_LENGTH = 1000;
const CATEGORIES = ["Product", "Service", "Website", "Support"];

/* ⭐ Star Rating */
function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div style={{ display: "flex", gap: 6 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          style={{
            fontSize: "1.8rem",
            cursor: "pointer",
            color: star <= (hovered || value) ? "#F59E0B" : "#D1D5DB",
            transition: "0.15s",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

/* 😊 Sentiment Result */
function SentimentResult({ sentiment }) {
  if (!sentiment) return null;

  const icons = {
    Positive: "😊",
    Negative: "😔",
    Neutral: "😐",
  };

  const colors = {
    Positive: "#10B981",
    Negative: "#EF4444",
    Neutral: "#F59E0B",
  };

  return (
    <div
      style={{
        marginTop: 24,
        borderRadius: 12,
        padding: 20,
        border: `2px solid ${colors[sentiment.label]}`,
        background: "#F9FAFB",
      }}
    >
      <h3 style={{ color: colors[sentiment.label] }}>
        {icons[sentiment.label]} {sentiment.label} Sentiment
      </h3>

      <p>
        <strong>Score:</strong>{" "}
        {Number(sentiment.compound || 0).toFixed(3)}
      </p>

      <div style={{ display: "flex", gap: 20 }}>
        <p>😊 Positive: {(sentiment.positive * 100).toFixed(1)}%</p>
        <p>😐 Neutral: {(sentiment.neutral * 100).toFixed(1)}%</p>
        <p>😔 Negative: {(sentiment.negative * 100).toFixed(1)}%</p>
      </div>
    </div>
  );
}

/* 📩 Feedback Form */
export default function FeedbackForm({ onSubmitSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    category: "",
    message: "",
    rating: 0,
  });

  const [loading, setLoading] = useState(false);
  const [sentimentResult, setSentimentResult] = useState(null);
  const [error, setError] = useState("");

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSentimentResult(null);

    try {
      const res = await feedbackService.submit({
        name: form.name,
        email: form.email,
        category: form.category,
        rating: form.rating,
        message: form.message,
      });

      const sentiment = res?.sentiment || res?.data?.sentiment;

      if (sentiment) {
        setSentimentResult(sentiment);
      }

      setForm({
        name: "",
        email: "",
        category: "",
        message: "",
        rating: 0,
      });

      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err) {
      setError(err.message || "Failed to submit feedback.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: 520,
        margin: "auto",
        background: "#fff",
        padding: 28,
        borderRadius: 14,
        boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
      }}
    >
      <h2>Share Your Feedback</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 14 }}
      >
        {/* Name */}
        <label>Full Name</label>
        <input
          type="text"
          name="name"
          placeholder="John Anderson"
          value={form.name}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        {/* Email */}
        <label>Email Address</label>
        <input
          type="email"
          name="email"
          placeholder="john@example.com"
          value={form.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        {/* Category */}
        <label>Category</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          style={inputStyle}
        >
          <option value="">Select Category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Rating */}
        <label>Your Experience</label>
        <StarRating
          value={form.rating}
          onChange={(val) =>
            setForm((prev) => ({ ...prev, rating: val }))
          }
        />

        {/* Message */}
        <label>Your Feedback</label>
        <textarea
          name="message"
          placeholder="Tell us about your experience..."
          value={form.message}
          onChange={handleChange}
          maxLength={MAX_MESSAGE_LENGTH}
          required
          style={{ ...inputStyle, height: 120 }}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 10,
            padding: 14,
            border: "none",
            borderRadius: 10,
            background: "linear-gradient(90deg,#4F46E5,#6366F1)",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "0.95rem",
          }}
        >
          {loading ? "Analyzing..." : "Submit & Analyze Sentiment"}
        </button>
      </form>

      <SentimentResult sentiment={sentimentResult} />
    </div>
  );
}

/* Input Styling */
const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  border: "1.5px solid #E5E7EB",
  borderRadius: 10,
  fontSize: "0.95rem",
  background: "#F9FAFB",
};