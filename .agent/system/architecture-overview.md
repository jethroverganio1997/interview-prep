## Overview
The project is a SaaS dashboard built with Next.js 15 (App Router) and React 19. Pages under `app/` are server components by default, with client interactivity handled via `"use client"` boundaries. Styling relies on Tailwind CSS v4 utilities and shadcn/ui primitives composed into feature-specific components.

## Folder Structure Strategy
The repository follows the **App Router split-by-route** approach. Shared global assets remain near the project root, while feature-specific assets live alongside the route segments that consume them.

```
app/
├─ layout.tsx                # Global layout shell
├─ page.tsx                  # Landing page
├─ dashboard/
│  ├─ page.tsx               # Auth-protected dashboard route
│  └─ _components/           # Dashboard-only UI building blocks
├─ auth/
│  ├─ login/page.tsx         # Auth routes with their own components
│  └─ _components/
└─ (marketing)/
   ├─ layout.tsx
   └─ page.tsx

components/
├─ ui/                       # shadcn primitives shared across routes
└─ /                         # Reusable widgets consumed by multiple route like header, footer etc

lib/
├─ server.ts                 # Supabase SSR helpers
└─ client.ts                 # Supabase client-side helpers
```

## Core Modules
- `app/<route/feature>/<_components>/` are components use by that specific route or feature that is not shared in diff route
- `app/<route/feature>/<_lib>/` centralises non-component logic for that feature. Each `_lib/` is split further into focused modules (e.g. `types.ts` for DTOs, `actions.ts` for server/data calls, `helpers.ts` for formatting or mapping utilities) so that pages and components stay lean. Route-level `types.ts` files should re-export aliases from the generated Supabase schema (see `types/database.types.ts`) instead of defining shapes manually.
- `app/dashboard/page.tsx` gates access through Supabase auth, fetches the initial job batch + saved IDs on the server, and hydrates the client job feed.
- `app/dashboard/_components/job-feed.tsx` is a client boundary that manages debounced search, saved-job toggles, infinite scrolling, and Supabase mutations while rendering `JobCard` entries.
- `components/ui/` mirrors the shadcn/ui registry, offering low-level building blocks (`card`, `button`, `badge`, etc.).
- `components/` houses higher-level widgets such as `header.tsx`, `footer.tsx`, which use in multiple route.
- `lib/server.ts` and `lib/client.ts` (not all shown here) provide Supabase client factories for server and browser contexts, ensuring consistent session handling.

## Data Flow
1. A request hits an `app/` route. Server components fetch session metadata using `createClient` from `@/lib/server`.
2. If the user is authenticated, the page returns structured JSX. Otherwise, it redirects to `/auth/login`.
3. Client-side boundaries (e.g., `JobFeed`) call `createClient` from `@/lib/client` to run Supabase queries for search, pagination, and saved job mutations without leaving the dashboard view.

## State Management
- Server state is derived on-demand in async server components.
- Client state is kept minimal; interactive elements use local React state when needed.

## Assets & Static Content
- Static files reside under `public/`.
- Shared Tailwind layers and CSS resets live in `app/globals.css`.

## Extensibility Notes
- New routes should follow the existing segment pattern (e.g., grouping marketing pages under `app/(marketing)`).
- Feature-specific components belong in dedicated subfolders under `app/<route>/_components/` to avoid polluting the root components.
- Keep supporting code for a route inside `app/<route>/_lib/`, grouping by responsibility (`types.ts`, `actions.ts`, `helpers.ts`, etc.) to make the contract between server logic and UI explicit.
- Shared components across multiple route belong in dedicated subfolders under `components/` to avoid polluting the shadcn primitives.
