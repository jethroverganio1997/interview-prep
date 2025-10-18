import { notFound, redirect } from "next/navigation";
import Link from "next/link";

import { JobDetail } from "@/app/dashboard/_components/job-detail";
import { getJobListingById } from "@/app/dashboard/_lib/actions";
import { createClient } from "@/lib/server";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface JobDetailPageProps {
  params: Promise<{ jobId: string }> | { jobId: string };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/auth/login");
  }

  const resolvedParams = await Promise.resolve(params);
  const jobId = decodeURIComponent(resolvedParams.jobId);
  const result = await getJobListingById(supabase, jobId, user.id ?? null);

  if (!result.data) {
    notFound();
  }

  const errorMessage = result.error?.message ?? null;

  return (
    <div className="w-full bg-muted/10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 md:px-6 lg:px-8">
        <div>
          <Button asChild variant="ghost" className="gap-2 px-0 text-muted-foreground hover:text-foreground">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" aria-hidden />
              Back to listings
            </Link>
          </Button>
        </div>
        <JobDetail job={result.data} isSaved={result.isSaved} errorMessage={errorMessage} />
      </div>
    </div>
  );
}
