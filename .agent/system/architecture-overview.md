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
- `app/dashboard/_components/job-feed.tsx` wraps the search input, infinite scroll sentinel, and list rendering. It delegates all data fetching to the colocated `useJobFeed` hook.
- `app/dashboard/_components/job-card.tsx` renders the summary card for each job using the simplified schema (no bookmark button or saved-state badges).
- `app/dashboard/_components/job-detail.tsx` renders the full role overview, personal tracking metadata, and source links.
- `app/dashboard/_lib/use-job-feed.ts` owns client-side state: debounced search term, pagination, fetch status, and mapping rows into card props.
- `app/dashboard/_lib/actions.ts` exposes shared server/client query helpers that respect the new `id`/`title` schema and search vector.
- `components/empty-state.tsx` and `components/ui/*` provide shared presentation primitives.

## Data Flow
1. Server routes create an authenticated Supabase client via `@/lib/server`. If the user is not authenticated, the request redirects to `/auth/login`.
2. The dashboard server component fetches the first page of `job_listings` records (limit 9) and passes them to the client boundary.
3. The client boundary (`JobFeed`) uses `@/lib/client` to create a browser Supabase client, running searches and pagination by calling `getJobListings`. Results are merged locally and rendered as `JobCard`s.
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
