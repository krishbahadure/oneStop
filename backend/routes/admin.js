const router = require('express').Router();
const db = require('../db/connection');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const parseJson = (v, f) => { try { return JSON.parse(v); } catch { return f; } };

// All admin routes require authentication AND admin role
router.use(requireAuth, requireAdmin);

// ── ANALYTICS ─────────────────────────────────────────────────────────────────
router.get('/analytics', (req, res) => {
  const totalStudents = db.prepare("SELECT COUNT(*) as cnt FROM users WHERE role='student'").get().cnt;
  const assessmentCompletions = db.prepare('SELECT COUNT(*) as cnt FROM assessment_results').get().cnt;
  const profileCompletions = db.prepare('SELECT COUNT(*) as cnt FROM student_profiles WHERE profile_completed=1').get().cnt;
  const totalColleges = db.prepare('SELECT COUNT(*) as cnt FROM colleges').get().cnt;
  const totalCourses = db.prepare('SELECT COUNT(*) as cnt FROM courses').get().cnt;
  const totalScholarships = db.prepare('SELECT COUNT(*) as cnt FROM scholarships').get().cnt;

  // Most recommended streams (from assessment results)
  const streamScores = {};
  db.prepare('SELECT scores FROM assessment_results').all().forEach(r => {
    const scores = parseJson(r.scores, {});
    Object.entries(scores).forEach(([stream, score]) => {
      streamScores[stream] = (streamScores[stream] || 0) + score;
    });
  });
  const streamRanking = Object.entries(streamScores).sort((a,b) => b[1]-a[1]).map(([name, total]) => ({ name, total }));

  // Recent registrations (last 7 days)
  const recentRegistrations = db.prepare(`
    SELECT DATE(created_at) as date, COUNT(*) as count
    FROM users WHERE role='student' AND created_at >= datetime('now', '-7 days')
    GROUP BY DATE(created_at) ORDER BY date
  `).all();

  // Verified vs unverified
  const verifiedColleges = db.prepare('SELECT COUNT(*) as cnt FROM colleges WHERE is_verified=1').get().cnt;
  const verifiedCourses = db.prepare('SELECT COUNT(*) as cnt FROM courses WHERE is_verified=1').get().cnt;

  res.json({
    totalStudents, assessmentCompletions, profileCompletions,
    totalColleges, totalCourses, totalScholarships,
    streamRanking, recentRegistrations,
    verifiedColleges, verifiedCourses,
    assessmentRate: totalStudents ? Math.round((assessmentCompletions / totalStudents) * 100) : 0,
    profileRate: totalStudents ? Math.round((profileCompletions / totalStudents) * 100) : 0,
  });
});

// ── STUDENTS ──────────────────────────────────────────────────────────────────
router.get('/students', (req, res) => {
  const { search } = req.query;
  let sql = "SELECT u.id,u.name,u.email,u.created_at,u.last_login,sp.district,sp.profile_completed,sp.class_12_stream,ar.completed_at as assessment_at FROM users u LEFT JOIN student_profiles sp ON u.id=sp.user_id LEFT JOIN assessment_results ar ON u.id=ar.user_id WHERE u.role='student'";
  const params = [];
  if (search) { sql += ' AND (u.name LIKE ? OR u.email LIKE ?)'; params.push(`%${search}%`, `%${search}%`); }
  sql += ' ORDER BY u.created_at DESC';
  res.json(db.prepare(sql).all(...params));
});

router.get('/students/:id', (req, res) => {
  const user = db.prepare("SELECT id,name,email,role,created_at,last_login FROM users WHERE id=? AND role='student'").get(req.params.id);
  if (!user) return res.status(404).json({ error: 'Student not found.' });
  const profile = db.prepare('SELECT * FROM student_profiles WHERE user_id=?').get(user.id);
  const assessment = db.prepare('SELECT * FROM assessment_results WHERE user_id=?').get(user.id);
  const progress = db.prepare('SELECT * FROM student_progress WHERE user_id=?').get(user.id);
  res.json({ user, profile, assessment, progress });
});

