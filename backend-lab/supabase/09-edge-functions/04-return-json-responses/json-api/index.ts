// Experiment: Return JSON responses from an Edge Function (status codes, headers, routing).
// Deploy : supabase functions deploy json-api --no-verify-jwt
// Test   : curl https://<ref>.supabase.co/functions/v1/json-api/products
//          curl https://<ref>.supabase.co/functions/v1/json-api/products/2
//          curl https://<ref>.supabase.co/functions/v1/json-api/unknown      (404)

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Cache-Control": "no-store" },
  });

const products = [
  { id: 1, name: "Laptop", price: 55000 },
  { id: 2, name: "Phone", price: 20000 },
];

Deno.serve((req: Request) => {
  const { pathname } = new URL(req.url);
  const path = pathname.replace(/^\/(functions\/v1\/)?json-api/, "") || "/";

  if (req.method === "GET" && path === "/") return json({ service: "json-api", endpoints: ["/products", "/products/:id"] });
  if (req.method === "GET" && path === "/products") return json({ count: products.length, data: products });

  const m = path.match(/^\/products\/(\d+)$/);
  if (req.method === "GET" && m) {
    const item = products.find((p) => p.id === Number(m[1]));
    return item ? json(item) : json({ error: "Product not found" }, 404);
  }
  return json({ error: "Not found", path }, 404);
});
