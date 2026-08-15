const router = require('express').Router();
const db = require('../db/connection');
const { requireAuth } = require('../middleware/auth');

// GET /api/profile
router.get('/', requireAuth, (req, res) => {
  const profile = db.prepare('SELECT * FROM student_profiles WHERE user_id = ?').get(req.user.id);
  const user = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!profile) return res.json({ user, profile: null });

  const parsed = {
    ...profile,
    interested_streams: parseJson(profile.interested_streams, []),
    hobbies: parseJson(profile.hobbies, []),
  };
  res.json({ user, profile: parsed });
});

// PUT /api/profile
router.put('/', requireAuth, (req, res) => {
  const {
    phone, district, board, class_10_percent, class_12_percent, class_12_stream,
    interested_streams, hobbies, career_goals, family_income, gender, category
  } = req.body;

  db.prepare(`
    INSERT INTO student_profiles (user_id,phone,district,board,class_10_percent,class_12_percent,class_12_stream,interested_streams,hobbies,career_goals,family_income,gender,category,profile_completed,updated_at)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,1,?)
    ON CONFLICT(user_id) DO UPDATE SET
      phone=excluded.phone, district=excluded.district, board=excluded.board,
      class_10_percent=excluded.class_10_percent, class_12_percent=excluded.class_12_percent,
      class_12_stream=excluded.class_12_stream, interested_streams=excluded.interested_streams,
      hobbies=excluded.hobbies, career_goals=excluded.career_goals,
      family_income=excluded.family_income, gender=excluded.gender, category=excluded.category,
      profile_completed=1, updated_at=excluded.updated_at
  `).run(
    req.user.id, phone, district, board, class_10_percent, class_12_percent,
    class_12_stream, JSON.stringify(interested_streams || []),
    JSON.stringify(hobbies || []), career_goals, family_income, gender, category,
    new Date().toISOString()
  );

  // Update progress
  db.prepare('UPDATE student_progress SET profile_completed=1 WHERE user_id=?').run(req.user.id);

  const updated = db.prepare('SELECT * FROM student_profiles WHERE user_id = ?').get(req.user.id);
  res.json({ profile: { ...updated, interested_streams: parseJson(updated.interested_streams, []), hobbies: parseJson(updated.hobbies, []) } });
});

function parseJson(val, fallback) {
  try { return JSON.parse(val); } catch { return fallback; }
}

module.exports = router;
