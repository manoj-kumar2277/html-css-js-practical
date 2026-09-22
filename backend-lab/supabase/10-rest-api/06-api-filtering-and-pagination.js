/**
 * Experiment: Implement API filtering and pagination.
 * Run: node 10-rest-api/06-api-filtering-and-pagination.js
 */
const { rest } = require('../config/rest');

(async () => {
  // ---- FILTER OPERATORS: eq neq gt gte lt lte like ilike in is not.<op> or() and() cs cd fts ----
  const f = [
    ['course = CSE',            '/students?course=eq.CSE'],
    ['age between 19 and 22',   '/students?age=gte.19&age=lte.22'],
    ['course in (CSE,IT)',      '/students?course=in.(CSE,IT)'],
    ['course not CSE',          '/students?course=neq.CSE'],
    ['name starts with A',      '/students?name=like.A*'],
    ['user_id is null',         '/students?user_id=is.null'],
    ['OR condition',            '/students?or=(age.gte.22,course.eq.IT)'],
    ['NOT (age < 20)',          '/students?age=not.lt.20'],
  ];
  for (const [label, path] of f) console.log(label.padEnd(24), '->', (await rest('GET', path)).data?.length, 'row(s)');

  // ---- SORT + LIMIT / OFFSET ----
  const page = 2, size = 3;
  const p = await rest('GET', `/students?select=id,name&order=id.asc&limit=${size}&offset=${(page - 1) * size}`);
  console.log(`\npage ${page} (limit/offset):`, p.data);

  // ---- TOTAL COUNT via headers: Prefer count=exact => Content-Range: 0-2/17 ----
  const c = await rest('GET', '/students?select=id&limit=3', { prefer: 'count=exact' });
  console.log('Content-Range      :', c.contentRange);
  const total = Number(c.contentRange.split('/')[1]);
  console.log(`total ${total} rows -> ${Math.ceil(total / size)} pages of ${size}`);

  // ---- RANGE header alternative ----
  const r = await rest('GET', '/students?select=id,name&order=id', { extra: { Range: '0-2', 'Range-Unit': 'items' }, prefer: 'count=exact' });
  console.log('Range: 0-2         :', r.status, r.data.length, 'rows');
})();
