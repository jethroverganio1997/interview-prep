"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type MutableRefObject,
  type SetStateAction,
} from "react";

import { createClient } from "@/lib/client";

import { mapRowToCard } from "./helpers";
import {
  getJobListings,
  removeSavedJob,
  saveJob,
} from "./actions";
import type { JobCardProps } from "../_components/job-card";
import type { JobListingRow } from "./types";

const PAGE_SIZE = 9;

export interface UseJobFeedOptions {
  initialRows: JobListingRow[];
  initialSavedJobIds: string[];
  initialHasMore: boolean;
  userId: string | null;
  initialError?: string | null;
}

export interface UseJobFeedResult {
  searchInput: string;
  setSearchInput: Dispatch<SetStateAction<string>>;
  clearSearch: () => void;
  savedOnly: boolean;
  setSavedOnly: Dispatch<SetStateAction<boolean>>;
  debouncedSearch: string;
  cards: JobCardProps[];
  fetchError: string | null;
  isLoading: boolean;
  isFetchingMore: boolean;
  hasMore: boolean;
  loadMoreRef: MutableRefObject<HTMLDivElement | null>;
}

export function useJobFeed({
  initialRows,
  initialSavedJobIds,
  initialHasMore,
  userId,
  initialError = null,
}: UseJobFeedOptions): UseJobFeedResult {
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

  const clearSearch = useCallback(() => setSearchInput(""), [setSearchInput]);

  return {
    searchInput,
    setSearchInput,
    clearSearch,
    savedOnly,
    setSavedOnly,
    debouncedSearch,
    cards,
    fetchError,
    isLoading,
    isFetchingMore,
    hasMore,
    loadMoreRef,
  };
}

function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handle = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(handle);
  }, [value, delay]);

  return debounced;
}
