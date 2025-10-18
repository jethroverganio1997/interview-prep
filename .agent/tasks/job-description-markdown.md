## Related Documentation
- [System: database-schema](../system/database-schema.md)
- [Task: job-detail-page](./job-detail-page.md)

## Feature
Render rich markdown job descriptions on the dashboard job detail page.

## Problem Statement
Job descriptions currently render plain text sourced from the `description` column, leaving the richer markdown version stored in `description_md` unused. As a result, formatting (lists, headings, links) is lost, and longer descriptions become harder to read.

## Requirements & Assumptions
- Job detail pages should render the markdown content stored in `job_listings.description_md`.
- Fallback to the existing plain-text `description` when markdown content is missing.
- Styling must match the current design language and remain legible in light/dark themes.
- Markdown rendering should handle common elements (paragraphs, headings, lists, links) while preventing unsafe HTML.
- No changes to the Supabase schema—only presentation logic.

## Implementation Plan
1. **Introduce markdown renderer**
   - Add a reusable server-safe component (e.g., `Markdown`) under `app/dashboard/_components` backed by `react-markdown` with `remark-gfm` for GitHub-flavoured syntax.
   - Configure allowed elements and map them to existing typography classes to maintain styling.
2. **Update job detail description**
   - Surface `job.description_md` in `JobDetail`, falling back to `job.description` when the markdown field is empty.
   - Replace the current `<p>` block with the new markdown component and adjust spacing utilities as needed.
3. **Polish and verify**
   - Ensure external links generated from markdown render with appropriate attributes (`target="_blank"`, `rel`).
   - Confirm typography respects the page layout and responsive breakpoints.

## Validation Plan
- Manual: load a job with markdown formatting and verify headings, bullet lists, and links render correctly.
- Manual: load a job without `description_md` to confirm the plain-text fallback still displays.
- Regression: smoke test the job detail page for layout and actions (apply link, saved badge).

## Implementation Summary
- Added `app/dashboard/_components/markdown.tsx` powered by `react-markdown` and `remark-gfm` with Tailwind-aware typography overrides and safe external link handling.
- Updated `JobDetail` to prioritise `description_md`, fall back to the plain description, and render the result with the shared Markdown component.

## Validation Notes
- `npm run lint` (fails: `types/database.types.ts` flagged as binary before this change; existing issue).
