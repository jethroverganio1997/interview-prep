## Supabase Auth
- `lib/server.ts` exports `createClient` that wraps `@supabase/ssr` helpers to hydrate sessions in server components.
- `lib/client.ts` (used in `LogoutButton`) bootstraps a browser Supabase client for auth mutations.
- Environment variables required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and service role keys when server-side writes are needed.

## shadcn/ui Registry
- UI primitives generated via the shadcn CLI reside in `components/ui/`.
- Components import from `@/components/ui/<name>`; avoid direct registry paths to keep imports local.
- When introducing new registry items, run `npx shadcn@latest add <component>` and commit both the generated file and updates here if the integration pattern changes.

## Tailwind & PostCSS
- Tailwind v4 runs in JIT mode with config in `tailwind.config.ts` (using the default PostCSS pipeline defined in `postcss.config.mjs`).
- Utility classes are available globally through `app/globals.css`; additional theme tokens should extend Tailwind config, not inline CSS.

## Routing & Layout
- App Router segments (`app/(marketing)`, `app/dashboard`) share metadata and layout definitions via `app/layout.tsx`.
- Auth routes under `app/auth/` use client components for forms but rely on server actions for Supabase operations.

## External Assets
- Icons and logos generally come from `lucide-react` or static images in `public/`.
- Fonts are handled via Next.js font utilities (see `app/layout.tsx`), which require network calls during server render; include them in caching strategies if customizing.
