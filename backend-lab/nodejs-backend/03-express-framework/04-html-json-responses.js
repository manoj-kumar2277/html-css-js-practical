/**
 * Experiment: Send HTML and JSON responses using Express.
 * Run: node 04-html-json-responses.js
 */
const express = require('express');
const path = require('path');
const app = express();

app.get('/text', (req, res) => res.send('Plain text response'));
app.get('/html', (req, res) => res.send('<h1 style="color:teal">HTML response</h1><p>Sent with res.send()</p>'));
app.get('/html-file', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/json', (req, res) => res.json({ id: 1, name: 'Asha', skills: ['node', 'express'] }));
app.get('/status', (req, res) => res.status(201).json({ created: true }));
app.get('/redirect', (req, res) => res.redirect('/json'));

app.listen(3000, () => console.log('http://localhost:3000'));
