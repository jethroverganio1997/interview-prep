import type { JobCardProps } from "../_components/job-card";
import type { JobListingRow } from "./types";

export function mapRowToCard(row: JobListingRow): JobCardProps {
  return {
    id: row.id,
    title: row.title,
    companyName: row.company ?? "Unknown company",
    companyUrl: row.company_url ?? undefined,
    location: row.location ?? undefined,
    workType: row.work_type ?? undefined,
    workArrangement: row.work_arrangement ?? undefined,
    salary: row.salary ?? undefined,
    postedAt: row.posted_at ?? undefined,
    description: summariseDescription(row.description),
    listingUrl: row.job_url ?? row.apply_url ?? "#",
    applyUrl: row.apply_url ?? undefined,
    skills: row.skills ?? [],
    status: row.status ?? undefined,
    priority: row.priority ?? undefined,
    lastUpdated: row.last_updated ?? undefined,
    experienceNeeded: row.experience_needed ?? undefined,
    appliedAt: row.applied_at ?? undefined,
    notes: row.notes ?? undefined,
    source: row.source ?? undefined,
    detailHref: `/dashboard/jobs/${row.id}`,
  };
}

export function formatSalary(value?: string | null) {
  return value ? value.trim() : null;
}

export function formatPostedAt(value?: string | null): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return "Just now";
  }
  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
  }
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  }
  if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getInitials(value?: string | null) {
  if (!value) {
    return "?";
  }

  const parts = value.trim().split(/\s+/);
  if (!parts.length) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function summariseDescription(value?: string | null) {
  const text = (value ?? "").replace(/\s+/g, " ").trim();

  if (!text) {
    return "No description provided.";
  }

  if (text.length <= 220) {
    return text;
  }

  return `${text.slice(0, 217)}...`;
}

export function buildSearchQuery(term?: string | null) {
  if (!term) {
    return null;
  }

  const tokens = term
    .trim()
    .split(/\s+/)
    .map((piece) => piece.replace(/['&|!*?:\\]/g, ""))
    .filter(Boolean);

  if (!tokens.length) {
    return null;
  }

  return tokens.map((piece) => `${piece}:*`).join(" & ");
}

const COMMON_SECOND_LEVEL_DOMAINS = new Set([
  "co",
  "com",
  "gov",
  "ac",
  "edu",
  "org",
  "net",
]);

export function getDomainFromUrl(value?: string | null): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    try {
      url = new URL(`https://${trimmed}`);
    } catch {
      return null;
    }
  }

  const hostname = url.hostname.toLowerCase();
  if (!hostname) {
    return null;
  }

  const host = hostname.startsWith("www.") ? hostname.slice(4) : hostname;
  const parts = host.split(".").filter(Boolean);

  if (parts.length <= 1) {
    return host;
  }

  if (parts.length === 2) {
    return host;
  }

  const last = parts[parts.length - 1];
  const second = parts[parts.length - 2];

  if (last.length === 2) {
    const third = parts[parts.length - 3];
    if (COMMON_SECOND_LEVEL_DOMAINS.has(second) || second.length <= 3) {
      return third ? `${third}.${second}.${last}` : `${second}.${last}`;
    }
  }

  return `${second}.${last}`;
}
