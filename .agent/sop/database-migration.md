## Purpose
Document the workflow for introducing or modifying database schema using Supabase migrations.

## Prerequisites
- Supabase CLI installed and authenticated (`supabase login`).
- Environment variables configured in `.env.local` for local testing.

## Steps
1. **Create Migration Scaffold**  
   ```bash
   supabase migration new add-table-name
   ```  
   The CLI creates a timestamped SQL file under `supabase/migrations/`.

2. **Edit SQL**  
   - Define tables, indices, constraints, and grants in the generated SQL.  
   - Include `comment on column` statements for key fields to aid future documentation.

3. **Apply Locally**  
   ```bash
   supabase db reset
   ```  
   This rebuilds the local database with the new migration sequence.

4. **Verify Changes**  
   - Connect via `supabase db connect` or PgAdmin to confirm schema updates.  
   - Update `.agent/system/database-schema.md` with a summary of new entities.

5. **Commit Artifacts**  
   - Commit the SQL file, related application code, and updated documentation.  
   - Reference the migration name in commit messages or PR descriptions.

6. **Deploy**  
   - After merge, run `supabase db push` or trigger your hosted Supabase migration workflow.  
   - Monitor Supabase dashboard logs for errors.

## Checklist
- [ ] Migration SQL created and reviewed  
- [ ] Local database reset and validated  
- [ ] Documentation updated  
- [ ] CI/CD plan for applying the migration confirmed
