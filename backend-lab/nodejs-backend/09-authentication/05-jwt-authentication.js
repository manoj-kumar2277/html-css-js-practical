/**
 * Experiment: Implement JWT-based Authentication.
 * Run  : node 05-jwt-authentication.js
 * Flow : POST /register -> POST /login (returns token) -> GET /profile with "Authorization: Bearer <token>"
 */
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const app = express();
app.use(express.json());
const users = [];

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (users.find((u) => u.email === email)) return res.status(409).json({ error: 'Email exists' });
  users.push({ id: users.length + 1, name, email, password: await bcrypt.hash(password, 10) });
  res.status(201).json({ message: 'Registered' });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, tokenType: 'Bearer', expiresIn: 3600 });
});

function verifyToken(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  try { req.auth = jwt.verify(token, JWT_SECRET); next(); }
  catch (e) { res.status(401).json({ error: e.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token' }); }
}

app.get('/profile', verifyToken, (req, res) => {
  const u = users.find((x) => x.id === req.auth.sub);
  res.json({ id: u.id, name: u.name, email: u.email });
});

app.listen(3000, () => console.log('http://localhost:3000'));
