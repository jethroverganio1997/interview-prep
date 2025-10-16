create table if not exists public.job_listings (
  id text primary key,
  link text not null,
  title text not null,
  company_name text not null,
  company_linkedin_url text,
  company_logo text,
  location text,
  salary_info text[] default '{}'::text[],
  posted_at date,
  benefits text[] default '{}'::text[],
  description_html text,
  applicants_count integer,
  apply_url text,
  description_text text,
  job_poster_name text,
  job_poster_title text,
  job_poster_photo text,
  job_poster_profile_url text,
  seniority_level text,
  employment_type text,
  job_function text,
  industries text,
  company_description text,
  company_website text,
  company_employees_count integer,
  created_at timestamptz default now()
);

comment on table public.job_listings is 'Job listings ingested for dashboard display.';
comment on column public.job_listings.salary_info is 'Array of salary values exactly as displayed to candidates.';
comment on column public.job_listings.benefits is 'Badge-style benefit highlights promoted alongside the job card.';

alter table public.job_listings enable row level security;

create policy "Allow authenticated job list reads"
  on public.job_listings
  for select
  using (auth.uid() is not null);

insert into public.job_listings (
  id,
  link,
  title,
  company_name,
  company_linkedin_url,
  company_logo,
  location,
  salary_info,
  posted_at,
  benefits,
  description_html,
  applicants_count,
  apply_url,
  description_text,
  job_poster_name,
  job_poster_title,
  job_poster_photo,
  job_poster_profile_url,
  seniority_level,
  employment_type,
  job_function,
  industries,
  company_description,
  company_website,
  company_employees_count
) values (
  '3692563200',
  'https://www.linkedin.com/jobs/view/english-data-labeling-analyst-at-facebook-3692563200?refId=WG865nttvc0AIFSWNZZS8w%3D%3D&trackingId=wcG3vxpHJfGtFUkaaMVelQ%3D%3D&position=1&pageNum=0&trk=public_jobs_jserp-result_search-card',
  'English Data Labeling Analyst',
  'Facebook',
  'https://www.linkedin.com/company/facebook?trk=public_jobs_jserp-result_job-search-card-subtitle',
  'https://media.licdn.com/dms/image/C4E0BAQHi-wrXiQcbxw/company-logo_100_100/0/1635988509026?e=2147483647&v=beta&t=pKAh1a653MsJvWqrqxSunoCVUALyq29eXX1oqobspnE',
  'Los Angeles Metropolitan Area',
  array['$17.00', '$19.00'],
  '2023-08-16',
  array['Actively Hiring'],
  $$<p>APPROVED REMOTE LOCATIONS:</p><p>Los Angeles, CA, San Fransisco Bay Area, CA, San Diego, CA, New York, NY, Denver, CO, Houston, TX, Seattle, WA.</p><p><br></p><p>Summary:</p><p>The main function of a data labeling analyst is to create and manage labeling and change processes within the data management systems. The typical data labeling analyst will have experience in data quality assurance.</p><p><br></p><p>Job Responsibilities:</p><p> Create and modify data labels ensuring compliance to all regulatory and legal requirements.</p><p> Maintain batch records, room logs, product travelers, and inventory records.</p><p> Label and analyze large data sets to inform product decisions.</p><p> Asses data quality.</p><p><br></p><p>Skills:</p><p> Ability to identify trends within large data sets.</p><p> Excellent communication skills, verbal and written.</p><p> Problem solving skills.</p><p> Team oriented with attention for detail.</p><p><br></p><p>Education/Experience:</p><ul><li> Bachelors degree in related field.</li></ul>$$,
  200,
  null,
  $$APPROVED REMOTE LOCATIONS:Los Angeles, CA, San Fransisco Bay Area, CA, San Diego, CA, New York, NY, Denver, CO, Houston, TX, Seattle, WA.Summary:The main function of a data labeling analyst is to create and manage labeling and change processes within the data management systems. The typical data labeling analyst will have experience in data quality assurance.Job Responsibilities: Create and modify data labels ensuring compliance to all regulatory and legal requirements. Maintain batch records, room logs, product travelers, and inventory records. Label and analyze large data sets to inform product decisions. Asses data quality.Skills: Ability to identify trends within large data sets. Excellent communication skills, verbal and written. Problem solving skills. Team oriented with attention for detail.Education/Experience: Bachelors degree in related field.$$,
  'Andrea Cowan',
  'Technical Recruiter at Meta',
  'https://media.licdn.com/dms/image/C5603AQErv53vemaq_A/profile-displayphoto-shrink_100_100/0/1657753132661?e=1699488000&v=beta&t=5R1WgyX-TbL6qhhsntBeR5qmjKdTL5G2l2KtroVTntM',
  'https://ca.linkedin.com/in/andrea-cowan-458b5423b',
  'Associate',
  'Contract',
  'Other',
  'Retail Office Equipment',
  $$The Facebook company is now Meta. Meta builds technologies that help people connect, find communities, and grow businesses. When Facebook launched in 2004, it changed the way people connect. Apps like Messenger, Instagram and WhatsApp further empowered billions around the world. Now, Meta is moving beyond 2D screens toward immersive experiences like augmented and virtual reality to help build the next evolution in social technology. 

We want to give people the power to build community and bring the world closer together. To do that, we ask that you help create a safe and respectful online space. These community values encourage constructive conversations on this page:

 Start with an open mind. Whether you agree or disagree, engage with empathy.
 Comments violating our Community Standards will be removed or hidden. So please treat everybody with respect. 
 Keep it constructive. Use your interactions here to learn about and grow your understanding of others.
 Our moderators are here to uphold these guidelines for the benefit of everyone, every day. 
 If you are seeking support for issues related to your Facebook account, please reference our Help Center (https://www.facebook.com/help) or Help Community (https://www.facebook.com/help/community).

For a full listing of our jobs, visit http://www.facebookcareers.com $$,
  'https://www.meta.com',
  36275
);

