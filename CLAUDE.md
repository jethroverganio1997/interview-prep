# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 15.5.5 SaaS application using the App Router architecture with TypeScript, React 19, and Tailwind CSS 4. The project is configured with shadcn/ui components (New York style) and uses Turbopack for development and builds.

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

### Directory Structure
- `app/` - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with Geist font configuration
  - `page.tsx` - Home page
  - `globals.css` - Global styles with Tailwind and theme configuration
- `lib/` - Utility functions
  - `utils.ts` - Contains `cn()` helper for className merging
- `components/` - React components (not yet created, but aliased)
  - `ui/` - shadcn/ui components will be added here

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

When adding new shadcn/ui components, they will be installed to `components/ui/` using the configured aliases.

## TypeScript Configuration
- Target: ES2017
- Strict mode enabled
- Module resolution: bundler
- JSX preserved (handled by Next.js)
- Incremental builds enabled
