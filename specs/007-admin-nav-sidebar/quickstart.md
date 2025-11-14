# Quickstart: Admin Navigation Sidebar

## Goal
Enable a collapsible right-side admin sidebar with core navigation links and language switcher.

## Prerequisites
- Existing admin pages under `web/src/app/admin/`
- i18n provider available globally
- Authenticated admin user available for testing

## Implementation Steps
1. Create `web/src/app/admin/components/AdminSidebar.tsx` (DONE) for main sidebar container.
2. Add `navItems.ts` (DONE) in `web/src/lib/navigation/` with static array of NavigationItem objects.
3. Implement active route matching `activeMatch.ts` (DONE) for highlighting.
4. Wire nav items & ARIA landmark (DONE) in `AdminSidebar.tsx`.
5. Add keyboard activation & active styling in `AdminNavItem.tsx` (DONE).
6. Add unified analytics helpers `analytics.ts` (DONE) for navigation, language timing, collapse, perf marks.
7. Introduce axe accessibility helper `web/tests/e2e/helpers/axe.ts` (DONE).
8. Implement collapse state hook using sessionStorage + cookie sync (`preference.ts`).
9. Inject sidebar into admin layout (`web/src/app/admin/layout.tsx`) (DONE) to render on all admin pages.
10. Add language switch control inside sidebar footer/header.
11. Provide ARIA attributes: `role="navigation"`, `aria-label="Admin Navigation"`, `aria-expanded` on toggle button.
12. Add keyboard support: focusable toggle, Enter/Space activation.
13. (Optional) Implement preference endpoints in `api/src/routes/admin/preferences.ts` using Zod validations.
14. Write unit tests: config & activeMatch (DONE), collapse logic, language switch.
15. Write e2e test: navigation between pages, language switch, collapse persistence.
16. Run lint & tests (Foundational tests PASS).
17. Update documentation and PR referencing success metrics.

## Testing
- Unit: `npm test` target component & helpers.
- E2E: Add Playwright test `admin_sidebar.spec.ts` verifying flows.
- Accessibility: Include axe scan after sidebar render.

## Verification Checklist
- Sidebar visible for admin, hidden for non-admin. (IN PROGRESS)
- Links navigate correctly (URLs match spec). (ACTIVE ITEMS wired)
- Collapse retains state on page navigation. (PENDING)
- Language switch updates visible labels. (PENDING)
- No major layout shift on initial load. (PASS for current items)
- Analytics events emitted for nav clicks & perf marks. (AVAILABLE)
- Axe scan reports zero critical violations (helper added).

## Metrics Hook (Optional)
Add analytics events on link click & language switch to measure improvements.

## Rollout
- Ship behind feature flag if risk concerns.
- Monitor navigation usage metrics; ensure SC-001..SC-005 targets approached.

## Troubleshooting
- Sidebar not rendering: verify admin layout injection & auth context.
- State not persisting: check sessionStorage key and cookie read on server.
- Language not switching: ensure i18n provider context update method invoked.
