# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 15.5.5 SaaS application using the App Router architecture with TypeScript, React 19, and Tailwind CSS 4. The project is configured with shadcn/ui components (New York style) and integrates Supabase for authentication and backend services.

## Development Commands

```bash
# Start development server with Turbopack
npm run dev

# Build for production with Turbopack
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Architecture

### Tech Stack
- **Framework**: Next.js 15.5.5 with App Router
- **Build Tool**: Turbopack (enabled for dev and build)
- **React**: v19.1.0 with RSC (React Server Components) enabled
- **TypeScript**: Strict mode enabled
- **Styling**: Tailwind CSS v4 with CSS variables approach
- **UI Components**: shadcn/ui (New York style variant)
- **Icons**: Lucide React
- **Backend**: Supabase (authentication and database)

### Directory Structure
- `app/` - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with Geist font configuration
  - `page.tsx` - Home page
  - `auth/` - Authentication-related pages (login, sign-up, forgot-password, etc.)
  - `protected/` - Protected routes requiring authentication
  - `globals.css` - Global styles with Tailwind and theme configuration
- `lib/` - Utility functions and Supabase clients
  - `utils.ts` - Contains `cn()` helper for className merging
  - `client.ts` - Supabase browser client factory
  - `server.ts` - Supabase server client factory for Server Components/Actions
  - `middleware.ts` - Session management utilities for Next.js middleware
- `components/` - React components
  - `ui/` - shadcn/ui base components (button, card, input, label)
  - Authentication form components (login-form, sign-up-form, etc.)
- `middleware.ts` - Next.js middleware for authentication and session refresh

### Path Aliases
TypeScript and shadcn/ui are configured with these aliases:
- `@/*` maps to project root
- `@/components` → components directory
- `@/lib` → lib directory
- `@/ui` → components/ui directory
- `@/hooks` → hooks directory

### Styling System
- Tailwind CSS v4 with `@import "tailwindcss"` syntax in globals.css
- Custom CSS variables defined in `:root` and `.dark` selectors
- Color system uses OKLCH color space for better perceptual uniformity
- Dark mode via class-based variant: `@custom-variant dark (&:is(.dark *))`
- Theme includes extensive design tokens for sidebar, charts, and semantic colors
- Animation utilities from `tw-animate-css` package

### shadcn/ui Configuration
Components are configured with:
- Style: "new-york"
- Base color: neutral
- CSS variables enabled
- RSC and TypeScript enabled
- Icon library: lucide-react
- Custom registry: `@magicui` available at https://magicui.design/r/{name}.json

When adding new shadcn/ui components, they will be installed to `components/ui/` using the configured aliases.

### Supabase Architecture

#### Client Creation Patterns
The project implements three distinct Supabase client patterns:

1. **Browser Client** (`lib/client.ts`):
   - Use in Client Components
   - Created via `createBrowserClient()`
   - Accesses environment variables: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY`

2. **Server Client** (`lib/server.ts`):
   - Use in Server Components and Server Actions
   - Created via `createServerClient()` with Next.js cookies integration
   - **IMPORTANT**: Always create a new client within each function (do not use global variables for Fluid compute compatibility)
   - Handles cookie management for session persistence

3. **Middleware Client** (`lib/middleware.ts`):
   - Specialized client for Next.js middleware
   - Manages session refresh and authentication state
   - **CRITICAL**: Must call `supabase.auth.getClaims()` immediately after client creation to prevent random logouts

#### Authentication Flow
- Middleware (`middleware.ts`) runs on all routes except static files and images
- Unauthenticated users are redirected to `/auth/login` (except for routes starting with `/auth`)
- Authentication pages include: login, sign-up, sign-up-success, forgot-password, update-password, and error
- Protected routes live under `/protected/` directory

#### Environment Variables
Required Supabase environment variables (stored in `.env.local`):
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY` - Supabase anonymous/public key

## TypeScript Configuration
- Target: ES2017
- Strict mode enabled
- Module resolution: bundler
- JSX preserved (handled by Next.js)
- Incremental builds enabled
