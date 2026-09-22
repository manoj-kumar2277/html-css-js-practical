/**
 * Experiment: Retrieve the currently authenticated user.
 * Run: node 05-authentication/05-get-current-user.js
 */
const { supabase } = require('../config/supabaseClient');

(async () => {
  let { data: { user } } = await supabase.auth.getUser();
  console.log('Before login :', user);                         // null - not signed in

  await supabase.auth.signInWithPassword({
    email: process.env.TEST_EMAIL || 'student1@example.com',
    password: process.env.TEST_PASSWORD || 'Passw0rd!123',
  });

  // getUser() asks the Auth server to validate the token -> use it for security decisions
  ({ data: { user } } = await supabase.auth.getUser());
  console.log('After login  :', { id: user.id, email: user.email, metadata: user.user_metadata });

  // getSession() reads the locally stored session (fast, but NOT re-validated)
  const { data: { session } } = await supabase.auth.getSession();
  console.log('Session user :', session.user.email);

  // matching profile row (created by the trigger)
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  console.log('Profile      :', profile);
})();
