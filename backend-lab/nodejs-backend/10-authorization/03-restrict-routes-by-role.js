/**
 * Experiment: Restrict specific routes based on user roles.
 * Run  : node 03-restrict-routes-by-role.js
 * Quick demo without login: send header  x-demo-role: admin | manager | user
 *   curl localhost:3000/reports -H "x-demo-role: manager"
 */
const express = require('express');
const app = express();

// demo authentication: trust a header (real apps decode a JWT / session)
app.use((req, res, next) => { req.user = { role: req.headers['x-demo-role'] || 'guest' }; next(); });

const allowRoles = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : res.status(403).json({ error: `Requires role: ${roles.join(' or ')}`, yourRole: req.user.role });

app.get('/', (req, res) => res.send('Open to everyone'));
app.get('/profile', allowRoles('user', 'manager', 'admin'), (req, res) => res.json({ page: 'profile' }));
app.get('/reports', allowRoles('manager', 'admin'), (req, res) => res.json({ page: 'reports' }));
app.delete('/users/:id', allowRoles('admin'), (req, res) => res.json({ deleted: req.params.id }));
app.get('/admin', allowRoles('admin'), (req, res) => res.send('Admin dashboard'));

app.listen(3000, () => console.log('http://localhost:3000'));
