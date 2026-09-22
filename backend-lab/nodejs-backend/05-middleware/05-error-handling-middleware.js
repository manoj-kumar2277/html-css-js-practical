/**
 * Experiment: Implement error-handling middleware.
 * Run: node 05-error-handling-middleware.js -> /ok , /bad-request , /crash , /async-crash
 */
const express = require('express');
const app = express();

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

app.get('/ok', (req, res) => res.send('fine'));
app.get('/bad-request', (req, res, next) => next(new HttpError(400, 'Bad request example')));
app.get('/crash', () => { throw new Error('Synchronous crash'); });
app.get('/async-crash', async (req, res, next) => {
  try { await Promise.reject(new Error('Async failure')); } catch (e) { next(e); }
});

app.use((req, res, next) => next(new HttpError(404, `Route ${req.originalUrl} not found`)));

// error-handling middleware: exactly FOUR parameters
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(err.status || 500).json({ success: false, message: err.message });
});

app.listen(3000, () => console.log('http://localhost:3000'));
