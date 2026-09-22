/**
 * Experiment: Create a Student REST API with Database Connectivity.
 * Run  : node 10-student-rest-api-with-database.js
 * Routes: GET/POST /api/students , GET/PUT/PATCH/DELETE /api/students/:id , GET /api/students?course=CSE&search=as&page=1&limit=5
 */
const express = require('express');
const db = require('../common/db');

const app = express();
app.use(express.json());

const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

app.get('/api/students', (req, res) => {
  const { course, search = '', page = 1, limit = 10 } = req.query;
  const where = ['name LIKE ?']; const params = [`%${search}%`];
  if (course) { where.push('course = ?'); params.push(course); }
  const total = db.prepare(`SELECT COUNT(*) c FROM students WHERE ${where.join(' AND ')}`).get(...params).c;
  const data = db.prepare(`SELECT * FROM students WHERE ${where.join(' AND ')} ORDER BY id LIMIT ? OFFSET ?`)
    .all(...params, +limit, (+page - 1) * +limit);
  res.json({ total, page: +page, limit: +limit, data });
});

app.get('/api/students/:id', (req, res) => {
  const s = db.prepare('SELECT * FROM students WHERE id = ?').get(req.params.id);
  s ? res.json(s) : res.status(404).json({ error: 'Student not found' });
});

app.post('/api/students', (req, res) => {
  const { name, email, course, age } = req.body;
  if (!name || !isEmail(email) || !course || !Number.isInteger(age) || age < 15)
    return res.status(400).json({ error: 'name, valid email, course and integer age (>=15) are required' });
  try {
    const info = db.prepare('INSERT INTO students (name,email,course,age) VALUES (?,?,?,?)').run(name, email, course, age);
    res.status(201).json(db.prepare('SELECT * FROM students WHERE id=?').get(info.lastInsertRowid));
  } catch (e) {
    res.status(e.code === 'SQLITE_CONSTRAINT_UNIQUE' ? 409 : 500).json({ error: e.message });
  }
});

const update = (req, res) => {
  const cur = db.prepare('SELECT * FROM students WHERE id = ?').get(req.params.id);
  if (!cur) return res.status(404).json({ error: 'Student not found' });
  const m = { ...cur, ...req.body, id: cur.id };
  if (req.method === 'PUT' && ['name', 'email', 'course', 'age'].some((k) => req.body[k] === undefined))
    return res.status(400).json({ error: 'PUT requires name, email, course and age' });
  db.prepare('UPDATE students SET name=?, email=?, course=?, age=? WHERE id=?').run(m.name, m.email, m.course, m.age, cur.id);
  res.json(db.prepare('SELECT * FROM students WHERE id=?').get(cur.id));
};
app.put('/api/students/:id', update);
app.patch('/api/students/:id', update);

app.delete('/api/students/:id', (req, res) => {
  const info = db.prepare('DELETE FROM students WHERE id = ?').run(req.params.id);
  info.changes ? res.status(204).end() : res.status(404).json({ error: 'Student not found' });
});

app.listen(3000, () => console.log('http://localhost:3000/api/students'));
