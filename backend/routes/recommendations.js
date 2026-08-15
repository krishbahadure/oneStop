const router = require('express').Router();
const db = require('../db/connection');
const { requireAuth } = require('../middleware/auth');
const { generateRecommendations } = require('../services/recommendationEngine');

const parseJson = (v, f) => { try { return JSON.parse(v); } catch { return f; } };

// GET /api/recommendations
router.get('/', requireAuth, (req, res) => {
  const profile = db.prepare('SELECT * FROM student_profiles WHERE user_id=?').get(req.user.id);
  const result = db.prepare('SELECT * FROM assessment_results WHERE user_id=?').get(req.user.id);

  const assessmentScores = result ? parseJson(result.scores, {}) : {};
  const profileData = profile ? {
    ...profile,
    interested_streams: parseJson(profile.interested_streams, []),
  } : {};

  const recs = generateRecommendations(profileData, assessmentScores);
  res.json(recs);
});

module.exports = router;
