/**
 * Experiment: Install and use packages using npm.
 * Setup : npm init -y            (creates package.json)
 *         npm install lodash dayjs   (adds packages to dependencies)
 * Other : npm install --save-dev nodemon | npm uninstall lodash | npm ls | npm update
 * Run   : node 05-npm-packages.js
 */
const _ = require('lodash');
const dayjs = require('dayjs');

const numbers = [5, 3, 8, 1, 9, 2];
console.log('sorted   :', _.sortBy(numbers));
console.log('chunked  :', _.chunk(numbers, 2));
console.log('max      :', _.max(numbers));
console.log('capitalize:', _.capitalize('hello NODE'));

console.log('today    :', dayjs().format('DD-MM-YYYY HH:mm'));
console.log('+7 days  :', dayjs().add(7, 'day').format('DD-MM-YYYY'));
