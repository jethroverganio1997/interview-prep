# Landing Page Implementation Plan

**Project**: SaaS Landing Page (Magic UI Style)
**Target**: https://startup-template-sage.vercel.app/
**Framework**: Next.js 15.5.5 + App Router
**Timeline**: Phased approach for systematic implementation

## Phase 1: Foundation & Dependencies (30 minutes)

### 1.1 Install Required shadcn/ui Components
```bash
npx shadcn@latest add navigation-menu separator badge sheet switch
```

**Components to install**:
- `navigation-menu` - Header navigation
- `separator` - Visual dividers
- `badge` - Pricing tier highlights
- `sheet` - Mobile drawer menu
- `switch` - Theme toggle control

### 1.2 Install Magic UI Components
```bash
npx shadcn@latest add @magicui/marquee
npx shadcn@latest add @magicui/shimmer-button
npx shadcn@latest add @magicui/animated-shiny-text
npx shadcn@latest add @magicui/dot-pattern
npx shadcn@latest add @magicui/border-beam
```

**Magic UI Components**:
- `marquee` - Logo carousel
- `shimmer-button` - Enhanced CTA buttons
- `animated-shiny-text` - Animated headlines
- `dot-pattern` - Background patterns
- `border-beam` - Card highlights

### 1.3 Project Structure Setup
Create the following directories and files:
```
app/
├── (marketing)/              # Marketing pages group
│   ├── layout.tsx           # Marketing layout with header/footer
│   ├── page.tsx             # Landing page (root)
│   └── _components/         # Landing page specific components
│       ├── header.tsx
│       ├── hero-section.tsx
│       ├── logo-cloud.tsx
│       ├── features-section.tsx
│       ├── pricing-section.tsx
│       ├── cta-section.tsx
│       └── footer.tsx
├── layout.tsx               # Root layout (existing)
└── globals.css              # Global styles (existing)

components/
├── ui/                      # shadcn components
├── theme/                   # Theme-related components
│   └── theme-toggle.tsx
└── layout/                  # Shared layout components
    └── mobile-nav.tsx

lib/
├── constants/               # Constants and config
│   ├── navigation.ts        # Nav links configuration
│   ├── features.ts          # Features data
│   └── pricing.ts           # Pricing tiers data
└── utils.ts                 # Existing utilities
```

## Phase 2: Core Layout Components (45 minutes)

### 2.1 Create Marketing Layout
**File**: `app/(marketing)/layout.tsx`

**Purpose**: Shared layout for all marketing pages
- Wraps header and footer around content
- Handles layout-level styling
- Server Component

**Key features**:
- Header component integration
- Footer component integration
- Main content area with proper spacing
- SEO metadata

### 2.2 Build Header Component
**File**: `app/(marketing)/_components/header.tsx`

**Components used**:
- `navigation-menu` from @shadcn
- `button` (existing)
- `sheet` for mobile menu
- Custom `theme-toggle`

**Features**:
- Fixed/sticky positioning
- Logo/brand area
- Desktop navigation menu
- Mobile hamburger menu
- Auth buttons (Login/Sign Up)
- Theme toggle
- Transparent background with backdrop blur
- Responsive breakpoints (lg+)

**State management**:
- Mobile menu open/close state
- Scroll position for header style changes

### 2.3 Build Theme Toggle
**File**: `components/theme/theme-toggle.tsx`

**Components used**:
- `switch` from @shadcn
- `lucide-react` icons (Moon, Sun)

**Implementation**:
- Use Next.js `next-themes` package
- Client Component with 'use client'
- Toggle between light/dark themes
- Persist preference in localStorage
- Animated icon transition

### 2.4 Create Mobile Navigation
**File**: `components/layout/mobile-nav.tsx`

**Components used**:
- `sheet` from @shadcn
- `button` from @shadcn

**Features**:
- Slide-in drawer from right
- Full navigation links
- Auth buttons
- Close button
- Overlay backdrop

### 2.5 Build Footer Component
**File**: `app/(marketing)/_components/footer.tsx`

**Features**:
- Multi-column grid layout (4 columns on desktop)
- Link sections: Product, Community, Legal
- Social media icons (Lucide icons)
- Copyright text
- Separator at top
- Responsive: 4 cols → 2 cols → 1 col

## Phase 3: Hero Section (30 minutes)

