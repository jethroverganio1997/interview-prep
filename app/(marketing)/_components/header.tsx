"use client";

import * as React from "react";
import Link from "next/link";
import { AlignJustify, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const menuItems = [
  {
    id: 1,
    label: "Features",
    href: "#",
  },
  {
    id: 2,
    label: "Pricing",
    href: "#",
  },
  {
    id: 3,
    label: "Careers",
    href: "#",
  },
  {
    id: 4,
    label: "Contact Us",
    href: "#",
  },
];

export default function Header() {
  const [hamburgerMenuIsOpen, setHamburgerMenuIsOpen] = React.useState(false);

  React.useEffect(() => {
    const html = document.querySelector("html");
    if (html) {
      if (hamburgerMenuIsOpen) {
        html.classList.add("overflow-hidden");
      } else {
        html.classList.remove("overflow-hidden");
      }
    }
  }, [hamburgerMenuIsOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl">
            Magic UI
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center space-x-6">
            <ThemeToggle />
            <Link
              className="text-sm font-medium transition-colors hover:text-primary"
              href="/auth/login"
            >
              Log in
            </Link>
            <Button variant="outline" className="text-sm" asChild>
              <Link href="/auth/sign-up">Sign up</Link>
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="flex items-center space-x-2 lg:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              <Link href="/auth/login">Sign up</Link>
            </Button>
            <Button variant="outline" className="text-sm" asChild>
              <Link href="/auth/sign-up">Sign up</Link>
            </Button>
            <button
              onClick={() => setHamburgerMenuIsOpen(!hamburgerMenuIsOpen)}
              className="ml-2 p-2 rounded-md hover:bg-accent transition-colors"
            >
              <span className="sr-only">Toggle menu</span>
              {hamburgerMenuIsOpen ? (
                <X strokeWidth={1.4} className="h-5 w-5" />
              ) : (
                <AlignJustify strokeWidth={1.4} className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      <nav
        className={`fixed left-0 top-0 z-50 h-screen w-full overflow-auto transition-all duration-300 ${
          hamburgerMenuIsOpen
            ? "pointer-events-auto bg-background/70 backdrop-blur-md"
            : "pointer-events-none"
        }`}
      >
        {hamburgerMenuIsOpen && (
          <>
            <div className="container  px-4 flex h-16 items-center justify-between">
              <Link className="font-bold text-xl" href="/">
                Magic UI
              </Link>

              <button
                className="lg:hidden ml-2 p-2 rounded-md hover:bg-accent transition-colors"
                onClick={() => setHamburgerMenuIsOpen(false)}
              >
                <span className="sr-only">Toggle menu</span>
                <X strokeWidth={1.4} className="text-gray-300 h-5 w-5" />
              </button>
            </div>
            <ul className="flex flex-col uppercase lg:flex-row lg:items-center lg:normal-case">
              {menuItems.map((item) => (
                <li
                  key={item.id}
                  className="border-b border-grey-dark p-4 lg:border-none"
                >
                  <Link
                    className="hover:text-primary flex h-[var(--navigation-height)] w-full items-center text-xl transition-[color,transform] duration-300 lg:translate-y-0 lg:text-sm md:transition-colors"
                    href={item.href}
                    onClick={() => setHamburgerMenuIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>
    </>
  );
}
