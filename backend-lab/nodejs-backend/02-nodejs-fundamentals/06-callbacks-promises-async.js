/**
 * Experiment: Demonstrate Callbacks, Promises, and Async/Await in Node.js.
 * Run: node 06-callbacks-promises-async.js
 */
// ---- 1. CALLBACK ----
function getUserCb(id, callback) {
  setTimeout(() => callback(null, { id, name: 'Asha' }), 300);
}

// ---- 2. PROMISE ----
function getUserPromise(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => (id > 0 ? resolve({ id, name: 'Asha' }) : reject(new Error('Invalid id'))), 300);
  });
}

// ---- 3. ASYNC / AWAIT ----
async function run() {
  try {
    const user = await getUserPromise(1);
    console.log('[async/await]', user);
    await getUserPromise(-1);
  } catch (err) {
    console.log('[async/await] caught:', err.message);
  }
  const all = await Promise.all([getUserPromise(1), getUserPromise(2)]);
  console.log('[Promise.all]', all);
}

getUserCb(1, (err, user) => {
  console.log('[callback]', user);
  getUserPromise(1)
    .then((u) => console.log('[promise]', u))
    .then(run);
});