// ── COLLEGES CRUD ─────────────────────────────────────────────────────────────
router.get('/colleges', (req, res) => {
  res.json(db.prepare('SELECT * FROM colleges ORDER BY name').all().map(c => ({...c, facilities: parseJson(c.facilities,[])})));
});

router.post('/colleges', (req, res) => {
  const { name, district, address, established, affiliated_to, naac_grade, total_seats, hostel_available, facilities, description, phone, admission_status } = req.body;
  if (!name || !district) return res.status(400).json({ error: 'Name and district are required.' });
  const now = new Date().toISOString();
  const { lastInsertRowid: id } = db.prepare(`
    INSERT INTO colleges (name,district,address,type,established,affiliated_to,naac_grade,total_seats,hostel_available,facilities,description,phone,admission_status,is_verified,last_updated)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,0,?)
  `).run(name,district,address,'Government',established,affiliated_to,naac_grade,total_seats,hostel_available?1:0,JSON.stringify(facilities||[]),description,phone,admission_status||'Applications Closed',now);
  res.status(201).json({ id, message: 'College created.' });
});

router.put('/colleges/:id', (req, res) => {
  const { name, district, address, established, affiliated_to, naac_grade, total_seats, hostel_available, facilities, description, phone, admission_status } = req.body;
  const now = new Date().toISOString();
  db.prepare(`
    UPDATE colleges SET name=?,district=?,address=?,established=?,affiliated_to=?,naac_grade=?,total_seats=?,hostel_available=?,facilities=?,description=?,phone=?,admission_status=?,last_updated=? WHERE id=?
  `).run(name,district,address,established,affiliated_to,naac_grade,total_seats,hostel_available?1:0,JSON.stringify(facilities||[]),description,phone,admission_status,now,req.params.id);
  res.json({ message: 'College updated.' });
});

router.delete('/colleges/:id', (req, res) => {
  db.prepare('DELETE FROM colleges WHERE id=?').run(req.params.id);
  res.json({ message: 'College deleted.' });
});

router.post('/colleges/:id/verify', (req, res) => {
  db.prepare('UPDATE colleges SET is_verified=1, last_updated=? WHERE id=?').run(new Date().toISOString(), req.params.id);
  res.json({ message: 'College verified.' });
});

// ── COURSES CRUD ──────────────────────────────────────────────────────────────
router.get('/courses', (req, res) => {
  res.json(db.prepare('SELECT * FROM courses ORDER BY name').all().map(c => ({
    ...c, careerScope:parseJson(c.career_scope,[]), skills:parseJson(c.skills,[])
  })));
});

router.post('/courses', (req, res) => {
  const { name, stream_name, duration, degree_type, description, eligibility, avg_fees } = req.body;
  if (!name) return res.status(400).json({ error: 'Course name is required.' });
  const now = new Date().toISOString();
  const { lastInsertRowid: id } = db.prepare(`
    INSERT INTO courses (name,stream_name,duration,degree_type,description,eligibility,avg_fees,career_scope,skills,subjects,top_recruiters,is_verified,last_updated)
    VALUES (?,?,?,?,?,?,?,'[]','[]','[]','[]',0,?)
  `).run(name,stream_name,duration,degree_type,description,eligibility,avg_fees,now);
  res.status(201).json({ id, message: 'Course created.' });
});

router.put('/courses/:id', (req, res) => {
  const { name, stream_name, duration, degree_type, description, eligibility, avg_fees } = req.body;
  const now = new Date().toISOString();
  db.prepare('UPDATE courses SET name=?,stream_name=?,duration=?,degree_type=?,description=?,eligibility=?,avg_fees=?,last_updated=? WHERE id=?')
    .run(name,stream_name,duration,degree_type,description,eligibility,avg_fees,now,req.params.id);
  res.json({ message: 'Course updated.' });
});

