/**
 * Experiment: Implement API Error Handling (consistent JSON error format).
 * Run: node 07-api-error-handling.js -> /api/items/abc (400) , /api/items/99 (404) , /api/boom (500) , /nowhere (404)
 */
const express = require('express');
const app = express();
app.use(express.json());

class ApiError extends Error {
  constructor(status, message, details) { super(message); this.status = status; this.details = details; }
}
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);   // forwards async errors

const items = [{ id: 1, name: 'Pen' }];

app.get('/api/items/:id', asyncHandler(async (req, res) => {
  if (!/^\d+$/.test(req.params.id)) throw new ApiError(400, 'id must be a number');
  const item = items.find((i) => i.id === +req.params.id);
  if (!item) throw new ApiError(404, `Item ${req.params.id} not found`);
  res.json(item);
}));
app.get('/api/boom', asyncHandler(async () => { throw new Error('database exploded'); }));

app.use((req, res, next) => next(new ApiError(404, `Route ${req.method} ${req.originalUrl} not found`)));

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400) err = new ApiError(400, 'Malformed JSON body');
  const status = err.status || 500;
  if (status === 500) console.error(err);                                         // log internals, hide from client
  res.status(status).json({
    success: false,
    error: { status, message: status === 500 ? 'Internal Server Error' : err.message, details: err.details },
  });
});

app.listen(3000, () => console.log('http://localhost:3000'));
