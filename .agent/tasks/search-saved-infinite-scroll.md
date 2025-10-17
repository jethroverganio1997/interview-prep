## Related Documentation
- [System: architecture-overview](../system/architecture-overview.md)
- [System: database-schema](../system/database-schema.md)
- [SOP: database-migration](../sop/database-migration.md)
- [Task: dashboard-job-listings](./dashboard-job-listings.md)

## Feature
Dashboard search, saved jobs, and infinite scroll

## Context
The dashboard currently renders every job listing in a static grid sourced from Supabase. Users cannot search, bookmark, or progressively load records, which makes the experience clunky as the dataset grows. We need richer querying, the ability to persist liked jobs, and a smoother browsing flow without reloading the page.

## Requirements
- Introduce keyword search that leverages Postgres/Supabase full-text search, supports partial prefixes (e.g. `Flu` → `Flutter`), and sorts results by most recently posted jobs.
- Allow authenticated users to bookmark (save) job listings and optionally view only their saved jobs.
- Switch the dashboard to an infinite scroll pattern that fetches nine jobs at a time, loads additional batches on scroll, and communicates when no more results are available.
- Keep the implementation consistent with existing architecture (`_lib` helpers, Supabase types) and respect RLS policies.

## Open Questions
- None at this stage; assumptions: search applies across title, company, location, and description fields, and saved jobs should be filterable via a toggle.

## Implementation Plan
1. **Database updates**
   - Create a Supabase migration that adds a generated `search_vector` column to `job_listings`, concatenating title, company, location, and description text with proper weights, and backfills a GIN index for fast full-text queries.
   - Create a new `saved_jobs` junction table (`id` composite of `user_id` + `job_id`, `created_at` timestamp) with foreign keys to `auth.users` and `job_listings`, plus supporting indices.
   - Define RLS policies permitting authenticated users to `select/insert/delete` their own saved rows. Update `.agent/system/database-schema.md` after implementation.

2. **Supabase types**
   - Regenerate `types/database.types.ts` via `supabase gen types typescript --linked` so the new column and table are typed.
   - Extend `app/dashboard/_lib/types.ts` with aliases for the new structures (e.g. `SavedJobRow`).

3. **Data helpers & actions**
   - Expand `_lib/actions.ts` to accept filtering options (`searchTerm`, `limit`, `offset`, `savedOnly`, `userId`) and reuse the same builder for both server and client Supabase clients.
   - Add helper functions for saving and removing jobs that operate against the new table.
   - Ensure queries apply the search vector with `:*` suffixes for prefix matching and always order by `posted_at` descending.

4. **UI state management**
   - Convert the dashboard job list into a client boundary (e.g. new `JobFeed` component) that handles search input, saved toggle, pagination state, and infinite scroll via an intersection observer.
   - Fetch the initial page on the server (`page.tsx`) for fast first paint, pass user ID + initial data into the client component, and reuse the `_lib` fetcher for subsequent client-side loads.
   - Update `mapRowToCard` to include an `isSaved` boolean and adjust `JobCard` props accordingly.

5. **Saved job interactions**
   - Update the `JobCard` UI to surface a bookmark button (lucide `Bookmark`) that reflects saved state, debounces rapid clicks, and calls the save/remove helpers.
   - Ensure unsaving while in “saved only” mode prunes the card immediately.

6. **UX polish**
   - Add empty states for search with no matches, loading skeleton/spinner for additional pages, and “No more results” messaging once all batches are fetched.
   - Guard against concurrent fetches and report Supabase errors inline.

7. **Validation & docs**
   - Run `npm run lint` and exercise the flow manually (search partial term, save/unsave, infinite scroll to exhaustion, saved-only view).
   - Update `.agent/system/database-schema.md` with the new column/table details and refresh `.agent/README.md` to index this task doc.

## Validation Plan
- `npm run lint`
- Manual QA checklist:
  - Search for partial keyword (e.g. `Flu`) and confirm matching jobs return in descending posted order.
  - Save/unsave a job and verify persistence after refresh plus visibility in “Saved jobs” view.
  - Scroll past initial nine jobs and observe subsequent pages loading until the terminal state message appears.

## Implementation Summary
- Added migration `20251101090000_add_search_vector_and_saved_jobs.sql` to generate the `job_listings.search_vector` column, create a GIN index for FTS, and introduce the RLS-protected `saved_jobs` table.
- Regenerated Supabase types and extended dashboard `_lib` utilities with query filters, prefix search builder, saved job helpers, and mapping utilities that surface saved state.
- Replaced the static dashboard grid with a client-side `JobFeed` component featuring debounced full-text search, saved-only toggle, infinite scrolling via `IntersectionObserver`, error messaging, and bookmark actions wired through Supabase.
- Updated `JobCard` to display a bookmark control and reflect saved status while maintaining existing badge layout.

## Validation Notes
- `npm run lint` (passes with existing warnings about `components/magic/particles.tsx` hook dependencies; unrelated to this change).
- Manual QA not performed in this environment. Please verify search, save/unsave, and infinite scroll flows against a linked Supabase project.
