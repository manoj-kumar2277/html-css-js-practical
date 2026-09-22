/**
 * Experiment: Implement session management in Express.
 * Run: node 03-session-management.js -> refresh http://localhost:3000 repeatedly
 */
const express = require('express');
const session = require('express-session');
const app = express();

app.use(session({
  secret: 'change-this-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 10 * 60 * 1000, httpOnly: true },   // 10 minutes
}));

app.get('/', (req, res) => {
  req.session.views = (req.session.views || 0) + 1;
  res.send(`Session ${req.sessionID} - you visited ${req.session.views} time(s)`);
});

app.get('/reset', (req, res) => req.session.destroy(() => res.send('Session destroyed')));

app.listen(3000, () => console.log('http://localhost:3000'));
