/**
 * Experiment: Implement CRUD operations using Node.js and Express (in-memory array).
 * Run  : node 01-crud-express-nodejs.js
 * Test : POST/GET/PUT/DELETE http://localhost:3000/items
 */
const express = require('express');
const app = express();
app.use(express.json());

let items = [{ id: 1, name: 'Book' }];
let nextId = 2;

app.post('/items', (req, res) => {                                   // CREATE
  const item = { id: nextId++, name: req.body.name };
  items.push(item);
  res.status(201).json(item);
});
app.get('/items', (req, res) => res.json(items));                     // READ all
app.get('/items/:id', (req, res) => {                                 // READ one
  const item = items.find((i) => i.id === +req.params.id);
  item ? res.json(item) : res.status(404).json({ error: 'Not found' });
});
app.put('/items/:id', (req, res) => {                                 // UPDATE
  const item = items.find((i) => i.id === +req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  item.name = req.body.name ?? item.name;
  res.json(item);
});
app.delete('/items/:id', (req, res) => {                              // DELETE
  const before = items.length;
  items = items.filter((i) => i.id !== +req.params.id);
  items.length < before ? res.status(204).end() : res.status(404).json({ error: 'Not found' });
});

app.listen(3000, () => console.log('http://localhost:3000/items'));
