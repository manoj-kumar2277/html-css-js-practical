/**
 * Experiment: Implement password reset.
 * Flow: 1) request e-mail  2) user clicks the link  3) page below sets the new password
 * Run : node 05-authentication/07-password-reset.js  -> http://localhost:3000
 * Prereq: Authentication > URL Configuration has Redirect URL  http://localhost:3000/**
 */
const express = require('express');
const { supabase } = require('../config/supabaseClient');
const app = express();
app.use(express.json());

// Step 1 - send the reset e-mail
app.post('/forgot-password', async (req, res) => {
  const { error } = await supabase.auth.resetPasswordForEmail(req.body.email, {
    redirectTo: 'http://localhost:3000/reset-password',
  });
  // same answer either way so attackers cannot discover registered e-mails
  if (error) console.error(error.message);
  res.json({ message: 'If that e-mail exists, a reset link has been sent.' });
});

// Step 2/3 - the link lands here; supabase-js in the browser reads the token from the URL hash
app.get('/reset-password', (req, res) => res.send(`<!DOCTYPE html><html><body style="font-family:Arial;max-width:420px;margin:40px auto">
<h3>Set a new password</h3><input id="pw" type="password" placeholder="New password" style="width:100%;padding:8px">
<button onclick="save()" style="margin-top:10px;padding:8px 14px">Update password</button><p id="m"></p>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
const sb = window.supabase.createClient('${process.env.SUPABASE_URL}', '${process.env.SUPABASE_ANON_KEY}');
sb.auth.onAuthStateChange((event) => { if (event === 'PASSWORD_RECOVERY') m.textContent = 'Recovery link verified. Enter a new password.'; });
async function save(){ const {error}=await sb.auth.updateUser({password:pw.value}); m.textContent = error?error.message:'Password updated! You can log in now.'; }
</script></body></html>`));

app.get('/', (req, res) => res.send(`<!DOCTYPE html><html><body style="font-family:Arial;max-width:420px;margin:40px auto">
<h3>Forgot password</h3><input id="e" type="email" placeholder="you@example.com" style="width:100%;padding:8px">
<button onclick="go()" style="margin-top:10px;padding:8px 14px">Send reset link</button><p id="m"></p>
<script>async function go(){const r=await fetch('/forgot-password',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:e.value})});m.textContent=(await r.json()).message}</script></body></html>`));

app.listen(3000, () => console.log('http://localhost:3000'));
