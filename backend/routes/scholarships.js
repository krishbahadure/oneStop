const router = require('express').Router();
const db = require('../db/connection');
const { requireAuth } = require('../middleware/auth');
const parseJson = (v, f) => { try { return JSON.parse(v); } catch { return f; } };

// GET /api/scholarships  – filters: stream, category, search
// Also computes eligibility if user profile exists
router.get('/', requireAuth, (req, res) => {
  const { stream, search } = req.query;
  let sql = 'SELECT * FROM scholarships WHERE 1=1';
  const params = [];
  if (search) { sql += ' AND (name LIKE ? OR description LIKE ? OR provider LIKE ?)'; params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
  sql += ' ORDER BY name';

  let scholarships = db.prepare(sql).all(...params);

  if (stream) {
    scholarships = scholarships.filter(s => {
      const sf = parseJson(s.stream_filter, null);
      return !sf || sf.includes(stream);
    });
  }

  // Get user profile for eligibility check
  const profile = db.prepare('SELECT * FROM student_profiles WHERE user_id=?').get(req.user.id);

  const result = scholarships.map(s => {
    const elig = parseJson(s.eligibility, {});
    const eligStatus = computeEligibility(elig, profile);
    return {
      ...s,
      eligibility: elig,
      stream_filter: parseJson(s.stream_filter, null),
      eligibilityStatus: eligStatus,  // 'Eligible' | 'Possibly Eligible' | 'Check Criteria'
    };
  });

  res.json(result);
});

function computeEligibility(elig, profile) {
  if (!profile) return 'Check Criteria';

  let passed = 0, total = 0;

  if (elig.income && profile.family_income) {
    total++;
    const incomeRanges = { 'Below 1 LPA': 1, 'Below 1.5 LPA': 1.5, 'Below 2.5 LPA': 2.5, 'Below 6 LPA': 6, 'Below 8 LPA': 8, 'All': 999 };
    const limit = incomeRanges[elig.income] || 999;
    const profileIncomeRanges = { '1-3 LPA': 2, '3-6 LPA': 4.5, '6-10 LPA': 8, 'Below 1 LPA': 0.5 };
    const profileInc = profileIncomeRanges[profile.family_income] || 5;
    if (limit >= profileInc) passed++;
  }

  if (elig.class_percent && elig.class_percent > 0) {
    total++;
    if ((profile.class_12_percent || 0) >= elig.class_percent) passed++;
  }

  if (elig.category && elig.category !== 'All') {
    total++;
    const cats = Array.isArray(elig.category) ? elig.category : [elig.category];
    if (cats.includes(profile.category)) passed++;
  }

  if (total === 0) return 'Possibly Eligible';
  if (passed === total) return 'Eligible';
  if (passed >= total / 2) return 'Possibly Eligible';
  return 'Check Criteria';
}

module.exports = router;
