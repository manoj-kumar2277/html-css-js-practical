/**
 * Experiment: Implement a PUT / PATCH REST API.
 * PUT   = replace the WHOLE resource (all fields required)
 * PATCH = change only the fields that are sent
 * Run  : node 04-put-patch-rest-api.js
 * Test : curl -X PUT   localhost:3000/api/users/1 -H "Content-Type: application/json" -d '{"name":"New","email":"n@x.com"}'
 *        curl -X PATCH localhost:3000/api/users/1 -H "Content-Type: application/json" -d '{"email":"only@x.com"}'
 */
const express = require('express');
const app = express();
app.use(express.json());
const users = [{ id: 1, name: 'Asha', email: 'asha@x.com' }];
const find = (id) => users.find((u) => u.id === +id);

app.get('/api/users/:id', (req, res) => (find(req.params.id) ? res.json(find(req.params.id)) : res.status(404).json({ error: 'Not found' })));

app.put('/api/users/:id', (req, res) => {
  const u = find(req.params.id);
  if (!u) return res.status(404).json({ error: 'Not found' });
  if (!req.body.name || !req.body.email) return res.status(400).json({ error: 'PUT needs name and email' });
  u.name = req.body.name; u.email = req.body.email;
  res.json(u);
});

app.patch('/api/users/:id', (req, res) => {
  const u = find(req.params.id);
  if (!u) return res.status(404).json({ error: 'Not found' });
  const allowed = ['name', 'email'];
  Object.keys(req.body).filter((k) => allowed.includes(k)).forEach((k) => (u[k] = req.body[k]));
  res.json(u);
});

app.listen(3000, () => console.log('http://localhost:3000'));
