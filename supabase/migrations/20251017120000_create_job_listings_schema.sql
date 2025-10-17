
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
) values
(
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
  'Socium - Teams Done Differently · Southeast Asia (Remote)',
  true,
  array['Remote', 'Contract'],
  'https://www.linkedin.com/job-apply/4311941610'
),
(
  '4315304272',
  'Software Engineer - Data Science (Full-Stack) | Remote',
  'https://www.linkedin.com/jobs/view/4315304272',
  'Taskify',
  'https://www.linkedin.com/company/taskify2/life',
  '74901660',
  'APAC',
  'Remote',
  null,
  '2025-10-15 08:05:44+00',
  1760540744000,
  array[]::text[],
  array[]::text[],
  false,
  false,
  null,
  $$Taskify is seeking a skilled Software Engineer with a full-stack data perspective to join our dynamic Data team. In this critical role, you will build and maintain robust data pipelines powering Data Science, Engineering, and Product teams, ensuring data reliability, availability, and timeliness across the organization.
What You'll DoDevelop, optimize, and maintain scalable ETL/ELT pipelines ingesting data from diverse sources like MongoDB, Airtable, PostHog, and production databasesDesign and implement dbt models and transformations to unify and standardize complex datasets into clean, production-ready schemasBuild fault-tolerant data workflows using modern tools such as Fivetran, dbt, SQL, and Python for seamless data consolidation and processingCollaborate closely with engineers, data scientists, and business stakeholders to guarantee data availability, accuracy, and usabilityOwn data quality and reliability end-to-end, from ingestion through to consumptionContinuously monitor, improve pipeline performance, and ensure their scalability
What We're Looking ForProven expertise in data engineering with strong skills in SQL, Python, and modern data stack tools (Fivetran, dbt, Snowflake, or equivalentExperience designing and maintaining large-scale ETL/ELT pipelines across heterogeneous data sources, including databases, analytics platforms, and SaaS toolsSolid understanding of data modeling principles, schema design, and best practices for data transformationKnowledge of data governance, monitoring, and quality assurance frameworkComfortable working cross-functionally with engineering, product, and operations teamsBonus: Prior experience supporting machine learning workflows or analytics platforms
Why Join Taskify:Remote-first culture with flexibility and autonomyWork alongside diverse, high-caliber teams, driving innovationOpportunity to impact data infrastructure that powers AI and next-generation productsInclusive environment welcoming all qualified applicants; reasonable accommodations available
Interested experts passionate about data engineering and collaboration are encouraged to apply to join Taskify's mission of powering cutting-edge AI and technology solutions$$,
  '2025-10-15 08:05:16+00',
  1760540716000,
  '91000003',
  'Taskify · APAC (Remote)',
  true,
  array['Remote', 'Part-time'],
  'https://work.mercor.com/jobs/list_AAABmYfNOM4oBYYrJlNJ8YgF?referralCode=6584e2c9-7348-4be1-b47c-16d913cf725e&utm_source=referral&utm_medium=share&utm_campaign=job_referral'
),
(
  '4315247284',
  'Senior Mobile Developer',
  'https://www.linkedin.com/jobs/view/4315247284',
  'Gigster',
  'https://www.linkedin.com/company/gigster/life',
  '6582187',
  'APAC',
  'Remote',
  null,
  '2025-10-16 10:10:44+00',
  1760634644000,
  array[]::text[],
  array[]::text[],
  false,
  false,
  null,
  $$10+y exp (7+ in mobile dev), React Native, iOS and Android dev, Typescript, Unit Testing, Git. Good English level. 40h/week long-term contract, fully remote, 4h overlap with Qatar. Payment in USD.
Learn more about the role by clicking on the Apply button.$$,
  '2025-10-16 10:10:36+00',
  1760634636000,
  '91000003',
  'Gigster · APAC (Remote)',
  true,
  array['Remote', 'Full-time'],
  'https://virtasant.teamtailor.com/jobs/6358988-senior-mobile-developer?promotion=1674428-trackable-share-link-mob-apac'
),
(
  '4315651834',
  'Intermediate Software Security Engineer, Trust and Safety (APAC or EMEA)',
  'https://www.linkedin.com/jobs/view/4315651834',
  'Jobgether',
  'https://www.linkedin.com/company/jobgether/life',
  '27130504',
  'APAC',
  'Remote',
  null,
  '2025-10-16 03:42:11+00',
  1760611331000,
  array[]::text[],
  array[]::text[],
  true,
  false,
  '38 applicants',
  $$This position is posted by Jobgether on behalf of a partner company. We are currently looking for an Intermediate Software Security Engineer, Trust and Safety in APAC and EMEA.

We are seeking a skilled Software Engineer to join a global Trust and Safety team, focused on protecting users and platforms from abuse, spam, and malicious activity. In this role, you will work at the intersection of software engineering and security, building tools and systems that proactively detect and mitigate threats. You will collaborate with security and product teams to design automated solutions, improve abuse prevention platforms, and strengthen operational security practices. This is an excellent opportunity for engineers passionate about security, eager to grow into security-focused roles, and motivated by solving complex, real-world problems. You will have the chance to make an immediate impact while developing expertise in trust, safety, and platform security.

Accountabilities

Maintain, enhance, and scale abuse prevention systems to detect spam, cryptomining, and other violationsDevelop and expand capabilities within in-house abuse detection platformsImprove AI-driven detection and mitigation tools to reduce manual interventionCollaborate with peers across Security Operations to deliver platform safety improvementsAutomate processes and create clear documentation, runbooks, and proceduresProactively identify abuse trends and propose preventive measures


Requirements

Strong software development skills, particularly with Ruby on RailsExperience working on distributed applications with large-scale codebasesCuriosity and motivation to grow into a security engineering roleFamiliarity with cloud-native platforms such as Google Cloud Platform (GCP) or AWSAbility to work effectively in a fully remote, results-driven environmentInterest in defending systems against attacks with an "automation first" mindsetPassion for understanding abuse patterns, trust and safety challenges, and platform security incidentsExcellent collaboration and communication skills, capable of working with cross-functional teams


Benefits

Competitive salary and equity compensation opportunitiesFully remote, asynchronous work environment with flexible schedulingPaid time off and parental leaveProfessional development budget and learning opportunitiesTeam member resource groups and inclusive, supportive cultureHome office setup support and optional coworking space access

Jobgether is a Talent Matching Platform that partners with companies worldwide to efficiently connect top talent with the right opportunities through AI-driven job matching.

When you apply, your profile goes through our AI-powered screening process designed to identify top talent efficiently and fairly.

🔍 Our AI evaluates your CV and LinkedIn profile thoroughly, analyzing your skills, experience, and achievements.

📊 It compares your profile to the job's core requirements and past success factors to determine your match score.

🎯 Based on this analysis, we automatically shortlist the 3 candidates with the highest match to the role.

🧠 When necessary, our human team may perform an additional manual review to ensure no strong profile is missed.

The process is transparent, skills-based, and free of bias — focusing solely on your fit for the role.

Once the shortlist is completed, we share it directly with the company that owns the job opening. The final decision and next steps (such as interviews or additional assessments) are then made by their internal hiring team.

Thank you for your interest!$$,
  '2025-10-15 23:37:25+00',
  1760596645000,
  '91000003',
  'Jobgether · APAC (Remote)',
  true,
  array['Remote', 'Full-time'],
  'https://www.linkedin.com/job-apply/4315651834'
),
(
  '4312479737',
  'Mobile Development Engineer Intern',
  'https://www.linkedin.com/jobs/view/4312479737',
  'Bybit',
  'https://www.linkedin.com/company/bybitexchange/life',
  '12583916',
  'APAC',
  'Remote',
  null,
  '2025-10-15 22:01:11+00',
  1760590871000,
  array[]::text[],
  array[]::text[],
  true,
  false,
  'over 100 applicants',
  $$About BybitEstablished in March 2018, Bybit is one of the fastest growing cryptocurrency derivatives exchanges, with more than 70 million registered users. We offer a professional platform where crypto traders can find an ultra-fast matching engine, excellent customer service and multilingual community support. We provide innovative online spot and derivatives trading services, mining and staking products, as well as API support, to retail and institutional clients around the world, and strive to be the most reliable exchange for the emerging digital asset class.Our core values define us. We listen, care, and improve to create a faster, fairer, and more humane trading environment for our users. Our innovative, highly advanced, user-friendly platform has been designed from the ground-up using best-in-class infrastructure to provide our users with the industry's safest, fastest, fairest, and most transparent trading experience. Built on customer-centric values, we endeavour to provide a professional, 24/7 multi-language customer support to help in a timely manner.
As of today, Bybit is one of the most trusted, reliable, and transparent cryptocurrency derivatives platforms in the space.
What You'll Do1. Maintain the mobile app for iOS and Android in Flutter2. Follow Figma designs to build beautiful interfaces through Flutter3. Work with our design and backend teams to implement new features4. Stay up to date with best practices in mobile performance, security, and UX5. Write documentation and support internal knowledge sharing
Must Haves1. Major in Computer Science or related fields.2. Solid foundation in computer science and a good understanding of microcomputer principles.3. Strong sense of responsibility for software products, with good communication skills and excellent teamwork capabilities.4. Proficient in at least one programming language, such as (but not limited to): Java, Kotlin, Objective-C, Swift, C, C++, or Python.5. Passion for building the high-performance apps
Nice to Haves1. Strong experience with Flutter and Native mobile development2. Solid understanding of TypeScript and modern React patterns3. Side projects or open-source contributions$$,
  '2025-10-15 22:00:27+00',
  1760590827000,
  '91000003',
  'Bybit · APAC (Remote)',
  true,
  array['Remote', 'Internship'],
  'https://www.linkedin.com/job-apply/4312479737'
),
(
  '4302146144',
  'Frontend Engineer (DeFi / Web3 Protocol) - React / Typescript',
  'https://www.linkedin.com/jobs/view/4302146144',
  'Stealth Startup',
  'https://www.linkedin.com/company/stealth-startup-community/life',
  '18583501',
  'APAC',
  'Remote',
  null,
  '2025-10-15 07:17:32+00',
  1760537852000,
  array[]::text[],
  array[]::text[],
  true,
  false,
  'over 100 applicants',
  $$This is a fully remote role
About the CompanyOur Client is a leading DeFi money market on BNB Smart Chain, powering decentralized lending, borrowing, and stablecoin generation for millions of users. As one of the Top DeFi protocol with billions in total value locked, redefining open finance by making liquidity accessible, efficient, and borderless.
About the RoleWe are seeking a talented Frontend Engineer to craft intuitive and performant user experiences for our DeFi protocol. You will collaborate closely with product and design teams to deliver responsive, user-centric interfaces while integrating with smart contracts and backend services.
Key Responsibilities:Develop and maintain frontend features using React and TypeScript.Build modern, responsive UIs with Tailwind CSS.Integrate smart contract interactions using Viem, ethers.js, or web3.js.Implement efficient data flows with GraphQL.Write reliable, well-tested code with Jest or Vitest.Continuously iterate on product features to optimize performance and usability.
Qualifications:3–5+ years of experience building web applications.Strong proficiency in React and TypeScript.Experience with Viem, ethers.js, or web3.js for blockchain integration.Familiarity with GraphQL and frontend testing frameworks.Bonus: Experience with wagmi, Yup/Zod, or React Hook Form.$$,
  '2025-09-18 03:00:41+00',
  1758189641000,
  '91000003',
  'Stealth Startup · APAC (Remote)',
  true,
  array['Remote', 'Full-time'],
  'https://www.linkedin.com/job-apply/4302146144'
),
(
  '4312294922',
  'Full Stack Engineer',
  'https://www.linkedin.com/jobs/view/4312294922',
  'RED Global',
  'https://www.linkedin.com/company/red-commerce/life',
  '15014',
  'APAC',
  'Remote',
  null,
  '2025-10-15 09:19:34+00',
  1760545174000,
  array[]::text[],
  array[]::text[],
  true,
  false,
  'over 100 applicants',
  $$On behalf of a global client, RED is currently looking for 6+ Developers that has experience with Java and/or Angular to join a multi year program.
Role Details:
Duration - 12 months + Possible extensionCapacity - 5 days/week, 8 hours/dayLocation - 100% remoteLanguages - English.
Below is some information about the tech stack:
Java with Spring BootBuilding REST APIapplication developmentworking with DB esp Mongo DBworking with eventsgRPCKubernetes
AngularTypeScript / JavaScriptAngular (e.g. Angular 17. Not AngularJS)Angular ComponentsState management

If this could be of interest please can you apply with an updated CV that I can use as a point of reference whilst we are on a call.$$,
  '2025-10-15 09:18:17+00',
  1760545097000,
  '91000003',
  'RED Global · APAC (Remote)',
  true,
  array['Remote', 'Contract'],
  'https://www.linkedin.com/job-apply/4312294922'
),
(
  '4315217507',
  'Bash Engineer',
  'https://www.linkedin.com/jobs/view/4315217507',
  'ENCORE IT SOLUTIONS',
  'https://www.linkedin.com/company/encoreitsolutions/life',
  '78823004',
  'APAC',
  'Remote',
  null,
  '2025-10-16 04:52:14+00',
  1760615534000,
  array[]::text[],
  array[]::text[],
  true,
  false,
  '42 applicants',
  $$Role: Bash EngineerLocation: (Remote) - India, Brazil, Pakistan, Nigeria, Kenya, Egypt, Ghana, Bangladesh, Turkey, MexicoExperience Required: 3+ yearsEngagement Type: 1.5 months (Freelancing)Start Date: Within 1 weekWorking Hours: Full-time (8 hrs/day) with 4 hours overlap with PST
Role OverviewWe are seeking a Software Engineer (Bash Specialist) to design, build, and optimize automation workflows for large-scale, production-grade systems. The candidate will develop and maintain shell scripts for automation, process orchestration, and system-level tasks.
Key ResponsibilitiesDevelop, maintain, and optimize Bash scripts for automation, deployment, monitoring, and system orchestration.Automate system-level operations: environment setup, build configuration, log collection, and service management.Collaborate with DevOps and Engineering teams to integrate Bash automation with build/release pipelines.Ensure scripts are modular, reusable, and secure, with strong logging and error-handling mechanisms.Participate in peer code reviews and quality assurance processes to maintain system consistency.Document workflows, metadata, and environment configurations clearly and concisely.
Technical Requirements3+ years of experience writing Bash scripts for automation, orchestration, and system-level tasks.Proven experience integrating Bash scripts into CI/CD pipelines such as:JenkinsGitHub ActionsGitLab CI/CDCircleCIAzure DevOpsExcellent troubleshooting and debugging skills in complex environments.Familiarity with containerization tools (Docker, Podman, or Kubernetes CLI).Knowledge of secure scripting practices — environment variables, credentials, and sensitive data handling.Experience with JSON/YAML, version control systems (Git), and test automation.Strong communication and documentation skills.
Interview ProcessRound 1: Technical Interview (60 minutes)Round 2: Delivery/Cultural Fit Discussion (15 minutes)Total Duration: ~75 minutes$$,
  '2025-10-16 04:42:29+00',
  1760614949000,
  '91000003',
  'ENCORE IT SOLUTIONS · APAC (Remote)',
  true,
  array['Remote', 'Contract'],
  'https://www.linkedin.com/job-apply/4315217507'
),
(
  '4312468908',
  'Backend Development Engineer Intern',
  'https://www.linkedin.com/jobs/view/4312468908',
  'Bybit',
  'https://www.linkedin.com/company/bybitexchange/life',
  '12583916',
  'APAC',
  'Remote',
  null,
  '2025-10-15 22:09:04+00',
  1760591344000,
  array[]::text[],
  array[]::text[],
  true,
  false,
  'over 100 applicants',
  $$About BybitEstablished in March 2018, Bybit is one of the fastest growing cryptocurrency derivatives exchanges, with more than 70 million registered users. We offer a professional platform where crypto traders can find an ultra-fast matching engine, excellent customer service and multilingual community support. We provide innovative online spot and derivatives trading services, mining and staking products, as well as API support, to retail and institutional clients around the world, and strive to be the most reliable exchange for the emerging digital asset class.Our core values define us. We listen, care, and improve to create a faster, fairer, and more humane trading environment for our users. Our innovative, highly advanced, user-friendly platform has been designed from the ground-up using best-in-class infrastructure to provide our users with the industry's safest, fastest, fairest, and most transparent trading experience. Built on customer-centric values, we endeavour to provide a professional, 24/7 multi-language customer support to help in a timely manner.
As of today, Bybit is one of the most trusted, reliable, and transparent cryptocurrency derivatives platforms in the space.
Job ResponsibilitiesParticipate in the design, development, and maintenance of the company's backend systems, using the Go language to write high-performance, high-concurrency services.Assist in building and optimizing microservice architectures to improve system stability and scalability.Participate in interface design and development, collaborating with front-end and testing teams to complete product features.Monitor online system performance, identify and resolve related issues.Learn and apply new technologies to continuously improve code quality and development efficiency.
Job RequirementsBachelor's degree or higher in a computer science-related major, recent graduate.Familiarity with computer networking basics (such as TCP/IP, HTTP, DNS, etc.) and understanding of network programming principles.Understanding of operating system fundamentals (such as processes/threads, memory management, file systems, IO mechanisms, etc.).Master the basic syntax and commonly used Go standard libraries, and understand coroutines, channels, and concurrent programming.Possess good coding style, logical thinking skills, and learning ability.Experience with open source projects, personal projects, or internships is preferred.$$,
  '2025-10-15 22:08:29+00',
  1760591309000,
  '91000003',
  'Bybit · APAC (Remote)',
  true,
  array['Remote', 'Internship'],
  'https://www.linkedin.com/job-apply/4312468908'
),
(
  '4315810791',
  'Low-code Backend Developer ',
  'https://www.linkedin.com/jobs/view/4315810791',
  'Arc.dev',
  'https://www.linkedin.com/company/arcdotdev/life',
  '20409460',
  'APAC',
  'Remote',
  null,
  '2025-10-16 05:44:13+00',
  1760618653000,
  array[]::text[],
  array[]::text[],
  false,
  false,
  null,
  $$We're scaling rapidly and building new integrations that enable seamless, automated vetting at scale. Our platform is currently built with Bubble.io (frontend) and Xano (backend), and we're looking for a skilled developer to help us move faster and smarter.

What You'll Work OnWe're bringing on our first in-house developer to collaborate with the agency that built the initial version of the platform. You'll work directly with the founder and play a key role in accelerating product improvements. The immediate focus will include:Implementing currency integration featuresBuilding API connections to property management systems (PMS)Supporting webhooks and backend logic in XanoReplicating API integrations across ~50 PMS providersContributing to platform enhancements, user flows, and data-driven automation
Who We're Looking For:Must-Have Skills3+ years of back-end or full-stack developmentStrong experience with API design, integration, and testingProficiency in Xano or similar no-code backendsComfortable working independently and owning delivery from spec to deploymentExcellent communication in English (written + spoken)Nice-to-HaveFamiliarity with Bubble.ioExperience working with Airbnb, property tech, or PMS integrationsPrior work in a startup or fast-paced, remote team environment$$,
  '2025-10-16 05:44:06+00',
  1760618646000,
  '91000003',
  'Arc.dev · APAC (Remote)',
  true,
  array['Remote', 'Part-time'],
  'https://arc.dev/remote-jobs/details/low-code-backend-developer-xano-part-time-worldwide-2-n8a0fmvckj'
);
