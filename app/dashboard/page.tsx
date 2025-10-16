import { redirect } from "next/navigation";

import { LogoutButton } from "@/app/auth/_components/logout-button";
import { JobCard } from "@/app/dashboard/_components/job-card";
import { getJobListings } from "@/app/dashboard/_lib/actions";
import { mapRowToCard } from "@/app/dashboard/_lib/helpers";
import { createClient } from "@/lib/server";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  const email = data.claims.email ?? "";
  const greetingName = email.split("@")[0] || "there";

  const {
    data: jobListingsData,
    error: jobListingsError,
  } = await getJobListings(supabase);

  const jobCards = (jobListingsData ?? []).map(mapRowToCard);

  return (
    <div className="w-full bg-muted/10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-6 lg:px-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
              Welcome back, {greetingName}
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Review the latest opportunities sourced from your Supabase
              workspace.
            </p>
          </div>
          <LogoutButton />
        </header>

        {jobListingsError ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            Unable to load job listings right now. Please try again later.
          </div>
        ) : null}

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {jobCards.length > 0 ? (
            jobCards.map((card) => <JobCard key={card.id} {...card} />)
          ) : (
            <div className="col-span-full rounded-2xl border border-border/60 bg-muted/20 px-6 py-10 text-center text-sm text-muted-foreground">
              No job listings available yet. Add records in Supabase to see them
              here.
            </div>
          )}
        </section>

        <footer className="flex items-center justify-center">
          <span className="text-sm text-muted-foreground">
            Data syncs automatically when new listings land in Supabase.
          </span>
        </footer>
      </div>
    </div>
  );
}