## Related Documentation
- [System: architecture-overview](../system/architecture-overview.md)
- [System: database-schema](../system/database-schema.md)
- [Task: dashboard-data-table](./dashboard-data-table.md)

## Feature
Inline editing for dashboard job listings table

## Context
The shadcn-powered data table on `/dashboard` already supports filtering and sorting but still treats Supabase rows as read-only. Recruiters now want to maintain application tracking fields (status, priority, applied dates, follow-up notes) without jumping into Supabase. We need a lightweight editing experience that keeps the table as the single workspace for updating tracking metadata while preserving the existing data-fetch flow.

## Requirements
- Allow editing the `status`, `priority`, `applied_at`, `last_updated`, and `notes` columns directly from the dashboard table.
- Persist edits to Supabase immediately; surface success/failure feedback inline.
- Keep the table layout compact—no full-page modals. Edits should feel cell-scoped (dropdowns/inputs anchored to the row).
- Maintain current filtering/sorting/search behaviour after changes, and keep the row in place without a full reload.
- Ensure date inputs handle ISO strings consistently and allow clearing values.

## Implementation Plan
1. **Supabase update action**
   - Add an `updateJobListing` helper in `app/dashboard/_lib/actions.ts` that accepts a partial update payload for the targeted tracking fields and returns the updated row/error.
   - Export supporting types (payload + result) from `types.ts` so client components have strong typing when invoking updates.
2. **Feed state integration**
   - Extend `useJobFeed` to expose a `replaceJob` callback that can update a single job in local state post-save without triggering a full refetch.
   - Ensure the hook preserves existing pagination/search behaviour and provides a way to reset the last error once an edit succeeds.
3. **Editable table cells**
   - In `JobTable`, add inline editing affordances:
     - For `status`/`priority`, render dropdown menus with predefined options plus a “Clear value” action.
     - For datetime fields, use `input type="datetime-local"` popovers with confirm/cancel controls and ISO conversions.
     - For notes, provide a textarea popover with save/cancel and clear support.
   - Manage per-cell editing/loading/error state, call `updateJobListing`, optimistically update the UI via `replaceJob`, and show a subtle confirmation badge or toast alternative.
   - Handle save failures gracefully (error message in popover + revert field).
4. **Polish & accessibility**
   - Keep keyboard navigation sane (tab focus, escape to cancel).
   - Reuse badge styles for display mode, ensuring edited values re-render correctly with existing tone helpers.
5. **Validation & documentation**
   - Run `npm run lint`.
   - Update `.agent/system/architecture-overview.md` to mention inline editing capabilities.
   - Add a summary of the change and validation results to this task file and refresh the `.agent/README.md` index.

## Validation Plan
- `npm run lint`
- Manual: edit each supported column (set, update, clear) and confirm Supabase persists the change without breaking table filters, counts, or infinite scroll.

## Implementation Summary
- Introduced `updateJobListing` in `app/dashboard/_lib/actions.ts` and wired the new helper through `useJobFeed` so the table can patch single rows without reloading the feed.
- Added popover-based editors for status, priority, applied dates, last updated timestamps, and notes inside `app/dashboard/_components/job-table.tsx`, including quick-pick chips, datetime inputs, and success/error feedback while keeping row heights stable.
- Extended the table hook signature and state plumbing to expose `updateJob`, allowing the new editors to persist values and refresh the corresponding row locally.
- Added Supabase migration `20251201101500_job_listings_update_policy.sql` so authenticated users can update listings, and refreshed architecture/database docs plus the `.agent/README.md` index.

## Validation Notes
- `npm run lint`
  - Existing warnings remain in `components/magic/particles.tsx` (missing hook dependencies); unrelated to this change set.
