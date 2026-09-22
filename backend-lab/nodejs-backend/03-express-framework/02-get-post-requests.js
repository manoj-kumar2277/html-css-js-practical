/**
 * Experiment: Handle GET and POST requests using Express.
 * Run  : node 02-get-post-requests.js
 * Test : curl http://localhost:3000/greet?name=Ravi
 *        curl -X POST http://localhost:3000/students -H "Content-Type: application/json" -d '{"name":"Ravi"}'
 */
const express = require('express');
const app = express();
app.use(express.json());                        // parse JSON body
app.use(express.urlencoded({ extended: true })); // parse form body

const students = [];

app.get('/greet', (req, res) => res.send(`Hello ${req.query.name || 'Guest'}`));
app.get('/students', (req, res) => res.json(students));

app.post('/students', (req, res) => {
  const student = { id: students.length + 1, ...req.body };
  students.push(student);
  res.status(201).json(student);
});

app.listen(3000, () => console.log('http://localhost:3000'));
