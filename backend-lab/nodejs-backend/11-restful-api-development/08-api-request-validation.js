/**
 * Experiment: Implement API Request Validation (schema-driven, no external lib).
 * Run  : node 08-api-request-validation.js
 * Test : curl -X POST localhost:3000/api/orders -H "Content-Type: application/json" -d '{"customer":"A","quantity":0,"email":"bad"}'
 */
const express = require('express');
const app = express();
app.use(express.json());

const schema = {
  customer: { type: 'string', required: true, min: 2, max: 50 },
  email:    { type: 'string', required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'must be a valid email' },
  quantity: { type: 'number', required: true, integer: true, min: 1, max: 100 },
  note:     { type: 'string', required: false, max: 200 },
};

function validateBody(schema) {
  return (req, res, next) => {
    const errors = [];
    for (const [field, r] of Object.entries(schema)) {
      const v = req.body[field];
      if (v === undefined || v === null || v === '') { if (r.required) errors.push({ field, message: 'is required' }); continue; }
      if (typeof v !== r.type) { errors.push({ field, message: `must be of type ${r.type}` }); continue; }
      if (r.integer && !Number.isInteger(v)) errors.push({ field, message: 'must be an integer' });
      if (r.min !== undefined && (r.type === 'string' ? v.length : v) < r.min) errors.push({ field, message: `must be >= ${r.min}` });
      if (r.max !== undefined && (r.type === 'string' ? v.length : v) > r.max) errors.push({ field, message: `must be <= ${r.max}` });
      if (r.pattern && !r.pattern.test(v)) errors.push({ field, message: r.message || 'has an invalid format' });
    }
    if (errors.length) return res.status(422).json({ success: false, errors });
    next();
  };
}

app.post('/api/orders', validateBody(schema), (req, res) => res.status(201).json({ success: true, order: req.body }));

app.listen(3000, () => console.log('http://localhost:3000'));
