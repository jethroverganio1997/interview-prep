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

import { getJobListings, updateJobListing } from "./actions";
import type {
  JobListingEditableFields,
  JobListingRow,
  JobListingUpdateResult,
} from "./types";

const PAGE_SIZE = 9;

export interface UseJobFeedOptions {
  initialRows: JobListingRow[];
  initialHasMore: boolean;
  initialError?: string | null;
}

export interface UseJobFeedResult {
  searchInput: string;
  setSearchInput: Dispatch<SetStateAction<string>>;
  clearSearch: () => void;
  debouncedSearch: string;
  jobs: JobListingRow[];
  fetchError: string | null;
  isLoading: boolean;
  isFetchingMore: boolean;
  hasMore: boolean;
  loadMoreRef: MutableRefObject<HTMLDivElement | null>;
  updateJob: (
    jobId: string,
    updates: Partial<JobListingEditableFields>
  ) => Promise<JobListingUpdateResult>;
}

export function useJobFeed({
  initialRows,
  initialHasMore,
  initialError = null,
}: UseJobFeedOptions): UseJobFeedResult {
  const supabase = useMemo(() => createClient(), []);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput, 400);
  const [jobs, setJobs] = useState<JobListingRow[]>(initialRows);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(initialError);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const initialRenderRef = useRef(true);

  const resetError = useCallback(() => setFetchError(null), []);

  const updateJob = useCallback(
    async (
      jobId: string,
      updates: Partial<JobListingEditableFields>
    ): Promise<JobListingUpdateResult> => {
      const result = await updateJobListing(supabase, { id: jobId, updates });

      if (result.data) {
        setJobs((previous) =>
          previous.map((job) => (job.id === jobId ? result.data! : job))
        );
      }

      return result;
    },
    [supabase]
  );

  const refreshListings = useCallback(async () => {
    setIsLoading(true);
    resetError();

    const result = await getJobListings(supabase, {
      searchTerm: debouncedSearch || undefined,
      limit: PAGE_SIZE,
      offset: 0,
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
    setFetchError(null);
    setIsLoading(false);
  }, [supabase, debouncedSearch, resetError]);

  const loadMore = useCallback(async () => {
    if (isFetchingMore || isLoading || !hasMore) {
      return;
    }

    setIsFetchingMore(true);
    resetError();

    const result = await getJobListings(supabase, {
      searchTerm: debouncedSearch || undefined,
      limit: PAGE_SIZE,
      offset: jobs.length,
    });

    if (result.error) {
      setFetchError(result.error.message ?? "Failed to load job listings.");
      setIsFetchingMore(false);
      return;
    }

    setJobs((prev) => [...prev, ...result.data]);
    setHasMore(result.hasMore);
    setFetchError(null);
    setIsFetchingMore(false);
  }, [debouncedSearch, hasMore, isFetchingMore, isLoading, jobs.length, resetError, supabase]);

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

  const clearSearch = useCallback(() => setSearchInput(""), [setSearchInput]);

  return {
    searchInput,
    setSearchInput,
    clearSearch,
    debouncedSearch,
    jobs,
    fetchError,
    isLoading,
    isFetchingMore,
    hasMore,
    loadMoreRef,
    updateJob,
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
