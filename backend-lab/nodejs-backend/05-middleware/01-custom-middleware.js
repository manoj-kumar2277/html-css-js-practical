/**
 * Experiment: Create and implement custom middleware.
 * Run: node 01-custom-middleware.js
 */
const express = require('express');
const app = express();

// application-level middleware: adds a timestamp to every request
const addTimestamp = (req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();                                   // pass control to the next handler
};

// middleware factory (configurable)
const addHeader = (name, value) => (req, res, next) => { res.setHeader(name, value); next(); };

app.use(addTimestamp);
app.use(addHeader('X-App-Name', 'MiddlewareLab'));

app.get('/', (req, res) => res.send(`Request received at ${req.requestTime}`));

// route-level middleware
app.get('/secret', (req, res, next) => { req.secret = 42; next(); }, (req, res) => res.json({ secret: req.secret }));

app.listen(3000, () => console.log('http://localhost:3000'));
