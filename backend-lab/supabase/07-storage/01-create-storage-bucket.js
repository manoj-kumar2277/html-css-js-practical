/**
 * Experiment: Create a Supabase Storage bucket.
 * Dashboard way: Storage > New bucket > name, Public on/off, size limit, allowed MIME types.
 * Code way (needs the service_role key): node 07-storage/01-create-storage-bucket.js
 */
const { supabaseAdmin } = require('../config/supabaseClient');
if (!supabaseAdmin) { console.error('SUPABASE_SERVICE_ROLE_KEY required'); process.exit(1); }

(async () => {
  const { data, error } = await supabaseAdmin.storage.createBucket('lab-bucket', {
    public: true,                               // files reachable through a public URL
    fileSizeLimit: 2 * 1024 * 1024,             // 2 MB
    allowedMimeTypes: ['image/png', 'image/jpeg', 'text/plain'],
  });
  console.log('createBucket :', error ? error.message : data);

  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  console.log('all buckets  :', buckets.map((b) => `${b.name} (${b.public ? 'public' : 'private'})`));

  console.log('getBucket    :', (await supabaseAdmin.storage.getBucket('lab-bucket')).data);
  await supabaseAdmin.storage.updateBucket('lab-bucket', { public: false });   // change settings
  console.log('after update :', (await supabaseAdmin.storage.getBucket('lab-bucket')).data.public ? 'public' : 'private');

  // await supabaseAdmin.storage.emptyBucket('lab-bucket'); await supabaseAdmin.storage.deleteBucket('lab-bucket');
})();
