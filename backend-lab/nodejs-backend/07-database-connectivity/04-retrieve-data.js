/**
 * Experiment: Retrieve data from a database using Node.js.
 * Run: node 04-retrieve-data.js   (run 03-insert-data.js first)
 */
const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'lab.db'));

console.log('ALL       :', db.prepare('SELECT * FROM students').all());
console.log('ONE       :', db.prepare('SELECT * FROM students WHERE id = ?').get(1));
console.log('FILTER    :', db.prepare('SELECT name, age FROM students WHERE age >= ? ORDER BY age DESC').all(20));
console.log('SEARCH    :', db.prepare('SELECT name FROM students WHERE name LIKE ?').all('%a%'));
console.log('PAGINATE  :', db.prepare('SELECT * FROM students LIMIT ? OFFSET ?').all(2, 0));
console.log('AGGREGATE :', db.prepare('SELECT COUNT(*) AS total, AVG(age) AS avg_age FROM students').get());
