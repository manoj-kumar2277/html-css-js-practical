/**
 * Experiment: Create a User Management CRUD application (SQLite).
 * Run: node 03-user-management-crud.js
 * Try: curl -X POST localhost:3000/users -H "Content-Type: application/json" \
 *        -d '{"name":"Ravi","email":"ravi@x.com","role":"user"}'
 */
const express = require('express');
const db = require('../common/db');
const crud = require('../common/crudFactory');
const v = require('../common/validators');

const app = express();
app.use(express.json());
app.use('/users', crud(db, 'users', {
  name: v.string(2), email: v.email(), role: v.oneOf(['user', 'admin']),
}, ['password']));

app.listen(3000, () => console.log('http://localhost:3000/users'));
