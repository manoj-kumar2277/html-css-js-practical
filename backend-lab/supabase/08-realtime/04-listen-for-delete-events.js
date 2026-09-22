/**
 * Experiment: Listen for database DELETE events.
 * Run: node 08-realtime/04-listen-for-delete-events.js
 */
const { supabase } = require('../config/supabaseClient');

(async () => {
  const { data: row, error } = await supabase.from('students')
    .insert({ name: 'To Delete', email: `del${Date.now()}@example.com`, course: 'IT', age: 22 }).select().single();
  if (error) return console.error(error.message);

  const channel = supabase
    .channel('students-deletes')
    .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'students' }, (payload) => {
      console.log('DELETE received. Old record:', payload.old);   // id always present; other columns need REPLICA IDENTITY FULL
    })
    // one channel can hold many listeners; event '*' catches INSERT, UPDATE and DELETE
    .on('postgres_changes', { event: '*', schema: 'public', table: 'students' }, (p) => console.log(`[any] ${p.eventType}`))
    .subscribe(async (status) => {
      if (status !== 'SUBSCRIBED') return;
      await supabase.from('students').delete().eq('id', row.id);
      setTimeout(async () => { await supabase.removeChannel(channel); process.exit(0); }, 3000);
    });
})();
