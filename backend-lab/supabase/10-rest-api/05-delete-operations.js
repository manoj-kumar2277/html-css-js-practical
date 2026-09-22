/**
 * Experiment: Implement DELETE operations using the Supabase REST API.
 * Run: node 10-rest-api/05-delete-operations.js
 */
const { rest } = require('../config/rest');

(async () => {
  const stamp = Date.now();
  const made = await rest('POST', '/students', {
    body: [
      { name: 'Del A', email: `da${stamp}@example.com`, course: 'TMP', age: 20 },
      { name: 'Del B', email: `db${stamp}@example.com`, course: 'TMP', age: 21 },
      { name: 'Del C', email: `dc${stamp}@example.com`, course: 'TMP', age: 22 },
    ],
    prefer: 'return=representation',
  });
  const ids = made.data.map((r) => r.id);

  // delete one row (204 No Content by default)
  const one = await rest('DELETE', `/students?id=eq.${ids[0]}`);
  console.log('delete one   :', one.status);

  // delete and return the removed row
  const ret = await rest('DELETE', `/students?id=eq.${ids[1]}`, { prefer: 'return=representation' });
  console.log('delete + rows:', ret.status, ret.data);

  // delete several with a filter
  const many = await rest('DELETE', '/students?course=eq.TMP', { prefer: 'return=representation' });
  console.log('delete many  :', many.status, `${many.data.length} row(s)`);

  // an unfiltered DELETE would remove everything - never do that without a filter
})();
