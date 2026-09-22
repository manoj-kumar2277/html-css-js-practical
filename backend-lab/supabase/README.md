# Supabase Lab

## One-time setup
1. Create a project at https://supabase.com (experiment 01-01 walks through it).
2. `cp .env.example .env` and fill in the URL + keys (Project Settings > API).
3. Run `00-setup/schema.sql` in the SQL Editor.
4. `npm install`

## Folder guide
| Folder | Content |
|---|---|
| 01-supabase-fundamentals | Project, dashboard, keys, editors, connecting an app |
| 02-database-and-tables | DDL, data types, keys, constraints, insert/select/update/delete (SQL) |
| 03-sql-operations | WHERE, ORDER BY, GROUP BY, aggregates, joins, subqueries, views |
| 04-supabase-crud | CRUD with `supabase-js` + Student / Product / User CRUD apps |
| 05-authentication | Sign up, sign in, sign out, reset password, sessions, protected routes |
| 06-authorization-and-security | RLS, policies, roles, RBAC |
| 07-storage | Buckets, upload, download, public URLs, authenticated uploads |
| 08-realtime | INSERT/UPDATE/DELETE listeners, chat app, realtime records |
| 09-edge-functions | Deno/TypeScript functions (create, deploy, auth, DB) |
| 10-rest-api | PostgREST endpoints (GET/POST/PATCH/DELETE, filters, pagination, Postman) |
| 11-project-based-experiments | 7 complete mini-projects |

Run any Node experiment with `node <folder>/<file>.js`.
`.sql` files are pasted into the SQL Editor. `.html` files can be opened in a browser (fill in the two keys at the top of the file).
