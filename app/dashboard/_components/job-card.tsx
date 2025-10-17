import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, MapPin, Users } from "lucide-react";
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
  companyLinkedinUrl?: string;
  companyLogo?: string;
  location?: string;
  employmentType?: string;
  seniorityLevel?: string;
  salaryInfo: string[];
  postedAt?: string;
  benefits: string[];
  description: string;
  listingUrl?: string;
  applyUrl?: string;
  applicantsCount?: number;
  jobPosterName?: string;
  jobPosterTitle?: string;
  jobPosterPhoto?: string;
  className?: string;
}

export function JobCard({
  id,
  title,
  companyName,
  companyLinkedinUrl,
  companyLogo,
  location,
  employmentType,
  seniorityLevel,
  salaryInfo,
  postedAt,
  benefits,
  description,
  listingUrl,
  applyUrl,
  applicantsCount,
  jobPosterName,
  jobPosterTitle,
  jobPosterPhoto,
  className,
}: JobCardProps) {
  const salaryLabel = formatSalary(salaryInfo);
  const formattedPostedAt = formatPostedAt(postedAt);
  const posterInitials = getInitials(jobPosterName);

  return (
    <Card
      className={cn(
        "group relative flex h-full flex-col gap-2 overflow-hidden rounded-2xl border border-border/70 bg-card/95 py-5 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:border-primary/40",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center gap-3 px-4">
        <div className="flex size-12 items-center justify-center rounded-xl border border-border/60 bg-muted/70 text-sm font-semibold uppercase text-foreground">
          {companyLogo ? (
            <span
              aria-hidden
              className="block size-full rounded-[10px] bg-cover bg-center"
              style={{ backgroundImage: `url(${companyLogo})` }}
            />
          ) : (
            companyName.slice(0, 2)
          )}
        </div>
        <div className="flex flex-1 flex-col justify-center gap-1">
          <CardTitle className="text-[16px] font-semibold leading-tight text-foreground">
            {listingUrl ? (
              <Link
                href={listingUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="transition hover:text-primary"
              >
                {title}
              </Link>
            ) : (
              title
            )}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2 text-[12px] text-muted-foreground">
            {companyLinkedinUrl ? (
              <Link
                href={companyLinkedinUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="font-medium transition hover:text-primary"
              >
                {companyName}
              </Link>
            ) : (
              <span className="font-medium text-foreground">{companyName}</span>
            )}
            {employmentType ? <span>&bull; {employmentType}</span> : null}
            {seniorityLevel ? <span>&bull; {seniorityLevel}</span> : null}
          </div>
          <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
            {typeof applicantsCount === "number" ? (
              <span className="flex items-center gap-1">
                <Users
                  className="h-3.5 w-3.5 text-muted-foreground"
                  aria-hidden
                />
                <span className="font-medium text-foreground">
                  {Intl.NumberFormat("en-US").format(applicantsCount)}
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
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3 px-4 py-2">
        <p className="text-[13px] leading-relaxed text-muted-foreground [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical] overflow-hidden text-ellipsis">
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {location ? (
            <Badge
              variant="outline"
              className="flex items-center gap-1 border-border/60 bg-background/70 px-2 py-1 text-[11px] font-medium"
            >
              <MapPin className="h-3 w-3 text-muted-foreground" aria-hidden />
              {location}
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
          {benefits.map((benefit) => (
            <Badge
              key={`${id}-${benefit}`}
              variant="secondary"
              className="bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary"
            >
              {benefit}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center justify-between px-4">
        <div className="flex items-center gap-3">
          {jobPosterName ? (
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-muted/70 text-[10px] font-semibold uppercase text-primary">
                {jobPosterPhoto ? (
                  <span
                    aria-hidden
                    className="block size-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${jobPosterPhoto})` }}
                  />
                ) : (
                  posterInitials
                )}
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[13px] font-medium text-foreground">
                  {jobPosterName}
                </span>
                {jobPosterTitle ? (
                  <span className="text-[11px] text-muted-foreground">
                    {jobPosterTitle}
                  </span>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
        <div>
          {applyUrl ? (
            <Link
              href={applyUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="text-[12px] font-semibold text-primary transition hover:text-primary/80"
            >
              Apply now &rarr;
            </Link>
          ) : null}
          {!applyUrl && listingUrl ? (
            <Link
              href={listingUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="text-[12px] font-semibold text-primary transition hover:text-primary/80"
            >
              View listing
            </Link>
          ) : null}
        </div>
      </CardFooter>
    </Card>
  );
}
