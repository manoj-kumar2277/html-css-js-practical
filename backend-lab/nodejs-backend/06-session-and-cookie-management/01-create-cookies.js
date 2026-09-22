/**
 * Experiment: Create and manage cookies using Express.
 * Run: node 01-create-cookies.js  -> open /set-cookie then check DevTools > Application > Cookies
 */
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser());

app.get('/set-cookie', (req, res) => {
  res.cookie('username', 'asha');                                                // session cookie
  res.cookie('theme', 'dark', { maxAge: 60 * 60 * 1000, httpOnly: true });        // 1 hour, not readable by JS
  res.cookie('cart', JSON.stringify({ items: 3 }), { path: '/', sameSite: 'lax' });
  res.send('Cookies have been set');
});

app.listen(3000, () => console.log('http://localhost:3000/set-cookie'));
