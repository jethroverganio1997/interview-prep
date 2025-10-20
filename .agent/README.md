## Documentation Index

### System
- [architecture-overview](system/architecture-overview.md) - High-level structure, routing patterns, and component organization.
- [database-schema](system/database-schema.md) - Current Supabase entities and migration guidance.
- [integration-points](system/integration-points.md) - External services and how the app integrates with them.

### SOP (Standard Operating Procedures)
- [adding-routes](sop/adding-routes.md) - Workflow for introducing new Next.js routes.
- [database-migration](sop/database-migration.md) - Steps for creating and applying Supabase migrations.
- [design-search](sop/design-search.md) - SOP for selecting shadcn/ui components with MCP tools.

### Tasks
- [editor-toolbar](tasks/editor-toolbar.md) - Plan for adding fixed and floating toolbars to the Plate editor.
- [dashboard-job-listings](tasks/dashboard-job-listings.md) - Supabase-backed job cards powering the dashboard.
- [search-saved-infinite-scroll](tasks/search-saved-infinite-scroll.md) - Plan for dashboard search, saved jobs, and infinite scrolling.
- [job-detail-page](tasks/job-detail-page.md) - Plan for adding an in-app job listing detail view.
- [job-description-markdown](tasks/job-description-markdown.md) - Plan for rendering markdown job descriptions in the detail view.
- [job-source-domain](tasks/job-source-domain.md) - Plan for displaying the origin domain of job listings.
- [remove-saved-jobs](tasks/remove-saved-jobs.md) - Retire saved jobs and align the job schema with the new contract.
- [dashboard-data-table](tasks/dashboard-data-table.md) - Replace dashboard cards with a shadcn-powered data table.

## How to Use
1. Start with **architecture-overview** for a project tour.
2. Consult **integration-points** and SOPs before touching Supabase or routing.
3. Update this index whenever new documentation is added, moved, or removed.
