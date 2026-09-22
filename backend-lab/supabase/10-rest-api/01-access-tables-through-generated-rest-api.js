/**
 * Experiment: Access Supabase tables through the generated REST API (PostgREST).
 * Every table/view in the "public" schema is exposed at  https://<ref>.supabase.co/rest/v1/<table>
 * Required headers:  apikey: <anon key>   and   Authorization: Bearer <anon key or user JWT>
 * Run: node 10-rest-api/01-access-tables-through-generated-rest-api.js
 */
const { rest, BASE } = require('../config/rest');

(async () => {
  console.log('Base URL:', BASE);

  // 1. Auto-generated OpenAPI description of ALL tables
  const spec = await rest('GET', '/');
  console.log('Tables exposed :', Object.keys(spec.data?.definitions || spec.data?.components?.schemas || {}));

  // 2. Read a table
  const r = await rest('GET', '/students?select=id,name,course&limit=3');
  console.log('GET /students  :', r.status, r.data);

  // 3. Equivalent curl
  console.log(`\ncurl "${BASE}/students?select=*&limit=3" \\\n  -H "apikey: $SUPABASE_ANON_KEY" -H "Authorization: Bearer $SUPABASE_ANON_KEY"`);

  // 4. Without keys the API refuses
  const noKey = await fetch(`${BASE}/students`);
  console.log('\nwithout apikey :', noKey.status);
})();
