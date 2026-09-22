/**
 * Experiment: Implement basic routing using Express.
 * Run: node 01-basic-routing.js
 */
const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Home'));
app.get('/about', (req, res) => res.send('About'));
app.post('/contact', (req, res) => res.send('POST /contact'));
app.put('/profile', (req, res) => res.send('PUT /profile'));
app.delete('/profile', (req, res) => res.send('DELETE /profile'));
app.all('/any', (req, res) => res.send(`Handled ${req.method} on /any`));
app.route('/book')                                   // chained handlers, one path
  .get((req, res) => res.send('Get book'))
  .post((req, res) => res.send('Add book'));

app.listen(3000, () => console.log('http://localhost:3000'));
