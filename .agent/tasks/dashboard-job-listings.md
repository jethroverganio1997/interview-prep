## Related Documentation
- [System: database-schema](../system/database-schema.md)
- [SOP: database-migration](../sop/database-migration.md)

## Feature
Dashboard Job Listings Data Integration

## Context
The dashboard previously rendered placeholder marketplace cards. We now source live job data from Supabase so users can monitor curated listings tied to their workspace.

## Requirements
- Persist LinkedIn-style job metadata (all fields supplied by scraping pipeline).
- Render the dashboard cards with data from Supabase rather than hard-coded fixtures.
- Keep access gated to authenticated sessions only.

## Implementation Summary
1. Added `public.job_listings` table (see migration `20251016153000_create_job_listings.sql`) with RLS select policy for authenticated users and seeded the example posting.
2. Refactored `app/dashboard/page.tsx` to fetch rows via Supabase server client, surface fetch errors, and handle empty states.
3. Split dashboard feature logic into `_lib/types.ts`, `_lib/actions.ts`, and `_lib/helpers.ts` to host data contracts, Supabase calls, and formatting utilities respectively—`types.ts` now aliases the generated Supabase `Database` schema to stay in sync.
4. Reworked `JobCard` component to display the richer dataset (company info, salary, benefits, recruiter details, apply links).
5. Applied the migration to project `uwdxmdtsrdwvllrqxsfi` using `supabase db push`.

## Follow-up Ideas
- Extend ingestion to batch sync multiple listings and track status (active/closed).
- Add filters or sorting (e.g., by location, salary bands).
- Surface full job description in a modal using `description_html`.
