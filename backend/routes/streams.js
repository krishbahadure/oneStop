const router = require('express').Router();
const db = require('../db/connection');
const { requireAuth } = require('../middleware/auth');
const parseJson = (v, f) => { try { return JSON.parse(v); } catch { return f; } };

// GET /api/streams
router.get('/', requireAuth, (req, res) => {
  const streams = db.prepare('SELECT * FROM streams').all();
  const withSubjects = streams.map(s => ({
    ...s,
    careers: parseJson(s.careers, []),
    subjects: db.prepare('SELECT * FROM subjects WHERE stream_id=?').all(s.id),
  }));
  res.json(withSubjects);
});

// GET /api/streams/:id
router.get('/:id', requireAuth, (req, res) => {
  const stream = db.prepare('SELECT * FROM streams WHERE id=?').get(req.params.id);
  if (!stream) return res.status(404).json({ error: 'Stream not found.' });
  const subjects = db.prepare('SELECT * FROM subjects WHERE stream_id=?').all(stream.id);
  const courses = db.prepare('SELECT * FROM courses WHERE stream_id=?').all(stream.id);
  res.json({ ...stream, careers: parseJson(stream.careers, []), subjects, courses });
});

module.exports = router;
