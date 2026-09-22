/**
 * Experiment: Create a basic Express.js application.
 * Run: node 01-basic-express-app.js   -> http://localhost:3000
 */
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Hello Express!'));

app.listen(3000, () => console.log('Express app running on http://localhost:3000'));
