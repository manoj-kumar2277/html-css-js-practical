/**
 * Experiment: Listen for database INSERT events.
 * Prereq: 01-enable-supabase-realtime.sql
 * Run   : node 08-realtime/02-listen-for-insert-events.js
 *         (the script inserts a row itself after subscribing; you can also insert from the dashboard)
 */
const { supabase } = require('../config/supabaseClient');

const channel = supabase
  .channel('students-inserts')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'students' }, (payload) => {
    console.log('INSERT received:', payload.new);
  })
  .subscribe(async (status, err) => {
    console.log('channel status:', status, err?.message || '');
    if (status === 'SUBSCRIBED') {
      const { error } = await supabase.from('students')
        .insert({ name: 'Realtime Tester', email: `rt${Date.now()}@example.com`, course: 'CSE', age: 20 });
      if (error) console.error('insert error:', error.message);
      setTimeout(async () => { await supabase.removeChannel(channel); process.exit(0); }, 3000);
    }
  });
