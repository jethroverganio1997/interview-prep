## Related Documentation
- [System: architecture-overview](../system/architecture-overview.md)
- [Task: job-description-markdown](./job-description-markdown.md)

## Feature
Add fixed and floating formatting toolbars to the Plate-powered in-app editor.

## Problem Statement
The current editor demo exposes Plate nodes and marks but lacks any on-screen controls, forcing users to rely on keyboard shortcuts. Providing toolbar affordances will make formatting features discoverable and easier to use.

## Requirements & Assumptions
- Display a fixed toolbar that remains visible above the editor surface with common mark and block toggles.
- Provide a contextual floating toolbar that appears when text is selected.
- Reuse the Plate UI toolbar components from the shadcn Plate registry to stay consistent with existing UI primitives.
- Ensure toolbars respect light/dark themes and integrate with the existing `Editor` container styles.
- Avoid regressions to the existing editor value rendering and keyboard shortcuts.

## Implementation Plan
1. **Scaffold toolbar components**
   - Use the shadcn Plate registry to add the `fixed-toolbar-kit` and `floating-toolbar-kit`, pulling in the required toolbar, dropdown, and tooltip primitives.
   - Confirm the generated files and dependencies align with existing project conventions (TS/ESLint, alias paths).
2. **Wire toolbar plugins**
   - Import the generated kits in `components/plate/plate-editor.tsx` and spread them into the Plate plugin configuration alongside `BasicNodesKit`.
   - Ensure the toolbar renderers (`render.beforeEditable`, `render.afterEditable`) hook into the existing `EditorContainer` without breaking layout.
3. **Polish behaviour & styling**
   - Verify toolbar buttons toggle the expected marks/blocks and the floating toolbar appears on text selection.
   - Adjust spacing or variants if needed so the fixed toolbar and editor content align visually.
   - Remove any unused scaffolded exports to keep the bundle lean.

## Validation Plan
- Manual: load `/editor`, confirm the fixed toolbar renders, buttons toggle marks/headings, and shortcuts still function.
- Manual: select text to ensure the floating toolbar appears with the expected options.
- Lint: `npm run lint` (if existing warnings persist, note them).

## Implementation Summary
- Added FixedToolbar/FloatingToolbar UI shells plus button groups built on custom BlockToolbarButton and mark toggles; the fixed bar now mirrors the Plate sample with a single-row, horizontally scrollable layout powered by the `tailwind-scrollbar-hide` plugin while still exposing import/export, alignment, font-size, line-height, turn-into, and list controls.
- Registered lightweight FixedToolbarKit, FloatingToolbarKit, and LineHeightKit plugins under `components/editor/plugins`, wrapping Plate render hooks to mount toolbars above and after the editable surface, with the floating instance now using `@platejs/floating` for collision-aware positioning.
- Updated `components/editor/plate-editor.tsx` to compose the new kits with `BasicNodesKit`, TextAlignPlugin, MarkdownPlugin, and list helpers while simplifying the editor shell—removing the resizable wrapper so layout relies on the core `Editor` padding for responsiveness—and refreshed the import/export toolbar buttons to follow the Plate sample, adding a Word (A4) option alongside full-page PDF/Image/HTML/Markdown capture while temporarily hiding toolbars to exclude UI chrome.

## Validation Notes
- `npm run lint` (fails: existing `types/database.types.ts` binary parse error; known warnings in `components/magic/particles.tsx`).
- Manual verification recommended: load `/editor`, exercise mark buttons, block toggles, divider insertion, floating toolbar selection behaviour, adjust line-height, and export to PDF/Image/HTML/Markdown to confirm full-document capture without toolbar chrome.
