/**
 * Experiment: Implement 404 / Not Found route handling.
 * Run: node 04-not-found-404-handling.js  -> try /  and  /does-not-exist
 */
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Home page'));
app.get('/hello', (req, res) => res.send('Hello'));

// must be the LAST middleware -> reached only when no route matched
app.use((req, res) => {
  res.status(404);
  if (req.accepts('html')) return res.send(`<h1>404</h1><p>${req.originalUrl} was not found.</p>`);
  res.json({ error: 'Not Found', path: req.originalUrl });
});

app.listen(3000, () => console.log('http://localhost:3000'));
