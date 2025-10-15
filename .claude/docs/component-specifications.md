# Component Specifications

**Project**: SaaS Landing Page Components
**Framework**: Next.js 15.5.5 + React 19
**Style Guide**: shadcn/ui New York variant

## Component Architecture Overview

All components follow these principles:
- Server Components by default
- 'use client' only when necessary (state, events, browser APIs)
- TypeScript with proper typing
- Accessible HTML semantics
- Responsive design first
- Dark mode support built-in

## 1. Header Component

**File**: `app/(marketing)/_components/header.tsx`
**Type**: Client Component ('use client' required for state)

### Props
```typescript
interface HeaderProps {
  className?: string
}
```

### Features
- Fixed positioning with backdrop blur
- Desktop horizontal navigation
- Mobile hamburger menu
- Theme toggle integration
- Auth buttons (Login/Sign Up)
- Smooth scroll to anchor links

### Structure
```tsx
<header className="sticky top-0 z-50 w-full border-b glass">
  <div className="container flex h-16 items-center justify-between">
    {/* Logo */}
    <Link href="/" className="flex items-center space-x-2">
      <Logo />
      <span>Magic UI</span>
    </Link>

    {/* Desktop Navigation */}
    <NavigationMenu className="hidden lg:flex">
      {navigationLinks.map((link) => (
        <NavigationMenuItem key={link.href}>
          <Link href={link.href}>{link.name}</Link>
        </NavigationMenuItem>
      ))}
    </NavigationMenu>

    {/* Right side: Auth + Theme */}
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <Button variant="ghost" asChild>
        <Link href="/auth/login">Login</Link>
      </Button>
      <Button asChild>
        <Link href="/auth/sign-up">Sign Up</Link>
      </Button>

      {/* Mobile menu trigger */}
      <Sheet>
        <SheetTrigger asChild className="lg:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <MobileNav />
        </SheetContent>
      </Sheet>
    </div>
  </div>
</header>
```

### Styling
```typescript
const headerStyles = {
  glass: "backdrop-blur-sm bg-background/80 border-b",
  container: "container flex h-16 items-center justify-between",
  logo: "flex items-center space-x-2 font-bold text-xl",
  nav: "hidden lg:flex gap-6",
  actions: "flex items-center gap-2",
}
```

### State
```typescript
const [isScrolled, setIsScrolled] = useState(false)

useEffect(() => {
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 10)
  }
  window.addEventListener('scroll', handleScroll)
  return () => window.removeEventListener('scroll', handleScroll)
}, [])
```

### Dependencies
- `@/components/ui/navigation-menu`
- `@/components/ui/button`
- `@/components/ui/sheet`
- `@/components/theme/theme-toggle`
- `@/lib/constants/navigation`
- `lucide-react` (Menu icon)
- `next/link`

---

## 2. Theme Toggle Component

**File**: `components/theme/theme-toggle.tsx`
**Type**: Client Component

### Props
```typescript
interface ThemeToggleProps {
  className?: string
}
```

### Features
- Toggle between light/dark themes
- Animated icon transition
- Persist preference
- Accessible button

### Structure
```tsx
'use client'

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={className}
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
```

### Dependencies
- `next-themes` package
- `@/components/ui/button`
- `lucide-react`

### Setup Required
Install and configure next-themes:
```bash
npm install next-themes
```

Add ThemeProvider to root layout:
```tsx
// app/layout.tsx
import { ThemeProvider } from "next-themes"

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

---

## 3. Mobile Navigation Component

**File**: `components/layout/mobile-nav.tsx`
**Type**: Client Component

### Props
```typescript
interface MobileNavProps {
  onLinkClick?: () => void
}
```

### Structure
```tsx
'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { navigationLinks } from "@/lib/constants/navigation"

export function MobileNav({ onLinkClick }: MobileNavProps) {
  return (
    <div className="flex flex-col space-y-4 mt-8">
      {navigationLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={onLinkClick}
          className="text-lg font-medium hover:text-primary transition-colors"
        >
          {link.name}
        </Link>
      ))}

      <Separator className="my-4" />

      <div className="flex flex-col space-y-2">
        <Button variant="ghost" asChild>
          <Link href="/auth/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/auth/sign-up">Sign Up</Link>
        </Button>
      </div>
    </div>
  )
}
```

---

## 4. Hero Section Component

**File**: `app/(marketing)/_components/hero-section.tsx`
**Type**: Server Component

### Features
- Large headline with gradient
- Supporting text
- Primary CTA button
- Background pattern
- Hero image
- Centered layout

### Structure
```tsx
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShimmerButton } from "@/components/magicui/shimmer-button"
import { DotPattern } from "@/components/magicui/dot-pattern"
import { cn } from "@/lib/utils"

