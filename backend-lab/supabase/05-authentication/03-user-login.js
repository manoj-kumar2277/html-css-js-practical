/**
 * Experiment: Implement user login.
 * Run: node 05-authentication/03-user-login.js
 */
const { supabase } = require('../config/supabaseClient');

(async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: process.env.TEST_EMAIL || 'student1@example.com',
    password: process.env.TEST_PASSWORD || 'Passw0rd!123',
  });

  if (error) return console.error('Login failed:', error.status, error.message);

  console.log('Logged in as :', data.user.email);
  console.log('Access token :', data.session.access_token.slice(0, 30) + '...');
  console.log('Expires at   :', new Date(data.session.expires_at * 1000).toLocaleString());
  console.log('Refresh token:', data.session.refresh_token);
})();
