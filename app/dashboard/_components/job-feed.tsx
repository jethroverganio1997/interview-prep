"use client"

import { FileSearch, Loader2 } from "lucide-react"

import { EmptyState } from "@/components/empty-state"

import { JobTable } from "./job-table"
import { useJobFeed, type UseJobFeedOptions } from "../_lib/use-job-feed"

type JobFeedProps = UseJobFeedOptions

export function JobFeed(props: JobFeedProps) {
  const {
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
  } = useJobFeed(props)

  const showEmptyState =
    !isLoading && jobs.length === 0 && !fetchError && !debouncedSearch

  return (
    <div className="flex flex-col gap-6">
      <JobTable
        jobs={jobs}
        isLoading={isLoading}
        hasBaseRows={jobs.length > 0}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        clearSearch={clearSearch}
        fetchError={fetchError}
      />

      {showEmptyState ? (
        <EmptyState
          icon={<FileSearch className="size-5" aria-hidden />}
          title="No job listings available"
          description="Add records in Supabase to populate this dashboard."
        />
      ) : null}

      {isFetchingMore ? (
        <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Loading more jobs...
        </div>
      ) : null}

      {!hasMore && jobs.length > 0 && !isLoading ? (
        <div className="py-4 text-center text-sm text-muted-foreground">
          You have reached the end of the results.
        </div>
      ) : null}

      <div ref={loadMoreRef} />
    </div>
  )
}
