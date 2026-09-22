# Experiment: Deploy an Edge Function

```bash
# 1. Make sure the function exists at supabase/functions/hello-world/index.ts
supabase functions deploy hello-world              # deploy one function
supabase functions deploy                          # deploy ALL functions
supabase functions deploy hello-world --no-verify-jwt   # allow calls WITHOUT a login token (public webhooks)

# 2. List and inspect
supabase functions list

# 3. Secrets (environment variables)
supabase secrets set MY_API_KEY=abc123
supabase secrets list

# 4. Call the live function
curl -i https://YOUR-PROJECT-REF.supabase.co/functions/v1/hello-world \
  -H "Authorization: Bearer YOUR-ANON-KEY"

# 5. Logs: Dashboard > Edge Functions > hello-world > Logs   (or Invocations tab)
```

## From the browser / Node
```js
const { data, error } = await supabase.functions.invoke('hello-world');
```

## Notes
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` are injected automatically.
- Functions verify the JWT by default; `--no-verify-jwt` disables that.
- No CLI? Dashboard > Edge Functions > **Deploy a new function** > paste code in the editor (or use the AI assistant).
