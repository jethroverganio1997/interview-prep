"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import { createClient } from "@/lib/client";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { JobCard } from "./job-card";
import { mapRowToCard } from "../_lib/helpers";
import {
  getJobListings,
  removeSavedJob,
  saveJob,
} from "../_lib/actions";
import type { JobListingRow } from "../_lib/types";

const PAGE_SIZE = 9;

interface JobFeedProps {
  initialRows: JobListingRow[];
  initialSavedJobIds: string[];
  initialHasMore: boolean;
  userId: string | null;
  initialError?: string | null;
}

export function JobFeed({
  initialRows,
  initialSavedJobIds,
  initialHasMore,
  userId,
  initialError = null,
}: JobFeedProps) {
  const supabase = useMemo(() => createClient(), []);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput, 400);
  const [savedOnly, setSavedOnly] = useState(false);
  const [jobs, setJobs] = useState<JobListingRow[]>(initialRows);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(initialError);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(
    () => new Set(initialSavedJobIds)
  );
  const [pendingSavedIds, setPendingSavedIds] = useState<Set<string>>(
    () => new Set()
  );

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const initialRenderRef = useRef(true);

  const resetError = useCallback(() => setFetchError(null), []);

  const refreshListings = useCallback(async () => {
    setIsLoading(true);
    resetError();

    const result = await getJobListings(supabase, {
      searchTerm: debouncedSearch || undefined,
      savedOnly,
      limit: PAGE_SIZE,
      offset: 0,
      userId,
    });

    if (result.error) {
      setJobs([]);
      setHasMore(false);
      setFetchError(result.error.message ?? "Failed to load job listings.");
      setIsLoading(false);
      return;
    }

    setJobs(result.data);
    setHasMore(result.hasMore);
    setSavedJobIds((prev) => {
      const next = new Set(prev);
      result.savedJobIds.forEach((id) => next.add(id));
      return next;
    });
    setFetchError(null);
    setIsLoading(false);
  }, [
    supabase,
    debouncedSearch,
    savedOnly,
    userId,
    resetError,
  ]);

  const loadMore = useCallback(async () => {
    if (isFetchingMore || isLoading || !hasMore) {
      return;
    }

    setIsFetchingMore(true);
    resetError();

    const result = await getJobListings(supabase, {
      searchTerm: debouncedSearch || undefined,
      savedOnly,
      limit: PAGE_SIZE,
      offset: jobs.length,
      userId,
    });

    if (result.error) {
      setFetchError(result.error.message ?? "Unable to load more jobs.");
      setHasMore(false);
      setIsFetchingMore(false);
      return;
    }

    setJobs((prev) => [...prev, ...result.data]);
    setHasMore(result.hasMore);
    setSavedJobIds((prev) => {
      const next = new Set(prev);
      result.savedJobIds.forEach((id) => next.add(id));
      return next;
    });
    setIsFetchingMore(false);
  }, [
    supabase,
    debouncedSearch,
    savedOnly,
    jobs.length,
    userId,
    hasMore,
    isFetchingMore,
    isLoading,
    resetError,
  ]);

  const handleToggleSave = useCallback(
    async (jobId: string, currentlySaved: boolean) => {
      if (!userId) {
        return;
      }

      setPendingSavedIds((prev) => {
        const next = new Set(prev);
        next.add(jobId);
        return next;
      });
      resetError();

      try {
        if (currentlySaved) {
          const { error } = await removeSavedJob(
            supabase,
            userId,
            jobId
          );

          if (error) {
            throw error;
          }

          setSavedJobIds((prev) => {
            const next = new Set(prev);
            next.delete(jobId);
            return next;
          });

          if (savedOnly) {
            setJobs((prev) =>
              prev.filter((row) => row.job_id !== jobId)
            );
            void refreshListings();
          }
        } else {
          const { error } = await saveJob(supabase, userId, jobId);

          if (error) {
            throw error;
          }

          setSavedJobIds((prev) => {
            const next = new Set(prev);
            next.add(jobId);
            return next;
          });
        }
      } catch (error) {
        console.error(error);
        setFetchError("Unable to update saved jobs. Please try again.");
      } finally {
        setPendingSavedIds((prev) => {
          const next = new Set(prev);
          next.delete(jobId);
          return next;
        });
      }
    },
    [userId, supabase, savedOnly, refreshListings, resetError]
  );

  useEffect(() => {
    if (initialRenderRef.current) {
      initialRenderRef.current = false;
      return;
    }

    void refreshListings();
  }, [refreshListings]);

  useEffect(() => {
    if (!hasMore) {
      return;
    }

    const node = loadMoreRef.current;
    if (!node) {
      return;
    }

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadMore();
        }
      },
      {
        rootMargin: "240px 0px 0px 0px",
      }
    );

    observerRef.current.observe(node);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [loadMore, hasMore]);

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const cards = jobs.map((row) => {
    const isSaved = savedJobIds.has(row.job_id);
    return {
      ...mapRowToCard(row, isSaved),
      onToggleSave: () => handleToggleSave(row.job_id, isSaved),
      disableSave: pendingSavedIds.has(row.job_id),
    };
  });

  const showEmptyState =
    !isLoading && cards.length === 0 && !fetchError;

  const emptyStateLabel = savedOnly
    ? "You have no saved jobs that match this search yet."
    : debouncedSearch
      ? "No job listings match your search just yet. Try adjusting your keywords."
      : "No job listings available yet. Add records in Supabase to see them here.";

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
                onClick={() => setSearchInput("")}
              >
                Clear
              </Button>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="saved-only"
            checked={savedOnly}
            onCheckedChange={(checked) => setSavedOnly(checked)}
            disabled={isLoading}
          />
          <Label htmlFor="saved-only">Show saved jobs</Label>
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
        <div className="rounded-2xl border border-border/60 bg-muted/20 px-6 py-10 text-center text-sm text-muted-foreground">
          {emptyStateLabel}
        </div>
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

function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handle = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(handle);
  }, [value, delay]);

  return debounced;
}
