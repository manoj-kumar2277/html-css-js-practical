/**
 * Experiment: Implement input validation for CRUD operations.
 * Run  : node 06-input-validation-crud.js
 * Test : curl -X POST localhost:3000/students -H "Content-Type: application/json" -d '{"name":"A","email":"x","age":5}'
 *        -> 400 with a list of every validation error
 */
const express = require('express');
const app = express();
app.use(express.json());

const rules = {
  name:   (v) => (typeof v === 'string' && v.trim().length >= 2 ? null : 'must be at least 2 characters'),
  email:  (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'must be a valid email'),
  age:    (v) => (Number.isInteger(v) && v >= 15 && v <= 100 ? null : 'must be an integer between 15 and 100'),
  course: (v) => (['CSE', 'ECE', 'MECH', 'CIVIL'].includes(v) ? null : 'must be CSE, ECE, MECH or CIVIL'),
};

function validate(required) {
  return (req, res, next) => {
    const errors = {};
    for (const field of Object.keys(rules)) {
      const value = req.body[field];
      if (value === undefined) { if (required) errors[field] = 'is required'; continue; }
      const msg = rules[field](value);
      if (msg) errors[field] = msg;
    }
    Object.keys(req.body).forEach((k) => { if (!rules[k]) errors[k] = 'is not an allowed field'; });
    return Object.keys(errors).length ? res.status(400).json({ errors }) : next();
  };
}

const students = [];
app.post('/students', validate(true), (req, res) => { const s = { id: students.length + 1, ...req.body }; students.push(s); res.status(201).json(s); });
app.put('/students/:id', validate(false), (req, res) => {
  const s = students.find((x) => x.id === +req.params.id);
  if (!s) return res.status(404).json({ error: 'Not found' });
  Object.assign(s, req.body); res.json(s);
});
app.get('/students', (req, res) => res.json(students));

app.listen(3000, () => console.log('http://localhost:3000'));
