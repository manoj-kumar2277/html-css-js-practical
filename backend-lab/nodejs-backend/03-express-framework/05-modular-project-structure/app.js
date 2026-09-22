/**
 * Experiment: Create an Express application with a modular project structure.
 * Structure:
 *   app.js -> routes/items.js -> controllers/itemController.js
 * Run: node app.js  ->  GET/POST http://localhost:3000/api/items
 */
const express = require('express');
const itemRoutes = require('./routes/items');

const app = express();
app.use(express.json());
app.get('/', (req, res) => res.send('Modular Express App'));
app.use('/api/items', itemRoutes);

app.listen(3000, () => console.log('http://localhost:3000'));
