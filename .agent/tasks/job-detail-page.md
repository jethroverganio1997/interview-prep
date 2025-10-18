## Related Documentation
- [System: architecture-overview](../system/architecture-overview.md)
- [SOP: adding-routes](../sop/adding-routes.md)
- [Task: dashboard-job-listings](./dashboard-job-listings.md)
- [Task: search-saved-infinite-scroll](./search-saved-infinite-scroll.md)

## Feature
Job listing detail view accessible from the dashboard feed.

## Problem Statement
Users can scan job summaries in the dashboard grid but cannot drill into a full description without leaving the app for the external listing. We need an in-app detail page that surfaces the complete job information when a listing card is selected.

## Requirements & Assumptions
- Clicking a job card routes to an internal `/dashboard/jobs/[jobId]` page that renders the full record.
- The detail view must include all job fields we currently store (description, skills, benefits, salary, metadata, external links).
- Page should handle missing or deleted jobs gracefully with a not-found state.
- Supabase-authenticated context is reused; only logged-in users can access dashboard routes.
- Saved-state toggling can remain on the feed for now; the detail page only needs to display information (no new mutations).

## Implementation Plan
1. **Data helper**
   - Add `getJobListingById` in `app/dashboard/_lib/actions.ts` that fetches a single row (and optional saved flag for the current user).
   - Export a typed result that can be reused by server components.
2. **Routing setup**
   - Create `app/dashboard/jobs/[jobId]/page.tsx` as a server component following the `adding-routes` SOP.
   - Use `createClient` from `@/lib/server` to load the record (and saved status if user authenticated).
   - Redirect unauthenticated users to login and render `notFound()` when the job is missing.
3. **UI composition**
   - Introduce a dedicated detail component under `app/dashboard/_components` to render job metadata, description, badges, and external CTAs.
   - Reuse existing formatting helpers (`formatSalary`, `formatPostedAt`, etc.) and ensure the layout is responsive.
4. **Navigation from feed**
   - Extend `mapRowToCard`/`JobCard` to include an internal detail link.
   - Update the card so clicking the primary surface navigates to the detail route while preserving the existing external listing link and save control.
5. **Error & empty states**
   - Add user-friendly messaging on the detail page for failed loads or missing data.
   - Ensure the page sets appropriate metadata/title for clarity.
6. **Documentation**
   - Update `.agent/system/architecture-overview.md` (and other relevant docs) to describe the new route and flow.

## Validation Plan
- Manual QA:
  - Navigate from the dashboard feed to a job detail page; verify all fields render.
  - Attempt to open a non-existent job ID and confirm the not-found state.
  - Check external links (apply/listing) still function.
- Automated tests: none planned (no existing unit test harness for these components).

## Implementation Summary
- Added `getJobListingById` and `JobListingDetailResult` so server routes can fetch a single listing along with the viewer’s saved status.
- Built `JobDetail` server component plus `/dashboard/jobs/[jobId]/page.tsx` (with custom not-found state) to display the full record, external CTAs, and availability messaging.
- Updated job cards to navigate to the new route (click/keyboard) while keeping save actions and external listing links functional.

## Validation Notes
- `npm run lint` (warns about existing `components/magic/particles.tsx` dependency lint warnings).
- Manual QA pending: verify navigation to detail page, not-found behaviour, and external links with Supabase data.
