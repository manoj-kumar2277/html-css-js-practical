/**
 * Experiment: Implement Update operations using the Supabase Client.
 * Run: node 04-supabase-crud/03-update-operation.js
 */
const { supabase } = require('../config/supabaseClient');

(async () => {
  const email = `update${Date.now()}@example.com`;
  const { data: created } = await supabase.from('students').insert({ name: 'Before', email, course: 'CSE', age: 20 }).select().single();
  console.log('created  :', created);

  // update a single row by id and return it
  const { data: one, error } = await supabase
    .from('students').update({ name: 'After', age: 21 }).eq('id', created.id).select().single();
  console.log('updated  :', error ? error.message : one);

  // update many rows with a filter
  const { data: many } = await supabase.from('students').update({ course: 'Computer Science' }).eq('course', 'CSE').select('id');
  console.log('rows updated by filter:', many?.length);

  // update that matches nothing returns an empty array (not an error)
  const { data: none } = await supabase.from('students').update({ age: 30 }).eq('id', -1).select();
  console.log('no match :', none);

  // ALWAYS add a filter: update() without eq()/match() is rejected by PostgREST when "safe update" is on
})();
