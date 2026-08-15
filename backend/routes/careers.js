const router = require('express').Router();
const db = require('../db/connection');
const { requireAuth } = require('../middleware/auth');
const parseJson = (v, f) => { try { return JSON.parse(v); } catch { return f; } };

function formatCareer(c) {
  return {
    ...c,
    requiredSkills: parseJson(c.required_skills, []),
    requiredCourses: parseJson(c.required_courses, []),
    steps: parseJson(c.steps, []),
  };
}

// GET /api/careers  – filters: stream, sector, search
router.get('/', requireAuth, (req, res) => {
  const { stream, sector, search } = req.query;
  let sql = 'SELECT * FROM careers WHERE 1=1';
  const params = [];
  if (stream) { sql += ' AND stream_name=?'; params.push(stream); }
  if (sector) { sql += ' AND sector=?'; params.push(sector); }
  if (search) { sql += ' AND (title LIKE ? OR description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
  sql += ' ORDER BY title';
  const careers = db.prepare(sql).all(...params);
  res.json(careers.map(formatCareer));
});

// GET /api/careers/:id
router.get('/:id', requireAuth, (req, res) => {
  const career = db.prepare('SELECT * FROM careers WHERE id=?').get(req.params.id);
  if (!career) return res.status(404).json({ error: 'Career not found.' });

  // Courses that lead to this career
  const reqCourseIds = parseJson(career.required_courses, []);
  const courses = reqCourseIds.length
    ? db.prepare(`SELECT id,name,stream_name,duration,degree_type,avg_fees FROM courses WHERE id IN (${reqCourseIds.map(()=>'?').join(',')})`)
        .all(...reqCourseIds)
    : [];

  res.json({ ...formatCareer(career), courses });
});

module.exports = router;
