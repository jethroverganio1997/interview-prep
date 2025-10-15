# Landing Page Documentation

This directory contains comprehensive documentation for implementing the SaaS landing page based on the Magic UI template (https://startup-template-sage.vercel.app/).

## Documentation Files

### 1. [landing-page-analysis.md](./landing-page-analysis.md)
**Complete analysis of the target landing page**

This document provides:
- Page structure breakdown
- Design system analysis
- Component mapping to shadcn/ui and Magic UI
- Responsive design patterns
- Animation & interaction patterns
- Accessibility considerations
- Performance optimizations
- Content structure requirements

**Use this to**: Understand what needs to be built and why certain components were chosen.

---

### 2. [implementation-plan.md](./implementation-plan.md)
**Step-by-step implementation roadmap**

This document provides:
- 12 phased implementation approach
- Detailed time estimates for each phase
- Installation commands for all dependencies
- Directory structure setup
- Data configuration patterns
- Testing and optimization strategies
- Complete implementation checklist

**Use this to**: Follow a structured approach to building the landing page from start to finish.

**Phases Overview**:
1. Foundation & Dependencies (30 min)
2. Core Layout Components (45 min)
3. Hero Section (30 min)
4. Trust/Logo Section (20 min)
5. Features Section (30 min)
6. Pricing Section (45 min)
7. CTA Section (15 min)
8. Main Landing Page Assembly (20 min)
9. Data Configuration (30 min)
10. Styling & Polish (45 min)
11. Optimization (30 min)
12. Testing & Refinement (30 min)

**Total Estimated Time**: 6-7 hours

---

### 3. [component-specifications.md](./component-specifications.md)
**Detailed technical specifications for each component**

This document provides:
- Complete TypeScript interfaces for all components
- Full component code structures
- Props and state management patterns
- Dependencies for each component
- Styling approaches
- Accessibility checklist
- Performance checklist
- Testing checklist

**Use this to**: Reference exact implementation details when building each component.

**Components Specified**:
1. Header Component
2. Theme Toggle Component
3. Mobile Navigation Component
4. Hero Section Component
5. Logo Cloud Component
6. Features Section Component
7. Pricing Section Component
8. CTA Section Component
9. Footer Component
10. Marketing Layout Component

---

## Quick Start Guide

### Prerequisites
- Next.js 15.5.5 project (already set up)
- Node.js and npm installed
- shadcn/ui configured (already done)

### Installation Commands

```bash
# 1. Install required shadcn/ui components
npx shadcn@latest add navigation-menu separator badge sheet switch

# 2. Install Magic UI components
npx shadcn@latest add @magicui/marquee
npx shadcn@latest add @magicui/shimmer-button
npx shadcn@latest add @magicui/dot-pattern
npx shadcn@latest add @magicui/border-beam

# 3. Install additional dependencies
npm install next-themes
```

### Implementation Order

Follow this order for best results:

1. **Start with Foundation**
   - Install all dependencies
   - Set up directory structure
   - Create data configuration files

2. **Build Layout First**
   - Marketing layout wrapper
   - Header component
   - Footer component
   - Theme toggle

3. **Build Sections Top to Bottom**
   - Hero section
   - Logo cloud
   - Features section
   - Pricing section
   - CTA section

4. **Polish and Optimize**
   - Add animations
   - Test responsiveness
   - Optimize performance
   - Accessibility audit

---

## Project Structure

The implementation will create the following structure:

```
app/
├── (marketing)/                    # Route group for marketing pages
│   ├── layout.tsx                 # Marketing layout with header/footer
│   ├── page.tsx                   # Landing page (root)
│   └── _components/               # Landing page components (private)
│       ├── header.tsx            # Site header
│       ├── hero-section.tsx      # Hero section
│       ├── logo-cloud.tsx        # Company logos marquee
│       ├── features-section.tsx  # Features grid
│       ├── pricing-section.tsx   # Pricing tiers
│       ├── cta-section.tsx       # Final CTA
│       └── footer.tsx            # Site footer
│
components/
├── ui/                            # shadcn/ui components
├── magicui/                       # Magic UI components
├── theme/                         # Theme components
│   └── theme-toggle.tsx          # Dark/light mode toggle
└── layout/                        # Shared layout components
    └── mobile-nav.tsx            # Mobile navigation drawer
│
lib/
├── constants/                     # Data and configuration
│   ├── navigation.ts             # Nav and footer links
│   ├── features.ts               # Features data
│   ├── pricing.ts                # Pricing tiers data
│   └── companies.ts              # Company logos data
└── utils.ts                       # Utility functions
```

---

## Component Dependencies

### shadcn/ui Components
Already installed:
- ✅ button
- ✅ card
- ✅ input
- ✅ label

Need to install:
- navigation-menu
- separator
- badge
- sheet
- switch

### Magic UI Components
Need to install:
- marquee
- shimmer-button
- dot-pattern
- border-beam

### npm Packages
- next-themes (for theme switching)

---

## Key Features

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Adaptive layouts for all sections
- Mobile navigation drawer

### Dark Mode Support
- Class-based dark mode (`.dark`)
- Theme toggle component
- Persistent theme preference
- Dual images for hero section

### Performance
- Server Components by default
- Client Components only when necessary
- Next.js Image optimization
- Lazy loading for below-fold content

### Accessibility
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus indicators
- Screen reader support

### Animations
- Shimmer buttons for CTAs
- Marquee for logo carousel
- Border beam for featured pricing
- Dot pattern backgrounds
- Smooth scroll behavior

---

## Development Workflow

### Recommended Approach

1. **Read the Analysis** (`landing-page-analysis.md`)
   - Understand the overall structure
   - Review component mapping
   - Note design patterns

2. **Follow the Plan** (`implementation-plan.md`)
   - Work through phases sequentially
   - Don't skip ahead
   - Test as you go

3. **Reference Specifications** (`component-specifications.md`)
   - Copy component code structures
   - Verify props and types
   - Check dependencies

4. **Test Continuously**
   - Test in light and dark mode
   - Test on different screen sizes
   - Verify keyboard navigation
   - Check console for errors

5. **Optimize Before Deploying**
   - Run Lighthouse audit
   - Check bundle size
   - Optimize images
   - Verify accessibility

---

## Configuration Files to Create

### 1. Navigation Configuration
**File**: `lib/constants/navigation.ts`
- Nav links (Features, Pricing, Careers, Contact)
- Footer links (Product, Community, Legal)
- Social media links

### 2. Features Data
**File**: `lib/constants/features.ts`
- 6 feature items
- Each with icon, title, description

### 3. Pricing Data
**File**: `lib/constants/pricing.ts`
- 4 pricing tiers (Basic, Premium, Enterprise, Ultimate)
- Each with name, price, features, CTA

### 4. Company Logos
**File**: `lib/constants/companies.ts`
- 6-10 company logos
- Name and logo path for each

---

## Styling Approach

### Tailwind CSS v4
The project uses Tailwind CSS v4 with:
- CSS variables for theming
- Custom utility classes
- OKLCH color space
- Class-based dark mode

### Custom Utilities
Add these to `app/globals.css`:
```css
.section { @apply py-20 lg:py-32; }
.heading-xl { @apply text-4xl font-bold lg:text-6xl; }
.heading-lg { @apply text-3xl font-bold lg:text-5xl; }
.glass { @apply backdrop-blur-sm bg-background/80; }
```

---

## Common Issues & Solutions

### Issue: Components not found
**Solution**: Ensure all shadcn/ui and Magic UI components are installed

### Issue: Theme toggle not working
**Solution**:
1. Install `next-themes`
2. Add `ThemeProvider` to root layout
3. Add `suppressHydrationWarning` to `<html>` tag

### Issue: Images not displaying
**Solution**:
1. Use Next.js `Image` component
2. Add images to `public/` directory
3. Provide proper width/height or fill prop

### Issue: Mobile menu not closing
**Solution**: Pass `onLinkClick` handler to close sheet on navigation

### Issue: Layout shift on load
**Solution**:
1. Specify image dimensions
2. Use `priority` for above-fold images
3. Reserve space for dynamic content

---

## Testing Checklist

Before considering the landing page complete:

### Visual Testing
- [ ] Renders correctly in Chrome
- [ ] Renders correctly in Firefox
- [ ] Renders correctly in Safari
- [ ] Works in light mode
- [ ] Works in dark mode

### Responsive Testing
- [ ] Mobile portrait (320px)
- [ ] Mobile landscape (568px)
- [ ] Tablet (768px)
- [ ] Desktop (1024px)
- [ ] Large desktop (1440px)

### Functionality Testing
- [ ] Navigation links work
- [ ] Mobile menu opens/closes
- [ ] Theme toggle works
- [ ] All buttons are clickable
- [ ] Smooth scroll to sections
- [ ] Forms work (if any)

### Performance Testing
- [ ] Lighthouse score > 90
- [ ] First Contentful Paint < 1.5s
- [ ] No console errors
- [ ] Images optimized
- [ ] Bundle size acceptable

### Accessibility Testing
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] ARIA labels present
- [ ] Alt text on images
- [ ] Color contrast passes WCAG AA
- [ ] Screen reader friendly

