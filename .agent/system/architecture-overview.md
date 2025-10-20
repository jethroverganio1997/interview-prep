## Overview
The app is a SaaS-style dashboard built with Next.js 15 (App Router) and React 19. Server components live under `app/`, while interactive regions opt into `"use client"` boundaries. Styling relies on Tailwind CSS v4 utilities plus shadcn/ui primitives that are composed into route-specific components.

## Folder Structure Strategy
Routes follow the App Router "split by segment" pattern. Shared utilities stay near the project root, while feature code lives beside the route that consumes it.

```
app/
  layout.tsx               # Global shell and providers
  page.tsx                 # Marketing landing page
  dashboard/
    page.tsx               # Auth-protected dashboard
    _components/           # Dashboard-only UI building blocks
    _lib/                  # Data helpers, hooks, and types
  auth/
    login/page.tsx         # Auth routes
    _components/
components/
  ui/                      # shadcn primitives
  ...                      # Reusable widgets shared across routes
lib/
  server.ts                # Supabase SSR helper
  client.ts                # Supabase browser helper
```

## Core Modules
- `app/<route>/_components/` hosts UI pieces that only make sense for that route.
- `app/<route>/_lib/` gathers non-visual logic (types, data fetchers, hooks, helpers). Each module leans on generated Supabase types imported from `types/database.types.ts`.
- `app/dashboard/page.tsx` validates the session, performs the first `job_listings` fetch on the server, and hydrates the client feed with initial data and any error message.
- `app/dashboard/_components/job-feed.tsx` wires the Supabase-backed search + pagination hook to the client UI and renders the data table.
- `app/dashboard/_components/job-table.tsx` renders the TanStack-powered shadcn data table, providing column-per-field output, multi-select column filters, column visibility controls, and row actions for viewing or applying to a job.
- `app/dashboard/_components/job-detail.tsx` renders the full role overview, personal tracking metadata, and source links.
- `app/dashboard/_lib/use-job-feed.ts` owns client-side state: debounced search term, pagination, and fetch status while returning raw Supabase rows for the table.
- `app/dashboard/_lib/actions.ts` exposes shared server/client query helpers that respect the new `id`/`title` schema and search vector.
- `components/empty-state.tsx` and `components/ui/*` provide shared presentation primitives.

## Data Flow
1. Server routes create an authenticated Supabase client via `@/lib/server`. If the user is not authenticated, the request redirects to `/auth/login`.
2. The dashboard server component fetches the first page of `job_listings` records (limit 9) and passes them to the client boundary.
3. The client boundary (`JobFeed`) uses `@/lib/client` to create a browser Supabase client, running searches and pagination by calling `getJobListings`. Results feed the column-rich `JobTable`, which applies client-side filters and column visibility controls.
4. Selecting a job uses Next.js routing (`/dashboard/jobs/[jobId]`) to render the server-driven detail page. The page fetches the single record via `getJobListingById` and displays it with `JobDetail` or falls back to a not-found boundary.

## State Management
- Server components fetch exactly what they need per request; no server-side caches are maintained in memory.
- Client state is kept minimal. The `useJobFeed` hook stores the current search term, job rows, pagination flags, and transient fetch errors.

## Assets & Styling
- Global CSS lives in `app/globals.css`.
- Static assets live in `public/`.
- shadcn/ui primitives in `components/ui/` are composed into higher-level widgets in `components/` or route-specific component folders.

## Extensibility Notes
- Keep new feature-specific code close to its route by adding `_components` and `_lib` folders as needed.
- When expanding Supabase usage, add typed helpers in the relevant `_lib` module so UI layers stay declarative.
- Reuse `EmptyState`, shadcn primitives, and Tailwind tokens to maintain consistent visual language.
