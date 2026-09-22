/**
 * Experiment: Generate public file URLs.
 * Run: node 07-storage/06-generate-public-file-urls.js
 */
const { supabase } = require('../config/supabaseClient');

const bucket = supabase.storage.from('uploads');

// 1. Public URL (bucket must be public). Purely computed locally - no request is made.
const { data } = bucket.getPublicUrl('demo/hello.txt');
console.log('public URL         :', data.publicUrl);
//   https://<ref>.supabase.co/storage/v1/object/public/uploads/demo/hello.txt

// 2. Forces "Save as" in the browser
console.log('download URL       :', bucket.getPublicUrl('demo/hello.txt', { download: 'my-file.txt' }).data.publicUrl);

// 3. Image transformation (resize on the fly; Pro plan feature)
console.log('transformed image  :', bucket.getPublicUrl('photos/pic.jpg', { transform: { width: 300, height: 200, resize: 'cover' } }).data.publicUrl);

// 4. Check that the URL works
(async () => {
  const res = await fetch(data.publicUrl);
  console.log('HTTP status        :', res.status, res.ok ? '(file is reachable)' : '(upload demo/hello.txt first)');
})();
// For PRIVATE buckets use createSignedUrl(path, seconds) instead of getPublicUrl.
