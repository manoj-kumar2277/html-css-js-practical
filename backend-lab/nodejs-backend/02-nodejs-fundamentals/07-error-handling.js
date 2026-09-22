/**
 * Experiment: Implement Error Handling in a Node.js application.
 * Run: node 07-error-handling.js
 */
const fs = require('fs');

// 1. try / catch / finally (sync)
try {
  JSON.parse('{ bad json }');
} catch (err) {
  console.log('1) caught:', err.name, '-', err.message);
} finally {
  console.log('1) finally always runs');
}

// 2. custom error class
class ValidationError extends Error {
  constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; }
}
try { throw new ValidationError('Email is invalid', 'email'); }
catch (e) { console.log('2)', e.name, e.field, e.message); }

// 3. error-first callback
fs.readFile('missing.txt', (err) => { if (err) console.log('3) callback error:', err.code); });

// 4. async/await
(async () => {
  try { await fs.promises.readFile('missing.txt'); }
  catch (e) { console.log('4) async error:', e.code); }
})();

// 5. global handlers (last line of defence)
process.on('uncaughtException', (e) => { console.error('5) uncaughtException:', e.message); });
process.on('unhandledRejection', (r) => { console.error('5) unhandledRejection:', r.message); });
setTimeout(() => { Promise.reject(new Error('forgotten promise')); }, 200);
setTimeout(() => { throw new Error('unexpected crash'); }, 400);
