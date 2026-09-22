// Experiment: Pass data to an Edge Function (query string, JSON body, headers).
// Deploy : supabase functions deploy greet
// Test   : curl -X POST "https://<ref>.supabase.co/functions/v1/greet?lang=en" \
//            -H "Authorization: Bearer <ANON_KEY>" -H "Content-Type: application/json" \
//            -H "x-client: curl" -d '{"name":"Asha","age":20}'
// JS     : supabase.functions.invoke('greet', { body: { name: 'Asha', age: 20 } })

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-client",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });   // browser pre-flight

  const url = new URL(req.url);
  const lang = url.searchParams.get("lang") ?? "en";           // 1. query string
  const client = req.headers.get("x-client") ?? "unknown";      // 2. header

  let body: { name?: string; age?: number } = {};               // 3. JSON body
  try { body = await req.json(); } catch { /* no body */ }

  if (!body.name) {
    return new Response(JSON.stringify({ error: "name is required" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const greeting = lang === "ta" ? "Vanakkam" : "Hello";
  return new Response(
    JSON.stringify({ message: `${greeting}, ${body.name}!`, age: body.age ?? null, lang, client }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
