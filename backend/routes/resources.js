const router = require('express').Router();
const db = require('../db/connection');
const { requireAuth } = require('../middleware/auth');

// GET /api/resources  – filters: stream, course, subject, career, type, search
router.get('/', requireAuth, (req, res) => {
  const { stream, course, subject, career, type, search } = req.query;
  let sql = 'SELECT * FROM resources WHERE 1=1';
  const params = [];
  if (stream) { sql += ' AND stream_name=?'; params.push(stream); }
  if (course) { sql += ' AND course_name LIKE ?'; params.push(`%${course}%`); }
  if (subject) { sql += ' AND subject LIKE ?'; params.push(`%${subject}%`); }
  if (career) { sql += ' AND career_name LIKE ?'; params.push(`%${career}%`); }
  if (type) { sql += ' AND type=?'; params.push(type); }
  if (search) { sql += ' AND (title LIKE ? OR description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
  sql += ' ORDER BY title';
  res.json(db.prepare(sql).all(...params));
});

module.exports = router;
