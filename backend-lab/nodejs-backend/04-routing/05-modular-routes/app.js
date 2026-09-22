/**
 * Experiment: Create modular routes for users, products, or students.
 * Run: node app.js -> /users , /products , /students
 */
const express = require('express');
const app = express();
app.use(express.json());

app.use('/users', require('./routes/users'));
app.use('/products', require('./routes/products'));
app.use('/students', require('./routes/students'));
app.use((req, res) => res.status(404).json({ error: 'Not Found' }));

app.listen(3000, () => console.log('http://localhost:3000'));
