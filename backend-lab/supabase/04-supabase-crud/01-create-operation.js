/**
 * Experiment: Implement Create operations using the Supabase Client.
 * Run: node 04-supabase-crud/01-create-operation.js
 */
const { supabase } = require('../config/supabaseClient');

(async () => {
  // 1. insert one row and return it
  const { data: one, error: e1 } = await supabase
    .from('students')
    .insert({ name: 'Asha', email: `asha${Date.now()}@example.com`, course: 'CSE', age: 20 })
    .select()
    .single();
  console.log('insert one  :', e1 ? e1.message : one);

  // 2. insert many rows
  const stamp = Date.now();
  const { data: many, error: e2 } = await supabase
    .from('students')
    .insert([
      { name: 'Ravi', email: `ravi${stamp}@example.com`, course: 'ECE', age: 21 },
      { name: 'Meena', email: `meena${stamp}@example.com`, course: 'IT', age: 19 },
    ])
    .select();
  console.log('insert many :', e2 ? e2.message : many.map((r) => r.id));

  // 3. upsert: insert, or update when the unique email already exists
  const { data: up, error: e3 } = await supabase
    .from('students')
    .upsert({ name: 'Asha Updated', email: one?.email, course: 'CSE', age: 21 }, { onConflict: 'email' })
    .select();
  console.log('upsert      :', e3 ? e3.message : up);

  // 4. error handling: violates CHECK (age >= 15)
  const { error: e4 } = await supabase.from('students').insert({ name: 'Kid', email: 'kid@x.com', course: 'CSE', age: 5 });
  console.log('invalid row :', e4 ? `${e4.code} - ${e4.message}` : 'unexpectedly inserted');
})();
