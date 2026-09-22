/**
 * Experiment: Delete database records using Node.js.
 * Run: node 06-delete-data.js
 */
const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'lab.db'));

console.log('Before:', db.prepare('SELECT COUNT(*) AS c FROM students').get().c);
const one = db.prepare('DELETE FROM students WHERE email = ?').run('meena@example.com');
console.log('Deleted rows (by email):', one.changes);
const many = db.prepare('DELETE FROM students WHERE age > ?').run(100);
console.log('Deleted rows (age > 100):', many.changes);
console.log('After :', db.prepare('SELECT COUNT(*) AS c FROM students').get().c);
// db.prepare('DELETE FROM students').run();   // removes ALL rows - use with care
