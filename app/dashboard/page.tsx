import { redirect } from "next/navigation";

import { LogoutButton } from "@/app/auth/_components/logout-button";
import { JobFeed } from "@/app/dashboard/_components/job-feed";
import { getJobListings } from "@/app/dashboard/_lib/actions";
import { createClient } from "@/lib/server";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) {
    redirect("/auth/login");
  }

  const user = data.user;
  const email = user.email ?? "";
  const greetingName = email.split("@")[0] || "there";

  const jobListingsResult = await getJobListings(supabase, {
    limit: 9,
  });

  const initialErrorMessage =
    jobListingsResult.error?.message ?? null;

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

        <JobFeed
          initialRows={jobListingsResult.data}
          initialHasMore={jobListingsResult.hasMore}
          initialError={initialErrorMessage}
        />
      </div>
    </div>
  );
}
