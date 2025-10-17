import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bookmark, BookmarkCheck, CalendarDays, MapPin, Users } from "lucide-react";
import Link from "next/link";

import {
  formatPostedAt,
  formatSalary,
  getInitials,
} from "@/app/dashboard/_lib/helpers";

export interface JobCardProps {
  id: string;
  title: string;
  companyName: string;
  companyUrl?: string;
  location?: string;
  workType?: string;
  salary?: string;
  postedAt?: string;
  postedAtEpoch?: number;
  benefits: string[];
  jobInsights: string[];
  skills: string[];
  description: string;
  listingUrl: string;
  applyUrl?: string;
  applicantCount?: string;
  isEasyApply: boolean;
  isPromoted: boolean;
  isVerified: boolean;
  navigationSubtitle?: string;
  className?: string;
  isSaved?: boolean;
  onToggleSave?: () => void;
  disableSave?: boolean;
}

export function JobCard({
  id,
  title,
  companyName,
  companyUrl,
  location,
  workType,
  salary,
  postedAt,
  postedAtEpoch,
  benefits,
  jobInsights,
  skills,
  description,
  listingUrl,
  applicantCount,
  isEasyApply,
  isPromoted,
  isVerified,
  navigationSubtitle,
  className,
  isSaved = false,
  onToggleSave,
  disableSave = false,
}: JobCardProps) {
  const salaryLabel = formatSalary(salary);
  const formattedPostedAt = formatPostedAt(postedAt, postedAtEpoch);
  const companyInitials = getInitials(companyName);
  const topBadges = location
    ? [
        {
          key: `${id}-location`,
          label: location,
          icon: (
            <MapPin className="h-3 w-3 text-muted-foreground" aria-hidden />
          ),
        },
      ]
    : [];

  return (
    <Card
      className={cn(
        "group relative flex h-full flex-col gap-2 overflow-hidden rounded-2xl border border-border/70 bg-card/95 py-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:border-primary/40",
        className
      )}
    >
      <CardHeader className="flex flex-col gap-4 px-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl border border-border/60 bg-muted/70 text-sm font-semibold uppercase text-foreground">
              {companyInitials}
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <CardTitle className="text-[16px] font-semibold leading-tight text-foreground">
                <Link
                  href={listingUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="transition hover:text-primary"
                >
                  {title}
                </Link>
              </CardTitle>
              <div className="flex flex-wrap items-center text-[12px] text-muted-foreground">
                {companyUrl ? (
                  <Link
                    href={companyUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-medium transition hover:text-primary"
                  >
                    {companyName}
                  </Link>
                ) : (
                  <span className="font-medium text-foreground">
                    {companyName}
                  </span>
                )}
                {navigationSubtitle ? <span>{navigationSubtitle}</span> : null}
                {!navigationSubtitle && workType ? (
                  <span>&bull; {workType}</span>
                ) : null}
              </div>
            </div>
          </div>
          {onToggleSave ? (
            <button
              type="button"
              onClick={onToggleSave}
              disabled={disableSave}
              aria-pressed={isSaved}
              title={isSaved ? "Remove from saved jobs" : "Save this job"}
              className={cn(
                "rounded-full border border-transparent p-2 text-muted-foreground transition hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60",
                isSaved ? "text-primary" : "hover:border-primary/20"
              )}
            >
              <span className="sr-only">
                {isSaved ? "Remove from saved jobs" : "Save this job"}
              </span>
              {isSaved ? (
                <BookmarkCheck className="h-4 w-4" aria-hidden />
              ) : (
                <Bookmark className="h-4 w-4" aria-hidden />
              )}
            </button>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[12px] text-muted-foreground">
          {applicantCount ? (
            <span className="flex items-center gap-1">
              <Users
                className="h-3.5 w-3.5 text-muted-foreground"
                aria-hidden
              />
              <span className="font-medium text-foreground">
                {applicantCount}
              </span>
            </span>
          ) : null}
          {formattedPostedAt ? (
            <span className="flex items-center gap-1">
              <CalendarDays
                className="h-3.5 w-3.5 text-muted-foreground"
                aria-hidden
              />
              <span>{formattedPostedAt}</span>
            </span>
          ) : null}
          {isVerified ? (
            <Badge
              variant="secondary"
              className="bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-600"
            >
              Verified
            </Badge>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 px-4 py-2">
        <p className="text-[13px] leading-relaxed text-muted-foreground [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical] overflow-hidden text-ellipsis">
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {topBadges.map((badge) => (
            <Badge
              key={badge.key}
              variant="outline"
              className="flex items-center gap-1 border-border/60 bg-background/70 px-2 py-1 text-[11px] font-medium"
            >
              {badge.icon}
              {badge.label}
            </Badge>
          ))}
          {workType ? (
            <Badge
              variant="outline"
              className="border-border/60 bg-background/70 px-2 py-1 text-[11px] font-medium"
            >
              {workType}
            </Badge>
          ) : null}
          {salaryLabel ? (
            <Badge
              variant="outline"
              className="border-border/60 bg-background/70 px-2 py-1 text-[11px] font-medium"
            >
              {salaryLabel}
            </Badge>
          ) : null}
          {jobInsights.map((insight) => (
            <Badge
              key={`${id}-insight-${insight}`}
              variant="secondary"
              className="bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary"
            >
              {insight}
            </Badge>
          ))}
          {benefits.map((benefit) => (
            <Badge
              key={`${id}-benefit-${benefit}`}
              variant="secondary"
              className="bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary"
            >
              {benefit}
            </Badge>
          ))}
          {skills.slice(0, 6).map((skill) => (
            <Badge
              key={`${id}-skill-${skill}`}
              variant="secondary"
              className="bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary"
            >
              {skill}
            </Badge>
          ))}
          {skills.length > 6 ? (
            <Badge
              key={`${id}-skill-more`}
              variant="secondary"
              className="bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary"
            >
              +{skills.length - 6} more
            </Badge>
          ) : null}
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center justify-between px-4">
        <div className="flex flex-wrap gap-2">
          {isEasyApply ? (
            <Badge
              variant="secondary"
              className="bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-600"
            >
              Easy Apply
            </Badge>
          ) : null}
          {isPromoted ? (
            <Badge
              variant="secondary"
              className="bg-amber-500/10 px-2 py-1 text-[11px] font-medium text-amber-600"
            >
              Promoted
            </Badge>
          ) : null}
        </div>
        <div>
          <Link
            href={listingUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="text-[12px] font-semibold text-primary transition hover:text-primary/80"
          >
            {"View listing →"}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
