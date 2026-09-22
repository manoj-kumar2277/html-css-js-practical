/**
 * Experiment: Create and use custom Node.js modules.
 * Run: node 04-custom-modules.js
 * Module file: 04a-mathUtils.js  (exported with module.exports)
 */
const { add, subtract, multiply, divide } = require('./04a-mathUtils');

console.log('10 + 5 =', add(10, 5));
console.log('10 - 5 =', subtract(10, 5));
console.log('10 * 5 =', multiply(10, 5));
console.log('10 / 5 =', divide(10, 5));

try { divide(1, 0); } catch (e) { console.log('Caught:', e.message); }

// A module is cached: requiring it twice returns the same object
console.log('Cached module reused:', require('./04a-mathUtils') === require('./04a-mathUtils'));
