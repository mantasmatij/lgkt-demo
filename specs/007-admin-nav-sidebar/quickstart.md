# Quickstart: Admin Navigation Sidebar

## Goal
Enable a collapsible right-side admin sidebar with core navigation links and language switcher.

## Prerequisites
- Existing admin pages under `web/src/app/admin/`
- i18n provider available globally
- Authenticated admin user available for testing

## Implementation Steps
1. Create `web/src/app/admin/components/AdminSidebar.tsx` for main sidebar container.
2. Add `navItems.ts` in `web/src/lib/navigation/` with static array of NavigationItem objects.
3. Implement collapse state hook using sessionStorage + cookie sync (`preference.ts`).
4. Inject sidebar into admin layout (`web/src/app/admin/layout.tsx` or modify existing root layout). Render on all admin pages.
5. Add language switch control inside sidebar footer/header.
6. Provide ARIA attributes: `role="navigation"`, `aria-label="Admin"`, `aria-expanded` on toggle button.
7. Add keyboard support: focusable toggle, Enter/Space activation.
8. (Optional) Implement preference endpoints in `api/src/routes/admin/preferences.ts` using Zod validations.
9. Write unit tests: collapse logic, active item highlighting.
10. Write e2e test: navigation between pages, language switch, collapse persistence.
11. Run lint & tests.
12. Update documentation and PR referencing success metrics.

## Testing
- Unit: `npm test` target component & helpers.
- E2E: Add Playwright test `admin_sidebar.spec.ts` verifying flows.
- Accessibility: Include axe scan after sidebar render.

## Verification Checklist
- Sidebar visible for admin, hidden for non-admin.
- Links navigate correctly (URLs match spec).
- Collapse retains state on page navigation.
- Language switch updates visible labels.
- No major layout shift on initial load.

## Metrics Hook (Optional)
Add analytics events on link click & language switch to measure improvements.

## Rollout
- Ship behind feature flag if risk concerns.
- Monitor navigation usage metrics; ensure SC-001..SC-005 targets approached.

## Troubleshooting
- Sidebar not rendering: verify admin layout injection & auth context.
- State not persisting: check sessionStorage key and cookie read on server.
- Language not switching: ensure i18n provider context update method invoked.
