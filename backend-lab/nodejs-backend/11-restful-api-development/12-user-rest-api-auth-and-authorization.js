/**
 * Experiment: Create a User REST API with Authentication and Authorization.
 * Run  : node 12-user-rest-api-auth-and-authorization.js
 * Rules: - POST /api/auth/register , POST /api/auth/login  are public
 *        - GET /api/users            -> admin only
 *        - GET/PUT /api/users/:id    -> admin OR the user himself
 *        - DELETE /api/users/:id     -> admin only
 * First registered account becomes "admin" (demo convenience); the rest are "user".
 */
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../common/db');

const SECRET = process.env.JWT_SECRET || 'user-api-secret';
const app = express();
app.use(express.json());
const safe = ({ password, ...u }) => u;

// ---------- authentication ----------
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 8) return res.status(400).json({ error: 'name, email and password (min 8) required' });
  if (db.prepare('SELECT 1 FROM users WHERE email = ?').get(email)) return res.status(409).json({ error: 'Email already registered' });
  const first = db.prepare('SELECT COUNT(*) c FROM users').get().c === 0;
  const info = db.prepare('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)')
    .run(name, email, await bcrypt.hash(password, 10), first ? 'admin' : 'user');
  res.status(201).json(safe(db.prepare('SELECT * FROM users WHERE id=?').get(info.lastInsertRowid)));
});

app.post('/api/auth/login', async (req, res) => {
  const u = db.prepare('SELECT * FROM users WHERE email = ?').get(req.body.email || '');
  if (!u || !(await bcrypt.compare(req.body.password || '', u.password))) return res.status(401).json({ error: 'Invalid credentials' });
  res.json({ token: jwt.sign({ id: u.id, role: u.role }, SECRET, { expiresIn: '2h' }), user: safe(u) });
});

// ---------- middleware ----------
const authenticate = (req, res, next) => {
  try { req.user = jwt.verify((req.headers.authorization || '').split(' ')[1], SECRET); next(); }
  catch { res.status(401).json({ error: 'Authentication required' }); }
};
const adminOnly = (req, res, next) => (req.user.role === 'admin' ? next() : res.status(403).json({ error: 'Admin only' }));
const selfOrAdmin = (req, res, next) =>
  req.user.role === 'admin' || req.user.id === +req.params.id ? next() : res.status(403).json({ error: 'You can only access your own account' });

// ---------- protected resources ----------
app.get('/api/users', authenticate, adminOnly, (req, res) => res.json(db.prepare('SELECT * FROM users').all().map(safe)));

app.get('/api/users/:id', authenticate, selfOrAdmin, (req, res) => {
  const u = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  u ? res.json(safe(u)) : res.status(404).json({ error: 'User not found' });
});

app.put('/api/users/:id', authenticate, selfOrAdmin, (req, res) => {
  const u = db.prepare('SELECT * FROM users WHERE id = ?').get(req.params.id);
  if (!u) return res.status(404).json({ error: 'User not found' });
  const role = req.user.role === 'admin' && req.body.role ? req.body.role : u.role;   // only admins may change roles
  db.prepare('UPDATE users SET name=?, role=? WHERE id=?').run(req.body.name ?? u.name, role, u.id);
  res.json(safe(db.prepare('SELECT * FROM users WHERE id=?').get(u.id)));
});

app.delete('/api/users/:id', authenticate, adminOnly, (req, res) => {
  const info = db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
  info.changes ? res.status(204).end() : res.status(404).json({ error: 'User not found' });
});

app.listen(3000, () => console.log('http://localhost:3000'));
