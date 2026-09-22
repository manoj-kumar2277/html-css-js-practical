/**
 * Experiment: Create a Node.js application using built-in modules.
 * Run: node 01-builtin-modules.js
 */
const os = require('os');
const util = require('util');
const EventEmitter = require('events');
const crypto = require('crypto');

console.log('Platform :', os.platform());
console.log('CPUs     :', os.cpus().length);
console.log('Free mem :', (os.freemem() / 1024 ** 3).toFixed(2), 'GB');

console.log(util.format('Hello %s, you are %d years old', 'Student', 20));
console.log('SHA-256  :', crypto.createHash('sha256').update('node').digest('hex'));

class Notifier extends EventEmitter {}
const notifier = new Notifier();
notifier.on('greet', (name) => console.log(`Event received: Hello ${name}`));
notifier.emit('greet', 'Node.js');
