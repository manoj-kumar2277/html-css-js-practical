/**
 * Experiment: Implement protected pages/routes using Supabase Authentication.
 * The browser signs in with supabase-js and sends the JWT to this Express server,
 * which verifies it with supabase.auth.getUser(token) before serving private data.
 * Run: node 05-authentication/09-protected-routes.js -> http://localhost:3000
 */
const express = require('express');
const { supabase } = require('../config/supabaseClient');
const app = express();
app.use(express.json());

// ---------- middleware ----------
async function requireAuth(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Missing token' });
  const { data, error } = await supabase.auth.getUser(token);      // validated by Supabase Auth
  if (error || !data.user) return res.status(401).json({ error: 'Invalid or expired token' });
  req.user = data.user;
  next();
}

// ---------- API ----------
app.get('/api/public', (req, res) => res.json({ message: 'Anyone can read this' }));
app.get('/api/private', requireAuth, (req, res) => res.json({ message: `Secret data for ${req.user.email}`, userId: req.user.id }));

// ---------- pages ----------
app.get('/', (req, res) => res.send(`<!DOCTYPE html><html><body style="font-family:Arial;max-width:520px;margin:40px auto">
<div id="loginBox"><h3>Login</h3><input id="e" placeholder="email"><input id="p" type="password" placeholder="password">
<button onclick="login()">Login</button><button onclick="signup()">Sign up</button></div>
<div id="appBox" style="display:none"><h3>Dashboard (protected)</h3><pre id="out"></pre><button onclick="logout()">Logout</button></div><p id="m"></p>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
const sb = window.supabase.createClient('${process.env.SUPABASE_URL}', '${process.env.SUPABASE_ANON_KEY}');
async function show(session){
  loginBox.style.display = session ? "none" : "block"; appBox.style.display = session ? "block" : "none";
  if(!session) return;
  const r = await fetch('/api/private',{headers:{Authorization:'Bearer '+session.access_token}});
  out.textContent = JSON.stringify(await r.json(),null,2);
}
async function login(){const {error}=await sb.auth.signInWithPassword({email:e.value,password:p.value}); if(error) m.textContent=error.message;}
async function signup(){const {error}=await sb.auth.signUp({email:e.value,password:p.value}); m.textContent=error?error.message:'Registered. Now login.';}
async function logout(){await sb.auth.signOut();}
sb.auth.onAuthStateChange((_e, session) => show(session));           // route guard: UI follows session state
sb.auth.getSession().then(({data}) => show(data.session));
</script></body></html>`));

app.listen(3000, () => console.log('http://localhost:3000'));
