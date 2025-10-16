import type { JobCardProps } from "../_components/job-card";
import type { JobListingRow } from "./types";

export function mapRowToCard(row: JobListingRow): JobCardProps {
  return {
    id: row.id,
    title: row.title,
    companyName: row.company_name,
    companyLinkedinUrl: row.company_linkedin_url ?? undefined,
    companyLogo: row.company_logo ?? undefined,
    location: row.location ?? undefined,
    employmentType: row.employment_type ?? undefined,
    seniorityLevel: row.seniority_level ?? undefined,
    salaryInfo: row.salary_info ?? [],
    postedAt: row.posted_at ?? undefined,
    benefits: row.benefits ?? [],
    description: summariseDescription(row),
    listingUrl: row.link ?? undefined,
    applyUrl: row.apply_url ?? undefined,
    applicantsCount: row.applicants_count ?? undefined,
    jobPosterName: row.job_poster_name ?? undefined,
    jobPosterTitle: row.job_poster_title ?? undefined,
    jobPosterPhoto: row.job_poster_photo ?? undefined,
  };
}

export function formatSalary(values: string[]) {
  if (!values.length) {
    return null;
  }

  if (values.length === 1) {
    return values[0];
  }

  const [lower, ...rest] = values;
  const upper = rest[rest.length - 1];
  return `${lower} - ${upper}`;
}

export function formatPostedAt(value?: string) {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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

function summariseDescription(row: JobListingRow) {
  const source =
    row.description_text ??
    (row.description_html ? stripHtml(row.description_html) : "");
  const text = source.replace(/\s+/g, " ").trim();

  if (!text) {
    return "No description provided.";
  }

  if (text.length <= 220) {
    return text;
  }

  return `${text.slice(0, 217)}...`;
}

function stripHtml(value: string) {
  return value.replace(/<[^>]+>/g, " ");
}

