/**
 * Experiment: Download files from Storage.
 * Run: node 07-storage/04-download-files.js   (needs demo/hello.txt from experiment 02)
 */
const fs = require('fs');
const path = require('path');
const { supabase, signedInClient } = require('../config/supabaseClient');

(async () => {
  // 1. download(): returns a Blob
  const { data: blob, error } = await supabase.storage.from('uploads').download('demo/hello.txt');
  if (error) return console.error('download failed:', error.message);
  const text = await blob.text();
  console.log('content :', text);

  // 2. save to disk
  const out = path.join(__dirname, 'downloaded-hello.txt');
  fs.writeFileSync(out, Buffer.from(await blob.arrayBuffer()));
  console.log('saved   :', out);

  // 3. private bucket: create a time-limited signed URL (60 s)
  const client = await signedInClient(process.env.TEST_EMAIL || 'student1@example.com', process.env.TEST_PASSWORD || 'Passw0rd!123');
  const { data: { user } } = await client.auth.getUser();
  const priv = client.storage.from('private-files');
  await priv.upload(`${user.id}/secret.txt`, Buffer.from('private data'), { contentType: 'text/plain', upsert: true });
  const { data: signed } = await priv.createSignedUrl(`${user.id}/secret.txt`, 60, { download: true });   // forces browser download
  console.log('signed URL (60s):', signed.signedUrl);
})();
