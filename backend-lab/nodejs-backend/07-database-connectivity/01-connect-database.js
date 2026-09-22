/**
 * Experiment: Connect a Node.js application to a database.
 * DB: SQLite via better-sqlite3 (no server needed).  MySQL/MongoDB notes are at the bottom.
 * Run: node 01-connect-database.js
 */
const Database = require('better-sqlite3');
const path = require('path');

try {
  const db = new Database(path.join(__dirname, 'lab.db'));
  const { version } = db.prepare('SELECT sqlite_version() AS version').get();
  console.log('Connected to SQLite successfully. Version:', version);
  db.close();
} catch (err) {
  console.error('Connection failed:', err.message);
}

/* MySQL equivalent:
   const mysql = require('mysql2/promise');
   const conn = await mysql.createConnection({ host:'localhost', user:'root', password:'', database:'lab' });
   MongoDB equivalent:
   await require('mongoose').connect('mongodb://127.0.0.1:27017/lab');
*/
