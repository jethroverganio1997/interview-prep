## Related Documentation
- [System: database-schema](../system/database-schema.md)
- [Task: dashboard-job-listings](./dashboard-job-listings.md)
- [Task: search-saved-infinite-scroll](./search-saved-infinite-scroll.md)
- [SOP: database-migration](../sop/database-migration.md)

## Feature
Retire saved jobs functionality and adopt streamlined job listing schema

## Context
Saved-job tracking is no longer required in the product and the job listing records need to follow a new normalized structure that better matches upstream sources. The existing Supabase schema, API helpers, and dashboard UI assume `saved_jobs` relations and older column names (e.g., `job_title`, `company_url`, `work_type`). We must remove the saved-jobs surface area across the database and frontend, then align all data flows with the prescribed schema shape.

## Requirements
- Drop the `saved_jobs` table, related policies, and any saved-job specific SQL artifacts.
- Replace the `job_listings` table definition to match the provided contract (flat scalar fields plus `skills` array) while preserving primary keys and timestamps.
- Update Supabase types and regenerate any derived DTOs so the new columns map cleanly into TypeScript.
- Remove saved-job interactions/UI (toggles, bookmark buttons, optimistic handlers) from the dashboard and adjust hooks/components to work without saved state.
- Ensure pages/components consume the new column names and data types without regressions.
- Fully reset the linked Supabase instance via `supabase db reset --linked` after migrations are updated.

## Open Questions
- None identified; assume the new schema replaces all previous job fields and saved state features.

## Implementation Plan
1. **Supabase migrations**
   - Author a new migration that drops `saved_jobs`, removes related RLS policies, and replaces `job_listings` columns with the new schema (including array for `skills` and explicit timestamp fields).
   - Ensure comments/indexes are updated or removed as appropriate and that `id` remains the primary key.
   - Execute `supabase db reset --linked` to apply the new schema remotely.
2. **Type regeneration and server helpers**
   - Regenerate `types/database.types.ts` via Supabase CLI to reflect the new structure.
   - Update dashboard `_lib` modules (`actions`, `helpers`, `types`) to consume the new field names and eliminate saved-job lookups/mutations.
3. **Frontend cleanup**
   - Remove saved-job UI (toggles, bookmark controls, empty states) from dashboard components.
   - Adjust job card/feed rendering to use the new schema fields and ensure filtering/search logic aligns with available columns.
4. **Documentation and validation**
   - Revise `.agent/system/database-schema.md` (and any other affected docs) to describe the new schema.
   - Run relevant lint/tests and note validation results.

## Validation Plan
- `supabase db reset --linked`
- `npm run lint`
- Manual sanity check of the dashboard listing flow against the new schema (ensure jobs render without saved state).

## Implementation Summary
- Added migration `20251201100000_replace_job_schema.sql` to drop `saved_jobs`, recreate `job_listings` with the new column contract (including `description_md` and generated `search_vector`), and rebuild the GIN index.
- Regenerated Supabase types and refactored dashboard data helpers to operate on the new `id`/`title` schema without any saved-job lookups.
- Simplified the dashboard UI: removed bookmark toggles, rewrote `JobCard`, `JobFeed`, `JobDetail`, and `useJobFeed` to display the new fields, and updated the server pages accordingly.
- Refreshed `.agent/system/architecture-overview.md` and `.agent/system/database-schema.md` to describe the new structure and removed functionality.

## Validation Notes
- `supabase db reset --linked --yes`
- `npm run lint` (passes with existing `components/magic/particles.tsx` dependency warnings)
