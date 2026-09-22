/**
 * Experiment: Implement User Registration.
 * Run  : node 01-user-registration.js
 * Test : curl -X POST localhost:3000/register -H "Content-Type: application/json" \
 *          -d '{"name":"Asha","email":"asha@x.com","password":"Secret123"}'
 */
const express = require('express');
const bcrypt = require('bcryptjs');
const app = express();
app.use(express.json());

const users = [];

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'name, email and password are required' });
  if (password.length < 8) return res.status(400).json({ error: 'password must be at least 8 characters' });
  if (users.some((u) => u.email === email)) return res.status(409).json({ error: 'Email already registered' });

  const hashed = await bcrypt.hash(password, 10);
  const user = { id: users.length + 1, name, email, password: hashed };
  users.push(user);
  res.status(201).json({ id: user.id, name, email });          // never return the password
});

app.get('/users', (req, res) => res.json(users.map(({ password, ...u }) => u)));

app.listen(3000, () => console.log('http://localhost:3000'));
