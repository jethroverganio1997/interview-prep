## Related Documentation
- [System: architecture-overview](../system/architecture-overview.md)
- [System: database-schema](../system/database-schema.md)
- [Task: remove-saved-jobs](./remove-saved-jobs.md)
- [SOP: adding-routes](../sop/adding-routes.md)

## Feature
Replace dashboard card grid with a shadcn data table presentation for job listings

## Context
With saved-job functionality removed, the dashboard now presents listings as standalone cards. We want to shift to a richer tabular layout (using shadcn's data table patterns) to make scanning fields such as company, status, priority, and dates easier. The current data flow (Supabase fetch + `useJobFeed`) should be preserved, but the UI must render a sortable/searchable table that feels native to the new schema.

## Requirements
- Present the job listings on `/dashboard` using a shadcn-styled data table instead of individual cards.
- Include useful columns drawn from the new schema (title, company, location, work arrangement, status, priority, posted/applied dates, etc.), and retain quick access to external links/application URLs.
- Keep the existing search input and infinite scroll behaviour compatible with the table experience; the hook should continue supplying structured row data.
- Support responsive behaviour: table must remain readable on smaller breakpoints (stacked rows or horizontal scrolling as appropriate).
- Reuse or adapt shared helpers so other modules (e.g., detail page) continue to function without regression.

## Open Questions
- Should we introduce client-side sorting or rely solely on search + chronological ordering? (Assume basic client-side sorting for key columns if shadcn table API makes it straightforward.)
- How should the table behave on very narrow screens? (Aim for horizontal scroll wrapper unless a stacked layout proves necessary.)

## Implementation Plan
1. **Evaluate shadcn data table patterns**
   - Use `shadcn-components` tooling to inspect the latest table implementation (columns definition, row actions, responsive wrappers).
   - Decide on column set and any custom cell renderers (e.g., badges for status/priority, action buttons for view/apply).
2. **Adapt frontend structure**
   - Introduce a new table component under `app/dashboard/_components/` (e.g., `job-table.tsx`) that consumes `UseJobFeed` data.
   - Update helpers to provide table-friendly row DTOs (links, formatted dates, badges) while keeping the detail view mapping intact.
   - Replace `JobFeed` card grid with the table component, preserving search input, error states, loading indicators, and infinite scroll sentinel.
3. **Polish & integrate**
   - Ensure responsive layout (wrap table in scroll container, adjust typography/badges).
   - Surface row-level actions (view detail, open listing/apply) in a dedicated column.
   - Update empty-state messaging to align with the table view.
4. **Validation & docs**
   - Run `npm run lint`.
   - Update `.agent/system/architecture-overview.md` if component structure changes, and refresh `.agent/README.md` if new docs are added.

## Validation Plan
- `npm run lint`
- Manual sanity: search, scroll to load more rows, open detail/apply links, confirm table renders on mobile-sized viewport.

## Implementation Summary
- Added shadcn table primitives (`components/ui/table.tsx`) and the TanStack dependency to support a feature-rich data table.
- Replaced the card grid with a column-per-field `JobTable` that mirrors every Supabase column, adds multi-select column filters, column visibility controls, and row actions while reusing the existing `useJobFeed` data flow.
- Simplified the feed hook and helpers to expose raw Supabase rows, introduced tone utilities for status/priority badges, and restyled `JobFeed` to hand search state into the table header.
- Refreshed architecture documentation to reflect the new data table architecture.

## Validation Notes
- `npm run lint` (passes with existing `components/magic/particles.tsx` dependency warnings).
