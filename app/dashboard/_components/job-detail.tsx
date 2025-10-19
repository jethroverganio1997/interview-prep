import { ArrowUpRight, CalendarDays, ExternalLink, Globe, MapPin } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  formatPostedAt,
  formatSalary,
  getDomainFromUrl,
  getInitials,
} from "@/app/dashboard/_lib/helpers";
import type { JobListingRow } from "@/app/dashboard/_lib/types";
import { Markdown } from "@/app/dashboard/_components/markdown";

interface JobDetailProps {
  job: JobListingRow;
  errorMessage?: string | null;
}

export function JobDetail({ job, errorMessage }: JobDetailProps) {
  const companyName = job.company ?? "Unknown company";
  const salaryLabel = formatSalary(job.salary);
  const postedAt = formatPostedAt(job.posted_at);
  const appliedAt = formatPostedAt(job.applied_at);
  const lastUpdated = formatPostedAt(job.last_updated);
  const location = job.location ?? undefined;
  const workType = job.work_type ?? undefined;
  const workArrangement = job.work_arrangement ?? undefined;
  const skills = job.skills ?? [];
  const experienceNeeded = job.experience_needed ?? undefined;
  const descriptionMarkdown = job.description_md?.trim();
  const descriptionPlain = job.description?.trim();
  const descriptionContent = descriptionMarkdown?.length
    ? descriptionMarkdown
    : descriptionPlain?.length
      ? descriptionPlain
      : "No description provided.";
  const sourceDomain =
    job.source ?? getDomainFromUrl(job.job_url ?? job.apply_url) ?? "Source unknown";
  const applyHref = job.apply_url ?? job.job_url ?? "";

  return (
    <article className="grid gap-6">
      {errorMessage ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {errorMessage}
        </div>
      ) : null}

      <Card className="overflow-hidden border-border/60 bg-card/95 shadow-sm">
        <CardHeader className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between md:gap-8">
          <div className="flex items-start gap-4">
            <div className="flex size-14 items-center justify-center rounded-xl border border-border/60 bg-muted/70 text-base font-semibold uppercase text-foreground">
              {getInitials(companyName)}
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-semibold leading-tight text-foreground">
                {job.title}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{companyName}</span>
                {location ? (
                  <>
                    <span aria-hidden>{"\u2022"}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" aria-hidden />
                      {location}
                    </span>
                  </>
                ) : null}
                {workType ? (
                  <>
                    <span aria-hidden>{"\u2022"}</span>
                    <span>{workType}</span>
                  </>
                ) : null}
                {workArrangement ? (
                  <>
                    <span aria-hidden>{"\u2022"}</span>
                    <span>{workArrangement}</span>
                  </>
                ) : null}
                <>
                  <span aria-hidden>{"\u2022"}</span>
                  <span className="flex items-center gap-1">
                    <Globe className="h-4 w-4 text-muted-foreground" aria-hidden />
                    <span className="font-medium text-foreground">{sourceDomain}</span>
                  </span>
                </>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {postedAt ? (
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" aria-hidden />
                    <span>Posted {postedAt}</span>
                  </span>
                ) : null}
                {appliedAt ? <span>Applied {appliedAt}</span> : null}
                {lastUpdated ? <span>Updated {lastUpdated}</span> : null}
                {salaryLabel ? (
                  <Badge variant="secondary" className="bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {salaryLabel}
                  </Badge>
                ) : null}
                {job.status ? (
                  <Badge variant="outline" className="border-border/60 bg-background/70 px-2 py-1 text-xs font-medium">
                    Status: {job.status}
                  </Badge>
                ) : null}
                {job.priority ? (
                  <Badge variant="outline" className="border-border/60 bg-background/70 px-2 py-1 text-xs font-medium">
                    Priority: {job.priority}
                  </Badge>
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 md:items-end">
            {applyHref ? (
              <Button asChild size="sm" className="gap-2">
                <Link href={applyHref} target="_blank" rel="noreferrer noopener">
                  Apply now
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </Link>
              </Button>
            ) : null}
            {job.job_url ? (
              <Link
                href={job.job_url}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary transition hover:text-primary/80"
              >
                View original listing
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="grid gap-8 px-6 pb-8">
          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Role overview
            </h2>
            <Markdown content={descriptionContent} className="text-sm leading-relaxed text-muted-foreground" />
          </section>

          {experienceNeeded ? (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Experience
              </h2>
              <p className="text-sm text-muted-foreground">{experienceNeeded}</p>
            </section>
          ) : null}

          {skills.length ? (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Skills & tools
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge
                    key={`${job.id}-skill-${skill}`}
                    variant="secondary"
                    className="bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </section>
          ) : null}

          {job.notes ? (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Notes
              </h2>
              <div className="rounded-md border border-border/60 bg-muted/40 p-4 text-sm text-muted-foreground">
                <p className="whitespace-pre-line">{job.notes}</p>
              </div>
            </section>
          ) : null}
        </CardContent>
      </Card>
    </article>
  );
}
