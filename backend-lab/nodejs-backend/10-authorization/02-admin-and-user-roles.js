/**
 * Experiment: Create Admin and User roles.
 * Run  : node 02-admin-and-user-roles.js
 * Registration always creates a normal "user". Only an admin can promote another account to admin.
 * Seed admin -> admin@x.com / admin123
 */
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SECRET = 'roles-secret';
const ROLES = ['user', 'admin'];

const app = express();
app.use(express.json());
const users = [{ id: 1, email: 'admin@x.com', password: bcrypt.hashSync('admin123', 8), role: 'admin' }];

const auth = (req, res, next) => {
  try { req.user = jwt.verify((req.headers.authorization || '').split(' ')[1], SECRET); next(); }
  catch { res.status(401).json({ error: 'Login required' }); }
};
const onlyAdmin = (req, res, next) => (req.user.role === 'admin' ? next() : res.status(403).json({ error: 'Admins only' }));

app.post('/register', (req, res) => {
  const { email, password } = req.body;
  if (users.find((u) => u.email === email)) return res.status(409).json({ error: 'Email exists' });
  users.push({ id: users.length + 1, email, password: bcrypt.hashSync(password, 8), role: 'user' });   // role is NOT taken from the body
  res.status(201).json({ message: 'Registered as user' });
});

app.post('/login', (req, res) => {
  const u = users.find((x) => x.email === req.body.email);
  if (!u || !bcrypt.compareSync(req.body.password || '', u.password)) return res.status(401).json({ error: 'Bad credentials' });
  res.json({ token: jwt.sign({ id: u.id, role: u.role }, SECRET, { expiresIn: '1h' }), role: u.role });
});

app.get('/me', auth, (req, res) => res.json(req.user));
app.get('/admin/users', auth, onlyAdmin, (req, res) => res.json(users.map(({ password, ...u }) => u)));
app.patch('/admin/users/:id/role', auth, onlyAdmin, (req, res) => {
  const u = users.find((x) => x.id === +req.params.id);
  if (!u) return res.status(404).json({ error: 'User not found' });
  if (!ROLES.includes(req.body.role)) return res.status(400).json({ error: `role must be one of ${ROLES}` });
  u.role = req.body.role;
  res.json({ id: u.id, email: u.email, role: u.role });
});

app.listen(3000, () => console.log('http://localhost:3000'));
