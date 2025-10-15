"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { navigationLinks } from "@/lib/constants/navigation"

interface MobileNavProps {
  onLinkClick?: () => void
}

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
