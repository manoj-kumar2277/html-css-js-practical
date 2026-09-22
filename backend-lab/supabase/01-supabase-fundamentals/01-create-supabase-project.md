# Experiment: Create a Supabase project

**Aim:** Create a new Supabase project (hosted PostgreSQL + Auth + Storage + Realtime + Edge Functions).

## Steps
1. Open <https://supabase.com> -> **Start your project** -> sign in with GitHub / email.
2. Create an **Organization** (free plan) if asked.
3. Click **New project** and fill in:
   - **Name:** `student-lab`
   - **Database password:** use *Generate a password*, then **copy and save it** (needed for direct DB connections; not shown again)
   - **Region:** nearest to you (for India choose *Mumbai / ap-south-1*, if listed)
   - **Pricing plan:** Free
4. Click **Create new project** and wait 1-2 minutes until the status shows *Healthy*.
5. Note the **Project URL** `https://<project-ref>.supabase.co` (Home page or Project Settings > API).

## What you get
| Service | Purpose |
|---|---|
| Postgres database | Relational data |
| Auth (GoTrue) | Users, passwords, OAuth |
| Storage | Files and images |
| Realtime | Live database changes |
| Edge Functions | Server-side TypeScript (Deno) |
| Auto-generated REST API | PostgREST over your tables |

## Result
A running project with its own URL, API keys and empty `public` schema.
