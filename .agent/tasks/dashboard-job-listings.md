## Related Documentation
- [System: database-schema](../system/database-schema.md)
- [SOP: database-migration](../sop/database-migration.md)

## Feature
Dashboard Job Listings Data Integration

## Context
The dashboard previously rendered placeholder marketplace cards. We now source live job data from Supabase so users can monitor curated listings tied to their workspace.

## Requirements
- Persist LinkedIn-style job metadata coming from the scraping pipeline, including company profile links, badge arrays, and LinkedIn flags (`is_easy_apply`, `is_promoted`, `is_verified`).
- Render the dashboard cards with live Supabase data (no fixtures) and surface the most relevant chips (location, work type, salary, insights, benefits, skills).
- Keep access gated to authenticated sessions only.

## Implementation Summary
1. Replaced the job listings schema via migration `20251017120000_update_job_listings_schema.sql`, aligning columns with the latest LinkedIn payload (job/company identifiers, timestamp epochs, array fields, verification flags). RLS policy `Allow authenticated job list reads` was recreated for the new table.
2. Regenerated `types/database.types.ts` using `supabase gen types typescript --linked` and kept `app/dashboard/_lib/types.ts` pointed at the generated `Database` type so runtime queries stay type-safe.
3. Updated `getJobListings` to order by `posted_at` and `mapRowToCard` to translate the new schema fields into UI-ready props (location/work type/salary badges, insight arrays, apply flags, etc.).
4. Refreshed `JobCard` to show company initials, applicant counts, verification/easy apply badges, and the new insight/skill chips while truncating the description to three lines.
5. Verified the dashboard page continues to guard unauthenticated access and now renders against the new Socium sample row.

## Follow-up Ideas
- Expand ingestion to include company branding assets should they become available (e.g., logos).
- Add filtering controls (remote-only, verified roles, specific insights) driven by the new boolean/array fields.
- Introduce a detail modal to display the full `description` text beyond the truncated preview.
