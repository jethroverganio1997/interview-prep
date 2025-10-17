import type { JobCardProps } from "../_components/job-card";
import type { JobListingRow } from "./types";

export function mapRowToCard(
  row: JobListingRow,
  isSaved = false
): JobCardProps {
  return {
    id: row.job_id,
    title: row.job_title,
    companyName: row.company,
    companyUrl: row.company_url ?? undefined,
    location: row.location ?? undefined,
    workType: row.work_type ?? undefined,
    salary: row.salary ?? undefined,
    postedAt: row.posted_at ?? undefined,
    postedAtEpoch: row.posted_at_epoch ?? undefined,
    benefits: row.benefits ?? [],
    jobInsights: row.job_insights ?? [],
    skills: row.skills ?? [],
    description: summariseDescription(row.description),
    listingUrl: row.job_url,
    applyUrl: row.apply_url ?? undefined,
    applicantCount: row.applicant_count ?? undefined,
    isEasyApply: row.is_easy_apply ?? false,
    isPromoted: row.is_promoted ?? false,
    isVerified: row.is_verified ?? false,
    navigationSubtitle: row.navigation_subtitle ?? undefined,
    isSaved,
  };
}

export function formatSalary(value?: string) {
  return value ? value.trim() : null;
}

export function formatPostedAt(value?: string, epoch?: number | null): string | null {
  const date = value ? new Date(value) : epoch ? new Date(epoch) : null;
  if (!date || Number.isNaN(date.getTime())) {
    return null;
  }

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return "Just now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  } else if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  } else {
    // fallback to readable date
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
}


export function getInitials(value?: string) {
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

export function mapRowsToCards(
  rows: JobListingRow[],
  savedJobIds: Iterable<string>
) {
  const savedSet = new Set(savedJobIds);
  return rows.map((row) => mapRowToCard(row, savedSet.has(row.job_id)));
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
