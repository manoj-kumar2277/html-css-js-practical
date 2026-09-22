/**
 * Experiment: Implement a DELETE REST API.
 * Run  : node 05-delete-rest-api.js
 * Test : curl -i -X DELETE localhost:3000/api/tasks/1     -> 204 No Content
 *        curl -i -X DELETE localhost:3000/api/tasks/99    -> 404
 *        curl -X DELETE "localhost:3000/api/tasks?done=true"  -> bulk delete
 */
const express = require('express');
const app = express();

let tasks = [
  { id: 1, title: 'Learn Node', done: true },
  { id: 2, title: 'Learn Express', done: false },
  { id: 3, title: 'Build API', done: true },
];

app.delete('/api/tasks/:id', (req, res) => {
  const index = tasks.findIndex((t) => t.id === +req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Task not found' });
  tasks.splice(index, 1);
  res.status(204).end();
});

app.delete('/api/tasks', (req, res) => {
  const before = tasks.length;
  tasks = tasks.filter((t) => String(t.done) !== req.query.done);
  res.json({ deleted: before - tasks.length });
});

app.get('/api/tasks', (req, res) => res.json(tasks));

app.listen(3000, () => console.log('http://localhost:3000'));
