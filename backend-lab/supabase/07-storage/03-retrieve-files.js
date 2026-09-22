/**
 * Experiment: Retrieve files from Storage (list, metadata, info).
 * Run: node 07-storage/03-retrieve-files.js   (run 02-upload-files.js first)
 */
const { supabase } = require('../config/supabaseClient');

(async () => {
  const bucket = supabase.storage.from('uploads');          // public bucket -> anon may list

  // list the folder "demo"
  const { data: files, error } = await bucket.list('demo', {
    limit: 20, offset: 0, sortBy: { column: 'created_at', order: 'desc' },
  });
  if (error) return console.error('list failed:', error.message);
  console.table(files.map((f) => ({ name: f.name, size: f.metadata?.size, type: f.metadata?.mimetype, created: f.created_at })));

  // search by name
  const { data: found } = await bucket.list('demo', { search: 'hello' });
  console.log('search "hello":', found.map((f) => f.name));

  // does a file exist?
  const { data: exists } = await bucket.exists('demo/hello.txt');
  console.log('exists demo/hello.txt:', exists);

  // list root
  const { data: root } = await bucket.list('');
  console.log('root entries :', root.map((f) => f.name));
})();
