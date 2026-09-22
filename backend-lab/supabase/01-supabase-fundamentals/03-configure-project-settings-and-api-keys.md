# Experiment: Configure project settings and API keys

**Aim:** Find the project settings and understand the different API keys.

## Where
**Project Settings** (gear icon) > **General / API / Database / Authentication**.

## Keys
| Key | Use | Safe in browser? |
|---|---|---|
| **Project URL** | Base URL of every API call | Yes |
| **anon (public / publishable) key** | Client-side calls; access is limited by **RLS policies** | Yes |
| **service_role (secret) key** | Full access, **bypasses RLS** | **NEVER** - server only |
| **JWT secret** | Signs/verifies tokens | Never |

## Steps
1. Project Settings > **API** -> copy **Project URL** and **anon key**.
2. Reveal and copy the **service_role key** (store only in a server-side `.env`).
3. Save them in `supabase/.env` (see `.env.example`); make sure `.env` is in `.gitignore`.
4. Project Settings > **General**: rename the project, set the region info, pause/restore options.
5. Project Settings > **Database**: view the connection string, reset the DB password, SSL settings.
6. Project Settings > **Authentication** (or Authentication > URL Configuration): set **Site URL** (e.g. `http://localhost:3000`) and **Redirect URLs**.
7. Authentication > Providers > **Email**: toggle *Confirm email* (turn OFF during lab testing so sign-ups work immediately).

## Security rules
- Never commit keys to Git; rotate a key if it leaks.
- Use anon key + RLS in the frontend; use service_role only in trusted servers/Edge Functions.
