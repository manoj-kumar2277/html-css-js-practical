/**
 * Experiment: Implement login and logout using sessions.
 * Run  : node 04-login-and-logout-with-sessions.js
 * Test : curl -c jar.txt -X POST localhost:3000/login -H "Content-Type: application/json" -d '{"username":"admin","password":"admin123"}'
 *        curl -b jar.txt localhost:3000/profile ; curl -b jar.txt -X POST localhost:3000/logout
 */
const express = require('express');
const session = require('express-session');
const app = express();
app.use(express.json());
app.use(session({ secret: 'lab-secret', resave: false, saveUninitialized: false }));

const USERS = [{ username: 'admin', password: 'admin123' }, { username: 'asha', password: 'pass123' }];

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find((u) => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  req.session.user = { username: user.username };
  res.json({ message: 'Logged in', user: req.session.user });
});

app.get('/profile', (req, res) =>
  req.session.user ? res.json(req.session.user) : res.status(401).json({ error: 'Not logged in' }));

app.post('/logout', (req, res) => req.session.destroy(() => { res.clearCookie('connect.sid'); res.json({ message: 'Logged out' }); }));

app.listen(3000, () => console.log('http://localhost:3000'));
