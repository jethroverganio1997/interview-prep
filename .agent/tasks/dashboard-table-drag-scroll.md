# Dashboard Table Drag Scroll

## Summary
Enable pointer-based horizontal dragging for the dashboard job table so users can reveal off-screen columns more easily.

## Plan
1. Update `app/dashboard/_components/job-table.tsx` to wrap the table in a horizontally scrollable container with pointer event handlers that translate drag gestures into `scrollLeft` updates.
2. Show a grab/grabbing cursor while the pointer is active, and suppress text selection during a drag.
3. Reuse the existing `cn` helper for conditional class names and ensure styling changes preserve the current border/spacing treatment.
4. Run the project lint command to confirm the updated component passes checks.

## Validation
- `pnpm lint`

## Outcome
- Added pointer drag handlers and grab cursor styling to the dashboard job table container so users can drag horizontally to discover hidden columns.
