/**
 * Experiment: Implement a GET REST API (collection, single item, filter, sort, paginate).
 * Run  : node 02-get-rest-api.js
 * Test : /api/products
 *        /api/products?category=phone&sort=price&order=desc
 *        /api/products?minPrice=500&page=1&limit=2
 *        /api/products/3
 */
const express = require('express');
const app = express();

const products = [
  { id: 1, name: 'Laptop', category: 'computer', price: 55000 },
  { id: 2, name: 'Phone', category: 'phone', price: 20000 },
  { id: 3, name: 'Tablet', category: 'phone', price: 15000 },
  { id: 4, name: 'Mouse', category: 'computer', price: 500 },
  { id: 5, name: 'Keyboard', category: 'computer', price: 1200 },
];

app.get('/api/products', (req, res) => {
  const { category, minPrice, sort = 'id', order = 'asc', page = 1, limit = 10 } = req.query;
  let list = [...products];
  if (category) list = list.filter((p) => p.category === category);
  if (minPrice) list = list.filter((p) => p.price >= +minPrice);
  list.sort((a, b) => (a[sort] > b[sort] ? 1 : -1) * (order === 'desc' ? -1 : 1));
  const start = (page - 1) * limit;
  res.json({ total: list.length, page: +page, limit: +limit, data: list.slice(start, start + +limit) });
});

app.get('/api/products/:id', (req, res) => {
  const p = products.find((x) => x.id === +req.params.id);
  p ? res.json(p) : res.status(404).json({ error: 'Product not found' });
});

app.listen(3000, () => console.log('http://localhost:3000/api/products'));
