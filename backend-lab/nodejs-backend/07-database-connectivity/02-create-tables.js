/**
 * Experiment: Create and manage database tables/collections.
 * Run: node 02-create-tables.js
 */
const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'lab.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    age INTEGER CHECK (age > 0),
    department_id INTEGER REFERENCES departments(id)
  );
`);

db.exec('ALTER TABLE students ADD COLUMN phone TEXT');                 // manage: add a column
console.log('Tables:', db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all());
console.log('students columns:', db.prepare('PRAGMA table_info(students)').all().map((c) => c.name));
db.exec('CREATE TABLE IF NOT EXISTS temp_table (id INTEGER)');
db.exec('DROP TABLE temp_table');                                       // manage: drop a table
