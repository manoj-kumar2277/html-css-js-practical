/**
 * Experiment: Implement email/password authentication (complete flow).
 * Run: node 05-authentication/06-email-password-authentication.js
 */
const { supabase } = require('../config/supabaseClient');

const email = `flow${Date.now()}@example.com`;
const password = 'Passw0rd!123';
const step = (n, t) => console.log(`\n${n}. ${t}`);

(async () => {
  step(1, 'Sign up');
  const su = await supabase.auth.signUp({ email, password, options: { data: { full_name: 'Flow User' } } });
  console.log(su.error ? su.error.message : `created ${su.data.user.id}`);
  if (su.error || !su.data.session) return console.log('E-mail confirmation is ON - confirm the mail, then run the next steps manually.');

  step(2, 'Wrong password is rejected');
  const bad = await supabase.auth.signInWithPassword({ email, password: 'wrong-password' });
  console.log(bad.error?.message);

  step(3, 'Sign in with correct password');
  const si = await supabase.auth.signInWithPassword({ email, password });
  console.log(si.error ? si.error.message : 'signed in as ' + si.data.user.email);

  step(4, 'Update metadata + password while signed in');
  const up = await supabase.auth.updateUser({ password: 'NewPassw0rd!456', data: { full_name: 'Renamed User' } });
  console.log(up.error ? up.error.message : 'updated: ' + up.data.user.user_metadata.full_name);

  step(5, 'Sign out');
  await supabase.auth.signOut();

  step(6, 'Old password no longer works, new one does');
  console.log('old:', (await supabase.auth.signInWithPassword({ email, password })).error?.message);
  console.log('new:', (await supabase.auth.signInWithPassword({ email, password: 'NewPassw0rd!456' })).data.user?.email);
  await supabase.auth.signOut();
})();
