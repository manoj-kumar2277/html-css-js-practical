/**
 * Experiment: Create a User Management CRUD application.
 * Manages the public.profiles table (one row per auth user). Creating auth users needs the admin key,
 * so this app uses the admin client for create/delete; profile edits use the normal table API.
 * Run: node 04-supabase-crud/07-user-management-crud.js -> http://localhost:3000
 */
const express = require('express');
const { supabaseAdmin } = require('../config/supabaseClient');

if (!supabaseAdmin) { console.error('SUPABASE_SERVICE_ROLE_KEY is required for this experiment'); process.exit(1); }

const app = express();
app.use(express.json());

// CREATE user (auth.users) - the trigger in schema.sql creates the profile row automatically
app.post('/api/users', async (req, res) => {
  const { email, password, full_name, role = 'user' } = req.body;
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email, password, email_confirm: true, user_metadata: { full_name },
  });
  if (error) return res.status(400).json({ error: error.message });
  await supabaseAdmin.from('profiles').update({ role, full_name }).eq('id', data.user.id);
  res.status(201).json({ id: data.user.id, email, full_name, role });
});

// READ
app.get('/api/users', async (req, res) => {
  const { data: profiles, error } = await supabaseAdmin.from('profiles').select('*').order('created_at');
  if (error) return res.status(400).json({ error: error.message });
  const { data: list } = await supabaseAdmin.auth.admin.listUsers();
  const emails = Object.fromEntries((list?.users || []).map((u) => [u.id, u.email]));
  res.json(profiles.map((p) => ({ ...p, email: emails[p.id] })));
});

// UPDATE
app.put('/api/users/:id', async (req, res) => {
  const { full_name, role } = req.body;
  const { data, error } = await supabaseAdmin.from('profiles').update({ full_name, role }).eq('id', req.params.id).select().single();
  error ? res.status(400).json({ error: error.message }) : res.json(data);
});

// DELETE (removes auth user; profile row is removed by ON DELETE CASCADE)
app.delete('/api/users/:id', async (req, res) => {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(req.params.id);
  error ? res.status(400).json({ error: error.message }) : res.status(204).end();
});

app.get('/', (req, res) => res.send(`<h2>User Management</h2><p>Use the API:</p>
<pre>POST /api/users {email,password,full_name,role}
GET /api/users
PUT /api/users/:id {full_name,role}
DELETE /api/users/:id</pre>
<div id=o></div><script>fetch('/api/users').then(r=>r.json()).then(d=>o.innerHTML='<table border=1 cellpadding=6><tr><th>email</th><th>name</th><th>role</th></tr>'+d.map(u=>'<tr><td>'+u.email+'</td><td>'+(u.full_name||'')+'</td><td>'+u.role+'</td></tr>').join('')+'</table>')</script>`));

app.listen(process.env.PORT || 3000, () => console.log('User management on http://localhost:3000'));
