/**
 * Experiment: Delete files from Storage.
 * Run: node 07-storage/05-delete-files.js
 */
const { signedInClient } = require('../config/supabaseClient');

(async () => {
  const client = await signedInClient(process.env.TEST_EMAIL || 'student1@example.com', process.env.TEST_PASSWORD || 'Passw0rd!123');
  const bucket = client.storage.from('uploads');

  await bucket.upload('trash/a.txt', Buffer.from('a'), { contentType: 'text/plain', upsert: true });
  await bucket.upload('trash/b.txt', Buffer.from('b'), { contentType: 'text/plain', upsert: true });
  console.log('before :', (await bucket.list('trash')).data.map((f) => f.name));

  // remove takes an ARRAY of full paths
  const { data, error } = await bucket.remove(['trash/a.txt', 'trash/b.txt']);
  console.log('remove :', error ? error.message : data.map((f) => f.name));
  console.log('after  :', (await bucket.list('trash')).data.map((f) => f.name));

  // "folders" are just path prefixes - deleting all files removes the folder
  // Tip: remove() on a missing path does NOT throw; it returns an empty array.
})();