### 3.1 Create Hero Section Component
**File**: `app/(marketing)/_components/hero-section.tsx`

**Components used**:
- `shimmer-button` or `button` from @shadcn
- `animated-shiny-text` from @magicui (optional)
- `dot-pattern` from @magicui (background)

**Layout structure**:
```tsx
<section className="relative">
  {/* Background pattern */}
  <DotPattern />

  {/* Content container */}
  <div className="container">
    {/* Badge/announcement (optional) */}
    <Badge />

    {/* Main headline */}
    <h1>Magic UI is the new way to build landing pages</h1>

    {/* Subheadline */}
    <p>Supporting text with value proposition</p>

    {/* CTA */}
    <ShimmerButton>Get Started for Free</ShimmerButton>

    {/* Hero image/visual */}
    <div className="hero-image">
      <Image />
    </div>
  </div>
</section>
```

**Key features**:
- Centered text alignment
- Generous vertical padding
- Responsive text sizes
- Primary CTA button
- Optional decorative background pattern
- Hero image with dark/light mode support

**Styling considerations**:
- `text-balance` for headlines
- Gradient text effects (optional)
- Z-index layering for pattern overlay

## Phase 4: Trust/Logo Section (20 minutes)

### 4.1 Create Logo Cloud Component
**File**: `app/(marketing)/_components/logo-cloud.tsx`

**Components used**:
- `marquee` from @magicui

**Implementation approach**:
```tsx
<section>
  <div className="container">
    <p className="text-center">Trusted by leading companies</p>

    <Marquee pauseOnHover className="[--duration:20s]">
      {companies.map((company) => (
        <Image
          key={company.name}
          src={company.logo}
          alt={company.name}
          width={120}
          height={40}
        />
      ))}
    </Marquee>
  </div>
</section>
```

**Features**:
- Infinite scroll animation
- Pause on hover
- Grayscale logos with hover color
- Responsive logo sizing
- Multiple rows (optional)

**Data structure** (`lib/constants/companies.ts`):
```ts
export const companies = [
  { name: "Company 1", logo: "/logos/company1.svg" },
  // ... more companies
]
```

## Phase 5: Features Section (30 minutes)

### 5.1 Create Features Section Component
**File**: `app/(marketing)/_components/features-section.tsx`

**Components used**:
- `card` from @shadcn (existing)
- Lucide icons

**Layout options**:
1. **Simple Grid Layout**:
   - 3 columns on desktop
   - 2 columns on tablet
   - 1 column on mobile

2. **Bento Grid Layout** (alternative):
   - Asymmetric grid
   - Different sized cards
   - More visual interest

**Feature Card structure**:
```tsx
<Card>
  <CardHeader>
    <Icon className="h-10 w-10" />
    <CardTitle>Feature Title</CardTitle>
  </CardHeader>
  <CardContent>
    <CardDescription>Feature description</CardDescription>
  </CardContent>
</Card>
```

**Data structure** (`lib/constants/features.ts`):
```ts
export const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built for speed and performance"
  },
  // ... more features
]
```

## Phase 6: Pricing Section (45 minutes)

### 6.1 Create Pricing Section Component
**File**: `app/(marketing)/_components/pricing-section.tsx`

**Components used**:
- `card` from @shadcn (existing)
- `badge` from @shadcn
- `button` from @shadcn (existing)
- `border-beam` from @magicui (for featured tier)
- `separator` from @shadcn

**Layout**:
- Grid with 4 columns (responsive)
- Desktop: 4 columns
- Tablet: 2 columns
- Mobile: 1 column (stack)

**Pricing Card structure**:
```tsx
<Card className="relative">
  {/* Featured tier gets border-beam */}
  {tier.featured && <BorderBeam />}

  {/* Popular badge */}
  {tier.popular && <Badge>Most Popular</Badge>}

  <CardHeader>
    <CardTitle>{tier.name}</CardTitle>
    <CardDescription>{tier.description}</CardDescription>
  </CardHeader>

  <CardContent>
    {/* Price */}
    <div className="price">
      <span className="amount">${tier.price}</span>
      <span className="period">/month</span>
    </div>

    {/* Features list */}
    <ul>
      {tier.features.map((feature) => (
        <li>
          <Check className="h-4 w-4" />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  </CardContent>

  <CardFooter>
    <Button variant={tier.featured ? "default" : "outline"}>
      {tier.cta}
    </Button>
  </CardFooter>
</Card>
```

