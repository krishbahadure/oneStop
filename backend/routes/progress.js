const router = require('express').Router();
const db = require('../db/connection');
const { requireAuth } = require('../middleware/auth');
const { generateRecommendations } = require('../services/recommendationEngine');
const parseJson = (v, f) => { try { return JSON.parse(v); } catch { return f; } };

// GET /api/progress – full dashboard aggregation
router.get('/', requireAuth, (req, res) => {
  const userId = req.user.id;

  const progress = db.prepare('SELECT * FROM student_progress WHERE user_id=?').get(userId)
    || { assessment_completed: 0, profile_completed: 0, courses_viewed: 0, colleges_shortlisted: 0, scholarships_saved: 0 };

  const profile = db.prepare('SELECT * FROM student_profiles WHERE user_id=?').get(userId);
  const assessmentResult = db.prepare('SELECT * FROM assessment_results WHERE user_id=?').get(userId);
  const roadmapItems = db.prepare('SELECT * FROM roadmap_items WHERE user_id=? ORDER BY step_number').all(userId);

  // Timeline – upcoming events (next 60 days)
  const now = new Date();
  const in60 = new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString();
  const upcomingEvents = db.prepare(
    "SELECT * FROM timeline_events WHERE event_date >= ? AND event_date <= ? ORDER BY event_date LIMIT 5"
  ).all(now.toISOString().slice(0, 10), in60.slice(0, 10));

  // Shortlisted colleges
  const shortlistCollegeIds = db.prepare("SELECT entity_id FROM student_shortlists WHERE user_id=? AND entity='college'").all(userId).map(r => r.entity_id);

  // Recommendations (mini)
  let recommendations = null;
  if (assessmentResult && profile) {
    const scores = parseJson(assessmentResult.scores, {});
    const profileData = { ...profile, interested_streams: parseJson(profile?.interested_streams, []) };
    const recs = generateRecommendations(profileData, scores);
    recommendations = {
      topStream: recs.streams[0] || null,
      topCourses: recs.courses.slice(0, 3),
      topCareers: recs.careers.slice(0, 3),
    };
  }

  // Nearby colleges (district-based)
  const nearbyColleges = profile?.district
    ? db.prepare('SELECT id,name,district,admission_status,naac_grade,is_verified,last_updated FROM colleges WHERE district=? LIMIT 3').all(profile.district)
    : db.prepare('SELECT id,name,district,admission_status,naac_grade,is_verified,last_updated FROM colleges LIMIT 3').all();

  // Scholarships count (all eligible)
  const scholarshipsTotal = db.prepare('SELECT COUNT(*) as cnt FROM scholarships').get().cnt;

  // Roadmap progress
  const roadmapCompleted = roadmapItems.filter(i => i.status === 'completed').length;
  const roadmapTotal = roadmapItems.length;

  res.json({
    progress: {
      ...progress,
      roadmapPercent: roadmapTotal ? Math.round((roadmapCompleted / roadmapTotal) * 100) : 0,
    },
    profile: profile ? { ...profile, interested_streams: parseJson(profile.interested_streams, []) } : null,
    assessmentCompleted: !!assessmentResult,
    recommendations,
    nearbyColleges,
    upcomingEvents: upcomingEvents.map(e => {
      const ed = new Date(e.event_date);
      return {
        ...e,
        daysLeft: Math.ceil((ed - now) / (1000 * 60 * 60 * 24)),
        displayDate: ed.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      };
    }),
    scholarshipsTotal,
    collegesShortlisted: shortlistCollegeIds.length,
  });
});

module.exports = router;
