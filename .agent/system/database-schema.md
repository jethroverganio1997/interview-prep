## Supabase Overview
The project connects to a Supabase backend configured through `supabase/config.toml`. The configuration enables Supabase Auth for user management and now tracks SQL migrations under `supabase/migrations/` (e.g. `20251016153000_create_job_listings.sql`).

## Auth Tables
Supabase provisions the following core tables automatically:
- `auth.users`: Stores user accounts, email addresses, and metadata.
- `auth.identities`: Maps third-party identity providers when enabled.
- `auth.sessions`: Tracks logged-in sessions for token validation.

## Application Data
### `public.job_listings`
- **Purpose:** Stores external job postings that are rendered on the dashboard cards.
- **Key columns:**
  - `id text primary key` – Stable identifier from the upstream feed (LinkedIn ID).
  - `title text` – Job title shown on the card.
  - `company_name text`, `company_linkedin_url text`, `company_logo text` – Company level metadata for the card header.
  - `location text`, `employment_type text`, `seniority_level text` – Display badges.
  - `salary_info text[]`, `benefits text[]` – Arrays for compensation ranges and benefit badges.
  - `posted_at date`, `applicants_count integer` – Used for the footer stats.
  - `description_text text`, `description_html text` – Plain copy (preferred by the UI) and the original HTML payload for parity.
  - `job_poster_*` fields – Name, title, photo, and profile url for the recruiter badge.
  - `apply_url text`, `link text` – Destination URLs for the apply/view actions.
  - `company_description text`, `company_website text`, `company_employees_count integer` – Extended company profile data for future surfaces.
- **Access:** Row Level Security enabled with policy `Allow authenticated job list reads` permitting `select` for authenticated users. Service-role operations continue to bypass RLS.
- **Seed data:** The initial migration inserts the "English Data Labeling Analyst" posting used during dashboard development.

## Creating New Schema
1. Run `supabase migration new <name>` to scaffold a migration file.
2. Edit the generated SQL to define tables or functions.
3. Apply remotely with `supabase db reset --linked`.
4. Commit both the migration and updates to this document describing the new entities.

## Future Guidance
- Keep business data in the public schema unless privacy requires restricted schemas.
- Mirror table descriptions here with column summaries, constraints, and index notes as they are added.
