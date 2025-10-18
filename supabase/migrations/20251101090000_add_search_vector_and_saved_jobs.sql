
-- Saved jobs table
create table public.saved_jobs (
  user_id uuid not null references auth.users(id) on delete cascade,
  job_id text not null references public.job_listings(job_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, job_id)
);

comment on table public.saved_jobs is 'Bookmarks linking users to preferred job listings.';
comment on column public.saved_jobs.created_at is 'Timestamp when the job was bookmarked.';

create index saved_jobs_user_created_at_idx
  on public.saved_jobs (user_id, created_at desc);

alter table public.saved_jobs enable row level security;

create policy "Saved jobs are visible to owner"
  on public.saved_jobs
  for select
  using (auth.uid() = user_id);

create policy "Users can save their own jobs"
  on public.saved_jobs
  for insert
  with check (auth.uid() = user_id);

create policy "Users can remove their saved jobs"
  on public.saved_jobs
  for delete
  using (auth.uid() = user_id);
