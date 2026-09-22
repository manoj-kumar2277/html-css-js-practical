/**
 * Experiment: Create a basic RESTful API using Express.js.
 * REST rules: resources as nouns (/books), HTTP verbs as actions, JSON in/out, proper status codes.
 * Run: node 01-basic-restful-api.js
 *   GET /api/books | GET /api/books/1 | POST /api/books | PUT /api/books/1 | DELETE /api/books/1
 */
const express = require('express');
const app = express();
app.use(express.json());

let books = [{ id: 1, title: 'Node.js Basics', author: 'A. Author' }];

app.get('/api/books', (req, res) => res.json(books));
app.get('/api/books/:id', (req, res) => {
  const b = books.find((x) => x.id === +req.params.id);
  b ? res.json(b) : res.status(404).json({ error: 'Book not found' });
});
app.post('/api/books', (req, res) => {
  const b = { id: books.length ? books[books.length - 1].id + 1 : 1, ...req.body };
  books.push(b);
  res.status(201).location(`/api/books/${b.id}`).json(b);
});
app.put('/api/books/:id', (req, res) => {
  const i = books.findIndex((x) => x.id === +req.params.id);
  if (i < 0) return res.status(404).json({ error: 'Book not found' });
  books[i] = { id: books[i].id, ...req.body };
  res.json(books[i]);
});
app.delete('/api/books/:id', (req, res) => {
  books = books.filter((x) => x.id !== +req.params.id);
  res.status(204).end();
});

app.listen(3000, () => console.log('REST API on http://localhost:3000/api/books'));
