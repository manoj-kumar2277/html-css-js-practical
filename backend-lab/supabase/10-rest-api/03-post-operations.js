/**
 * Experiment: Implement POST operations using the Supabase REST API.
 * Run: node 10-rest-api/03-post-operations.js
 */
const { rest } = require('../config/rest');

(async () => {
  const stamp = Date.now();

  // 1. Insert one row. "Prefer: return=representation" returns the created row (default returns nothing, 201)
  const one = await rest('POST', '/students', {
    body: { name: 'REST Asha', email: `rest${stamp}@example.com`, course: 'CSE', age: 20 },
    prefer: 'return=representation',
  });
  console.log('insert one   :', one.status, one.data);

  // 2. Bulk insert = send an array
  const many = await rest('POST', '/students', {
    body: [
      { name: 'REST Ravi', email: `rr${stamp}@example.com`, course: 'ECE', age: 21 },
      { name: 'REST Meena', email: `rm${stamp}@example.com`, course: 'IT', age: 19 },
    ],
    prefer: 'return=representation',
  });
  console.log('bulk insert  :', many.status, many.data.map((r) => r.id));

  // 3. Upsert on the unique email
  const up = await rest('POST', '/students?on_conflict=email', {
    body: { name: 'REST Asha v2', email: one.data[0].email, course: 'CSE', age: 22 },
    prefer: 'resolution=merge-duplicates,return=representation',
  });
  console.log('upsert       :', up.status, up.data[0].name);

  // 4. Invalid data -> 400/409 with a Postgres error code
  const bad = await rest('POST', '/students', { body: { name: 'X', email: 'x@x.com', course: 'CSE', age: 3 } });
  console.log('check fails  :', bad.status, bad.data.message);

  // 5. Call a database function (RPC) - POST /rpc/<function>
  //    create function public.add_numbers(a int, b int) returns int language sql as $$ select a + b $$;
  const rpc = await rest('POST', '/rpc/add_numbers', { body: { a: 2, b: 3 } });
  console.log('rpc          :', rpc.status, rpc.data);
})();
