/**
 * Experiment: Create a Product REST API with CRUD Operations (SQLite, validation, stock adjustment).
 * Run: node 11-product-rest-api-crud.js
 * Extra endpoint: POST /api/products/:id/stock  {"change": -3}   (adjust stock, never below 0)
 */
const express = require('express');
const db = require('../common/db');
const crud = require('../common/crudFactory');
const v = require('../common/validators');

const app = express();
app.use(express.json());

app.post('/api/products/:id/stock', (req, res, next) => {
  const p = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!p) return res.status(404).json({ error: 'Product not found' });
  if (!Number.isInteger(req.body.change)) return res.status(400).json({ error: 'change must be an integer' });
  if (p.stock + req.body.change < 0) return res.status(409).json({ error: 'Insufficient stock' });
  db.prepare('UPDATE products SET stock = stock + ? WHERE id = ?').run(req.body.change, p.id);
  res.json(db.prepare('SELECT * FROM products WHERE id = ?').get(p.id));
});

app.use('/api/products', crud(db, 'products', { name: v.string(2), price: v.number(0), stock: v.int(0) }));

app.listen(3000, () => console.log('http://localhost:3000/api/products'));
