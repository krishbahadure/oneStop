const router = require('express').Router();
const db = require('../db/connection');
const { requireAuth } = require('../middleware/auth');

// GET /api/roadmap – returns or auto-creates roadmap for the student
router.get('/', requireAuth, (req, res) => {
  let items = db.prepare('SELECT * FROM roadmap_items WHERE user_id=? ORDER BY step_number').all(req.user.id);

  // Auto-create default roadmap if none exists
  if (items.length === 0) {
    const defaults = [
      {n:1, title:"Complete Your Profile", desc:"Add your district, board, marks, and career goals.", status:"pending", cat:"Profile", link:"/profile"},
      {n:2, title:"Take the Interest & Aptitude Assessment", desc:"12-question assessment to identify your strengths.", status:"pending", cat:"Assessment", link:"/assessment"},
      {n:3, title:"Review Your Stream Recommendations", desc:"Check recommended streams with match percentages.", status:"pending", cat:"Assessment", link:"/recommendations"},
      {n:4, title:"Explore Recommended Courses", desc:"Browse courses recommended for your profile.", status:"pending", cat:"Course", link:"/courses"},
      {n:5, title:"Deep-Dive Into Career Paths", desc:"Explore careers, salary ranges, and 'How Do I Become This?' ladders.", status:"pending", cat:"Career", link:"/careers"},
      {n:6, title:"Find Government Colleges Near You", desc:"Browse government colleges in your district.", status:"pending", cat:"College", link:"/colleges"},
      {n:7, title:"Compare Top Colleges", desc:"Compare 2-3 colleges side-by-side.", status:"pending", cat:"College", link:"/colleges/compare"},
      {n:8, title:"Check Scholarship Eligibility", desc:"Review scholarships and check eligibility.", status:"pending", cat:"Scholarship", link:"/scholarships"},
      {n:9, title:"Save Key Admission Deadlines", desc:"Review the Admission Timeline.", status:"pending", cat:"College", link:"/timeline"},
      {n:10, title:"Apply to Your Chosen College", desc:"Submit your application before the deadline.", status:"pending", cat:"College", link:"/colleges"},
    ];

    // Check profile and assessment to mark completed steps
    const profile = db.prepare('SELECT profile_completed FROM student_profiles WHERE user_id=?').get(req.user.id);
    const assessment = db.prepare('SELECT id FROM assessment_results WHERE user_id=?').get(req.user.id);

    const insert = db.prepare('INSERT INTO roadmap_items (user_id,step_number,title,description,status,category,link) VALUES (?,?,?,?,?,?,?)');
    defaults.forEach(s => {
      let status = 'pending';
      if (s.n === 1 && profile?.profile_completed) status = 'completed';
      if (s.n === 2 && assessment) status = 'completed';
      if (s.n === 3 && assessment) status = 'completed';
      insert.run(req.user.id, s.n, s.title, s.desc, status, s.cat, s.link);
    });

    items = db.prepare('SELECT * FROM roadmap_items WHERE user_id=? ORDER BY step_number').all(req.user.id);
  }

  const completed = items.filter(i => i.status === 'completed').length;
  const total = items.length;
  const progressPct = Math.round((completed / total) * 100);

  res.json({ items, progressPct, completed, total });
});

// PUT /api/roadmap/:id – update step status
router.put('/:id', requireAuth, (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'in_progress', 'completed'];
  if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status.' });

  const item = db.prepare('SELECT * FROM roadmap_items WHERE id=? AND user_id=?').get(req.params.id, req.user.id);
  if (!item) return res.status(404).json({ error: 'Roadmap item not found.' });

  db.prepare('UPDATE roadmap_items SET status=?, updated_at=? WHERE id=?')
    .run(status, new Date().toISOString(), req.params.id);

  res.json({ success: true });
});

module.exports = router;
