# Edge Functions - one-time setup

Edge Functions are server-side **TypeScript/Deno** functions that run close to your users.

```bash
# 1. Install the Supabase CLI (any one)
npm install -g supabase            # or: brew install supabase/tap/supabase
supabase --version

# 2. Log in and link this folder to your project
supabase login
supabase init                      # creates ./supabase/ (run in a working folder)
supabase link --project-ref YOUR-PROJECT-REF

# 3. Copy a function into the CLI layout:   supabase/functions/<name>/index.ts
#    Example: cp -r 09-edge-functions/01-create-edge-function/hello-world  <workdir>/supabase/functions/
```

Local testing needs **Docker**: `supabase start` then `supabase functions serve <name>`.
Each folder in this directory is one experiment and contains a ready `index.ts`.
