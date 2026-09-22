/**
 * Experiment: Implement PATCH / UPDATE operations using the Supabase REST API.
 * PATCH changes only the columns sent, for every row matching the filter in the query string.
 * Run: node 10-rest-api/04-patch-update-operations.js
 */
const { rest } = require('../config/rest');

(async () => {
  const email = `patch${Date.now()}@example.com`;
  const created = await rest('POST', '/students', { body: { name: 'Patch Me', email, course: 'CSE', age: 20 }, prefer: 'return=representation' });
  const id = created.data[0].id;

  // update one row
  const one = await rest('PATCH', `/students?id=eq.${id}`, { body: { name: 'Patched', age: 21 }, prefer: 'return=representation' });
  console.log('patch one    :', one.status, one.data);

  // update many rows (filter matches several)
  const many = await rest('PATCH', '/students?course=eq.CSE&age=lt.18', { body: { course: 'Junior' }, prefer: 'return=representation' });
  console.log('patch many   :', many.status, `${many.data.length} row(s)`);

  // no match => 200 with []
  const none = await rest('PATCH', '/students?id=eq.-1', { body: { age: 30 }, prefer: 'return=representation' });
  console.log('no match     :', none.status, none.data);

  // A PATCH with NO filter would touch every row - PostgREST/RLS should prevent it in production
  await rest('DELETE', `/students?id=eq.${id}`);
})();
