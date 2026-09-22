/**
 * Experiment: Implement Role-Based Authorization (RBAC).
 * Run  : node 01-role-based-authorization.js
 * Login as admin@x.com/admin123 or user@x.com/user1234 via POST /login, then call the routes with the token.
 */
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET = 'rbac-secret';

const app = express();
app.use(express.json());

const users = [
  { id: 1, email: 'admin@x.com', password: bcrypt.hashSync('admin123', 8), role: 'admin' },
  { id: 2, email: 'user@x.com', password: bcrypt.hashSync('user1234', 8), role: 'user' },
];

// role -> permissions map
const permissions = { admin: ['read', 'create', 'update', 'delete'], user: ['read'] };

app.post('/login', (req, res) => {
  const u = users.find((x) => x.email === req.body.email);
  if (!u || !bcrypt.compareSync(req.body.password || '', u.password)) return res.status(401).json({ error: 'Bad credentials' });
  res.json({ token: jwt.sign({ id: u.id, role: u.role }, SECRET, { expiresIn: '1h' }) });
});

const authenticate = (req, res, next) => {
  try { req.user = jwt.verify((req.headers.authorization || '').split(' ')[1], SECRET); next(); }
  catch { res.status(401).json({ error: 'Login required' }); }
};
const can = (action) => (req, res, next) =>
  permissions[req.user.role].includes(action) ? next() : res.status(403).json({ error: `Role "${req.user.role}" cannot ${action}` });

const docs = [{ id: 1, title: 'Report' }];
app.get('/docs', authenticate, can('read'), (req, res) => res.json(docs));
app.post('/docs', authenticate, can('create'), (req, res) => { docs.push({ id: docs.length + 1, ...req.body }); res.status(201).json(docs); });
app.delete('/docs/:id', authenticate, can('delete'), (req, res) => res.status(204).end());

app.listen(3000, () => console.log('http://localhost:3000'));
