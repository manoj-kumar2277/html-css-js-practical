/**
 * Experiment: Demonstrate the Path (path) module.
 * Run: node 03-path-module.js
 */
const path = require('path');
const p = '/home/user/projects/app/index.js';

console.log('basename      :', path.basename(p));
console.log('basename (ext):', path.basename(p, '.js'));
console.log('dirname       :', path.dirname(p));
console.log('extname       :', path.extname(p));
console.log('join          :', path.join('folder', 'sub', '..', 'file.txt'));
console.log('resolve       :', path.resolve('folder', 'file.txt'));
console.log('normalize     :', path.normalize('/a//b/../c/./d.txt'));
console.log('isAbsolute    :', path.isAbsolute(p), path.isAbsolute('a/b'));
console.log('relative      :', path.relative('/a/b/c', '/a/d/e'));
console.log('parse         :', path.parse(p));
console.log('format        :', path.format({ dir: '/tmp', name: 'file', ext: '.txt' }));
console.log('separator     :', path.sep);
