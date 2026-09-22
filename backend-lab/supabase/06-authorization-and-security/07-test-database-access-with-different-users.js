/**
 * Experiment: Test database access with different users.
 * Prereq: run 03 (own records) SQL, create TEST_EMAIL and TEST_EMAIL_2 users (05-authentication/02).
 * Run   : node 06-authorization-and-security/07-test-database-access-with-different-users.js
 */
const { supabase, signedInClient } = require('../config/supabaseClient');

const u1 = { email: process.env.TEST_EMAIL || 'student1@example.com', password: process.env.TEST_PASSWORD || 'Passw0rd!123' };
const u2 = { email: process.env.TEST_EMAIL_2 || 'student2@example.com', password: process.env.TEST_PASSWORD_2 || 'Passw0rd!123' };

(async () => {
  const ok = (label, { data, error }) => console.log(`${label.padEnd(46)}`, error ? `BLOCKED (${error.message})` : `allowed -> ${JSON.stringify(data)}`);

  const anon = supabase;                                  // not signed in
  const c1 = await signedInClient(u1.email, u1.password);
  const c2 = await signedInClient(u2.email, u2.password);

  // 1. anonymous
  ok('anon  reads notes', await anon.from('notes').select('id,title'));
  ok('anon  inserts note', await anon.from('notes').insert({ title: 'anon note' }).select());

  // 2. user 1 creates a note
  const { data: n1 } = await c1.from('notes').insert({ title: `note by ${u1.email}` }).select().single();
  console.log('user1 created note id', n1?.id);

  // 3. user 2 tries to see / edit / delete user 1's note
  ok('user2 reads notes (should not see user1 note)', await c2.from('notes').select('id,title'));
  ok('user2 updates user1 note', await c2.from('notes').update({ title: 'hacked' }).eq('id', n1.id).select());
  ok('user2 deletes user1 note', await c2.from('notes').delete().eq('id', n1.id).select());

  // 4. user 1 can see and change own note
  ok('user1 reads own notes', await c1.from('notes').select('id,title'));
  ok('user1 updates own note', await c1.from('notes').update({ title: 'edited by owner' }).eq('id', n1.id).select());

  // 5. user tries to insert a row on behalf of another user
  const { data: { user } } = await c2.auth.getUser();
  ok('user1 inserts note owned by user2', await c1.from('notes').insert({ title: 'spoof', user_id: user.id }).select());

  // 6. user tries to make himself admin (needs role policies from 04)
  ok('user1 promotes self to admin', await c1.from('profiles').update({ role: 'admin' }).eq('id', (await c1.auth.getUser()).data.user.id).select());

  // cleanup
  await c1.from('notes').delete().eq('id', n1.id);
})().catch((e) => console.error('Test failed:', e.message));
