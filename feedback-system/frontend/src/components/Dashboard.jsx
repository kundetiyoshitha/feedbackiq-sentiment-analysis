import React, { useEffect, useState, useCallback } from 'react';
import { feedbackService } from '../services/api.js';
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

const COLORS = { Positive: '#10B981', Negative: '#EF4444', Neutral: '#F59E0B' };

function StatCard({ type, icon, label, value, total, color, bg }) {
  const pct = total > 0 && type !== 'total' ? Math.round((value / total) * 100) : null;
  return (
    <div style={{
      background: bg || '#fff',
      borderRadius: 16,
      padding: '24px 20px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
      border: `1px solid ${color}20`,
      display: 'flex', flexDirection: 'column', gap: 8,
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'default'
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${color}25`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.07)'; }}
    >
      <div style={{ fontSize: '1.8rem' }}>{icon}</div>
      <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2rem', color: color || '#1E293B' }}>
        {value}
      </div>
      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#64748B' }}>{label}</div>
      {pct !== null && (
        <>
          <div style={{ height: 6, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden', marginTop: 4 }}>
            <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99, transition: 'width 0.8s ease' }}></div>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{pct}% of total</div>
        </>
      )}
    </div>
  );
}

function buildTrendData(feedbacks) {
  const map = {};
  feedbacks.forEach(f => {
    const date = new Date(f.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!map[date]) map[date] = { date, Positive: 0, Negative: 0, Neutral: 0 };
    map[date][f.sentiment_label] = (map[date][f.sentiment_label] || 0) + 1;
  });
  return Object.values(map).slice(-10);
}

export default function Dashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [analytics, setAnalytics] = useState({ total: 0, positive: 0, negative: 0, neutral: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError('');
    try {
      const [fbRes, analyticsRes] = await Promise.all([
        feedbackService.getAll(),
        feedbackService.getAnalytics()
      ]);
      setFeedbacks(fbRes.data || []);
      setAnalytics(analyticsRes.data || { total: 0, positive: 0, negative: 0, neutral: 0 });
    } catch (err) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  function handleDelete(id) {
    setFeedbacks(prev => prev.filter(f => f.id !== id));
    setAnalytics(prev => {
      const removed = feedbacks.find(f => f.id === id);
      if (!removed) return prev;
      const label = removed.sentiment_label.toLowerCase();
      return { ...prev, total: prev.total - 1, [label]: Math.max(0, prev[label] - 1) };
    });
  }

  const pieData = [
    { name: 'Positive', value: analytics.positive },
    { name: 'Negative', value: analytics.negative },
    { name: 'Neutral', value: analytics.neutral }
  ].filter(d => d.value > 0);

  const trendData = buildTrendData(feedbacks);

  const positivePct = analytics.total > 0 ? Math.round((analytics.positive / analytics.total) * 100) : 0;
  const negativePct = analytics.total > 0 ? Math.round((analytics.negative / analytics.total) * 100) : 0;
  const neutralPct = analytics.total > 0 ? Math.round((analytics.neutral / analytics.total) * 100) : 0;

  return (
    <>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #1E293B 0%, #2d3f5f 100%)',
        padding: '48px 24px 64px', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 50%, rgba(16,185,129,0.15) 0%, transparent 60%)', pointerEvents: 'none' }}></div>
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(37,99,235,0.2)', border: '1px solid rgba(37,99,235,0.4)',
            color: '#93C5FD', fontSize: '0.78rem', fontWeight: 600,
            letterSpacing: '0.08em', textTransform: 'uppercase',
            padding: '6px 14px', borderRadius: 99, marginBottom: 16
          }}>📊 Analytics Dashboard</div>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, color: '#fff', marginBottom: 10, lineHeight: 1.2 }}>
            Feedback Intelligence Center
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', maxWidth: 500, marginBottom: 20 }}>
            Real-time sentiment analysis powered by VADER NLP. Monitor customer satisfaction at a glance.
          </p>
          <button
            onClick={() => fetchData(true)}
            disabled={refreshing}
            style={{
              padding: '10px 22px',
              background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff', borderRadius: 99, cursor: 'pointer',
              fontSize: '0.85rem', fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 8,
              transition: 'all 0.2s', opacity: refreshing ? 0.7 : 1
            }}
            onMouseEnter={e => !refreshing && (e.currentTarget.style.background = 'rgba(255,255,255,0.18)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
          >
            {refreshing ? <><span className="spinner" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#fff' }}></span> Refreshing...</> : '🔄 Refresh Analytics'}
          </button>
        </div>
      </div>

      <div className="page-container" style={{ marginTop: -24 }}>

        {error && (
          <div className="alert error" style={{ marginBottom: 24 }}>
            <span>⚠️</span>
            <div>
              <strong>Failed to load dashboard</strong>
              <div style={{ marginTop: 4, fontSize: '0.85rem' }}>{error}</div>
              <button onClick={() => fetchData()} style={{ marginTop: 10, padding: '6px 16px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: 99, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Retry</button>
            </div>
          </div>
        )}

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          <StatCard type="total" icon="📋" label="Total Feedback" value={loading ? '—' : analytics.total} total={analytics.total} color="#2563EB" />
          <StatCard type="positive" icon="😊" label="Positive" value={loading ? '—' : analytics.positive} total={analytics.total} color="#10B981" bg="#F0FDF4" />
          <StatCard type="negative" icon="😔" label="Negative" value={loading ? '—' : analytics.negative} total={analytics.total} color="#EF4444" bg="#FFF1F1" />
          <StatCard type="neutral" icon="😐" label="Neutral" value={loading ? '—' : analytics.neutral} total={analytics.total} color="#F59E0B" bg="#FFFBEB" />
        </div>

        {/* Statistics Summary */}
        <div style={{
          background: '#fff', borderRadius: 16, padding: '24px 28px',
          boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #F1F5F9',
          marginBottom: 28
        }}>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.05rem', color: '#1E293B', marginBottom: 20 }}>
            📈 Statistics Summary
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
            {[
              { label: 'Total Feedback Collected', value: loading ? '—' : analytics.total, color: '#2563EB' },
              { label: 'Positive Sentiment', value: loading ? '—' : `${positivePct}%`, color: '#10B981' },
              { label: 'Negative Sentiment', value: loading ? '—' : `${negativePct}%`, color: '#EF4444' },
              { label: 'Neutral Sentiment', value: loading ? '—' : `${neutralPct}%`, color: '#F59E0B' }
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center', padding: '16px 12px', background: '#F8FAFC', borderRadius: 12 }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.8rem', color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 4, lineHeight: 1.4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Row */}
        {!loading && feedbacks.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 28 }}>

            {/* Pie Chart */}
            <div style={{ background: '#fff', borderRadius: 16, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #F1F5F9' }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.05rem', color: '#1E293B', marginBottom: 20 }}>
                🥧 Sentiment Distribution
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} feedbacks`, '']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Line Chart */}
            <div style={{ background: '#fff', borderRadius: 16, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #F1F5F9' }}>
              <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.05rem', color: '#1E293B', marginBottom: 20 }}>
                📈 Sentiment Trend Over Time
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94A3B8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="Positive" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981', r: 4 }} />
                  <Line type="monotone" dataKey="Negative" stroke="#EF4444" strokeWidth={2} dot={{ fill: '#EF4444', r: 4 }} />
                  <Line type="monotone" dataKey="Neutral" stroke="#F59E0B" strokeWidth={2} dot={{ fill: '#F59E0B', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Recent Feedback Table */}
        <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid #F1F5F9', overflow: 'hidden', marginBottom: 28 }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.05rem', color: '#1E293B', margin: 0 }}>
              💬 Recent Feedback
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{feedbacks.length} entries</span>
          </div>

          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>Loading feedback...</div>
          ) : feedbacks.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#94A3B8' }}>No feedback submitted yet.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['Name', 'Sentiment', 'Message', 'Category', 'Score', 'Date', ''].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {feedbacks.map((f, i) => {
                    const labelColor = COLORS[f.sentiment_label] || '#94A3B8';
                    const labelBg = { Positive: '#ECFDF5', Negative: '#FEF2F2', Neutral: '#FFFBEB' }[f.sentiment_label] || '#F1F5F9';
                    return (
                      <tr key={f.id} style={{ borderTop: '1px solid #F1F5F9', background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#F0F9FF'}
                        onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? '#fff' : '#FAFAFA'}
                      >
                        <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1E293B', whiteSpace: 'nowrap' }}>{f.name}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ background: labelBg, color: labelColor, padding: '4px 12px', borderRadius: 99, fontWeight: 700, fontSize: '0.78rem' }}>
                            {{ Positive: '😊', Negative: '😔', Neutral: '😐' }[f.sentiment_label]} {f.sentiment_label}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#475569', maxWidth: 280 }}>
                          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 260 }} title={f.message}>
                            {f.message}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#64748B', whiteSpace: 'nowrap' }}>
                          {f.category || '—'}
                        </td>
                        <td style={{ padding: '14px 16px', fontWeight: 700, color: labelColor, whiteSpace: 'nowrap' }}>
                          {f.sentiment_score}
                        </td>
                        <td style={{ padding: '14px 16px', color: '#94A3B8', whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                          {new Date(f.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <button
                            onClick={() => handleDelete(f.id)}
                            style={{ background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, transition: 'all 0.15s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#EF4444'; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#FEF2F2'; e.currentTarget.style.color = '#EF4444'; }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer style={{ textAlign: 'center', padding: '24px 0', borderTop: '1px solid #F1F5F9', color: '#94A3B8', fontSize: '0.82rem', lineHeight: 1.8 }}>
          <div style={{ fontWeight: 700, color: '#64748B', marginBottom: 4 }}>FeedbackIQ – Customer Feedback Intelligence Platform</div>
          <div>Built with React, Node.js, MySQL, and VADER NLP</div>
          <div style={{ marginTop: 4 }}>© 2026 FeedbackIQ</div>
        </footer>

      </div>
    </>
  );
}
