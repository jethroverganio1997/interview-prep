## Supabase Overview
The project connects to a Supabase backend configured through `supabase/config.toml`. The configuration enables Supabase Auth for user management and now tracks SQL migrations under `supabase/migrations/` (e.g. `20251016153000_create_job_listings.sql`).

## Auth Tables
Supabase provisions the following core tables automatically:
- `auth.users`: Stores user accounts, email addresses, and metadata.
- `auth.identities`: Maps third-party identity providers when enabled.
- `auth.sessions`: Tracks logged-in sessions for token validation.

## Application Data
### `public.job_listings`
- **Purpose:** Stores LinkedIn-style job postings that hydrate the dashboard cards.
- **Key columns:**
  - `job_id text primary key` – Stable job identifier from LinkedIn.
  - `job_title text`, `job_url text` – Display title and canonical listing URL.
  - `company text`, `company_url text`, `company_urn text` – Company display string, public profile link, and LinkedIn URN.
  - `location text`, `work_type text` – Geography and working arrangement (Remote, Hybrid, etc.).
  - `salary text` – Raw salary string supplied by the feed.
  - `posted_at timestamptz`, `posted_at_epoch bigint` – Publication timestamp in ISO and epoch milliseconds for flexibility.
  - `skills text[]`, `benefits text[]`, `job_insights text[]` – Arrays surfaced as skill/benefit/insight badges.
  - `is_easy_apply boolean`, `is_promoted boolean`, `is_verified boolean` – Flags that drive badge rendering.
  - `applicant_count text` – Human readable applicant volume (e.g. “over 100 applicants”).
  - `description text` – Full job summary used for truncation on the card.
  - `navigation_subtitle text`, `geo_id text` – Supplemental metadata used for LinkedIn navigation cues.
  - `created_at timestamptz`, `created_at_epoch bigint` – Ingestion timestamps.
  - `apply_url text` – Direct apply link; falls back to `job_url` when absent.
- **Access:** Row Level Security remains enabled with policy `Allow authenticated job list reads` allowing `select` for authenticated users.
- **Seed data:** Migration `20251017120000_update_job_listings_schema.sql` inserts the “Senior Frontend Developer” posting from Socium as sample data.

## Creating New Schema
1. Run `supabase migration new <name>` to scaffold a migration file.
2. Edit the generated SQL to define tables or functions.
3. Apply remotely with `supabase db reset --linked`.
4. Commit both the migration and updates to this document describing the new entities.

## Future Guidance
- Keep business data in the public schema unless privacy requires restricted schemas.
- Mirror table descriptions here with column summaries, constraints, and index notes as they are added.
