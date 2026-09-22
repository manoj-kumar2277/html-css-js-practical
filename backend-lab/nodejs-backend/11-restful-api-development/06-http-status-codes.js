/**
 * Experiment: Implement proper HTTP Status Codes in REST APIs.
 * Run: node 06-http-status-codes.js  -> call each route and read the status line (curl -i)
 */
const express = require('express');
const app = express();
app.use(express.json());

app.get('/ok', (req, res) => res.status(200).json({ msg: '200 OK - request succeeded' }));
app.post('/created', (req, res) => res.status(201).json({ msg: '201 Created - new resource made' }));
app.delete('/no-content', (req, res) => res.status(204).end());                       // 204 No Content
app.get('/moved', (req, res) => res.redirect(301, '/ok'));                            // 301 Moved Permanently
app.get('/bad-request', (req, res) => res.status(400).json({ msg: '400 Bad Request - client sent invalid data' }));
app.get('/unauthorized', (req, res) => res.status(401).json({ msg: '401 Unauthorized - login required' }));
app.get('/forbidden', (req, res) => res.status(403).json({ msg: '403 Forbidden - logged in but not allowed' }));
app.get('/missing', (req, res) => res.status(404).json({ msg: '404 Not Found' }));
app.post('/conflict', (req, res) => res.status(409).json({ msg: '409 Conflict - duplicate resource' }));
app.post('/invalid', (req, res) => res.status(422).json({ msg: '422 Unprocessable Entity - validation failed' }));
app.get('/rate-limited', (req, res) => res.status(429).json({ msg: '429 Too Many Requests' }));
app.get('/server-error', (req, res) => res.status(500).json({ msg: '500 Internal Server Error' }));
app.get('/unavailable', (req, res) => res.status(503).json({ msg: '503 Service Unavailable' }));

app.listen(3000, () => console.log('http://localhost:3000'));
