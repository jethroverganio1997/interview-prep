"use client";

import { FileSearch, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";

import { JobCard } from "./job-card";
import { useJobFeed, type UseJobFeedOptions } from "../_lib/use-job-feed";

type JobFeedProps = UseJobFeedOptions;

export function JobFeed(props: JobFeedProps) {
  const {
    searchInput,
    setSearchInput,
    clearSearch,
    debouncedSearch,
    cards,
    fetchError,
    isLoading,
    isFetchingMore,
    hasMore,
    loadMoreRef,
  } = useJobFeed(props);

  const showEmptyState =
    !isLoading && cards.length === 0 && !fetchError;

  const emptyStateTitle = debouncedSearch
    ? "No matches found"
    : "No job listings available";

  const emptyStateDescription = debouncedSearch
    ? "Try another keyword or clear the search to browse all roles."
    : "Add job records in Supabase to populate this dashboard.";

  const emptyStateActions = debouncedSearch ? (
    <Button type="button" onClick={clearSearch}>
      Clear search
    </Button>
  ) : undefined;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex w-full flex-col gap-2 md:max-w-sm">
          <Label htmlFor="job-search">Search jobs</Label>
          <div className="flex items-center gap-2">
            <Input
              id="job-search"
              placeholder="Search job titles, companies, or keywords"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
            {searchInput ? (
              <Button
                type="button"
                variant="outline"
                onClick={clearSearch}
              >
                Clear
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {fetchError ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {fetchError}
        </div>
      ) : null}

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <JobCard key={card.id} {...card} />
        ))}
      </section>

      {showEmptyState ? (
        <EmptyState
          icon={<FileSearch className="size-5" aria-hidden />}
          title={emptyStateTitle}
          description={emptyStateDescription}
          actions={emptyStateActions}
        />
      ) : null}

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Loading jobs...
        </div>
      ) : null}

      {isFetchingMore ? (
        <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Loading more jobs...
        </div>
      ) : null}

      {!hasMore && cards.length > 0 && !isLoading ? (
        <div className="py-4 text-center text-sm text-muted-foreground">
          You have reached the end of the results.
        </div>
      ) : null}

      <div ref={loadMoreRef} />
    </div>
  );
}
