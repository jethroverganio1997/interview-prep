import { type ReactNode } from "react";

import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users } from "lucide-react";

export interface JobProvider {
  name: string;
  handle: string;
  logo?: ReactNode;
  accentClassName?: string;
}

export interface JobCardProps {
  title: string;
  slug: string;
  description: string;
  icon: ReactNode;
  iconClassName?: string;
  provider: JobProvider;
  watchers: string;
  rating: string;
  className?: string;
}

export function JobCard({
  title,
  slug,
  description,
  icon,
  iconClassName,
  provider,
  watchers,
  rating,
  className,
}: JobCardProps) {
  return (
    <Card
      className={cn(
        "group py-5 gap-2 relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card/95 shadow-sm transition-transform duration-200 hover:-translate-y-0.5 hover:border-primary/40",
        className
      )}
    >
      <CardHeader className="flex flex-row items-start px-4">
        <div
          className={cn(
            "flex size-11 items-center justify-center rounded-xl border border-border/60 bg-muted/70 text-base font-semibold text-foreground",
            iconClassName
          )}
        >
          {icon}
        </div>
        <div className="flex flex-col gap-1">
          <CardTitle className="text-[16px] font-semibold leading-tight">
            {title}
          </CardTitle>
          <div className="flex flex-wrap items-center gap-1 text-[11px] text-muted-foreground">
            <Badge
              variant="outline"
              className="border-border/60 bg-background/70 px-1.5 py-0 text-[10px] font-medium"
            >
              {slug}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col px-5 py-2">
        <p className="text-[13px] leading-relaxed text-muted-foreground [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden text-ellipsis">
          {description}
        </p>
      </CardContent>
      <CardFooter className="flex flex-row items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex size-7 items-center justify-center rounded-lg border border-border/60 bg-background text-[10px] font-semibold uppercase text-primary",
              provider.accentClassName
            )}
          >
            {provider.logo ?? provider.name.slice(0, 2)}
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[13px] font-medium">{provider.name}</span>
            <span className="text-[11px] text-muted-foreground">
              {provider.handle}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
            <span className="font-medium text-foreground">{watchers}</span>
          </span>
          <span className="flex items-center gap-1 text-foreground">
            <Star
              className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
              aria-hidden
            />
            <span className="font-semibold">{rating}</span>
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
