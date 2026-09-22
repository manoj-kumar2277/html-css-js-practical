/**
 * Experiment: Create a Student Management CRUD application (SQLite).
 * Run: node 02-student-management-crud.js
 * Try: curl -X POST localhost:3000/students -H "Content-Type: application/json" \
 *        -d '{"name":"Asha","email":"asha@x.com","course":"CSE","age":20}'
 * Also open http://localhost:3000 for a simple HTML page.
 */
const express = require('express');
const db = require('../common/db');
const crud = require('../common/crudFactory');
const v = require('../common/validators');

const app = express();
app.use(express.json());
app.use('/students', crud(db, 'students', {
  name: v.string(2), email: v.email(), course: v.string(2), age: v.int(15),
}));

app.get('/', (req, res) => res.send(`<h2>Student Management</h2>
<ul id="l"></ul><script>fetch('/students').then(r=>r.json()).then(d=>l.innerHTML=d.map(s=>'<li>'+s.name+' - '+s.course+'</li>').join(''))</script>`));

app.listen(3000, () => console.log('http://localhost:3000'));
