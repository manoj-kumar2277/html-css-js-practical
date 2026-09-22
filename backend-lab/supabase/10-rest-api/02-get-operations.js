/**
 * Experiment: Implement GET operations using the Supabase REST API.
 * Run: node 10-rest-api/02-get-operations.js
 */
const { rest } = require('../config/rest');

(async () => {
  const show = async (label, path) => { const r = await rest('GET', path); console.log(label.padEnd(20), r.status, JSON.stringify(r.data).slice(0, 150)); };

  await show('all rows',          '/students');
  await show('choose columns',    '/students?select=id,name');
  await show('by id',             '/students?id=eq.1');
  await show('single object',     '/students?id=eq.1&select=name');      // still an array; add header Accept: application/vnd.pgrst.object+json for an object
  await show('filter eq',         '/students?course=eq.CSE');
  await show('filter gt',         '/students?age=gt.20');
  await show('in list',           '/students?course=in.(CSE,IT)');
  await show('pattern (ilike)',   '/students?name=ilike.*a*');
  await show('order',             '/students?order=age.desc');
  await show('rename column',     '/students?select=student:name,years:age');

  const single = await rest('GET', '/students?id=eq.1', { extra: { Accept: 'application/vnd.pgrst.object+json' } });
  console.log('as one object'.padEnd(20), single.status, single.data);
})();
