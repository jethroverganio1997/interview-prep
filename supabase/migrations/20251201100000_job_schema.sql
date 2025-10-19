-- =============================================
-- Migration: replace job schema and retire saved jobs
-- =============================================

create table public.job_listings (
  id text primary key,
  title text not null,
  company text,
  company_url text,
  location text,
  work_type text,
  work_arrangement text,
  salary text,
  description text,
  description_md text,
  skills text[] default '{}'::text[],
  experience_needed text,
  posted_at text,
  apply_url text,
  job_url text,
  source text,
  status text,
  applied_at text,
  notes text,
  priority text,
  last_updated text,
  search_vector tsvector generated always as (
    setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(company, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(location, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'D')
  ) stored
);

comment on table public.job_listings is 'Job listings ingested for dashboard display.';
comment on column public.job_listings.id is 'Unique identifier for the job from the source site.';
comment on column public.job_listings.title is 'Job title (e.g., "Java Developer").';
comment on column public.job_listings.company is 'Company name offering the job.';
comment on column public.job_listings.company_url is 'Direct link to the company profile or page.';
comment on column public.job_listings.location is 'Job location (city, region, or remote).';
comment on column public.job_listings.work_type is 'Employment type (e.g., Full-time, Contract).';
comment on column public.job_listings.work_arrangement is 'Work setup (On-site, Remote, Hybrid).';
comment on column public.job_listings.salary is 'Salary information (text or range).';
comment on column public.job_listings.description is 'Job description or summary.';
comment on column public.job_listings.description_md is 'Job description in markdown format.';
comment on column public.job_listings.skills is 'List of required or preferred skills.';
comment on column public.job_listings.experience_needed is 'Required years or level of experience.';
comment on column public.job_listings.posted_at is 'When the job was posted (ISO string).';
comment on column public.job_listings.apply_url is 'Direct link to the application form.';
comment on column public.job_listings.job_url is 'Main link to the job listing page.';
comment on column public.job_listings.source is 'Platform or website where the job came from.';
comment on column public.job_listings.status is 'Personal progress status (Interested, Applied, etc.).';
comment on column public.job_listings.applied_at is 'Date applied to the job.';
comment on column public.job_listings.notes is 'Personal notes or reminders.';
comment on column public.job_listings.priority is 'Relative importance (High, Medium, Low).';
comment on column public.job_listings.last_updated is 'Timestamp of the last update for this entry.';
comment on column public.job_listings.search_vector is 'Generated tsvector for keyword search across key fields.';

alter table public.job_listings enable row level security;

create policy "Allow authenticated job list reads"
  on public.job_listings
  for select
  using (auth.uid() is not null);

create index job_listings_search_vector_idx
  on public.job_listings
  using gin (search_vector);