**Data structure** (`lib/constants/pricing.ts`):
```ts
export const pricingTiers = [
  {
    name: "Basic",
    description: "Perfect for getting started",
    price: 9,
    period: "month",
    features: [
      "Feature 1",
      "Feature 2",
      // ...
    ],
    cta: "Get Started",
    popular: false,
    featured: false
  },
  // ... more tiers
]
```

**Styling highlights**:
- Featured tier: elevated, highlighted, border-beam
- Popular badge positioning
- Check icons for features
- Consistent spacing

## Phase 7: CTA Section (15 minutes)

### 7.1 Create Final CTA Component
**File**: `app/(marketing)/_components/cta-section.tsx`

**Components used**:
- `shimmer-button` from @magicui
- Optional background pattern

**Structure**:
```tsx
<section className="bg-muted/50">
  <div className="container text-center">
    <h2>Ready to get started?</h2>
    <p>Start your 7-day free trial today</p>
    <ShimmerButton size="lg">
      Start Free Trial
    </ShimmerButton>
  </div>
</section>
```

**Features**:
- Centered content
- Contrasting background
- Large, prominent CTA button
- Supporting text

## Phase 8: Main Landing Page Assembly (20 minutes)

### 8.1 Update Landing Page
**File**: `app/(marketing)/page.tsx`

**Implementation**:
```tsx
import HeroSection from "./_components/hero-section"
import LogoCloud from "./_components/logo-cloud"
import FeaturesSection from "./_components/features-section"
import PricingSection from "./_components/pricing-section"
import CTASection from "./_components/cta-section"

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <LogoCloud />
      <FeaturesSection />
      <PricingSection />
      <CTASection />
    </>
  )
}
```

**Notes**:
- All sections are Server Components by default
- Layout wrapper handles header/footer
- Each section is self-contained

## Phase 9: Data Configuration (30 minutes)

### 9.1 Create Navigation Configuration
**File**: `lib/constants/navigation.ts`

```ts
export const navigationLinks = [
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "Careers", href: "/careers" },
  { name: "Contact", href: "/contact" },
]

export const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "API", href: "/api" },
    { name: "Changelog", href: "/changelog" },
  ],
  community: [
    { name: "Blog", href: "/blog" },
    { name: "Discord", href: "/discord" },
    { name: "GitHub", href: "https://github.com" },
    { name: "Twitter", href: "https://twitter.com" },
  ],
  legal: [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
    { name: "Security", href: "/security" },
  ],
}

export const socialLinks = [
  { name: "Twitter", href: "https://twitter.com", icon: "Twitter" },
  { name: "GitHub", href: "https://github.com", icon: "Github" },
  { name: "Discord", href: "/discord", icon: "MessageSquare" },
]
```

### 9.2 Create Features Data
**File**: `lib/constants/features.ts`

```ts
import { Zap, Shield, Layers, Clock, Users, Globe } from "lucide-react"

export const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Built with performance in mind. Load times under 100ms guaranteed."
  },
  {
    icon: Shield,
    title: "Secure by Default",
    description: "Enterprise-grade security with automatic SSL and DDoS protection."
  },
  {
    icon: Layers,
    title: "Highly Scalable",
    description: "Scale from zero to millions of users without breaking a sweat."
  },
  {
    icon: Clock,
    title: "99.9% Uptime",
    description: "Industry-leading uptime SLA with automatic failover."
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Work together seamlessly with built-in collaboration tools."
  },
  {
    icon: Globe,
    title: "Global CDN",
    description: "Distributed across 200+ edge locations worldwide."
  },
]
```

### 9.3 Create Pricing Data
**File**: `lib/constants/pricing.ts`