router.delete('/courses/:id', (req, res) => {
  db.prepare('DELETE FROM courses WHERE id=?').run(req.params.id);
  res.json({ message: 'Course deleted.' });
});

router.post('/courses/:id/verify', (req, res) => {
  db.prepare('UPDATE courses SET is_verified=1, last_updated=? WHERE id=?').run(new Date().toISOString(), req.params.id);
  res.json({ message: 'Course verified.' });
});

// ── CAREERS CRUD ──────────────────────────────────────────────────────────────
router.get('/careers', (req, res) => {
  res.json(db.prepare('SELECT * FROM careers ORDER BY title').all().map(c => ({
    ...c, requiredSkills:parseJson(c.required_skills,[])
  })));
});

router.post('/careers', (req, res) => {
  const { title, stream_name, description, salary_min, salary_max, sector, growth_outlook } = req.body;
  if (!title) return res.status(400).json({ error: 'Career title is required.' });
  const now = new Date().toISOString();
  const { lastInsertRowid: id } = db.prepare(`
    INSERT INTO careers (title,stream_name,description,salary_min,salary_max,sector,growth_outlook,required_skills,required_courses,steps,is_verified,last_updated)
    VALUES (?,?,?,?,?,?,?,'[]','[]','[]',0,?)
  `).run(title,stream_name,description,salary_min,salary_max,sector,growth_outlook,now);
  res.status(201).json({ id, message: 'Career created.' });
});

router.put('/careers/:id', (req, res) => {
  const { title, stream_name, description, salary_min, salary_max, sector, growth_outlook } = req.body;
  const now = new Date().toISOString();
  db.prepare('UPDATE careers SET title=?,stream_name=?,description=?,salary_min=?,salary_max=?,sector=?,growth_outlook=?,last_updated=? WHERE id=?')
    .run(title,stream_name,description,salary_min,salary_max,sector,growth_outlook,now,req.params.id);
  res.json({ message: 'Career updated.' });
});

router.delete('/careers/:id', (req, res) => {
  db.prepare('DELETE FROM careers WHERE id=?').run(req.params.id);
  res.json({ message: 'Career deleted.' });
});

router.post('/careers/:id/verify', (req, res) => {
  db.prepare('UPDATE careers SET is_verified=1, last_updated=? WHERE id=?').run(new Date().toISOString(), req.params.id);
  res.json({ message: 'Career verified.' });
});

// ── SCHOLARSHIPS CRUD ─────────────────────────────────────────────────────────
router.get('/scholarships', (req, res) => {
  res.json(db.prepare('SELECT * FROM scholarships ORDER BY name').all().map(s => ({
    ...s, eligibility:parseJson(s.eligibility,{})
  })));
});

router.post('/scholarships', (req, res) => {
  const { name, provider, amount, description, deadline, application_url } = req.body;
  if (!name) return res.status(400).json({ error: 'Scholarship name is required.' });
  const now = new Date().toISOString();
  const { lastInsertRowid: id } = db.prepare(`
    INSERT INTO scholarships (name,provider,amount,eligibility,description,deadline,application_url,is_verified,last_updated)
    VALUES (?,?,?,'{}',?,?,?,0,?)
  `).run(name,provider,amount,description,deadline,application_url,now);
  res.status(201).json({ id, message: 'Scholarship created.' });
});

router.put('/scholarships/:id', (req, res) => {
  const { name, provider, amount, description, deadline, application_url } = req.body;
  const now = new Date().toISOString();
  db.prepare('UPDATE scholarships SET name=?,provider=?,amount=?,description=?,deadline=?,application_url=?,last_updated=? WHERE id=?')
    .run(name,provider,amount,description,deadline,application_url,now,req.params.id);
  res.json({ message: 'Scholarship updated.' });
});

