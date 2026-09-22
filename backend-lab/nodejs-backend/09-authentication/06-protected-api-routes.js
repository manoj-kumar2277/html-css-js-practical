/**
 * Experiment: Create Protected API Routes using authentication (JWT).
 * Run  : node 06-protected-api-routes.js
 * Demo user is pre-created: email demo@x.com / password demo1234
 */
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET = 'protected-routes-secret';

const app = express();
app.use(express.json());
const users = [{ id: 1, email: 'demo@x.com', password: bcrypt.hashSync('demo1234', 10) }];
const notes = [{ id: 1, ownerId: 1, text: 'my private note' }, { id: 2, ownerId: 2, text: "someone else's note" }];

const auth = (req, res, next) => {
  const token = (req.headers.authorization || '').split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });
  try { req.user = jwt.verify(token, SECRET); next(); } catch { res.status(401).json({ error: 'Invalid or expired token' }); }
};

app.get('/api/public', (req, res) => res.json({ message: 'Open to everyone' }));

app.post('/api/login', (req, res) => {
  const u = users.find((x) => x.email === req.body.email);
  if (!u || !bcrypt.compareSync(req.body.password || '', u.password)) return res.status(401).json({ error: 'Bad credentials' });
  res.json({ token: jwt.sign({ id: u.id, email: u.email }, SECRET, { expiresIn: '30m' }) });
});

// everything below this line requires a valid token
app.use('/api/private', auth);
app.get('/api/private/me', (req, res) => res.json(req.user));
app.get('/api/private/notes', (req, res) => res.json(notes.filter((n) => n.ownerId === req.user.id)));

app.listen(3000, () => console.log('http://localhost:3000'));
