// One Stop Career & Education Advisor – Express entry point
// Prototype backend for PS72 (J&K Higher Education Dept)

const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const assessmentRoutes = require('./routes/assessment');
const recommendationRoutes = require('./routes/recommendations');
const streamsRoutes = require('./routes/streams');
const coursesRoutes = require('./routes/courses');
const careersRoutes = require('./routes/careers');
const collegesRoutes = require('./routes/colleges');
const scholarshipsRoutes = require('./routes/scholarships');
const resourcesRoutes = require('./routes/resources');
const timelineRoutes = require('./routes/timeline');
const roadmapRoutes = require('./routes/roadmap');
const progressRoutes = require('./routes/progress');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/streams', streamsRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/careers', careersRoutes);
app.use('/api/colleges', collegesRoutes);
app.use('/api/scholarships', scholarshipsRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/admin', adminRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'onestop-backend' });
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ One Stop backend running on http://localhost:${PORT}`);
  console.log(`   Run 'npm run seed' first if database is empty.`);
});
