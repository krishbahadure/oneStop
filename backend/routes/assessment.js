const router = require('express').Router();
const db = require('../db/connection');
const { requireAuth } = require('../middleware/auth');

const parseJson = (v, f) => { try { return JSON.parse(v); } catch { return f; } };

// GET /api/assessment/questions
router.get('/questions', requireAuth, (req, res) => {
  const questions = db.prepare('SELECT * FROM assessment_questions ORDER BY order_idx').all();
  res.json(questions.map(q => ({ ...q, options: parseJson(q.options, []) })));
});

// POST /api/assessment/submit
router.post('/submit', requireAuth, (req, res) => {
  const { answers } = req.body; // {questionId: optionId}
  if (!answers || typeof answers !== 'object') return res.status(400).json({ error: 'Answers object required.' });

  const questions = db.prepare('SELECT * FROM assessment_questions').all();
  const scores = { Science: 0, Commerce: 0, Arts: 0, Medical: 0, Vocational: 0 };

  questions.forEach(q => {
    const opts = parseJson(q.options, []);
    const selectedOpt = opts.find(o => o.id === answers[q.id]);
    if (selectedOpt?.streams) {
      selectedOpt.streams.forEach(s => {
        if (scores[s] !== undefined) scores[s] += (selectedOpt.weight || 1);
      });
    }
  });

  db.prepare(`
    INSERT INTO assessment_results (user_id, answers, scores, completed_at)
    VALUES (?,?,?,?)
    ON CONFLICT(user_id) DO UPDATE SET answers=excluded.answers, scores=excluded.scores, completed_at=excluded.completed_at
  `).run(req.user.id, JSON.stringify(answers), JSON.stringify(scores), new Date().toISOString());

  db.prepare('UPDATE student_progress SET assessment_completed=1 WHERE user_id=?').run(req.user.id);

  res.json({ success: true, scores });
});

// GET /api/assessment/result
router.get('/result', requireAuth, (req, res) => {
  const result = db.prepare('SELECT * FROM assessment_results WHERE user_id=?').get(req.user.id);
  if (!result) return res.status(404).json({ error: 'No assessment result found. Please take the assessment first.' });
  res.json({ ...result, answers: parseJson(result.answers, {}), scores: parseJson(result.scores, {}) });
});

module.exports = router;
