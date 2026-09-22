# Experiment: Explore the Supabase Dashboard

**Aim:** Identify every major area of the dashboard and what it is used for.

| Sidebar item | What to explore |
|---|---|
| **Project Overview / Home** | Project URL, API status, usage graphs |
| **Table Editor** | Spreadsheet-like view: create tables, add/edit/delete rows, define relations |
| **SQL Editor** | Run SQL, save snippets, use templates |
| **Database** | Tables, Views, Functions, Triggers, Roles, Extensions, Replication, Backups, Migrations |
| **Authentication** | Users list, Policies (RLS), Providers (email, Google...), URL Configuration, Email Templates |
| **Storage** | Buckets, files, storage policies |
| **Edge Functions** | Deployed functions, logs, secrets |
| **Realtime** | Inspector, channel monitoring |
| **Advisors** | Security and performance recommendations |
| **Logs** | API, Postgres, Auth, Storage, Edge logs |
| **API Docs** | Auto-generated documentation with ready-to-copy code for **each of your tables** |
| **Project Settings** | General, Database (connection strings), API (URL + keys), Auth, Billing |

## Activity
1. Open **Authentication > Users** and add a test user (Add user > Create new user).
2. Open **API Docs > Tables and Views**, pick a table, and copy the JavaScript and cURL snippets.
3. Open **Logs > API** and find your own request.
4. Open **Advisors > Security** and read any warnings (for example "RLS disabled").
