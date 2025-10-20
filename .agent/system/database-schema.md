## Supabase Overview
The project connects to Supabase via `supabase/config.toml`. SQL changes are versioned under `supabase/migrations/`, with key milestones:
- `20251201100000_job_schema.sql` - current canonical shape; drops saved-job tables and rebuilds job listings to match the new contract.

## Auth Tables
Supabase provisioned tables handle authentication plumbing:
- `auth.users` - primary user rows (email, metadata).
- `auth.identities` - third-party identity links.
- `auth.sessions` - active session tokens consumed by `createClient` helpers.

## Application Data
### `public.job_listings`
- **Purpose:** Single table backing dashboard cards and the job detail view. Stores both source-provided fields and personal tracking metadata.
- **Columns:**
  - `id text primary key` - unique identifier from the upstream feed.
  - `title text` - job title rendered across the UI.
  - `company text`, `company_url text` - company display name and optional external profile.
  - `location text`, `work_type text`, `work_arrangement text` - geography and working pattern (Full-time, Remote, Hybrid, etc.).
  - `salary text` - free-form salary information captured from the source.
  - `description text`, `description_md text` - plain-text and markdown role summaries.
  - `skills text[]` - ordered list of skills/tools highlighted in the feed.
  - `experience_needed text` - human readable requirement (e.g., "3+ years").
  - `posted_at text` - ISO string of when the job was posted by the source platform.
  - `apply_url text`, `job_url text` - direct application link and canonical listing URL.
  - `source text` - originating platform identifier (LinkedIn, Indeed, etc.).
  - `status text`, `applied_at text`, `notes text`, `priority text`, `last_updated text` - personal tracking fields maintained inside the product.
  - `search_vector tsvector` - generated column weighting title/company/location/description for full-text search (GIN indexed via `job_listings_search_vector_idx`).
- **RLS:** Policy `Allow authenticated job list reads` lets authenticated users `select` all rows. Policy `Allow authenticated job updates` now enables inline dashboard edits to update tracking fields for any listing.
- **Legacy note:** The `saved_jobs` table introduced in 2025-11 has been removed. Bookmarks are no longer part of the data model.

## Creating New Schema
1. Run `supabase migration new <name>` to scaffold a migration file.
2. Implement the SQL changes (include column comments and indexes).
3. Apply remotely with `supabase db reset --linked` so the hosted project stays in sync.
4. Regenerate runtime types: `supabase gen types typescript --linked > types/database.types.ts`.
5. Update this document so future agents understand the latest schema shape.

## Future Guidance
- Keep the schema minimal - prefer optional scalar columns over new tables unless there is a clear relational need.
- When expanding search, update the `search_vector` definition and recreate the GIN index in the same migration.
- Document every column addition (purpose, type, constraints) here to preserve a single source of truth.
