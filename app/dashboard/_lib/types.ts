import type { PostgrestError } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export type JobListingRow =
  Database["public"]["Tables"]["job_listings"]["Row"];

export type SavedJobRow =
  Database["public"]["Tables"]["saved_jobs"]["Row"];

export interface JobListFilters {
  searchTerm?: string;
  limit?: number;
  offset?: number;
  savedOnly?: boolean;
  userId?: string | null;
}

export interface JobListingsResult {
  data: JobListingRow[];
  error: PostgrestError | null;
  savedJobIds: string[];
  hasMore: boolean;
}
