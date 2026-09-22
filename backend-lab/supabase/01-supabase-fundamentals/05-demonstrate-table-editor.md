# Experiment: Demonstrate the Supabase Table Editor

**Aim:** Create and manage tables without writing SQL.

## Create a table
1. Dashboard > **Table Editor** > **New table**.
2. Name: `books`; keep **Enable Row Level Security (RLS)** ticked.
3. Columns (use *Add column*):

| Name | Type | Default | Options |
|---|---|---|---|
| `id` | `int8` | identity | Primary key |
| `title` | `text` | - | uncheck *Allow nullable* |
| `author` | `text` | - | |
| `price` | `numeric` | `0` | |
| `created_at` | `timestamptz` | `now()` | |

4. Click **Save**.

## Work with data
- **Insert row:** *Insert > Insert row*, fill the form, Save.
- **Import CSV:** *Insert > Import data from CSV*.
- **Edit cell:** double-click a cell, type, press Enter.
- **Filter / Sort:** toolbar *Filter* (e.g. `price > 100`) and *Sort*.
- **Delete row:** tick the checkbox > *Delete rows*.
- **Export:** *Export > Download as CSV*.

## Relations
1. In `books` add column `publisher_id` (`int8`).
2. Click the link icon > **Add foreign key relation** -> choose `publishers.id`.

## Other actions
- **Edit table:** rename, add/remove columns, change types.
- **View definition:** the *Definition* tab shows the generated SQL.
- **Realtime:** toggle *Enable Realtime* on the table menu.

## Result
Anything done in the Table Editor is plain PostgreSQL - it is the same table you can query in the SQL Editor.
