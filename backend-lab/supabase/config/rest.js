// Tiny helper for calling the auto-generated PostgREST API with fetch (Node 18+).
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const BASE = `${process.env.SUPABASE_URL}/rest/v1`;
const headers = (extra = {}, token) => ({
  apikey: process.env.SUPABASE_ANON_KEY,
  Authorization: `Bearer ${token || process.env.SUPABASE_ANON_KEY}`,   // user JWT if logged in, otherwise anon key
  'Content-Type': 'application/json',
  ...extra,
});

async function rest(method, pathAndQuery, { body, prefer, token, extra } = {}) {
  const res = await fetch(`${BASE}${pathAndQuery}`, {
    method,
    headers: headers({ ...(prefer ? { Prefer: prefer } : {}), ...extra }, token),
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data; try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  return { status: res.status, ok: res.ok, data, contentRange: res.headers.get('content-range') };
}

module.exports = { rest, BASE, headers };
