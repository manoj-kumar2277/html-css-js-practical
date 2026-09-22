/**
 * Experiment: Update database records using Node.js.
 * Run: node 05-update-data.js
 */
const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'lab.db'));

const before = db.prepare('SELECT * FROM students WHERE email = ?').get('asha@example.com');
console.log('Before:', before);

const info = db.prepare('UPDATE students SET age = ?, phone = ? WHERE email = ?').run(22, '9876543210', 'asha@example.com');
console.log('Rows updated:', info.changes);

db.prepare('UPDATE students SET age = age + 1').run();                       // bulk update
console.log('After :', db.prepare('SELECT * FROM students WHERE email = ?').get('asha@example.com'));
