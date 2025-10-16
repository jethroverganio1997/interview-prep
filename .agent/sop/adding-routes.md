## Purpose
Standardize how we add new routes to the Next.js App Router while preserving shared layout, auth, and styling conventions.

## Steps
1. **Choose a Segment**  
   - Marketing content belongs under `app/(marketing)/`.  
   - Auth flows sit in `app/auth/`.  
   - Auth-protected application pages should live under `app/dashboard/` or a new segment grouped with parentheses if multiple related routes are needed.

2. **Create the Route File**  
   - Add `page.tsx` (server component) or `page.tsx` + supporting client components in `_components/`.  
   - If the page requires client interactivity, wrap child components with `"use client"` rather than marking the page as client.

3. **Hook Up Layout**  
   - Reuse existing layouts where possible (`app/layout.tsx`, `app/(marketing)/layout.tsx`).  
   - For new groups, create a layout to share metadata, navigation, or theming.

4. **Handle Data Access**  
   - Use `createClient` from `@/lib/server` inside server components for Supabase reads.  
   - Validate authentication before returning JSX and redirect unauthenticated users with `redirect("/auth/login")`.

5. **Styling & Components**  
   - Compose UI from `@/components/ui/*` primitives.  
   - Place any new global pieces under `components/<feature>/` and import via absolute aliases.
   - components that are globally use or use by 2 or more route is place in here

6. **Testing**  
   - Run `npm run dev` and manually verify the route, auth guards, and navigation integration.  
   - Document manual test steps in the pull request.

## Checklist
- [ ] Route file created in the correct segment  
- [ ] Auth guard implemented where required  
- [ ] New components stored in `components/<feature>/`  
- [ ] Manual testing performed and recorded