---

## Resources

### Documentation Links
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Magic UI Documentation](https://magicui.design)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)

### Target Reference
- Live site: https://startup-template-sage.vercel.app/

### Project Files
- Project instructions: `CLAUDE.md` (in project root)
- Configuration: `components.json`
- Styles: `app/globals.css`

---

## Support & Questions

If you encounter issues during implementation:

1. **Check the documentation first**
   - Review component specifications
   - Verify installation steps
   - Check common issues section

2. **Verify your environment**
   - Ensure all dependencies are installed
   - Check Node.js version
   - Verify TypeScript configuration

3. **Test in isolation**
   - Build one component at a time
   - Test each component before moving on
   - Use Storybook if available

4. **Reference the source**
   - Look at the target website
   - Inspect with browser dev tools
   - Check Magic UI examples

---

## Next Steps

Ready to start building? Follow this path:

1. ✅ Read this README (you're here!)
2. 📖 Read `landing-page-analysis.md` for understanding
3. 📋 Follow `implementation-plan.md` step by step
4. 💻 Reference `component-specifications.md` while coding
5. ✅ Use the checklists to verify completion
6. 🚀 Deploy your landing page!

---

**Good luck with your implementation!** 🎉

Remember: Take it one phase at a time, test frequently, and don't hesitate to reference these docs throughout the process.