```ts
export const pricingTiers = [
  {
    name: "Basic",
    description: "Perfect for individuals and small projects",
    price: 9,
    period: "month",
    features: [
      "Up to 10 projects",
      "5GB storage",
      "Community support",
      "Basic analytics",
      "99.9% uptime SLA",
    ],
    cta: "Get Started",
    popular: false,
    featured: false,
  },
  {
    name: "Premium",
    description: "Ideal for growing teams and businesses",
    price: 29,
    period: "month",
    features: [
      "Unlimited projects",
      "50GB storage",
      "Priority support",
      "Advanced analytics",
      "99.99% uptime SLA",
      "Custom integrations",
      "API access",
    ],
    cta: "Start Free Trial",
    popular: true,
    featured: true,
  },
  {
    name: "Enterprise",
    description: "For large organizations with custom needs",
    price: 99,
    period: "month",
    features: [
      "Everything in Premium",
      "Unlimited storage",
      "24/7 phone support",
      "Custom analytics",
      "99.999% uptime SLA",
      "Dedicated account manager",
      "SSO & SAML",
      "Custom contracts",
    ],
    cta: "Contact Sales",
    popular: false,
    featured: false,
  },
  {
    name: "Ultimate",
    description: "Maximum power and flexibility",
    price: 299,
    period: "month",
    features: [
      "Everything in Enterprise",
      "White-label solution",
      "On-premise deployment",
      "Custom development",
      "Unlimited API calls",
      "Training & onboarding",
      "Legal review",
    ],
    cta: "Contact Sales",
    popular: false,
    featured: false,
  },
]
```

### 9.4 Create Company Logos Data
**File**: `lib/constants/companies.ts`

```ts
export const companies = [
  { name: "Company 1", logo: "/logos/company1.svg" },
  { name: "Company 2", logo: "/logos/company2.svg" },
  { name: "Company 3", logo: "/logos/company3.svg" },
  { name: "Company 4", logo: "/logos/company4.svg" },
  { name: "Company 5", logo: "/logos/company5.svg" },
  { name: "Company 6", logo: "/logos/company6.svg" },
]
```

## Phase 10: Styling & Polish (45 minutes)

### 10.1 Update Global Styles
**File**: `app/globals.css`

Add custom utility classes:
```css
/* Section spacing */
.section {
  @apply py-20 lg:py-32;
}

.section-sm {
  @apply py-12 lg:py-20;
}

/* Container variations */
.container-narrow {
  @apply container max-w-4xl;
}

/* Text utilities */
.heading-xl {
  @apply text-4xl font-bold tracking-tight lg:text-6xl;
}

.heading-lg {
  @apply text-3xl font-bold tracking-tight lg:text-5xl;
}

.heading-md {
  @apply text-2xl font-bold tracking-tight lg:text-4xl;
}

/* Gradient text */
.text-gradient {
  @apply bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent;
}

/* Glass effect */
.glass {
  @apply backdrop-blur-sm bg-background/80 border border-border/50;
}

/* Smooth scroll */
html {
  scroll-behavior: smooth;
}

/* Focus visible for accessibility */
*:focus-visible {
  @apply outline-none ring-2 ring-ring ring-offset-2 ring-offset-background;
}
```

### 10.2 Add Animation Utilities
```css
/* Fade in animation */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

/* Stagger delays */
.stagger-1 { animation-delay: 0.1s; }
.stagger-2 { animation-delay: 0.2s; }
.stagger-3 { animation-delay: 0.3s; }
.stagger-4 { animation-delay: 0.4s; }
```

### 10.3 Mobile Responsiveness
Test and adjust:
- Header mobile menu behavior
- Section padding on mobile
- Text sizes on small screens
- Grid layouts collapsing properly
- Touch targets (minimum 44x44px)
- Horizontal scrolling prevention

### 10.4 Dark Mode Polish
Verify:
- All components work in both themes
- Border visibility in dark mode
- Text contrast ratios
- Background patterns visibility
- Image variants for theme (if needed)

## Phase 11: Optimization (30 minutes)

### 11.1 Image Optimization
- Add placeholder company logos (or use SVG icons temporarily)
- Optimize hero image
- Add proper alt text
- Use Next.js Image component
- Add loading="lazy" for below-fold images

### 11.2 Performance Checks
```bash
# Build and analyze
npm run build

# Check bundle size
npm run analyze  # if configured
```

Optimization targets:
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1
- Time to Interactive < 3.5s

### 11.3 SEO Setup
**File**: `app/(marketing)/page.tsx`

```tsx
export const metadata = {
  title: "Magic UI - The new way to build landing pages",
  description: "Build beautiful, performant landing pages in minutes with Magic UI components and Next.js",
  openGraph: {
    title: "Magic UI - The new way to build landing pages",
    description: "Build beautiful, performant landing pages in minutes",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Magic UI - The new way to build landing pages",
    description: "Build beautiful, performant landing pages in minutes",
    images: ["/og-image.png"],
  },
}
```

