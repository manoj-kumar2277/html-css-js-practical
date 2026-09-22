// Experiment: Connect an Edge Function with a Supabase database.
// GET  -> list students (as the caller: RLS applies)      POST -> insert {name,email,course,age}
// GET ?stats=1 -> uses the service-role client for an admin-style aggregate
// Deploy : supabase functions deploy students-api
// JS     : supabase.functions.invoke('students-api', { method: 'POST', body: {...} })
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const reply = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  // 1) client that carries the caller's JWT -> respects RLS
  const userClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } },
  });

  const url = new URL(req.url);

  if (req.method === "GET" && url.searchParams.get("stats") === "1") {
    // 2) service-role client -> bypasses RLS (keep this logic server-side only!)
    const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { count, error } = await admin.from("students").select("*", { count: "exact", head: true });
    return error ? reply({ error: error.message }, 500) : reply({ totalStudents: count });
  }

  if (req.method === "GET") {
    const { data, error } = await userClient.from("students").select("*").order("id").limit(50);
    return error ? reply({ error: error.message }, 400) : reply(data);
  }

  if (req.method === "POST") {
    const body = await req.json().catch(() => null);
    if (!body?.name || !body?.email || !body?.course) return reply({ error: "name, email and course are required" }, 400);
    const { data, error } = await userClient.from("students").insert(body).select().single();
    return error ? reply({ error: error.message }, 400) : reply(data, 201);
  }

  return reply({ error: "Method not allowed" }, 405);
});
