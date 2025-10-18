import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function JobDetailNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Job listing not found
        </h1>
        <p className="max-w-lg text-sm text-muted-foreground">
          The job you&apos;re looking for might have been removed or is no longer available. Please return to the dashboard to continue browsing.
        </p>
      </div>
      <Button asChild>
        <Link href="/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  );
}
