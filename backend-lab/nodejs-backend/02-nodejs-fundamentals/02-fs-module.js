/**
 * Experiment: Demonstrate the File System (fs) module.
 * Run: node 02-fs-module.js
 */
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'fs-demo');
const file = path.join(dir, 'notes.txt');

fs.mkdirSync(dir, { recursive: true });                         // create folder
fs.writeFileSync(file, 'Line 1\n');                              // write
fs.appendFileSync(file, 'Line 2\n');                             // append
console.log('READ  :', fs.readFileSync(file, 'utf8'));           // read
console.log('EXISTS:', fs.existsSync(file));
console.log('STATS :', fs.statSync(file).size, 'bytes');
fs.renameSync(file, path.join(dir, 'renamed.txt'));              // rename
console.log('LIST  :', fs.readdirSync(dir));

// asynchronous version
fs.readFile(path.join(dir, 'renamed.txt'), 'utf8', (err, data) => {
  if (err) return console.error(err);
  console.log('ASYNC READ:', data.trim());
  fs.unlinkSync(path.join(dir, 'renamed.txt'));                  // delete file
  fs.rmdirSync(dir);                                             // delete folder
  console.log('Cleaned up.');
});
