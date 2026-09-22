/**
 * Experiment: Implement user registration.
 * Run: node 05-authentication/02-user-registration.js
 * Set TEST_EMAIL / TEST_PASSWORD in .env (or defaults are used).
 */
const { supabase } = require('../config/supabaseClient');

(async () => {
  const email = process.env.TEST_EMAIL || 'student1@example.com';
  const password = process.env.TEST_PASSWORD || 'Passw0rd!123';

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: 'Student One' } },      // stored in user_metadata
  });

  if (error) return console.error('Registration failed:', error.message);

  console.log('User id     :', data.user?.id);
  console.log('Email       :', data.user?.email);
  console.log('Session     :', data.session ? 'created (confirm-email is OFF)' : 'none - confirm the e-mail first');
  // Registering an existing e-mail returns a user with no identities (to avoid leaking who is registered)
  if (data.user && data.user.identities?.length === 0) console.log('This e-mail is already registered.');
})();
