import type {
  PostgrestError,
  PostgrestResponse,
  SupabaseClient,
} from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import { buildSearchQuery } from "./helpers";
import type {
  JobListFilters,
  JobListingDetailResult,
  JobListingRow,
  JobListingsResult,
} from "./types";

const DEFAULT_PAGE_SIZE = 9;

export async function getJobListings(
  client: SupabaseClient<Database>,
  filters: JobListFilters = {}
): Promise<JobListingsResult> {
  const {
    searchTerm,
    limit = DEFAULT_PAGE_SIZE,
    offset = 0,
    savedOnly = false,
    userId = null,
  } = filters;

  const effectiveLimit = Math.max(limit, 1);
  const rangeStart = offset;
  const rangeEnd = offset + effectiveLimit; // request one extra record
  const textQuery = buildSearchQuery(searchTerm);

  if (savedOnly) {
    return getSavedJobListings(
      client,
      {
        userId,
        textQuery,
        rangeStart,
        rangeEnd,
        limit: effectiveLimit,
      }
    );
  }

  return getAllJobListings(client, {
    userId,
    textQuery,
    rangeStart,
    rangeEnd,
    limit: effectiveLimit,
  });
}

export async function getJobListingById(
  client: SupabaseClient<Database>,
  jobId: string,
  userId: string | null
): Promise<JobListingDetailResult> {
  const response = await client
    .from("job_listings")
    .select("*")
    .eq("job_id", jobId)
    .maybeSingle();

  if (response.error) {
    return {
      data: null,
      error: response.error,
      isSaved: false,
    };
  }

  const job = response.data ?? null;
  if (!job) {
    return {
      data: null,
      error: null,
      isSaved: false,
    };
  }

  if (!userId) {
    return {
      data: job,
      error: null,
      isSaved: false,
    };
  }

  const savedLookup = await client
    .from("saved_jobs")
    .select("job_id")
    .eq("user_id", userId)
    .eq("job_id", jobId)
    .maybeSingle();

  return {
    data: job,
    error: savedLookup.error ?? null,
    isSaved: Boolean(savedLookup.data),
  };
}

export async function getSavedJobIds(
  client: SupabaseClient<Database>,
  userId: string
) {
  return client
    .from("saved_jobs")
    .select("job_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
}

export async function saveJob(
  client: SupabaseClient<Database>,
  userId: string,
  jobId: string
) {
  return client
    .from("saved_jobs")
    .upsert({ user_id: userId, job_id: jobId });
}

export async function removeSavedJob(
  client: SupabaseClient<Database>,
  userId: string,
  jobId: string
) {
  return client
    .from("saved_jobs")
    .delete()
    .eq("user_id", userId)
    .eq("job_id", jobId);
}

function handleSavedLookupError(
  primaryError: PostgrestError | null,
  savedResponse: PostgrestResponse<{ job_id: string }>
): PostgrestError | null {
  if (primaryError) {
    return primaryError;
  }

  return savedResponse.error ?? null;
}

async function getAllJobListings(
  client: SupabaseClient<Database>,
  options: {
    userId: string | null;
    textQuery: string | null;
    rangeStart: number;
    rangeEnd: number;
    limit: number;
  }
): Promise<JobListingsResult> {
  const { userId, textQuery, rangeStart, rangeEnd, limit } = options;

  const query = client
    .from("job_listings")
    .select("*")
    .order("posted_at", { ascending: false, nullsLast: true })
    .range(rangeStart, rangeEnd);

  if (textQuery) {
    query.textSearch("search_vector", textQuery, {
      type: "raw",
      config: "english",
    });
  }

  const response = await query;
  if (response.error) {
    return {
      data: [],
      error: response.error,
      savedJobIds: [],
      hasMore: false,
    };
  }

  const rows = response.data ?? [];
  const hasMore = rows.length > limit;
  const trimmedRows = hasMore ? rows.slice(0, limit) : rows;

  if (!userId || trimmedRows.length === 0) {
    return {
      data: trimmedRows,
      error: null,
      savedJobIds: [],
      hasMore,
    };
  }

  const savedLookup = await client
    .from("saved_jobs")
    .select("job_id")
    .eq("user_id", userId)
    .in(
      "job_id",
      trimmedRows.map((row) => row.job_id)
    );

  const savedJobIds =
    savedLookup.data?.map((row) => row.job_id) ?? [];

  return {
    data: trimmedRows,
    error: handleSavedLookupError(null, savedLookup),
    savedJobIds,
    hasMore,
  };
}

async function getSavedJobListings(
  client: SupabaseClient<Database>,
  options: {
    userId: string | null;
    textQuery: string | null;
    rangeStart: number;
    rangeEnd: number;
    limit: number;
  }
): Promise<JobListingsResult> {
  const { userId, textQuery, rangeStart, rangeEnd, limit } = options;

  if (!userId) {
    return {
      data: [],
      error: null,
      savedJobIds: [],
      hasMore: false,
    };
  }

  const query = client
    .from("saved_jobs")
    .select("job_id, job_listings:job_listings(*)")
    .eq("user_id", userId)
    .order("posted_at", {
      ascending: false,
      nullsLast: true,
      foreignTable: "job_listings",
    })
    .range(rangeStart, rangeEnd);

  if (textQuery) {
    query.textSearch("job_listings.search_vector", textQuery, {
      type: "raw",
      config: "english",
    });
  }

  const response = await query;

  if (response.error) {
    return {
      data: [],
      error: response.error,
      savedJobIds: [],
      hasMore: false,
    };
  }

  const rows =
    response.data
      ?.map((row) => row.job_listings)
      .filter((job): job is JobListingRow => Boolean(job)) ?? [];

  const hasMore = rows.length > limit;
  const trimmedRows = hasMore ? rows.slice(0, limit) : rows;

  return {
    data: trimmedRows,
    error: null,
    savedJobIds: trimmedRows.map((row) => row.job_id),
    hasMore,
  };
}
