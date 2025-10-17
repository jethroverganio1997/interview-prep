
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
  created_at timestamptz default now(),
  created_at_epoch bigint,
  geo_id text,
  navigation_subtitle text,
  is_verified boolean default false,
  job_insights text[] default '{}'::text[],
  apply_url text
);

comment on table public.job_listings is 'Job listings ingested for dashboard display.';
comment on column public.job_listings.job_url is 'Canonical LinkedIn job listing URL.';
comment on column public.job_listings.work_type is 'Working arrangement (e.g. Remote, On-site, Hybrid).';
comment on column public.job_listings.job_insights is 'Extra LinkedIn insight chips such as Remote, Contract.';

alter table public.job_listings enable row level security;

create policy "Allow authenticated job list reads"
  on public.job_listings
  for select
  using (auth.uid() is not null);

insert into public.job_listings (
  job_id,
  job_title,
  job_url,
  company,
  company_url,
  company_urn,
  location,
  work_type,
  salary,
  posted_at,
  posted_at_epoch,
  skills,
  benefits,
  is_easy_apply,
  is_promoted,
  applicant_count,
  description,
  created_at,
  created_at_epoch,
  geo_id,
  navigation_subtitle,
  is_verified,
  job_insights,
  apply_url
) values (
  '4311941610',
  'Senior Frontend Developer',
  'https://www.linkedin.com/jobs/view/4311941610',
  'Socium - Teams Done Differently',
  'https://www.linkedin.com/company/socium-teams-done-differently/life',
  '18982109',
  'Southeast Asia',
  'Remote',
  null,
  '2025-10-13 23:39:07+00',
  1760423947000,
  array[]::text[],
  array[]::text[],
  true,
  false,
  'over 100 applicants',
  $$Working Arrangement: RemoteWorking Schedule: 10 am - 7 pm UAE scheduleEmployment Setup: Contract - initial 1 year, subject for extensionNotice Period: Candidates must be amenable to start ASAP or 30 days notice
As a Frontend (Web) Engineer, you will be part of a cross-functional team developing highly scalable and reliable web applications and services used daily by customers and partners. You will collaborate with talented and motivated individuals to shape user-facing experiences and build core functionality that supports business success. Your work will include creating extensible web applications and hybrid online/offline services.
What You'll DoWrite high-quality, performant, and reliable code while independently handling defined tasks and bug fixes.Understand functional specifications and deliver complete features with minimal supervision.Participate in the on-call rotation and help resolve incidents within the defined SLA.Engage in agile team processes and contribute to their continuous improvement.Collaborate with team members to develop scalable and robust progressive web applications.
What You'll NeedBachelors Degree in Computer Science or a related technical field.4+ years of experience with one or more modern JS frameworks: React (preferred), Angular, or Vue.Strong experience with HTML, CSS, and JavaScript.Proficiency in TypeScript and modern JavaScript (ES6+).Experience with (S)CSS Modules, responsive design, and UI/UX best practices.Familiarity with UI frameworks like Ant Design, Bootstrap, or Material Design.Experience with client-side state management: Redux, React Context, etc.Knowledge of real-time technologies: WebSockets, Socket.IO.Experience with testing tools and frameworks: Jest, Enzyme, React Testing Library.Proficiency with modern JS ecosystem tools: Webpack, ESLint.Solid understanding of modern browser behavior and limitations.Knowledge of client-side performance optimization techniques and best practices.$$,
  '2025-10-13 23:32:34+00',
  1760423554000,
  '91000014',
  'Socium - Teams Done Differently  Southeast Asia (Remote)',
  true,
  array['Remote', 'Contract'],
  'https://www.linkedin.com/job-apply/4311941610'
);
