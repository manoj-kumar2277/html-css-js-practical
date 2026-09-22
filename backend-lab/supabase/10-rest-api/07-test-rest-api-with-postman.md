# Experiment: Test Supabase REST APIs using Postman

1. Import `07-supabase-rest.postman_collection.json` (Postman > Import).
2. Open the collection **Variables** tab and set:
   - `baseUrl` = `https://YOUR-PROJECT-REF.supabase.co`
   - `anonKey` = your anon key
   - `accessToken` = (optional) `access_token` from a login response - needed once RLS restricts a table
3. Run the requests in order: **Login -> GET -> POST -> PATCH -> DELETE**. Test scripts assert status codes and store the created `id`.
4. Use **Runner** (Collection > Run) to run everything automatically.

## Headers every request needs
| Header | Value |
|---|---|
| `apikey` | `{{anonKey}}` |
| `Authorization` | `Bearer {{anonKey}}` (or `Bearer {{accessToken}}`) |
| `Content-Type` | `application/json` |
| `Prefer` | `return=representation` (return the changed row) |

## Things to observe
- **Status:** `200` read, `201` created, `204` deleted, `400` bad data, `401` bad key, `403/42501` blocked by RLS, `404` unknown table.
- **Response headers:** `Content-Range` gives the total row count when `Prefer: count=exact`.
- **Time / size** tabs show latency and payload.
