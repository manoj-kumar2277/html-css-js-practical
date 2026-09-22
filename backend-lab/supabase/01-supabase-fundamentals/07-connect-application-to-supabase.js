/**
 * Experiment: Connect an application to Supabase.
 * Setup: npm install  ->  fill .env  ->  run 00-setup/schema.sql
 * Run  : node 01-supabase-fundamentals/07-connect-application-to-supabase.js
 * (the client itself is created in config/supabaseClient.js using createClient(url, anonKey))
 */
const { supabase } = require('../config/supabaseClient');

(async () => {
  // 1. Simple connectivity test: count rows in a table
  const { count, error } = await supabase.from('students').select('*', { count: 'exact', head: true });
  if (error) {
    console.error('Connection or query failed:', error.message);
    process.exit(1);
  }
  console.log('Connected to Supabase successfully. students rows =', count);

  // 2. Check the Auth service is reachable
  const { data } = await supabase.auth.getSession();
  console.log('Auth reachable. Current session:', data.session ? 'signed in' : 'none (anonymous)');
})();

/* Browser usage (CDN):
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   <script>const supabase = window.supabase.createClient('URL', 'ANON_KEY');</script>
*/
