/**
 * Experiment: Implement request validation middleware.
 * Run  : node 03-request-validation-middleware.js
 * Test : curl -X POST localhost:3000/register -H "Content-Type: application/json" -d '{"name":"A","email":"bad"}'
 */
const express = require('express');
const app = express();
app.use(express.json());

const validateRegistration = (req, res, next) => {
  const { name, email, age } = req.body;
  const errors = [];
  if (!name || name.trim().length < 3) errors.push('name must be at least 3 characters');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('email is invalid');
  if (age !== undefined && (!Number.isInteger(age) || age < 0)) errors.push('age must be a positive integer');
  if (errors.length) return res.status(400).json({ success: false, errors });
  next();
};

app.post('/register', validateRegistration, (req, res) => res.status(201).json({ success: true, user: req.body }));

app.listen(3000, () => console.log('http://localhost:3000'));