### 11.4 Accessibility Audit
- Run Lighthouse accessibility audit
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Test with screen reader
- Check color contrast ratios
- Add skip-to-content link

## Phase 12: Testing & Refinement (30 minutes)

### 12.1 Browser Testing
Test in:
- Chrome/Edge
- Firefox
- Safari
- Mobile Safari
- Mobile Chrome

### 12.2 Responsive Testing
Test at breakpoints:
- 320px (small mobile)
- 375px (mobile)
- 768px (tablet)
- 1024px (desktop)
- 1440px (large desktop)

### 12.3 Interaction Testing
- Navigation menu works
- Mobile menu opens/closes
- Theme toggle functions
- All links work
- Buttons have proper hover states
- Smooth scroll to sections
- Forms (if added) submit properly

### 12.4 Final Polish
- Fix any visual inconsistencies
- Adjust spacing if needed
- Verify all copy is correct
- Check for console errors
- Validate HTML
- Test with slow network

## Implementation Checklist

### Pre-Implementation
- [ ] Review analysis document
- [ ] Understand component structure
- [ ] Set up development environment
- [ ] Create feature branch

### Phase 1: Foundation
- [ ] Install shadcn components
- [ ] Install Magic UI components
- [ ] Create directory structure
- [ ] Set up constants files

### Phase 2: Layout
- [ ] Create marketing layout
- [ ] Build header component
- [ ] Create theme toggle
- [ ] Build mobile navigation
- [ ] Build footer component

### Phase 3: Content Sections
- [ ] Create hero section
- [ ] Create logo cloud
- [ ] Create features section
- [ ] Create pricing section
- [ ] Create CTA section

### Phase 4: Data & Configuration
- [ ] Configure navigation data
- [ ] Configure features data
- [ ] Configure pricing data
- [ ] Configure company logos

### Phase 5: Assembly
- [ ] Assemble landing page
- [ ] Test all sections render
- [ ] Verify layout wrapping

### Phase 6: Styling
- [ ] Add custom CSS utilities
- [ ] Implement animations
- [ ] Test responsive design
- [ ] Polish dark mode

### Phase 7: Optimization
- [ ] Optimize images
- [ ] Check performance
- [ ] Add SEO metadata
- [ ] Accessibility audit

### Phase 8: Testing
- [ ] Browser testing
- [ ] Responsive testing
- [ ] Interaction testing
- [ ] Final polish

### Post-Implementation
- [ ] Code review
- [ ] Documentation
- [ ] Deployment preparation
- [ ] Performance monitoring setup

## Estimated Total Time: 6-7 hours

Breakdown:
- Foundation & Dependencies: 30 min
- Core Layout: 45 min
- Hero Section: 30 min
- Logo Cloud: 20 min
- Features: 30 min
- Pricing: 45 min
- CTA: 15 min
- Assembly: 20 min
- Data Configuration: 30 min
- Styling & Polish: 45 min
- Optimization: 30 min
- Testing: 30 min
- Buffer: 30 min

## Resources & References

### Documentation Links
- [Next.js App Router](https://nextjs.org/docs/app)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Magic UI Components](https://magicui.design)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)

### Design Reference
- Target site: https://startup-template-sage.vercel.app/

### Project Documentation
- Analysis: `.claude/docs/landing-page-analysis.md`
- Component specs: `.claude/docs/component-specifications.md`

## Notes for Implementation

### Best Practices
1. Start with the layout (header/footer) first
2. Build sections in isolation
3. Test each section before moving on
4. Keep components small and focused
5. Use TypeScript for type safety
6. Leverage Server Components where possible
7. Add 'use client' only when necessary
8. Use semantic HTML
9. Follow accessibility guidelines
10. Optimize as you go

### Common Pitfalls to Avoid
1. Not testing mobile responsiveness early
2. Hardcoding content instead of using data
3. Forgetting to add alt text to images
4. Not considering dark mode from the start
5. Creating overly complex components
6. Not using TypeScript types
7. Ignoring performance implications
8. Poor component naming
9. Inconsistent spacing
10. Not testing with real content

### Tips for Success
1. Follow the phased approach
2. Commit frequently
3. Test in browser often
4. Use the existing color system
5. Leverage existing components first
6. Keep Magic UI animations subtle
7. Prioritize mobile experience
8. Use placeholder content initially
9. Refactor as needed
10. Document as you build
