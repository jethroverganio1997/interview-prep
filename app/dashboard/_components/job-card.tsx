"use client";

import {
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  formatPostedAt,
  formatSalary,
  getDomainFromUrl,
  getInitials,
} from "@/app/dashboard/_lib/helpers";

export interface JobCardProps {
  id: string;
  title: string;
  companyName: string;
  companyUrl?: string;
  location?: string;
  workType?: string;
  workArrangement?: string;
  salary?: string;
  postedAt?: string;
  description: string;
  listingUrl: string;
  applyUrl?: string;
  skills: string[];
  status?: string;
  priority?: string;
  lastUpdated?: string;
  experienceNeeded?: string;
  appliedAt?: string;
  notes?: string;
  source?: string;
  className?: string;
  detailHref: string;
}

export function JobCard({
  id,
  title,
  companyName,
  companyUrl,
  location,
  workType,
  workArrangement,
  salary,
  postedAt,
  description,
  listingUrl,
  applyUrl,
  skills,
  status,
  priority,
  lastUpdated,
  experienceNeeded,
  appliedAt,
  notes,
  source,
  className,
  detailHref,
}: JobCardProps) {
  const router = useRouter();
  const salaryLabel = formatSalary(salary);
  const formattedPostedAt = formatPostedAt(postedAt);
  const formattedAppliedAt = formatPostedAt(appliedAt);
  const formattedUpdatedAt = formatPostedAt(lastUpdated);
  const companyInitials = getInitials(companyName);
  const sourceDomain =
    source ?? getDomainFromUrl(listingUrl) ?? "Source unknown";

  const topBadges = [
    location
      ? {
          key: `${id}-location`,
          label: location,
          icon: <MapPin className="h-3 w-3 text-muted-foreground" aria-hidden />,
        }
      : null,
    workType
      ? {
          key: `${id}-worktype`,
          label: workType,
        }
      : null,
    workArrangement
      ? {
          key: `${id}-arrangement`,
          label: workArrangement,
        }
      : null,
    salaryLabel
      ? {
          key: `${id}-salary`,
          label: salaryLabel,
        }
      : null,
    status
      ? {
          key: `${id}-status`,
          label: `Status: ${status}`,
        }
      : null,
    priority
      ? {
          key: `${id}-priority`,
          label: `Priority: ${priority}`,
        }
      : null,
  ].filter(Boolean) as {
    key: string;
    label: string;
    icon?: ReactNode;
  }[];

  const handleNavigate = () => {
    router.push(detailHref);
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleNavigate();
    }
  };

  return (
    <Card
      className={cn(
        "group relative flex h-full cursor-pointer flex-col gap-2 overflow-hidden rounded-2xl border border-border/70 bg-card/95 py-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:border-primary/40",
        className
      )}
      role="link"
      tabIndex={0}
      onClick={handleNavigate}
      onKeyDown={handleKeyDown}
    >
      <CardHeader className="flex flex-col gap-4 px-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl border border-border/60 bg-muted/70 text-sm font-semibold uppercase text-foreground">
              {companyInitials}
            </div>
            <div className="flex flex-col gap-1">
              <CardTitle className="text-lg font-semibold text-foreground">
                {title}
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  {companyUrl ? (
                    <Link
                      href={companyUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="underline decoration-border/60 underline-offset-2"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {companyName}
                    </Link>
                  ) : (
                    companyName
                  )}
                </span>
                {experienceNeeded ? (
                  <>
                    <span aria-hidden>{"\u2022"}</span>
                    <span>{experienceNeeded}</span>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-[12px] text-muted-foreground">
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
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[12px] text-muted-foreground">
          {formattedPostedAt ? (
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
              <span>Posted {formattedPostedAt}</span>
            </span>
          ) : null}
          {formattedAppliedAt ? (
            <span>Applied {formattedAppliedAt}</span>
          ) : null}
          {formattedUpdatedAt ? (
            <span>Updated {formattedUpdatedAt}</span>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 px-4 py-2">
        <p className="text-[13px] leading-relaxed text-muted-foreground [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical] overflow-hidden text-ellipsis">
          {description}
        </p>
        {notes ? (
          <div className="rounded-md border border-border/60 bg-muted/40 p-3 text-[12px] text-muted-foreground">
            <p className="font-medium text-foreground">Notes</p>
            <p className="mt-1 line-clamp-3 whitespace-pre-line">{notes}</p>
          </div>
        ) : null}
        {skills.length ? (
          <div className="flex flex-wrap gap-2">
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
        ) : null}
      </CardContent>
      <CardFooter className="flex flex-row items-center justify-between px-4">
        <div className="flex flex-wrap gap-2">
          <Badge
            variant="secondary"
            className="bg-emerald-500/10 px-2 py-1 text-[11px] font-medium text-emerald-600"
          >
            {sourceDomain}
          </Badge>
        </div>
        <div className="flex items-center gap-3 text-[12px] font-semibold text-primary">
          {applyUrl ? (
            <Link
              href={applyUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="transition hover:text-primary/80"
              onClick={(event) => event.stopPropagation()}
            >
              Apply now
            </Link>
          ) : null}
          <Link
            href={listingUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="transition hover:text-primary/80"
            onClick={(event) => event.stopPropagation()}
          >
            View listing {"\u2197"}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
