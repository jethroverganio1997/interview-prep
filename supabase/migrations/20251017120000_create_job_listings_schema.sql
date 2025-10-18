-- =============================================
-- Table: job_listings
-- =============================================

create table public.job_listings (
  job_id text primary key,
  job_title text not null,
  job_url text not null,
  company text not null,
  company_url text,
  company_urn text,
  location text,
  work_type text,
  salary text,
  posted_at timestamptz,
  posted_at_epoch bigint,
  skills text[] default '{}'::text[],
  benefits text[] default '{}'::text[],
  is_easy_apply boolean default false,
  is_promoted boolean default false,
  applicant_count text,
  description text,
  description_md text,
  created_at timestamptz default now(),
  created_at_epoch bigint,
  geo_id text,
  navigation_subtitle text,
  is_verified boolean default false,
  job_insights text[] default '{}'::text[],
  apply_url text,

  -- Full-text search vector
  search_vector tsvector generated always as (
    setweight(to_tsvector('english', coalesce(job_title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(company, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(location, '')), 'C') ||
    setweight(to_tsvector('english', coalesce(description, '')), 'D')
  ) stored
);

-- =============================================
-- Comments
-- =============================================

comment on table public.job_listings is 'Job listings ingested for dashboard display.';
comment on column public.job_listings.job_url is 'Canonical LinkedIn job listing URL.';
comment on column public.job_listings.work_type is 'Working arrangement (e.g. Remote, On-site, Hybrid).';
comment on column public.job_listings.job_insights is 'Extra LinkedIn insight chips such as Remote, Contract.';
comment on column public.job_listings.search_vector is 'Generated tsvector for keyword search across title, company, location, and description.';

-- =============================================
-- Index
-- =============================================

create index job_listings_search_vector_idx
  on public.job_listings
  using gin (search_vector);

-- =============================================
-- Row Level Security
-- =============================================

alter table public.job_listings enable row level security;

create policy "Allow authenticated job list reads"
  on public.job_listings
  for select
  using (auth.uid() is not null);

