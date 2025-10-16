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
- `app/<route/feature>/<_lib>/` are files like hooks, actions, state-management like zod, constants etc. that is use by that specific route or feature that is not shared in diff route
- `app/dashboard/page.tsx` gates access through Supabase auth, then renders data-driven UI sections built from local components within the dashboard segment.
- `components/ui/` mirrors the shadcn/ui registry, offering low-level building blocks (`card`, `button`, `badge`, etc.).
- `components/` houses higher-level widgets such as `header.tsx`, `footer.tsx`, which use in multiple route.
- `lib/server.ts` and `lib/client.ts` (not all shown here) provide Supabase client factories for server and browser contexts, ensuring consistent session handling.

## Data Flow
1. A request hits an `app/` route. Server components fetch session metadata using `createClient` from `@/lib/server`.
2. If the user is authenticated, the page returns structured JSX. Otherwise, it redirects to `/auth/login`.
3. Client-side actions (e.g., `LogoutButton`) call `createClient` from `@/lib/client`, operate against Supabase auth, and update routing through Next navigation.

## State Management
- Server state is derived on-demand in async server components.
- Client state is kept minimal; interactive elements use local React state when needed.

## Assets & Static Content
- Static files reside under `public/`.
- Shared Tailwind layers and CSS resets live in `app/globals.css`.

## Extensibility Notes
- New routes should follow the existing segment pattern (e.g., grouping marketing pages under `app/(marketing)`).
- Feature-specific components belong in dedicated subfolders under `app/<route>/_components/` to avoid polluting the root components.
- Shared components across multiple route belong in dedicated subfolders under `components/` to avoid polluting the shadcn primitives.

