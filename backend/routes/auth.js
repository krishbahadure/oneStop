const router = require('express').Router();
const db = require('../db/connection');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email, and password are required.' });
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) return res.status(409).json({ error: 'An account with this email already exists.' });

    const hashed = await bcrypt.hash(password, 10);
    const { lastInsertRowid: userId } = db.prepare(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
    ).run(name, email, hashed, 'student');

    // Bootstrap progress and empty profile
    db.prepare('INSERT INTO student_profiles (user_id) VALUES (?)').run(userId);
    db.prepare('INSERT INTO student_progress (user_id) VALUES (?)').run(userId);

    const token = jwt.sign({ id: userId, name, email, role: 'student' }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: userId, name, email, role: 'student' } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) return res.status(401).json({ error: 'Invalid email or password.' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid email or password.' });

    db.prepare('UPDATE users SET last_login = ? WHERE id = ?').run(new Date().toISOString(), user.id);

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET, { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

module.exports = router;
