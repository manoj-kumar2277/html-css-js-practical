/**
 * Experiment: Test REST APIs using Postman.
 * 1. Run this server:            node 09-test-rest-api-postman.js
 * 2. Postman -> Import -> select  09-postman-collection.json
 * 3. Run each request, or use Collection Runner (has test scripts that check status codes/body).
 * Manual steps: New Request -> choose method -> URL -> Body > raw > JSON -> Send -> inspect Status/Time/Body.
 */
const express = require('express');
const app = express();
app.use(express.json());

let todos = [{ id: 1, title: 'Learn Postman', completed: false }];
let nextId = 2;

app.get('/api/todos', (req, res) => res.json(todos));
app.get('/api/todos/:id', (req, res) => {
  const t = todos.find((x) => x.id === +req.params.id);
  t ? res.json(t) : res.status(404).json({ error: 'Todo not found' });
});
app.post('/api/todos', (req, res) => {
  if (!req.body.title) return res.status(400).json({ error: 'title is required' });
  const t = { id: nextId++, title: req.body.title, completed: false };
  todos.push(t);
  res.status(201).json(t);
});
app.put('/api/todos/:id', (req, res) => {
  const t = todos.find((x) => x.id === +req.params.id);
  if (!t) return res.status(404).json({ error: 'Todo not found' });
  Object.assign(t, { title: req.body.title ?? t.title, completed: req.body.completed ?? t.completed });
  res.json(t);
});
app.delete('/api/todos/:id', (req, res) => {
  todos = todos.filter((x) => x.id !== +req.params.id);
  res.status(204).end();
});

app.listen(3000, () => console.log('http://localhost:3000/api/todos'));
