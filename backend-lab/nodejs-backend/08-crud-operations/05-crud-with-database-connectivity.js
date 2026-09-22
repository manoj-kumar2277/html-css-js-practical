/**
 * Experiment: Implement CRUD operations with database connectivity.
 * Hand-written SQL (no factory) for a "tasks" table so every step is visible.
 * Run: node 05-crud-with-database-connectivity.js
 */
const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'tasks.db'));
db.exec(`CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  done INTEGER NOT NULL DEFAULT 0
)`);

const app = express();
app.use(express.json());

app.post('/tasks', (req, res) => {
  const info = db.prepare('INSERT INTO tasks (title) VALUES (?)').run(req.body.title);
  res.status(201).json({ id: info.lastInsertRowid, title: req.body.title, done: 0 });
});
app.get('/tasks', (req, res) => res.json(db.prepare('SELECT * FROM tasks').all()));
app.get('/tasks/:id', (req, res) => {
  const t = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
  t ? res.json(t) : res.status(404).json({ error: 'Task not found' });
});
app.put('/tasks/:id', (req, res) => {
  const { title, done } = req.body;
  const info = db.prepare('UPDATE tasks SET title = COALESCE(?, title), done = COALESCE(?, done) WHERE id = ?')
    .run(title ?? null, done === undefined ? null : Number(done), req.params.id);
  if (!info.changes) return res.status(404).json({ error: 'Task not found' });
  res.json(db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id));
});
app.delete('/tasks/:id', (req, res) => {
  const info = db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id);
  info.changes ? res.status(204).end() : res.status(404).json({ error: 'Task not found' });
});

app.listen(3000, () => console.log('http://localhost:3000/tasks'));
