## Related Documentation
- [Task: job-detail-page](./job-detail-page.md)
- [Task: job-description-markdown](./job-description-markdown.md)
- [System: architecture-overview](../system/architecture-overview.md)

## Feature
Surface the origin site for each job listing by extracting the primary domain from its URL.

## Problem Statement
Users cannot quickly identify which job board or company site a listing originates from. Showing the main domain (e.g., `indeed.com`, `acme.com`) near the job metadata improves trust and context without requiring them to inspect the full URL.

## Requirements & Assumptions
- Derive a clean, human-readable domain from `job.job_url`, stripping protocol, trailing slashes, query params, and common `www.` prefixes.
- Handle subdomains by collapsing to the registrable domain (`careers.acme.com` → `acme.com`) when feasible.
- Render the domain in the job detail page within the header metadata block, grouped alongside location/work type.
- Provide a sensible fallback (e.g., “Source unknown”) when the URL is missing or cannot be parsed.
- Avoid introducing heavy third-party dependencies; prefer lightweight parsing utilities.

## Implementation Plan
1. **Utility helper**
   - Extend `app/dashboard/_lib/helpers.ts` with a function (e.g., `getDomainFromUrl`) that safely parses a URL using the WHATWG URL API, removes `www.` prefixes, and reduces multi-part hosts to their registrable domain when possible.
   - Include basic unit-worthy logic (split on dots, drop common subdomains) and return `null` on failure.
2. **Job detail rendering**
   - Import the helper into `JobDetail`, compute the domain once, and add a new metadata pill or inline label near the header section.
   - Ensure the label is accessible (aria-hidden separators, text contrast) and gracefully handles the fallback string.
3. **Polish & docs**
   - Verify spacing does not break on small screens.
   - Update `.agent/system/architecture-overview.md` and this task file with implementation notes and validation results.

## Validation Plan
- Manual: open a job whose URL includes `www.` and confirm the header displays the expected domain.
- Manual: test with a subdomain URL (e.g., `jobs.google.com`) to ensure reduction to the primary domain.
- Manual: simulate a missing/invalid URL to confirm the fallback text renders.

## Implementation Summary
- Added `getDomainFromUrl` in `app/dashboard/_lib/helpers.ts` to normalise hostnames, trim common prefixes, and collapse subdomains to their registrable domain with graceful fallbacks.
- Updated `JobDetail` to render the extracted domain with a globe icon alongside existing metadata and default to “Source unknown” when parsing fails.

## Validation Notes
- `npm run lint` (fails: known `types/database.types.ts` binary parse error; existing warnings in `components/magic/particles.tsx`).
