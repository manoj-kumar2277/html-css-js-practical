/**
 * Experiment: Read and delete cookies using Express.
 * Run: node 02-read-and-delete-cookies.js
 * Flow: /set -> /read -> /delete -> /read
 */
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser('my-signing-secret'));

app.get('/set', (req, res) => {
  res.cookie('username', 'asha');
  res.cookie('token', 'abc123', { signed: true, httpOnly: true });
  res.send('Cookies set');
});

app.get('/read', (req, res) => {
  res.json({ all: req.cookies, signed: req.signedCookies, username: req.cookies.username });
});

app.get('/delete', (req, res) => {
  res.clearCookie('username');
  res.clearCookie('token');
  res.send('Cookies deleted');
});

app.listen(3000, () => console.log('http://localhost:3000/set'));
