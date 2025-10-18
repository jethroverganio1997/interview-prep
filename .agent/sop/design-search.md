## Related Documentation
- [architecture-overview](../system/architecture-overview.md)
- [integration-points](../system/integration-points.md)

## MCP Tooling
- **shadcn-ui server**  
  - Status: enabled, Auth: unsupported  
  - Command: `cmd /c npx shadcn@latest mcp`  
  - Env: `SystemRoot=C:\Windows`  
  - Tools: `get_add_command_for_items`, `get_audit_checklist`, `get_item_examples_from_registries`, `get_project_registries`, `list_items_in_registries`, `search_items_in_registries`, `view_items_in_registries`
- **shadcn-components server**  
  - Status: enabled, Auth: unsupported  
  - Command: `cmd /c npx @jpisnice/shadcn-ui-mcp-server mcp`  
  - Tools: `get_block`, `get_component`, `get_component_demo`, `get_component_metadata`, `get_directory_structure`, `list_blocks`, `list_components`

## Purpose
Define the repeatable process for selecting shadcn/ui components that satisfy new product requirements using the available MCP tooling.

## When to Use This SOP
- Any new UI requirement where shadcn/ui primitives or blocks may apply
- Refining an existing feature that could benefit from newer shadcn/ui patterns
- Producing a handoff package that specifies which shadcn/ui assets to install and customize

## Preparation
1. Capture the feature brief: audience, tasks, data states, accessibility mandates (WCAG target, keyboard support).
2. Identify existing shadcn/ui components already shipped in the repo to avoid duplication.
3. Verify MCP servers above are running or can be launched in your environment.
4. Note implementation constraints (SSR vs client, Supabase data dependencies, theming tokens).

## shadcn/ui Research Workflow
1. **Clarify Requirements**  
   - Convert product requests into component capabilities (e.g., sortable columns, inline validation, multi-step flow).  
   - Record visual tone requirements so you can check variant support in shadcn/ui.
2. **Launch MCP Servers**  
   - Start the `shadcn-ui` server for registry lookups.  
   - Start the `shadcn-components` server for detailed component metadata and demo blocks.
3. **Inspect Registries**  
   - Run `get_project_registries` to confirm registries.  
   - Use `list_items_in_registries` or `list_components` to browse categories relevant to the requirement.
4. **Targeted Search**  
   - Use `search_items_in_registries` (keywords) to surface potential matches.  
   - For each candidate, call `view_items_in_registries` or `get_component_metadata` to review props, dependencies, and composition notes.
5. **Review Usage Examples**  
   - Fetch demos via `get_item_examples_from_registries` or `get_component_demo` to confirm state handling, slot support, and accessibility patterns.  
   - Capture snippets that illustrate the required states (loading, empty, error).
6. **Assess Fit**  
   - Compare candidates on feature coverage, extensibility, and theming hooks.  
   - Use `get_directory_structure` or `get_block` to understand file layout when blocks are involved.
7. **Plan Installation**  
   - For the selected component(s), call `get_add_command_for_items` to record the install command.  
   - Note any follow-up steps (e.g., running `shadcn-ui add`, adjusting tailwind config).
8. **Document Outcome**  
   - Summarize the chosen component, justification, required variants, and follow-up engineering tasks.  
   - Log unanswered questions for design/product sign-off.

## Evaluation Criteria
- Feature coverage for required interactions and states
- Accessibility guarantees provided in the demo or metadata
- Theming flexibility and alignment with current tokens
- Complexity of customizing the component to meet layout expectations
- Maintenance implications (updates from shadcn/ui, overlap with existing components)

## Deliverables
- Recommendation statement naming the selected shadcn/ui component or block
- Install command(s) from `get_add_command_for_items`
- Code snippet or demo reference showing the target configuration
- Notes on required overrides (CSS variables, slots, additional components)
- List of open questions or validation steps for stakeholders

## Checklist
- [ ] Requirements mapped to explicit shadcn/ui capabilities
- [ ] MCP servers launched and queries logged
- [ ] Candidate components reviewed via registry and demo tools
- [ ] Install commands and customization notes captured
- [ ] Recommendation documented with outstanding actions
