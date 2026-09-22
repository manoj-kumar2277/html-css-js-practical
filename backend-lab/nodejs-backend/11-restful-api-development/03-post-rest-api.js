/**
 * Experiment: Implement a POST REST API.
 * Run  : node 03-post-rest-api.js
 * Test : curl -i -X POST localhost:3000/api/employees -H "Content-Type: application/json" \
 *          -d '{"name":"Asha","department":"IT","salary":40000}'
 * Returns 201 Created + Location header; 400 for bad body; 409 for duplicates.
 */
const express = require('express');
const app = express();
app.use(express.json());
const employees = [];

app.post('/api/employees', (req, res) => {
  const { name, department, salary } = req.body || {};
  if (!name || !department || typeof salary !== 'number')
    return res.status(400).json({ error: 'name, department (string) and salary (number) are required' });
  if (employees.some((e) => e.name.toLowerCase() === name.toLowerCase()))
    return res.status(409).json({ error: 'Employee already exists' });

  const employee = { id: employees.length + 1, name, department, salary, createdAt: new Date().toISOString() };
  employees.push(employee);
  res.status(201).location(`/api/employees/${employee.id}`).json(employee);
});

app.get('/api/employees', (req, res) => res.json(employees));

app.listen(3000, () => console.log('http://localhost:3000'));
