## Overview
Establish a repeatable SOP for the “design search” workflow so future agents know how to evaluate UI patterns, verify accessibility, and document component decisions. The guide will outline discovery steps, evaluation criteria, and documentation expectations when planning or implementing design-oriented features.

## Files
- `.agent/sop/design-search.md` — New SOP describing the end-to-end design search process, referencing shadcn/ui research steps, evaluation checklists, and documentation touchpoints.
- `.agent/README.md` — Append the new SOP to the index and mark TODO completion once implemented.

## Implementation
- **Structure**
  - Front-matter: brief purpose statement plus links to related documentation (architecture overview, component guidelines).
  - Sections: prerequisites, discovery (component inventory, shadcn/ui exploration), evaluation (responsiveness, accessibility, theming), decision logging, and integration/validation checklists.
  - Include a consolidated checklist summarising key actions (research, documentation, validation).
- **Content Enhancements**
  - Provide actionable prompts for using shadcn/ui tools (`list_components`, `list_blocks`, demos) and evaluating suitability.
  - Highlight accessibility and responsive considerations aligned with project design standards.
  - Add guidance on when to create shared vs. route-scoped components.
- **Style & Formatting**
  - Use clear headings, ordered lists for tasks, and tables/bullets where helpful.
  - Keep tone instructional and reference existing SOP phrasing patterns.

## Integration
- After drafting the SOP, update `.agent/README.md` to link the document under the SOP section.
- Ensure cross-links from related docs (e.g., command guide) point to the new SOP if relevant.
- Confirm the checklist under `.agent/commands/update-doc.md` still applies without duplication.

## Notes
- No code changes required; focus is strictly documentation.
- Coordinate with existing rules that forbid direct implementation without planning—this SOP supports that discovery phase.
- Ensure examples use `pnpm` when referencing package commands, per project standards.
