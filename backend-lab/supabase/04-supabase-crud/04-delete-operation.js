/**
 * Experiment: Implement Delete operations using the Supabase Client.
 * Run: node 04-supabase-crud/04-delete-operation.js
 */
const { supabase } = require('../config/supabaseClient');

(async () => {
  const { data: created } = await supabase.from('students')
    .insert({ name: 'Temp', email: `temp${Date.now()}@example.com`, course: 'CSE', age: 20 }).select().single();
  console.log('created :', created.id);

  // delete one row, return the deleted row
  const { data: deleted, error } = await supabase.from('students').delete().eq('id', created.id).select().single();
  console.log('deleted :', error ? error.message : deleted);

  // delete many rows
  const { data: many } = await supabase.from('students').delete().like('email', 'temp%').select('id');
  console.log('bulk deleted count:', many?.length ?? 0);

  // confirm it is gone
  const { data: check } = await supabase.from('students').select('id').eq('id', created.id);
  console.log('still exists?', check.length > 0);
})();
