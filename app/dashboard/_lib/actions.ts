import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export async function getJobListings(
  client: SupabaseClient<Database>
) {
  return client
    .from("job_listings")
    .select("*")
    .order("posted_at", { ascending: false });
}
