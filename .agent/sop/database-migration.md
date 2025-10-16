## Purpose
Document the workflow for introducing or modifying database schema using Supabase migrations (using remote supabase).

## Prerequisites
- Supabase CLI installed and authenticated (`supabase link`) and select project `uwdxmdtsrdwvllrqxsfi [name: InterviewAI, org: jzmfaoustempidbwmaeo, region: ap-southeast-1]`.
- Environment variables configured in `.env.local` for remote config.

## Steps
1. **Create Migration Scaffold**  
   ```bash
   supabase migration new add-table-name
   ```  
   The CLI creates a timestamped SQL file under `supabase/migrations/`.

2. **Edit SQL**  
   - Define tables, indices, constraints, and grants in the generated SQL.  
   - Include `comment on column` statements for key fields to aid future documentation.

3. **Apply Remotely**  
   - run `supabase db push` or trigger your hosted Supabase migration workflow. 

4. **Verify Changes**  
   - Check via `supabase migration list ` if your migration successfuly push.  
   - Update `.agent/system/database-schema.md` with a summary of new entities.

5. **Commit Artifacts**  
   - Commit the SQL file, related application code, and updated documentation.  
   - Reference the migration name in commit messages or PR descriptions.

**Optional**
- use db reset if you need to alter tables or have conflict to others tables that already exist cause were on the 
testing stage even tho we use remote database. feel free to reset db

```bash
   supabase db reset --linked
```  
   This rebuilds the remote database with the new migration sequence.
```

## Checklist
- [ ] Migration SQL created and reviewed  
- [ ] Documentation updated  
- [ ] CI/CD plan for applying the migration confirmed
