/**
 * Experiment: Implement logging middleware.
 * Run: node 02-logging-middleware.js  -> logs also written to requests.log
 */
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const logFile = fs.createWriteStream(path.join(__dirname, 'requests.log'), { flags: 'a' });

function logger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {                 // runs after the response is sent
    const line = `${new Date().toISOString()} ${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`;
    console.log(line);
    logFile.write(line + '\n');
  });
  next();
}

app.use(logger);
app.get('/', (req, res) => res.send('Home'));
app.get('/slow', (req, res) => setTimeout(() => res.send('Slow response'), 500));

app.listen(3000, () => console.log('http://localhost:3000'));
