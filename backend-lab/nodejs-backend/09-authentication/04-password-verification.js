/**
 * Experiment: Implement Password Verification.
 * Run: node 04-password-verification.js
 */
const bcrypt = require('bcryptjs');

(async () => {
  const stored = await bcrypt.hash('MyPassword@123', 10);   // what a database would store

  const attempts = ['MyPassword@123', 'mypassword@123', 'wrong'];
  for (const attempt of attempts) {
    const ok = await bcrypt.compare(attempt, stored);         // salt is read from the stored hash
    console.log(`"${attempt}" ->`, ok ? 'ACCESS GRANTED' : 'ACCESS DENIED');
  }

  // synchronous variants also exist
  console.log('sync compare:', bcrypt.compareSync('MyPassword@123', stored));
})();
