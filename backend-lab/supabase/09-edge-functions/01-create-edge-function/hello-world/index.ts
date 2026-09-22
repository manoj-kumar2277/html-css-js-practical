// Experiment: Create a Supabase Edge Function.
// Create : supabase functions new hello-world      (then paste this into supabase/functions/hello-world/index.ts)
// Serve  : supabase functions serve hello-world    -> http://localhost:54321/functions/v1/hello-world
// Test   : curl http://localhost:54321/functions/v1/hello-world -H "Authorization: Bearer <ANON_KEY>"

Deno.serve((_req: Request) => {
  const body = JSON.stringify({
    message: "Hello from a Supabase Edge Function!",
    runtime: `Deno ${Deno.version.deno}`,
    time: new Date().toISOString(),
  });
  return new Response(body, { headers: { "Content-Type": "application/json" } });
});
