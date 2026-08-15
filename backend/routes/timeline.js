const router = require('express').Router();
const db = require('../db/connection');
const { requireAuth } = require('../middleware/auth');
const parseJson = (v, f) => { try { return JSON.parse(v); } catch { return f; } };

// GET /api/timeline  – filters: category, stream, status
router.get('/', requireAuth, (req, res) => {
  const { category, stream, status } = req.query;
  let sql = 'SELECT * FROM timeline_events WHERE 1=1';
  const params = [];
  if (category) { sql += ' AND category=?'; params.push(category); }
  if (status) { sql += ' AND status=?'; params.push(status); }
  sql += ' ORDER BY event_date ASC';

  let events = db.prepare(sql).all(...params);

  // Auto-compute status based on date
  const now = new Date();
  events = events.map(e => {
    const eventDate = new Date(e.event_date);
    const diffDays = Math.ceil((eventDate - now) / (1000 * 60 * 60 * 24));
    let computedStatus = e.status;
    if (diffDays < 0) computedStatus = 'completed';
    else if (diffDays <= 14) computedStatus = 'due_soon';
    else computedStatus = 'upcoming';

    // Filter by stream
    if (stream) {
      const sf = parseJson(e.stream_filter, null);
      if (sf && !sf.includes(stream)) return null;
    }

    return {
      ...e,
      stream_filter: parseJson(e.stream_filter, null),
      daysLeft: diffDays,
      computedStatus,
      displayDate: eventDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
    };
  }).filter(Boolean);

  res.json(events);
});

module.exports = router;
