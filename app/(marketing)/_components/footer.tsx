import Link from "next/link";
import { Github, Twitter, MessageSquare } from "lucide-react";

const footerNavs = [
  {
    label: "Product",
    items: [
      {
        href: "/",
        name: "Email Collection",
      },
      {
        href: "/pricing",
        name: "Pricing",
      },
      {
        href: "/faq",
        name: "FAQ",
      },
    ],
  },
  {
    label: "Community",
    items: [
      {
        href: "/",
        name: "Discord",
      },
      {
        href: "/",
        name: "Twitter",
      },
      {
        href: "mailto:hello@chatcollect.com",
        name: "Email",
      },
    ],
  },
  {
    label: "Legal",
    items: [
      {
        href: "/terms",
        name: "Terms",
      },
      {
        href: "/privacy",
        name: "Privacy",
      },
    ],
  },
];

const footerSocials = [
  {
    href: "https://discord.com",
    name: "Discord",
    icon: MessageSquare,
  },
  {
    href: "https://twitter.com",
    name: "Twitter",
    icon: Twitter,
  },
  {
    href: "https://github.com",
    name: "GitHub",
    icon: Github,
  },
];

export default function Footer() {
  return (
    <footer>
      <div className="mx-auto w-full max-w-screen-xl xl:pb-2">
        <div className="gap-4 p-4 px-8 py-16 sm:pb-16 md:flex md:justify-between">
          <div className="mb-12 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-floor-plan size-8"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" />
                <path d="M9 3v7" />
                <path d="M21 10h-7" />
                <path d="M3 15h9" />
              </svg>
              <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
                Svee UI
              </span>
            </Link>
            <p className="max-w-xs text-muted-foreground">
              UI Library for Design Engineers
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-10">
            {footerNavs.map((nav) => (
              <div key={nav.label}>
                <h2 className="mb-6 text-sm font-medium uppercase tracking-tighter text-foreground">
                  {nav.label}
                </h2>
                <ul className="grid gap-2">
                  {nav.items.map((item, index) => (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="cursor-pointer text-sm font-[450] text-muted-foreground duration-200 hover:text-foreground"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-md border-neutral-700/20 px-8 py-4 sm:flex sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-5 sm:mt-0 sm:justify-center">
            {footerSocials.map((social) => {
              const IconComponent = social.icon;
              return (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.name}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="sr-only">{social.name}</span>
                </Link>
              );
            })}
          </div>
          <span className="text-sm text-muted-foreground sm:text-center">
            Copyright © {new Date().getFullYear()}{" "}
            <Link
              href="/"
              className="cursor-pointer hover:text-foreground transition-colors"
            >
              Svee UI
            </Link>
            . All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
