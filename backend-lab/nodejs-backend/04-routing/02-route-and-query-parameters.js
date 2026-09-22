/**
 * Experiment: Implement route parameters and query parameters.
 * Run  : node 02-route-and-query-parameters.js
 * Test : /users/5            (route param)
 *        /users/5/posts/9    (multiple params)
 *        /search?q=node&page=2&limit=10   (query params)
 */
const express = require('express');
const app = express();

app.get('/users/:id', (req, res) => res.json({ id: req.params.id }));
app.get('/users/:userId/posts/:postId', (req, res) => res.json(req.params));
app.get('/products/:id(\\d+)', (req, res) => res.json({ numericId: Number(req.params.id) })); // regex constraint

app.get('/search', (req, res) => {
  const { q = '', page = 1, limit = 10 } = req.query;
  res.json({ query: q, page: Number(page), limit: Number(limit) });
});

app.param('id', (req, res, next, id) => { console.log('param id =', id); next(); });

app.listen(3000, () => console.log('http://localhost:3000'));
