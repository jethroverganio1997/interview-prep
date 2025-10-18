import { ArrowUpRight, BookmarkCheck, CalendarDays, ExternalLink, Globe, MapPin, Users } from "lucide-react";
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
  isSaved: boolean;
  errorMessage?: string | null;
}

export function JobDetail({ job, isSaved, errorMessage }: JobDetailProps) {
  const salaryLabel = formatSalary(job.salary ?? undefined);
  const postedAt = formatPostedAt(job.posted_at ?? undefined, job.posted_at_epoch);
  const applicantCount = job.applicant_count ?? undefined;
  const location = job.location ?? undefined;
  const workType = job.work_type ?? undefined;
  const benefits = job.benefits ?? [];
  const jobInsights = job.job_insights ?? [];
  const skills = job.skills ?? [];
  const descriptionMarkdown = job.description_md?.trim();
  const descriptionPlain = job.description?.trim();
  const descriptionContent = descriptionMarkdown?.length
    ? descriptionMarkdown
    : descriptionPlain?.length
      ? descriptionPlain
      : "No description provided.";
  const sourceDomain = getDomainFromUrl(job.job_url) ?? "Source unknown";
  const applyHref = job.apply_url ?? job.job_url;

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
              {getInitials(job.company)}
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-semibold leading-tight text-foreground">
                {job.job_title}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                  {job.company}
                </span>
                {location ? (
                  <>
                    <span aria-hidden>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" aria-hidden />
                      {location}
                    </span>
                  </>
                ) : null}
                {workType ? (
                  <>
                    <span aria-hidden>•</span>
                    <span>{workType}</span>
                  </>
                ) : null}
                <>
                  <span aria-hidden>•</span>
                  <span className="flex items-center gap-1">
                    <Globe className="h-4 w-4 text-muted-foreground" aria-hidden />
                    <span className="font-medium text-foreground">{sourceDomain}</span>
                  </span>
                </>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                {applicantCount ? (
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" aria-hidden />
                    <span className="font-medium text-foreground">{applicantCount}</span>
                  </span>
                ) : null}
                {postedAt ? (
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" aria-hidden />
                    <span>{postedAt}</span>
                  </span>
                ) : null}
                {salaryLabel ? (
                  <Badge variant="secondary" className="bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {salaryLabel}
                  </Badge>
                ) : null}
                {isSaved ? (
                  <Badge variant="secondary" className="bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-600">
                    <BookmarkCheck className="mr-1 h-3.5 w-3.5" aria-hidden />
                    Saved
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
            <Link
              href={job.job_url}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary transition hover:text-primary/80"
            >
              View original listing
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </CardHeader>
        <CardContent className="grid gap-8 px-6 pb-8">
          <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Role overview
            </h2>
            <Markdown content={descriptionContent} className="text-sm leading-relaxed text-muted-foreground" />
          </section>

          {jobInsights.length ? (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Highlights
              </h2>
              <div className="flex flex-wrap gap-2">
                {jobInsights.map((insight) => (
                  <Badge
                    key={`${job.job_id}-insight-${insight}`}
                    variant="secondary"
                    className="bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                  >
                    {insight}
                  </Badge>
                ))}
              </div>
            </section>
          ) : null}

          {benefits.length ? (
            <section className="space-y-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Benefits
              </h2>
              <div className="flex flex-wrap gap-2">
                {benefits.map((benefit) => (
                  <Badge
                    key={`${job.job_id}-benefit-${benefit}`}
                    variant="outline"
                    className="border-border/60 bg-background/70 px-2 py-1 text-xs font-medium"
                  >
                    {benefit}
                  </Badge>
                ))}
              </div>
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
                    key={`${job.job_id}-skill-${skill}`}
                    variant="secondary"
                    className="bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </section>
          ) : null}
        </CardContent>
      </Card>
    </article>
  );
}
