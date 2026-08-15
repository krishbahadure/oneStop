const router = require('express').Router();
const db = require('../db/connection');
const { requireAuth } = require('../middleware/auth');
const parseJson = (v, f) => { try { return JSON.parse(v); } catch { return f; } };

function formatCourse(c) {
  return {
    ...c,
    careerScope: parseJson(c.career_scope, []),
    skills: parseJson(c.skills, []),
    subjects: parseJson(c.subjects, []),
    topRecruiters: parseJson(c.top_recruiters, []),
  };
}

// GET /api/courses  – filters: stream, degree_type, search
router.get('/', requireAuth, (req, res) => {
  const { stream, degree_type, search } = req.query;
  let sql = 'SELECT * FROM courses WHERE 1=1';
  const params = [];
  if (stream) { sql += ' AND stream_name=?'; params.push(stream); }
  if (degree_type) { sql += ' AND degree_type=?'; params.push(degree_type); }
  if (search) { sql += ' AND (name LIKE ? OR description LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
  sql += ' ORDER BY name';
  const courses = db.prepare(sql).all(...params);
  res.json(courses.map(formatCourse));
});

// GET /api/courses/:id
router.get('/:id', requireAuth, (req, res) => {
  const course = db.prepare('SELECT * FROM courses WHERE id=?').get(req.params.id);
  if (!course) return res.status(404).json({ error: 'Course not found.' });

  // Find careers that include this course
  const allCareers = db.prepare('SELECT id,title,stream_name,sector,salary_min,salary_max,growth_outlook,required_courses FROM careers').all();
  const relatedCareers = allCareers.filter(car => {
    const rc = parseJson(car.required_courses, []);
    return rc.includes(course.id);
  });

  // Colleges offering this course
  const collegesOffering = db.prepare(`
    SELECT c.*, cc.seats, cc.fees, cc.cutoff_marks
    FROM colleges c JOIN college_courses cc ON c.id=cc.college_id
    WHERE cc.course_id=?
  `).all(course.id);

  res.json({ ...formatCourse(course), relatedCareers, collegesOffering });
});

module.exports = router;
