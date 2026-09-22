/**
 * Project: Create a Student REST API using Supabase.
 * An Express API that sits in front of Supabase. If the caller sends "Authorization: Bearer <user JWT>",
 * the request runs AS that user (RLS applies); otherwise it runs as anon.
 *
 * Run : node 11-project-based-experiments/06-student-rest-api.js      (port 3000)
 * Docs: GET http://localhost:3000/
 *   GET    /api/students?search=&course=&sort=name&order=asc&page=1&limit=10
 *   GET    /api/students/:id
 *   POST   /api/students          {name,email,course,age}
 *   PUT    /api/students/:id      (all fields)     PATCH /api/students/:id (some fields)
 *   DELETE /api/students/:id
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());

// per-request client that forwards the caller's token
app.use((req, res, next) => {
  const auth = req.headers.authorization;
  req.sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    global: { headers: auth ? { Authorization: auth } : {} },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  next();
});

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function validate(b, partial = false) {
  const errors = [];
  const check = (k, ok, msg) => { if (b[k] === undefined) { if (!partial) errors.push(`${k} is required`); } else if (!ok(b[k])) errors.push(`${k} ${msg}`); };
  check('name', (v) => typeof v === 'string' && v.trim().length >= 2, 'must be at least 2 characters');
  check('email', (v) => typeof v === 'string' && EMAIL.test(v), 'must be a valid email');
  check('course', (v) => typeof v === 'string' && v.trim().length > 0, 'must be a non-empty string');
  check('age', (v) => Number.isInteger(v) && v >= 15, 'must be an integer >= 15');
  return errors;
}
const FIELDS = ['name', 'email', 'course', 'age'];
const pick = (b) => Object.fromEntries(FIELDS.filter((k) => b[k] !== undefined).map((k) => [k, b[k]]));
const fail = (res, error, fallback = 400) => {
  const status = error.code === '23505' ? 409 : error.code === 'PGRST116' ? 404 : error.code === '42501' ? 403 : fallback;
  res.status(status).json({ error: error.message, code: error.code });
};

app.get('/api/students', async (req, res) => {
  const { search, course, sort = 'id', order = 'asc', page = 1, limit = 10 } = req.query;
  const p = Math.max(1, +page), l = Math.min(100, Math.max(1, +limit));
  if (!['id', 'name', 'email', 'course', 'age', 'created_at'].includes(sort)) return res.status(400).json({ error: 'invalid sort column' });

  let q = req.sb.from('students').select('*', { count: 'exact' });
  if (search) q = q.ilike('name', `%${search}%`);
  if (course) q = q.eq('course', course);
  const { data, count, error } = await q.order(sort, { ascending: order !== 'desc' }).range((p - 1) * l, p * l - 1);
  if (error) return fail(res, error);
  res.json({ page: p, limit: l, total: count, totalPages: Math.ceil(count / l), data });
});

app.get('/api/students/:id', async (req, res) => {
  const { data, error } = await req.sb.from('students').select('*').eq('id', req.params.id).single();
  error ? fail(res, error) : res.json(data);
});

app.post('/api/students', async (req, res) => {
  const errors = validate(req.body);
  if (errors.length) return res.status(422).json({ errors });
  const { data, error } = await req.sb.from('students').insert(pick(req.body)).select().single();
  error ? fail(res, error) : res.status(201).location(`/api/students/${data.id}`).json(data);
});

const update = (partial) => async (req, res) => {
  const errors = validate(req.body, partial);
  if (errors.length) return res.status(422).json({ errors });
  const { data, error } = await req.sb.from('students').update(pick(req.body)).eq('id', req.params.id).select().single();
  error ? fail(res, error) : res.json(data);
};
app.put('/api/students/:id', update(false));
app.patch('/api/students/:id', update(true));

app.delete('/api/students/:id', async (req, res) => {
  const { data, error } = await req.sb.from('students').delete().eq('id', req.params.id).select();
  if (error) return fail(res, error);
  data.length ? res.status(204).end() : res.status(404).json({ error: 'Student not found' });
});

app.get('/', (req, res) => res.json({ name: 'Student REST API (Supabase)', endpoints: ['GET /api/students', 'GET /api/students/:id', 'POST /api/students', 'PUT|PATCH /api/students/:id', 'DELETE /api/students/:id'] }));
app.use((req, res) => res.status(404).json({ error: 'Route not found' }));

app.listen(process.env.PORT || 3000, () => console.log('Student REST API on http://localhost:' + (process.env.PORT || 3000)));
