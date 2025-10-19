import type { PostgrestError } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export type JobListingRow =
  Database["public"]["Tables"]["job_listings"]["Row"];

export interface JobListFilters {
  searchTerm?: string;
  limit?: number;
  offset?: number;
}

export interface JobListingsResult {
  data: JobListingRow[];
  error: PostgrestError | null;
  hasMore: boolean;
}

export interface JobListingDetailResult {
  data: JobListingRow | null;
  error: PostgrestError | null;
}
