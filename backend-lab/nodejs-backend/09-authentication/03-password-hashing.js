/**
 * Experiment: Implement Password Hashing.
 * Run: node 03-password-hashing.js
 * A hash is one-way; bcrypt adds a random salt so equal passwords give different hashes.
 */
const bcrypt = require('bcryptjs');

(async () => {
  const password = 'MyPassword@123';

  const salt = await bcrypt.genSalt(10);                 // cost factor 10 => 2^10 rounds
  const hash1 = await bcrypt.hash(password, salt);
  const hash2 = await bcrypt.hash(password, 10);

  console.log('Plain password :', password);
  console.log('Salt           :', salt);
  console.log('Hash 1         :', hash1);
  console.log('Hash 2         :', hash2);
  console.log('Same hash?     :', hash1 === hash2, '(different salts => different hashes)');
  console.log('Hash length    :', hash1.length);
})();
