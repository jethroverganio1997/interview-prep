## Overview
Establish a reusable empty-state experience grounded in shadcn/ui’s `Empty` pattern so the product can present consistent “no data” messaging across dashboard search, saved lists, and future modules. The plan evaluates the registry component, maps it to current design tokens, and outlines integration steps for Next.js 15 server/client boundaries.

## Files
- `components/ui/empty.tsx` — Import the shadcn `Empty` primitive (and its subcomponents) for shared usage.
- `components/empty-state.tsx` — Compose an app-specific wrapper that applies default iconography, copy slots, and responsive layout tokens.
- `app/dashboard/_components/job-feed.tsx` — Replace custom empty markup with the new component, preserving conditional messaging for search vs. saved filters.
- `app/dashboard/page.tsx` — Ensure initial server-rendered fallback references the shared empty state (if necessary after refactor).
- `app/auth/*` (optional) — Audit auth flows for inline empty placeholders and align them with the shared wrapper where appropriate.
- `.agent/system/architecture-overview.md` — Document the shared empty-state pattern for future discoverability once implemented.

## Implementation
- **Component intake**
  - Run `pnpm dlx shadcn@latest add empty` (post-approval) to scaffold `components/ui/empty.tsx` alongside registry styles. Confirm imports rely on the local `cn` utility and maintain slot data attributes for testing/a11y.
  - Review shadcn MCP artifacts (`list_components`, `get_component_demo`, `get_component`) to ensure all subcomponents (`EmptyHeader`, `EmptyContent`, `EmptyMedia`, etc.) are available and typed.
- **Wrapper composition (`components/empty-state.tsx`)**
  - Export a typed `EmptyState` component accepting:
    ```ts
    interface EmptyStateProps {
      icon?: React.ReactNode;
      title: string;
      description?: React.ReactNode;
      actions?: React.ReactNode;
      footerLink?: { href: string; label: string; external?: boolean };
      className?: string;
    }
    ```
  - Use the shadcn primitives to compose header/content/footer with sensible defaults (e.g., muted icon container, text-sm description, optional CTA stack). Provide responsive spacing using Tailwind tokens (`gap-6`, `md:gap-8`, `p-6`, `md:p-10`) and ensure 44px touch targets.
  - Support light/dark themes via existing Tailwind variables (`bg-muted`, `text-muted-foreground`) and allow prop overrides with `cn()`.
  - Ensure focus management: Links inside the component should inherit standard focus-visible styles; supply `aria-live="polite"` on the outer wrapper when the empty state represents dynamic content updates (e.g., after search).
- **Job feed integration**
  - Replace the conditional `<div>` empty messages in `app/dashboard/_components/job-feed.tsx` with the new wrapper. Pass iconography (e.g., `Inbox` or `Search` from `lucide-react`), title, description, and contextual actions (such as “Reset filters”).
  - Guard saved-only vs. general messaging via props and ensure the existing loading/infinite-scroll flow remains unaffected. Confirm the empty state sits above the intersection observer sentinel to avoid eager fetch loops.
- **Server-rendered fallback**
  - Update `app/dashboard/page.tsx` to render the new component if initial data is empty, maintaining SSR parity with client hydration.
- **Extended reuse (optional)**
  - Identify other no-data scenarios (e.g., upcoming saved jobs page, marketing dashboards) and note quick wins for later adoption.

## Integration
- **Theming & tokens:** Align icon container, typography (`text-lg` title, `text-sm` description), and spacing with existing design language. Validate contrast ratios meet WCAG AA; adjust tokens if necessary.
- **Accessibility:** Ensure the composite announces purpose via semantic structure (`h2` or `p` tags where appropriate) and provides tabbable actions. Add `aria-live` or `role="status"` when the component appears after a state change (e.g., search results).
- **State management:** Document how the empty state interacts with loading and error banners—ensure mutual exclusivity and maintain existing error messaging in job feed.
- **Testing notes:** After implementation, run `pnpm run lint`, unit tests (if hooks introduced), and manual responsive checks across breakpoints. Capture screenshots in both light and dark modes for design sign-off.

## Notes
- No breaking schema changes; work is purely presentational but affects perceived UX.
- Consider lazy-loading heavy iconography if assets grow beyond simple SVGs.
- Coordinate with future virtualized lists to ensure the empty component does not conflict with virtualization placeholders (wrap with `aria-hidden` if needed for offscreen rendering).

## Implementation Summary
- Added shadcn-aligned primitives in `components/ui/empty.tsx`, exposing `Empty`, `EmptyHeader`, `EmptyContent`, `EmptyMedia`, `EmptyTitle`, and `EmptyDescription`.
- Built a reusable `components/empty-state.tsx` wrapper that encapsulates icons, messaging, actions, and optional footer links with accessible defaults.
- Replaced custom dashboard empty markup with the shared component, wiring contextual titles, descriptions, and clear/search actions while preserving infinite-scroll behavior.

## Validation Notes
- `npm run lint` (passes with pre-existing warnings in `components/magic/particles.tsx`).
- Manual QA recommended: verify empty states across scenarios (no jobs, search mismatch, saved-only) in both light/dark themes and responsive breakpoints.
