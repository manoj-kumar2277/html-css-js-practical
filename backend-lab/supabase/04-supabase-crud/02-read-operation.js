/**
 * Experiment: Implement Read operations using the Supabase Client.
 * Run: node 04-supabase-crud/02-read-operation.js   (insert some students first)
 */
const { supabase } = require('../config/supabaseClient');

(async () => {
  const show = (label, { data, error }) => console.log(label, error ? error.message : data);

  show('all            :', await supabase.from('students').select('*'));
  show('columns        :', await supabase.from('students').select('id, name, course'));
  show('eq             :', await supabase.from('students').select('*').eq('course', 'CSE'));
  show('gt + lt        :', await supabase.from('students').select('name, age').gt('age', 18).lt('age', 25));
  show('in             :', await supabase.from('students').select('name').in('course', ['CSE', 'IT']));
  show('ilike          :', await supabase.from('students').select('name').ilike('name', '%a%'));
  show('or             :', await supabase.from('students').select('name, age, course').or('age.gte.22,course.eq.IT'));
  show('order + limit  :', await supabase.from('students').select('name, age').order('age', { ascending: false }).limit(3));
  show('range (page 2) :', await supabase.from('students').select('id, name').order('id').range(3, 5));
  show('single         :', await supabase.from('students').select('*').limit(1).single());
  show('maybeSingle    :', await supabase.from('students').select('*').eq('id', -1).maybeSingle());

  const { count } = await supabase.from('students').select('*', { count: 'exact', head: true });
  console.log('total count    :', count);
})();
