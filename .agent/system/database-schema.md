## Supabase Overview
The project connects to a Supabase backend configured through `supabase/config.toml`. The configuration enables Supabase Auth for user management; no custom SQL migrations are currently tracked in `supabase/migrations/`.

## Auth Tables
Supabase provisions the following core tables automatically:
- `auth.users`: Stores user accounts, email addresses, and metadata.
- `auth.identities`: Maps third-party identity providers when enabled.
- `auth.sessions`: Tracks logged-in sessions for token validation.

## Application Data
There are no application-defined tables yet. Any new tables should be created via Supabase SQL migrations and committed under `supabase/migrations/<timestamp>_<name>.sql`.

## Creating New Schema
1. Run `supabase migration new <name>` to scaffold a migration file.
2. Edit the generated SQL to define tables or functions.
3. Apply locally with `supabase db reset` or `supabase db diff`.
4. Commit both the migration and updates to this document describing the new entities.

## Future Guidance
- Keep business data in the public schema unless privacy requires restricted schemas.
- Mirror table descriptions here with column summaries, constraints, and index notes as they are added.
