/**
 * Experiment: Insert data into a database using Node.js.
 * Run: node 03-insert-data.js   (run 02-create-tables.js first)
 */
const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'lab.db'));

db.exec("CREATE TABLE IF NOT EXISTS students (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, age INTEGER, department_id INTEGER, phone TEXT)");

const insert = db.prepare('INSERT OR IGNORE INTO students (name, email, age) VALUES (?, ?, ?)');   // parameterised => no SQL injection

const info = insert.run('Asha', 'asha@example.com', 20);
console.log('Inserted id:', info.lastInsertRowid, 'changes:', info.changes);

// many rows inside one transaction
const insertMany = db.transaction((rows) => rows.forEach((r) => insert.run(r.name, r.email, r.age)));
insertMany([
  { name: 'Ravi', email: 'ravi@example.com', age: 21 },
  { name: 'Meena', email: 'meena@example.com', age: 19 },
]);
console.log('Total rows:', db.prepare('SELECT COUNT(*) AS c FROM students').get().c);
