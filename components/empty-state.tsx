import * as React from "react";
import Link from "next/link";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { cn } from "@/lib/utils";

interface EmptyStateFooterLink {
  href: string;
  label: string;
  external?: boolean;
}

export interface EmptyStateProps
  extends React.ComponentProps<typeof Empty> {
  icon?: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  footerLink?: EmptyStateFooterLink;
  contentClassName?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actions,
  footerLink,
  contentClassName,
  className,
  ...props
}: EmptyStateProps) {
  const footer = footerLink ? (
    <Link
      href={footerLink.href}
      className="text-xs font-medium text-muted-foreground underline underline-offset-4 transition hover:text-primary"
      target={footerLink.external ? "_blank" : undefined}
      rel={footerLink.external ? "noreferrer noopener" : undefined}
    >
      {footerLink.label}
    </Link>
  ) : null;

  return (
    <Empty
      role="status"
      aria-live="polite"
      className={cn(
        "gap-8 border-border/60 bg-muted/30 p-8 md:p-12",
        className
      )}
      {...props}
    >
      <EmptyHeader>
        {icon ? (
          <EmptyMedia variant="icon" aria-hidden>
            {icon}
          </EmptyMedia>
        ) : null}
        <EmptyTitle className="text-xl font-semibold">
          {title}
        </EmptyTitle>
        {description ? (
          <EmptyDescription className="text-sm text-muted-foreground">
            {description}
          </EmptyDescription>
        ) : null}
      </EmptyHeader>

      {(actions || footer) ? (
        <EmptyContent className={cn("gap-6 md:gap-8", contentClassName)}>
          {actions ? (
            <div className="flex flex-col items-center gap-3 sm:flex-row">
              {actions}
            </div>
          ) : null}
          {footer}
        </EmptyContent>
      ) : null}
    </Empty>
  );
}