export default function HeroSection() {
  return (
    <section className="relative section overflow-hidden">
      {/* Background Pattern */}
      <DotPattern
        className={cn(
          "absolute inset-0 -z-10",
          "[mask-image:radial-gradient(ellipse_at_center,white,transparent)]"
        )}
      />

      <div className="container flex flex-col items-center text-center">
        {/* Optional badge */}
        <div className="mb-8">
          <Badge variant="secondary">
            🎉 Announcing our new feature
          </Badge>
        </div>

        {/* Headline */}
        <h1 className="heading-xl text-balance mb-6 max-w-4xl">
          Magic UI is the new way to{" "}
          <span className="text-gradient">build landing pages</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl text-balance">
          Create beautiful, high-converting landing pages in minutes with our
          collection of pre-built components and templates.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <ShimmerButton className="shadow-2xl" asChild>
            <Link href="/auth/sign-up">
              Get Started for Free
            </Link>
          </ShimmerButton>
          <Button variant="outline" size="lg" asChild>
            <Link href="#features">
              Learn More
            </Link>
          </Button>
        </div>

        {/* Hero Image */}
        <div className="relative w-full max-w-5xl">
          <div className="relative aspect-[16/9] rounded-xl overflow-hidden border shadow-2xl">
            <Image
              src="/hero-light.png"
              alt="Dashboard preview"
              fill
              className="object-cover dark:hidden"
              priority
            />
            <Image
              src="/hero-dark.png"
              alt="Dashboard preview"
              fill
              className="object-cover hidden dark:block"
              priority
            />
          </div>
          {/* Gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
        </div>
      </div>
    </section>
  )
}
```

### Responsive Behavior
- Headline: `text-4xl → text-6xl`
- Buttons: Stack vertically on mobile, horizontal on desktop
- Image: Full width with max-width constraint
- Padding: `py-20 → py-32`

---

## 5. Logo Cloud Component

**File**: `app/(marketing)/_components/logo-cloud.tsx`
**Type**: Server Component

### Features
- Infinite scroll animation
- Grayscale with hover color
- Pause on hover
- Responsive sizing

### Structure
```tsx
import Image from "next/image"
import { Marquee } from "@/components/magicui/marquee"
import { companies } from "@/lib/constants/companies"

export default function LogoCloud() {
  return (
    <section className="section-sm border-y bg-muted/50">
      <div className="container">
        <p className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-wider">
          Trusted by leading companies worldwide
        </p>

        <Marquee pauseOnHover className="[--duration:40s]">
          {companies.map((company) => (
            <div
              key={company.name}
              className="mx-8 grayscale hover:grayscale-0 transition-all"
            >
              <Image
                src={company.logo}
                alt={company.name}
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  )
}
```

### Alternative: Dual Marquee
For more visual interest, add two rows with opposite directions:
```tsx
<div className="space-y-8">
  <Marquee pauseOnHover className="[--duration:40s]">
    {/* First row */}
  </Marquee>
  <Marquee pauseOnHover reverse className="[--duration:40s]">
    {/* Second row - reverse direction */}
  </Marquee>
</div>
```

---

## 6. Features Section Component

**File**: `app/(marketing)/_components/features-section.tsx`
**Type**: Server Component

### Features
- Grid layout
- Icon + title + description cards
- Responsive columns
- Hover effects

### Structure
```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { features } from "@/lib/constants/features"

export default function FeaturesSection() {
  return (
    <section id="features" className="section">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="heading-lg mb-4">
            Everything you need to succeed
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features to help you build, launch, and grow your
            business faster than ever before.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                className="relative overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
```

### Grid Behavior
- Mobile: 1 column
- Tablet (md): 2 columns
- Desktop (lg): 3 columns

---

## 7. Pricing Section Component

**File**: `app/(marketing)/_components/pricing-section.tsx`
**Type**: Server Component

### Features
- 4 pricing tiers
- Feature comparison
- Popular badge
- Border beam on featured
- Responsive grid

### Structure
```tsx
import { Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BorderBeam } from "@/components/magicui/border-beam"
import { pricingTiers } from "@/lib/constants/pricing"
import { cn } from "@/lib/utils"

export default function PricingSection() {
  return (
    <section id="pricing" className="section bg-muted/50">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="heading-lg mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that's right for you. All plans include a 7-day
            free trial.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid gap-8 lg:grid-cols-4 md:grid-cols-2">
          {pricingTiers.map((tier, index) => (
            <Card
              key={index}
              className={cn(
                "relative flex flex-col",
                tier.featured && "border-primary shadow-lg scale-105"
              )}
            >
              {tier.featured && <BorderBeam />}

              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="shadow-sm">Most Popular</Badge>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                {/* Price */}
                <div className="mb-8">
                  <span className="text-4xl font-bold">${tier.price}</span>
                  <span className="text-muted-foreground">/{tier.period}</span>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={tier.featured ? "default" : "outline"}
                  size="lg"
                >
                  {tier.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Enterprise note */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Need a custom plan?{" "}
          <a href="/contact" className="text-primary hover:underline">
            Contact our sales team
          </a>
        </p>
      </div>
    </section>
  )
}
```

### Card States
- Default: `border` styling
- Popular: Badge at top
- Featured: `border-primary`, `scale-105`, `BorderBeam`

---

## 8. CTA Section Component

**File**: `app/(marketing)/_components/cta-section.tsx`
**Type**: Server Component

### Features
- Final conversion section
- Contrasting background
- Large CTA button
- Simple, focused message

### Structure
```tsx
import Link from "next/link"
import { ShimmerButton } from "@/components/magicui/shimmer-button"

export default function CTASection() {
  return (
    <section className="section border-y bg-muted/50">
      <div className="container text-center">
        <h2 className="heading-lg mb-4">
          Ready to get started?
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Join thousands of teams already using Magic UI to build better
          landing pages. Start your 7-day free trial today.
        </p>
        <ShimmerButton size="lg" asChild className="shadow-2xl">
          <Link href="/auth/sign-up">
            Start Free Trial
          </Link>
        </ShimmerButton>
        <p className="text-sm text-muted-foreground mt-4">
          No credit card required · Cancel anytime
        </p>
      </div>
    </section>
  )
}
```

---

## 9. Footer Component

**File**: `app/(marketing)/_components/footer.tsx`
**Type**: Server Component

### Features
- Multi-column link sections
- Social media icons
- Copyright notice
- Responsive grid

### Structure
```tsx
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Github, Twitter, MessageSquare } from "lucide-react"
import { footerLinks, socialLinks } from "@/lib/constants/navigation"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-16">
        <div className="grid gap-8 lg:grid-cols-5 md:grid-cols-3">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="font-bold text-xl">Magic UI</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs mb-6">
              Build beautiful, high-converting landing pages in minutes with
              our component library.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              <Link
                href="https://twitter.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="https://github.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="/discord"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Discord"
              >
                <MessageSquare className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Magic UI. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with ❤️ using Next.js and shadcn/ui
          </p>
        </div>
      </div>
    </footer>
  )
}
```

### Grid Behavior
- Desktop (lg): 5 columns (2 for brand + 3 for links)
- Tablet (md): 3 columns
- Mobile: 1 column (stack)

---

## 10. Marketing Layout Component

**File**: `app/(marketing)/layout.tsx`
**Type**: Server Component

### Purpose
Wraps all marketing pages with header and footer

### Structure
```tsx
import type { Metadata } from "next"
import Header from "./_components/header"
import Footer from "./_components/footer"

export const metadata: Metadata = {
  title: {
    default: "Magic UI - Build beautiful landing pages",
    template: "%s | Magic UI",
  },
  description:
    "Create stunning, high-converting landing pages in minutes with our collection of pre-built components and templates.",
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
```

---

## Component Dependencies Summary

### shadcn/ui Components Required
- ✅ button (already installed)
- ✅ card (already installed)
- ✅ input (already installed)
- ✅ label (already installed)
- navigation-menu
- separator
- badge
- sheet
- switch

### Magic UI Components Required
- marquee
- shimmer-button
- dot-pattern
- border-beam
- animated-shiny-text (optional)

### Additional Dependencies
- next-themes
- lucide-react (already installed)
- next/image (built-in)
- next/link (built-in)

### Installation Commands
```bash
# shadcn components
npx shadcn@latest add navigation-menu separator badge sheet switch

# Magic UI components
npx shadcn@latest add @magicui/marquee
npx shadcn@latest add @magicui/shimmer-button
npx shadcn@latest add @magicui/dot-pattern
npx shadcn@latest add @magicui/border-beam

# Additional package
npm install next-themes
```

---

## Accessibility Checklist

For each component:
- [ ] Semantic HTML elements
- [ ] ARIA labels where needed
- [ ] Keyboard navigation support
- [ ] Focus indicators visible
- [ ] Color contrast meets WCAG AA
- [ ] Screen reader tested
- [ ] Alt text for images
- [ ] Skip links implemented
- [ ] Form labels properly associated
- [ ] Interactive elements large enough (44x44px minimum)

---

## Performance Checklist

For each component:
- [ ] Images optimized (Next.js Image component)
- [ ] Lazy loading for below-fold content
- [ ] Bundle size checked
- [ ] No layout shift
- [ ] Critical CSS inline
- [ ] Fonts preloaded
- [ ] Server Components used where possible
- [ ] Client Components minimized
- [ ] No unnecessary re-renders
- [ ] Proper code splitting

---

## Testing Checklist

For each component:
- [ ] Renders correctly in isolation
- [ ] Works in light mode
- [ ] Works in dark mode
- [ ] Responsive on mobile (320px)
- [ ] Responsive on tablet (768px)
- [ ] Responsive on desktop (1024px+)
- [ ] Hover states work
- [ ] Focus states work
- [ ] Click handlers work
- [ ] No console errors
- [ ] TypeScript types correct
- [ ] Accessible with keyboard
- [ ] Screen reader friendly
