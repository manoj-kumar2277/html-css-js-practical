/**
 * Experiment: Serve static files using Express.
 * Run: node 03-static-files.js  -> http://localhost:3000  and  /style.css
 */
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));                 // served at /
app.use('/assets', express.static(path.join(__dirname, 'public')));      // also served at /assets

app.listen(3000, () => console.log('http://localhost:3000'));
