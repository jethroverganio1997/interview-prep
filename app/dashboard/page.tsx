import { redirect } from "next/navigation";

import { LogoutButton } from "@/app/auth/_components/logout-button";
import {
  JobCard,
  type JobCardProps,
} from "@/app/dashboard/_components/job-card";
import { createClient } from "@/lib/server";

const SCRAPER_CARDS: JobCardProps[] = [
  {
    title: "TikTok Scraper",
    slug: "clockworks/tiktok-scraper",
    description:
      "Extract data from TikTok videos, hashtags, and users to feed dashboards, automations, or market research.",
    icon: <span className="text-lg font-semibold text-white">TT</span>,
    iconClassName: "bg-[#120D2F] text-white",
    provider: {
      name: "Clockworks",
      handle: "@clockworks",
      logo: <span className="text-[10px] font-bold text-primary">CW</span>,
    },
    watchers: "81K",
    rating: "4.3",
  },
  {
    title: "Google Maps Scraper",
    slug: "compass/crawler-google-places",
    description:
      "Collect insights from thousands of Google Maps listings, including reviews, contacts, and location data.",
    icon: <span className="text-lg font-semibold text-white">GM</span>,
    iconClassName: "bg-[#0F2C33] text-white",
    provider: {
      name: "Compass",
      handle: "@compass",
      logo: <span className="text-[10px] font-bold text-primary">CO</span>,
      accentClassName: "bg-emerald-100 text-emerald-700",
    },
    watchers: "183K",
    rating: "4.7",
  },
  {
    title: "Instagram Scraper",
    slug: "apify/instagram-scraper",
    description:
      "Scrape and download Instagram posts, profiles, hashtags, and comments to power analytics workflows.",
    icon: <span className="text-lg font-semibold text-white">IG</span>,
    iconClassName: "bg-[#3C135C] text-white",
    provider: {
      name: "Apify",
      handle: "@apify",
      logo: <span className="text-[10px] font-bold text-primary">AP</span>,
      accentClassName: "bg-amber-100 text-amber-700",
    },
    watchers: "140K",
    rating: "4.4",
  },
  {
    title: "Website Content Crawler",
    slug: "apify/website-content-crawler",
    description:
      "Crawl websites to extract structured text for AI models, LLM knowledge bases, and vector databases.",
    icon: <span className="text-lg font-semibold text-white">WC</span>,
    iconClassName: "bg-[#2D170F] text-white",
    provider: {
      name: "Apify",
      handle: "@apify",
      logo: <span className="text-[10px] font-bold text-primary">AP</span>,
      accentClassName: "bg-amber-100 text-amber-700",
    },
    watchers: "81K",
    rating: "4.6",
  },
  {
    title: "Amazon Scraper",
    slug: "junglee/free-amazon-product-scraper",
    description:
      "Fetch detailed product information from Amazon listings to power pricing trackers and product analytics.",
    icon: <span className="text-lg font-semibold text-white">AZ</span>,
    iconClassName: "bg-[#252531] text-white",
    provider: {
      name: "Junglee",
      handle: "@junglee",
      logo: <span className="text-[10px] font-bold text-primary">JU</span>,
      accentClassName: "bg-slate-200 text-slate-700",
    },
    watchers: "8.5K",
    rating: "4.9",
  },
  {
    title: "Facebook Posts Scraper",
    slug: "apify/facebook-posts-scraper",
    description:
      "Extract posts from public Facebook pages and groups, including reactions, comments, and media content.",
    icon: <span className="text-lg font-semibold text-white">FB</span>,
    iconClassName: "bg-[#0E2554] text-white",
    provider: {
      name: "Apify",
      handle: "@apify",
      logo: <span className="text-[10px] font-bold text-primary">AP</span>,
      accentClassName: "bg-amber-100 text-amber-700",
    },
    watchers: "33K",
    rating: "4.2",
  },
];

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const email = data.claims.email ?? "";
  const greetingName = email.split("@")[0] || "there";

  return (
    <div className="w-full bg-muted/10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-6 lg:px-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
              Welcome back, {greetingName}
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Discover compact Apify actor cards inspired by the marketplace
              design.
            </p>
          </div>
          <LogoutButton />
        </header>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {SCRAPER_CARDS.map((card) => (
            <JobCard key={card.slug} {...card} />
          ))}
        </section>

        <footer className="flex items-center justify-center">
          <button className="text-sm font-medium text-primary transition hover:text-primary/80">
            Browse 7,000+ Actors &rarr;
          </button>
        </footer>
      </div>
    </div>
  );
}
