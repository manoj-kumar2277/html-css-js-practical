/**
 * Experiment: Manage authentication sessions.
 * Run: node 05-authentication/08-manage-authentication-sessions.js
 */
const { supabase } = require('../config/supabaseClient');

(async () => {
  // listen for auth events (SIGNED_IN, TOKEN_REFRESHED, SIGNED_OUT, USER_UPDATED, PASSWORD_RECOVERY)
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    console.log(`[event] ${event} ->`, session ? session.user.email : 'no session');
  });

  const { data } = await supabase.auth.signInWithPassword({
    email: process.env.TEST_EMAIL || 'student1@example.com',
    password: process.env.TEST_PASSWORD || 'Passw0rd!123',
  });
  const s = data.session;
  console.log('access token valid until :', new Date(s.expires_at * 1000).toLocaleTimeString());
  console.log('seconds remaining        :', s.expires_at - Math.floor(Date.now() / 1000));

  // refresh: exchanges the refresh token for a new access token
  const { data: refreshed } = await supabase.auth.refreshSession();
  console.log('new token differs        :', refreshed.session.access_token !== s.access_token);

  // restore a saved session (e.g. from a cookie / database)
  const saved = { access_token: refreshed.session.access_token, refresh_token: refreshed.session.refresh_token };
  await supabase.auth.signOut({ scope: 'local' });
  const { data: restored } = await supabase.auth.setSession(saved);
  console.log('restored session for     :', restored.user?.email);

  await supabase.auth.signOut();
  subscription.unsubscribe();
  // Browser tips: supabase-js stores the session in localStorage and auto-refreshes it before expiry.
})();
