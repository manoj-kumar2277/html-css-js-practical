// Shared Supabase clients used by every Node experiment.
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { createClient } = require('@supabase/supabase-js');
const ws = require('ws');

const { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY } = process.env;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing SUPABASE_URL / SUPABASE_ANON_KEY. Copy .env.example to .env and fill it in.');
  process.exit(1);
}

const options = { realtime: { transport: ws } };

// Public client: respects Row Level Security, acts as anon or as the signed-in user.
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, options);

// Admin client: bypasses RLS. SERVER SIDE ONLY.
const supabaseAdmin = SUPABASE_SERVICE_ROLE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { ...options, auth: { autoRefreshToken: false, persistSession: false } })
  : null;

// Helper: a fresh client that is signed in as the given user (for RLS tests)
async function signedInClient(email, password) {
  const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { ...options, auth: { persistSession: false } });
  const { error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return client;
}

module.exports = { supabase, supabaseAdmin, signedInClient };
