/**
 * Experiment: Create protected routes using session authentication.
 * Run: node 05-protected-routes-session-auth.js
 * Open /login-demo (auto login) then /dashboard and /admin ; without login you get 401 / redirect
 */
const express = require('express');
const session = require('express-session');
const app = express();
app.use(session({ secret: 'lab-secret', resave: false, saveUninitialized: false }));

const requireLogin = (req, res, next) => (req.session.user ? next() : res.status(401).send('401 - Please log in first'));
const requireAdmin = (req, res, next) =>
  req.session.user && req.session.user.role === 'admin' ? next() : res.status(403).send('403 - Admins only');

app.get('/', (req, res) => res.send('Public home. Try /login-demo?role=admin then /dashboard and /admin'));
app.get('/login-demo', (req, res) => {
  req.session.user = { name: 'Demo', role: req.query.role === 'admin' ? 'admin' : 'user' };
  res.send(`Logged in as ${req.session.user.role}`);
});
app.get('/dashboard', requireLogin, (req, res) => res.send(`Dashboard for ${req.session.user.name}`));
app.get('/admin', requireLogin, requireAdmin, (req, res) => res.send('Admin panel'));
app.get('/logout', (req, res) => req.session.destroy(() => res.redirect('/')));

app.listen(3000, () => console.log('http://localhost:3000'));
