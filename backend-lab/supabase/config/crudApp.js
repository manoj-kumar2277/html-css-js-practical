// Builds a tiny Express app: JSON CRUD API (supabase-js) + a generic HTML UI, for any table.
const express = require('express');
const { supabase } = require('./supabaseClient');

module.exports = function createCrudApp({ table, title, fields, orderBy = 'id' }) {
  const app = express();
  app.use(express.json());
  const wrap = (fn) => async (req, res) => {
    const { data, error, status } = await fn(req);
    if (error) return res.status(status && status >= 400 ? status : 400).json({ error: error.message });
    res.status(status === 201 ? 201 : 200).json(data);
  };
  const pick = (body) => Object.fromEntries(fields.filter((f) => body[f.name] !== undefined && body[f.name] !== '')
    .map((f) => [f.name, f.type === 'number' ? Number(body[f.name]) : body[f.name]]));

  // ---- CRUD API ----
  app.get(`/api/${table}`, wrap(async (req) => {
    const q = supabase.from(table).select('*').order(orderBy);
    return req.query.search ? q.ilike(fields[0].name, `%${req.query.search}%`) : q;
  }));
  app.get(`/api/${table}/:id`, wrap((req) => supabase.from(table).select('*').eq('id', req.params.id).single()));
  app.post(`/api/${table}`, wrap((req) => supabase.from(table).insert(pick(req.body)).select().single().then((r) => ({ ...r, status: r.error ? r.status : 201 }))));
  app.put(`/api/${table}/:id`, wrap((req) => supabase.from(table).update(pick(req.body)).eq('id', req.params.id).select().single()));
  app.delete(`/api/${table}/:id`, wrap((req) => supabase.from(table).delete().eq('id', req.params.id).select().single()));

  // ---- UI ----
  app.get('/', (req, res) => res.send(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${title}</title>
<style>body{font-family:Arial;max-width:900px;margin:30px auto;padding:0 12px}input,select{padding:6px;margin:3px}button{padding:6px 12px;cursor:pointer}
table{width:100%;border-collapse:collapse;margin-top:16px}th,td{border:1px solid #ccc;padding:6px;text-align:left}th{background:#f0f4ff}#msg{color:#b00}</style></head><body>
<h2>${title}</h2><p id="msg"></p>
<div id="form">${fields.map((f) => `<input id="f_${f.name}" placeholder="${f.name}" type="${f.type === 'number' ? 'number' : f.type === 'email' ? 'email' : 'text'}">`).join('')}
<button onclick="save()">Save</button> <button onclick="reset()">Clear</button>
<input id="search" placeholder="search ${fields[0].name}" oninput="load()"></div>
<table><thead><tr><th>ID</th>${fields.map((f) => `<th>${f.name}</th>`).join('')}<th>Actions</th></tr></thead><tbody id="rows"></tbody></table>
<script>
const F=${JSON.stringify(fields.map((f) => f.name))}; let editId=null; const api='/api/${table}';
const msg=t=>document.getElementById('msg').textContent=t||'';
async function load(){const s=document.getElementById('search').value;const r=await fetch(api+(s?'?search='+encodeURIComponent(s):''));const d=await r.json();
 if(!r.ok)return msg(d.error);msg('');
 document.getElementById('rows').innerHTML=d.map(x=>'<tr><td>'+x.id+'</td>'+F.map(f=>'<td>'+(x[f]??'')+'</td>').join('')+
 '<td><button onclick=\\'edit('+JSON.stringify(x)+')\\'>Edit</button> <button onclick="del('+x.id+')">Delete</button></td></tr>').join('');}
function edit(x){editId=x.id;F.forEach(f=>document.getElementById('f_'+f).value=x[f]??'');}
function reset(){editId=null;F.forEach(f=>document.getElementById('f_'+f).value='');}
async function save(){const b={};F.forEach(f=>b[f]=document.getElementById('f_'+f).value);
 const r=await fetch(editId?api+'/'+editId:api,{method:editId?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)});
 const d=await r.json();if(!r.ok)return msg(d.error);reset();load();}
async function del(id){if(!confirm('Delete record '+id+'?'))return;const r=await fetch(api+'/'+id,{method:'DELETE'});if(!r.ok)msg((await r.json()).error);load();}
load();</script></body></html>`));

  const port = process.env.PORT || 3000;
  app.listen(port, () => console.log(`${title} running on http://localhost:${port}`));
  return app;
};
