/**
 * Experiment: Create a Product Management CRUD application (SQLite).
 * Run: node 04-product-management-crud.js
 * Try: curl -X POST localhost:3000/products -H "Content-Type: application/json" \
 *        -d '{"name":"Keyboard","price":999.5,"stock":10}'
 */
const express = require('express');
const db = require('../common/db');
const crud = require('../common/crudFactory');
const v = require('../common/validators');

const app = express();
app.use(express.json());
app.use('/products', crud(db, 'products', {
  name: v.string(2), price: v.number(0), stock: v.int(0),
}));

app.listen(3000, () => console.log('http://localhost:3000/products'));
