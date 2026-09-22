/**
 * Experiment: Implement User Login and Logout (session based).
 * Run: node 02-login-and-logout.js
 * Flow: POST /register -> POST /login -> GET /me -> POST /logout -> GET /me (401)
 * Test with cookies:  curl -c jar -b jar ...
 */
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const app = express();
app.use(express.json());
app.use(session({ secret: 'auth-lab-secret', resave: false, saveUninitialized: false }));

const users = [];

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (users.find((u) => u.email === email)) return res.status(409).json({ error: 'Email exists' });
  users.push({ id: users.length + 1, email, password: await bcrypt.hash(password, 10) });
  res.status(201).json({ message: 'Registered' });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ error: 'Invalid email or password' });
  req.session.userId = user.id;
  res.json({ message: 'Login successful' });
});

app.get('/me', (req, res) => {
  const user = users.find((u) => u.id === req.session.userId);
  user ? res.json({ id: user.id, email: user.email }) : res.status(401).json({ error: 'Not authenticated' });
});

app.post('/logout', (req, res) => req.session.destroy(() => { res.clearCookie('connect.sid'); res.json({ message: 'Logged out' }); }));

app.listen(3000, () => console.log('http://localhost:3000'));
