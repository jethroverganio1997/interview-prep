import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import { buildSearchQuery } from "./helpers";
import type {
  JobListFilters,
  JobListingDetailResult,
  JobListingUpdatePayload,
  JobListingUpdateResult,
  JobListingsResult,
} from "./types";

const DEFAULT_PAGE_SIZE = 10;

export async function getJobListings(
  client: SupabaseClient<Database>,
  filters: JobListFilters = {}
): Promise<JobListingsResult> {
  const { searchTerm, limit = DEFAULT_PAGE_SIZE, offset = 0 } = filters;

  const effectiveLimit = Math.max(limit, 1);
  const rangeStart = offset;
  const rangeEnd = offset + effectiveLimit; // request one extra record
  const textQuery = buildSearchQuery(searchTerm);

  const query = client
    .from("job_listings")
    .select("*")
    .order("posted_at", { ascending: false, nullsFirst: true })
    .range(rangeStart, rangeEnd);

  if (textQuery) {
    query.textSearch("search_vector", textQuery, {
      type: "websearch",
      config: "english",
    });
  }

  const response = await query;
  if (response.error) {
    return {
      data: [],
      error: response.error,
      hasMore: false,
    };
  }

  const rows = response.data ?? [];
  const hasMore = rows.length > effectiveLimit;
  const trimmedRows = hasMore ? rows.slice(0, effectiveLimit) : rows;

  return {
    data: trimmedRows,
    error: null,
    hasMore,
  };
}

export async function getJobListingById(
  client: SupabaseClient<Database>,
  jobId: string
): Promise<JobListingDetailResult> {
  const response = await client
    .from("job_listings")
    .select("*")
    .eq("id", jobId)
    .maybeSingle();

  if (response.error) {
    return {
      data: null,
      error: response.error,
    };
  }

  return {
    data: response.data ?? null,
    error: null,
  };
}

export async function updateJobListing(
  client: SupabaseClient<Database>,
  payload: JobListingUpdatePayload
): Promise<JobListingUpdateResult> {
  const sanitizedUpdates = Object.fromEntries(
    Object.entries(payload.updates).filter(([, value]) => value !== undefined)
  ) as JobListingUpdatePayload["updates"];

  if (Object.keys(sanitizedUpdates).length === 0) {
    return {
      data: null,
      error: null,
    };
  }

  const response = await client
    .from("job_listings")
    .update(sanitizedUpdates)
    .eq("id", payload.id)
    .select("*")
    .maybeSingle();

  if (response.error) {
    return {
      data: null,
      error: response.error,
    };
  }

  return {
    data: response.data ?? null,
    error: null,
  };
}
