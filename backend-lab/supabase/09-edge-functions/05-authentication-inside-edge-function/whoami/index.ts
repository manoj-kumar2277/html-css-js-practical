// Experiment: Implement authentication inside an Edge Function.
// The caller sends the user's access token in the Authorization header; the function verifies it and reads the user.
// Deploy : supabase functions deploy whoami          (JWT verification stays ON)
// JS     : const { data } = await supabase.functions.invoke('whoami')   // token is added automatically when signed in
// Test   : curl https://<ref>.supabase.co/functions/v1/whoami -H "Authorization: Bearer <USER_ACCESS_TOKEN>"
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const reply = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { ...cors, "Content-Type": "application/json" } });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return reply({ error: "Missing Authorization header" }, 401);

  // client that acts AS the caller (RLS applies)
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return reply({ error: "Invalid or expired token" }, 401);

  const { data: profile } = await supabase.from("profiles").select("full_name, role").eq("id", user.id).single();

  // simple role check inside the function
  if (new URL(req.url).searchParams.get("admin") === "1" && profile?.role !== "admin") {
    return reply({ error: "Admins only" }, 403);
  }

  return reply({ id: user.id, email: user.email, profile });
});
