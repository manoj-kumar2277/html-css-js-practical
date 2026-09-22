/**
 * Experiment: Implement authentication middleware.
 * Run  : node 04-authentication-middleware.js
 * Test : curl localhost:3000/dashboard                      -> 401
 *        curl localhost:3000/dashboard -H "Authorization: Bearer secret-token-123"   -> 200
 */
const express = require('express');
const app = express();

const VALID_TOKENS = { 'secret-token-123': { id: 1, name: 'Asha' } };

function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return res.status(401).json({ error: 'Missing bearer token' });
  const user = VALID_TOKENS[token];
  if (!user) return res.status(403).json({ error: 'Invalid token' });
  req.user = user;
  next();
}

app.get('/public', (req, res) => res.send('Anyone can see this'));
app.get('/dashboard', authenticate, (req, res) => res.json({ message: `Welcome ${req.user.name}` }));

app.listen(3000, () => console.log('http://localhost:3000'));
