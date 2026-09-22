/**
 * Experiment: Upload files using Supabase Storage.
 * Prereq: 00-storage-setup-and-policies.sql, a registered TEST_EMAIL user.
 * Run   : node 07-storage/02-upload-files.js
 */
const fs = require('fs');
const path = require('path');
const { signedInClient } = require('../config/supabaseClient');

(async () => {
  const client = await signedInClient(process.env.TEST_EMAIL || 'student1@example.com', process.env.TEST_PASSWORD || 'Passw0rd!123');
  const bucket = client.storage.from('uploads');

  // 1. upload a text buffer
  const up1 = await bucket.upload('demo/hello.txt', Buffer.from('Hello Supabase Storage!'), {
    contentType: 'text/plain', cacheControl: '3600', upsert: true,          // upsert:true overwrites an existing file
  });
  console.log('upload text :', up1.error ? up1.error.message : up1.data);

  // 2. upload a real file from disk
  const file = path.join(__dirname, 'sample.txt');
  fs.writeFileSync(file, `Sample created ${new Date().toISOString()}`);
  const up2 = await bucket.upload(`demo/${Date.now()}-sample.txt`, fs.readFileSync(file), { contentType: 'text/plain' });
  console.log('upload file :', up2.error ? up2.error.message : up2.data);

  // 3. duplicate name without upsert -> error
  const up3 = await bucket.upload('demo/hello.txt', Buffer.from('again'), { contentType: 'text/plain' });
  console.log('duplicate   :', up3.error ? up3.error.message : 'uploaded');

  // Browser: <input type="file" id="f"> ->  bucket.upload('folder/' + file.name, file)
  fs.unlinkSync(file);
})();