router.delete('/scholarships/:id', (req, res) => {
  db.prepare('DELETE FROM scholarships WHERE id=?').run(req.params.id);
  res.json({ message: 'Scholarship deleted.' });
});

router.post('/scholarships/:id/verify', (req, res) => {
  db.prepare('UPDATE scholarships SET is_verified=1, last_updated=? WHERE id=?').run(new Date().toISOString(), req.params.id);
  res.json({ message: 'Scholarship verified.' });
});

// ── RESOURCES CRUD ────────────────────────────────────────────────────────────
router.get('/resources', (req, res) => {
  res.json(db.prepare('SELECT * FROM resources ORDER BY title').all());
});

router.post('/resources', (req, res) => {
  const { title, type, subject, stream_name, course_name, career_name, url, description, is_free } = req.body;
  if (!title) return res.status(400).json({ error: 'Resource title is required.' });
  const now = new Date().toISOString();
  const { lastInsertRowid: id } = db.prepare(`
    INSERT INTO resources (title,type,subject,stream_name,course_name,career_name,url,description,is_free,is_verified,last_updated)
    VALUES (?,?,?,?,?,?,?,?,?,0,?)
  `).run(title,type,subject,stream_name,course_name,career_name,url,description,is_free?1:0,now);
  res.status(201).json({ id, message: 'Resource created.' });
});

router.put('/resources/:id', (req, res) => {
  const { title, type, subject, stream_name, course_name, career_name, url, description, is_free } = req.body;
  const now = new Date().toISOString();
  db.prepare('UPDATE resources SET title=?,type=?,subject=?,stream_name=?,course_name=?,career_name=?,url=?,description=?,is_free=?,last_updated=? WHERE id=?')
    .run(title,type,subject,stream_name,course_name,career_name,url,description,is_free?1:0,now,req.params.id);
  res.json({ message: 'Resource updated.' });
});

router.delete('/resources/:id', (req, res) => {
  db.prepare('DELETE FROM resources WHERE id=?').run(req.params.id);
  res.json({ message: 'Resource deleted.' });
});

router.post('/resources/:id/verify', (req, res) => {
  db.prepare('UPDATE resources SET is_verified=1, last_updated=? WHERE id=?').run(new Date().toISOString(), req.params.id);
  res.json({ message: 'Resource verified.' });
});

// ── TIMELINE CRUD ─────────────────────────────────────────────────────────────
router.get('/timeline', (req, res) => {
  res.json(db.prepare('SELECT * FROM timeline_events ORDER BY event_date').all());
});

router.post('/timeline', (req, res) => {
  const { title, description, event_date, category, status } = req.body;
  if (!title || !event_date) return res.status(400).json({ error: 'Title and event_date are required.' });
  const now = new Date().toISOString();
  const { lastInsertRowid: id } = db.prepare(`
    INSERT INTO timeline_events (title,description,event_date,category,status,is_verified,last_updated)
    VALUES (?,?,?,?,?,0,?)
  `).run(title,description,event_date,category,status||'upcoming',now);
  res.status(201).json({ id, message: 'Timeline event created.' });
});

router.put('/timeline/:id', (req, res) => {
  const { title, description, event_date, category, status } = req.body;
  const now = new Date().toISOString();
  db.prepare('UPDATE timeline_events SET title=?,description=?,event_date=?,category=?,status=?,last_updated=? WHERE id=?')
    .run(title,description,event_date,category,status,now,req.params.id);
  res.json({ message: 'Timeline event updated.' });
});

router.delete('/timeline/:id', (req, res) => {
  db.prepare('DELETE FROM timeline_events WHERE id=?').run(req.params.id);
  res.json({ message: 'Timeline event deleted.' });
});

router.post('/timeline/:id/verify', (req, res) => {
  db.prepare('UPDATE timeline_events SET is_verified=1, last_updated=? WHERE id=?').run(new Date().toISOString(), req.params.id);
  res.json({ message: 'Timeline event verified.' });
});

module.exports = router;
