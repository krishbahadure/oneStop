const router = require('express').Router();
const db = require('../db/connection');
const { requireAuth } = require('../middleware/auth');
const parseJson = (v, f) => { try { return JSON.parse(v); } catch { return f; } };

function formatCollege(c, courses) {
  return {
    ...c,
    facilities: parseJson(c.facilities, []),
    courses: courses || [],
  };
}

function getCollegeCourses(collegeId) {
  return db.prepare(`
    SELECT cc.*, co.name as course_full_name, co.stream_name, co.duration, co.degree_type
    FROM college_courses cc LEFT JOIN courses co ON cc.course_id=co.id
    WHERE cc.college_id=?
  `).all(collegeId);
}

// GET /api/colleges  – filters: district, hostel, stream, search
router.get('/', requireAuth, (req, res) => {
  const { district, hostel, stream, search, naac } = req.query;
  let sql = 'SELECT * FROM colleges WHERE 1=1';
  const params = [];
  if (district) { sql += ' AND district=?'; params.push(district); }
  if (hostel === 'true') { sql += ' AND hostel_available=1'; }
  if (naac) { sql += ' AND naac_grade=?'; params.push(naac); }
  if (search) { sql += ' AND (name LIKE ? OR address LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
  sql += ' ORDER BY name';

  let colleges = db.prepare(sql).all(...params);

  // Filter by stream (through college_courses)
  if (stream) {
    const streamCollegeIds = new Set(
      db.prepare('SELECT DISTINCT cc.college_id FROM college_courses cc JOIN courses co ON cc.course_id=co.id WHERE co.stream_name=?')
        .all(stream).map(r => r.college_id)
    );
    colleges = colleges.filter(c => streamCollegeIds.has(c.id));
  }

  res.json(colleges.map(c => formatCollege(c, getCollegeCourses(c.id))));
});

// GET /api/colleges/:id
router.get('/:id', requireAuth, (req, res) => {
  const college = db.prepare('SELECT * FROM colleges WHERE id=?').get(req.params.id);
  if (!college) return res.status(404).json({ error: 'College not found.' });
  res.json(formatCollege(college, getCollegeCourses(college.id)));
});

// POST /api/colleges/compare  – body: {ids: [1,2,3]}
router.post('/compare', requireAuth, (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length < 2) return res.status(400).json({ error: 'Provide at least 2 college IDs to compare.' });
  const colleges = ids.map(id => {
    const c = db.prepare('SELECT * FROM colleges WHERE id=?').get(id);
    return c ? formatCollege(c, getCollegeCourses(id)) : null;
  }).filter(Boolean);
  res.json(colleges);
});

module.exports = router;
