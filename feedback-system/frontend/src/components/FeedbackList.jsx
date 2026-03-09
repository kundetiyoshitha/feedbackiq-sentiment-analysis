import React, { useState } from 'react';
import { feedbackService } from '../services/api.js';

function SentimentBadge({ label }) {
  const icons = { Positive: '↑', Negative: '↓', Neutral: '→' };
  return (
    <span className={`badge ${label}`}>
      <span className="badge-dot"></span>
      {icons[label]} {label}
    </span>
  );
}

function CompoundScore({ value }) {
  const cls = value >= 0.05 ? 'pos' : value <= -0.05 ? 'neg' : 'neu';
  return (
    <span className={`compound-score ${cls}`}>
      {value >= 0 ? '+' : ''}{value}
    </span>
  );
}

function Avatar({ name }) {
  const initials = name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return <div className="avatar">{initials}</div>;
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });
}

export default function FeedbackList({ feedbacks, loading, onDelete }) {
  const [filter, setFilter] = useState('All');
  const [deletingId, setDeletingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const filters = ['All', 'Positive', 'Negative', 'Neutral'];

  const filtered = filter === 'All'
    ? feedbacks
    : feedbacks.filter(f => f.sentiment_label === filter);

  async function handleDelete(id) {
    if (!window.confirm('Delete this feedback entry?')) return;
    setDeletingId(id);
    try {
      await feedbackService.delete(id);
      onDelete(id);
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  }

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner dark"></div>
        <span>Loading feedback...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="feedback-section-header">
        <h3>All Feedback <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.9rem' }}>({filtered.length} entries)</span></h3>
        <div className="filter-tabs">
          {filters.map(f => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💬</div>
            <h4>No feedback yet</h4>
            <p>
              {filter === 'All'
                ? 'No feedback has been submitted. Be the first to share your thoughts!'
                : `No ${filter.toLowerCase()} feedback found.`}
            </p>
          </div>
        ) : (
          <div className="feedback-table-wrapper">
            <table className="feedback-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Message</th>
                  <th>Sentiment</th>
                  <th>Compound</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(fb => (
                  <tr key={fb.id}>
                    <td>
                      <div className="name-cell">
                        <Avatar name={fb.name} />
                        <div>
                          <div className="name-text">{fb.name}</div>
                          <div className="email-text">{fb.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div
                        className="message-cell"
                        title={fb.message}
                        onClick={() => setExpandedId(expandedId === fb.id ? null : fb.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        {expandedId === fb.id
                          ? fb.message
                          : fb.message.length > 80
                            ? fb.message.slice(0, 80) + '…'
                            : fb.message}
                      </div>
                    </td>
                    <td>
                      <SentimentBadge label={fb.sentiment_label} />
                    </td>
                    <td>
                      <CompoundScore value={parseFloat(fb.sentiment_compound)} />
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                      {formatDate(fb.created_at)}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button
                        className="btn btn-icon"
                        onClick={() => handleDelete(fb.id)}
                        disabled={deletingId === fb.id}
                        title="Delete feedback"
                        style={{ margin: '0 auto' }}
                      >
                        {deletingId === fb.id ? (
                          <span className="spinner dark" style={{ width: 14, height: 14 }}></span>
                        ) : '🗑'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
