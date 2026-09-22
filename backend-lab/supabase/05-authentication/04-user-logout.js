/**
 * Experiment: Implement user logout.
 * Run: node 05-authentication/04-user-logout.js
 */
const { supabase } = require('../config/supabaseClient');

(async () => {
  await supabase.auth.signInWithPassword({
    email: process.env.TEST_EMAIL || 'student1@example.com',
    password: process.env.TEST_PASSWORD || 'Passw0rd!123',
  });
  console.log('Session before logout:', (await supabase.auth.getSession()).data.session ? 'active' : 'none');

  const { error } = await supabase.auth.signOut();          // scope: 'local' | 'global' | 'others'
  if (error) return console.error('Logout failed:', error.message);

  console.log('Session after logout :', (await supabase.auth.getSession()).data.session ? 'active' : 'none');
  // await supabase.auth.signOut({ scope: 'global' })  -> signs the user out on ALL devices
})();
