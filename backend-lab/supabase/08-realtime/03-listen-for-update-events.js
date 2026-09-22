/**
 * Experiment: Listen for database UPDATE events.
 * Run: node 08-realtime/03-listen-for-update-events.js
 */
const { supabase } = require('../config/supabaseClient');

(async () => {
  const { data: row, error } = await supabase.from('students')
    .insert({ name: 'Before Update', email: `up${Date.now()}@example.com`, course: 'CSE', age: 20 }).select().single();
  if (error) return console.error(error.message);

  const channel = supabase
    .channel('students-updates')
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'students', filter: `id=eq.${row.id}` }, (payload) => {
      console.log('UPDATE received');
      console.log('  old:', payload.old);          // full row only if REPLICA IDENTITY FULL
      console.log('  new:', payload.new);
    })
    .subscribe(async (status) => {
      if (status !== 'SUBSCRIBED') return;
      await supabase.from('students').update({ name: 'After Update', age: 21 }).eq('id', row.id);
      setTimeout(async () => {
        await supabase.from('students').delete().eq('id', row.id);
        await supabase.removeChannel(channel);
        process.exit(0);
      }, 3000);
    });
})();
