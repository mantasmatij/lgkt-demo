# Tasks: UI Redesign & Responsive Implementation

**Branch**: `002-ui-redesign-responsive` | **Generated**: 2025-01-24  
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Implementation Strategy

**MVP Scope**: User Story 1 (P1) - Improved Form Navigation and Layout
- This is the primary entry point for users and has the highest impact on submission completion rates
- Delivers immediate value: clean form layout with 8-point grid spacing
- Can be deployed independently after foundational setup

**Incremental Delivery**:
1. **MVP (US1)**: Public form responsive redesign → Deploy to production
2. **Phase 2 (US3)**: Extend spacing system to all pages → Deploy to production  
3. **Phase 3 (US2)**: Admin dashboard responsive improvements → Deploy to production
4. **Phase 4 (US4)**: Touch-friendly mobile optimizations → Deploy to production
5. **Phase 5 (US5)**: Typography refinements → Deploy to production

**Parallel Execution**: Tasks marked with [P] can be executed in parallel with other [P] tasks in the same phase (different files, no dependencies).

---

## Dependencies & Execution Order

```
Phase 1 (Setup) → Must complete before all other phases
  ↓
Phase 2 (Foundational) → Blocking prerequisites for all user stories
  ↓
Phase 3 (US1 - P1) ──┐
                      ├→ Can execute in any order (independent user stories)
Phase 4 (US3 - P1) ──┤
                      │
Phase 5 (US2 - P2) ──┤
                      │
Phase 6 (US4 - P2) ──┤
                      │
Phase 7 (US5 - P3) ──┘
  ↓
Phase 8 (Polish) → Final integration and performance optimization
```

**User Story Dependencies**:
- US1, US3, US2, US4, US5 are **independent** - can be implemented in any order after Phase 2
- Recommended order follows priority: P1 (US1, US3) → P2 (US2, US4) → P3 (US5)

---

## Phase 1: Setup & Dependency Migration (Blocking - Complete First)

**Goal**: Migrate from deprecated NextUI to HeroUI, install recommended dependencies, configure tooling.

**Time Estimate**: 3-4 hours

### Tasks

- [x] T001 Remove deprecated NextUI packages from root package.json and packages/ui/package.json
- [x] T002 Install HeroUI v2.5.x in root package.json: `@heroui/react@^2.5.0`
- [x] T003 [P] Install Framer Motion in root package.json: `framer-motion@^11.0.0`
- [x] T004 [P] Install React Hook Form dependencies in root package.json: `react-hook-form@^7.50.0`, `@hookform/resolvers@^3.3.0`
- [x] T005 [P] Install class composition utilities in root package.json: `clsx@^2.1.0`, `tailwind-merge@^2.2.0`
- [x] T006 [P] Install ESLint Tailwind plugin as dev dependency in root package.json: `eslint-plugin-tailwindcss@^3.14.0`
- [x] T007 Run `npm install` to install all new dependencies
- [x] T008 Update UI provider in packages/ui/src/lib/provider.tsx: Replace `NextUIProvider` import and component with `HeroUIProvider` from `@heroui/react`
- [x] T009 [P] Update component imports in packages/ui/src/lib/components/OrgansSection.tsx: Replace `@nextui-org/react` with `@heroui/react`
- [x] T010 [P] Update component imports in packages/ui/src/lib/components/GenderBalanceSection.tsx: Replace `@nextui-org/react` with `@heroui/react`
- [x] T011 [P] Update component imports in packages/ui/src/lib/components/AttachmentsSection.tsx: Replace `@nextui-org/react` with `@heroui/react`
- [x] T012 [P] Update component imports in apps/web/src/app/form/success/page.tsx: Replace `@nextui-org/react` with `@heroui/react`
- [x] T013 [P] Update component imports in apps/web/src/app/admin/sign-in/page.tsx: Replace `@nextui-org/react` with `@heroui/react`
- [x] T014 [P] Update component imports in apps/web/src/app/admin/dashboard/page.tsx: Replace `@nextui-org/react` with `@heroui/react`
- [x] T015 [P] Update component imports in apps/web/src/app/admin/companies/page.tsx: Replace `@nextui-org/react` with `@heroui/react`
- [x] T016 Update Tailwind plugin in apps/web/tailwind.config.ts: Replace `nextui()` import from `@nextui-org/theme` with `heroui()` from `@heroui/react`
- [x] T017 Update constitution in .specify/memory/constitution.md: Replace all references to "NextUI" with "HeroUI" and note migration from NextUI v2.4.0
- [x] T018: Run `npx nx build ui` and verify it builds successfully with HeroUI
- [x] T019: Run `npx nx build web` and verify the app renders correctly (check localhost:3000)

---

---

## Phase 2: Foundational - 8-Point Grid & Utilities (Blocking - Complete Before User Stories)

**Goal**: Configure 8-point grid spacing system, map fontAndColour.css to theme, create utility functions. All user stories depend on this foundation.

**Time Estimate**: 2-3 hours

**Independent Test Criteria**: 
- Tailwind spacing utilities (gap-1, gap-2, etc.) correctly map to 8-point grid (8px, 16px, etc.)
- fontAndColour.css variables are accessible via Tailwind color utilities (bg-primary, text-danger, etc.)
- `cn()` utility function correctly merges Tailwind classes and resolves conflicts

### Tasks

- [x] T020 Configure 8-point grid spacing scale in apps/web/tailwind.config.ts theme.extend.spacing: Map 1→8px, 2→16px, 3→24px, 4→32px, 5→40px, 6→48px, 8→64px, 10→80px, 12→96px
- [x] T021 Map fontAndColour.css color variables in apps/web/tailwind.config.ts theme.extend.colors: Map primary, secondary, success, danger, warning, info, light, dark to corresponding --bs-* variables
- [x] T022 Map fontAndColour.css font families in apps/web/tailwind.config.ts theme.extend.fontFamily: Map sans to --bs-body-font-family, mono to --bs-font-monospace
- [x] T023 Configure HeroUI theme colors in apps/web/tailwind.config.ts heroui plugin: Map semantic colors (primary, success, danger, warning, focus) to fontAndColour.css variables
- [x] T024 Create class composition utility in packages/ui/src/lib/utils/cn.ts: Implement `cn()` function using clsx and tailwind-merge
- [x] T025 Export cn utility from packages/ui/src/index.ts: Add `export { cn } from './lib/utils/cn'`
- [x] T026 Configure ESLint Tailwind plugin in eslint.config.mjs: Add tailwindcss/recommended, enable no-arbitrary-value (warn), enforces-shorthand (warn), no-contradicting-classname (error)
- [x] T027 Verify 8-point grid works: Create test component with gap-1, gap-2, gap-3 and inspect computed styles (should be 8px, 16px, 24px)
- [x] T028 Verify fontAndColour.css mapping works: Create test component with bg-primary, text-danger and inspect computed styles (should use CSS variables)

---

## Phase 3: User Story 1 (P1) - Improved Form Navigation and Layout

**Goal**: Redesign public company form with clean layout, proper section separation, consistent spacing using 8-point grid, and responsive behavior.

**Priority**: P1 (High) - Primary user entry point, directly impacts submission completion rates

**Time Estimate**: 4-6 hours

**Independent Test Criteria**:
- Navigate through entire form from start to submission
- All sections (Company Info, Organs, Gender Balance, Measures, Attachments) are visually distinct with consistent spacing
- Fields are properly aligned without horizontal scrolling on mobile (375px), tablet (768px), desktop (1920px)
- Form submission succeeds and redirects to success page with proper styling

### Tasks

- [x] T029 [P] [US1] Update company form main page in apps/web/src/app/page.tsx: Wrap content in responsive container with proper padding (px-4 py-6), apply 8-point grid spacing (gap-3 for sections)
- [x] T030 [P] [US1] Add form section wrapper cards: Ensure each section (Company Info, Organs, Gender Balance, Measures, Attachments) is wrapped in HeroUI Card with consistent padding (p-6)
- [x] T031 [P] [US1] Update OrgansSection component in packages/ui/src/lib/components/OrgansSection.tsx: Apply 8-point grid spacing (gap-3 for fields, mb-2 for headings), use cn() utility for conditional classes
- [x] T032 [P] [US1] Update GenderBalanceSection component in packages/ui/src/lib/components/GenderBalanceSection.tsx: Apply 8-point grid spacing (gap-3 for rows), ensure input fields align properly
- [x] T033 [P] [US1] Update AttachmentsSection component in packages/ui/src/lib/components/AttachmentsSection.tsx: Apply 8-point grid spacing (gap-2 for file list), ensure drag-drop zone has proper padding (p-6)
- [x] T034 [P] [US1] Make form fields responsive in all components: Stack vertically on mobile (<768px), 2-column grid on tablet (768-1023px), multi-column on desktop (1024px+) using Tailwind responsive utilities
- [x] T035 [P] [US1] Update form success page in apps/web/src/app/form/success/page.tsx: Apply consistent card styling (Card with p-6), proper spacing for message and action button (gap-3)
- [x] T036 [US1] Test form layout on mobile viewport (375px): Open form, verify no horizontal scroll, all fields visible and tappable
- [x] T037 [US1] Test form layout on tablet viewport (768px): Open form, verify responsive grid layout works, fields properly sized
- [x] T038 [US1] Test form layout on desktop viewport (1920px): Open form, verify multi-column layouts display correctly, no excessive white space
- [x] T039 [US1] Complete full form submission test: Fill out all sections, submit, verify redirect to success page with proper styling

---

## Phase 4: User Story 3 (P1) - Consistent Component Spacing and Alignment

**Goal**: Apply 8-point grid spacing system consistently across all pages and components for cohesive, professional appearance.

**Priority**: P1 (High) - Affects all users across all features, creates perception of quality

**Time Estimate**: 3-4 hours

**Independent Test Criteria**:
- Navigate through every page (form, admin sign-in, dashboard, companies, success pages)
- All spacing between elements follows 8-point grid (8px, 16px, 24px, 32px, 40px, 48px)
- All cards use consistent padding (p-6 = 48px)
- All form fields have consistent height and vertical spacing (gap-3 = 24px between fields)
- All buttons follow consistent sizing

### Tasks

- [x] T040 [P] [US3] Update admin sign-in page in apps/web/src/app/admin/sign-in/page.tsx: Apply 8-point grid spacing (gap-3 for form fields, p-6 for card), ensure buttons have consistent padding
- [x] T041 [P] [US3] Update admin dashboard page in apps/web/src/app/admin/dashboard/page.tsx: Apply 8-point grid spacing (gap-4 for page sections, p-6 for cards), consistent spacing around table
- [x] T042 [P] [US3] Update admin companies page in apps/web/src/app/admin/companies/page.tsx: Apply 8-point grid spacing (gap-4 for page layout, p-6 for table card)
- [x] T043 [P] [US3] Audit all Button components across codebase: Ensure consistent sizing using HeroUI size prop (size="md" or size="lg"), proper spacing with adjacent elements (gap-2 or gap-3)
- [x] T044 [P] [US3] Audit all Input components across codebase: Ensure consistent height (HeroUI default), proper vertical spacing (gap-3 between fields), labels properly aligned
- [x] T045 [P] [US3] Audit all Card components across codebase: Ensure consistent padding (p-6 for content, gap-3 for internal elements)
- [ ] T046 [US3] Visual inspection test - Form page: Measure spacing between sections (should be 24px), padding inside cards (should be 48px), verify consistency **[MANUAL TEST REQUIRED]**
- [ ] T047 [US3] Visual inspection test - Admin pages: Measure spacing between page elements (should follow grid), padding consistency, verify alignment **[MANUAL TEST REQUIRED]**
- [x] T048 [US3] Run ESLint to catch arbitrary Tailwind values: Fix any warnings about non-grid spacing values

---

## Phase 5: User Story 2 (P2) - Responsive Admin Dashboard

**Goal**: Make admin dashboard responsive across desktop, tablet, and mobile with appropriate table handling, navigation, and touch targets.

**Priority**: P2 (Medium) - Admins may need mobile access, but lower volume than public form users

**Time Estimate**: 4-5 hours

**Independent Test Criteria**:
- Access admin dashboard on desktop (1920px), tablet (768px), mobile (375px)
- All functionality accessible on each device
- Tables handle many columns appropriately (scroll, collapse, or card view)
- Navigation adapts to mobile (hamburger menu or alternative pattern)
- All actions have proper touch targets (min 44x44px on mobile)

### Tasks

- [x] T049 [P] [US2] Make admin dashboard table responsive in apps/web/src/app/admin/dashboard/page.tsx: Add horizontal scroll wrapper for table on mobile/tablet (<1024px), ensure table maintains proper spacing
- [x] T050 [P] [US2] Make admin companies table responsive in apps/web/src/app/admin/companies/page.tsx: Add horizontal scroll wrapper for table on mobile/tablet (<1024px), consider hiding less critical columns on mobile
- [ ] T051 [P] [US2] Ensure admin navigation is mobile-friendly: If navigation exists, make it responsive (hamburger menu, bottom nav, or similar pattern for <768px) **[NO NAVIGATION EXISTS - SKIP]**
- [x] T052 [P] [US2] Ensure all admin action buttons meet touch target size on mobile: Verify buttons are at least 44x44px (use size="lg" on HeroUI Button), proper spacing between buttons (gap-2 minimum)
- [x] T053 [P] [US2] Add responsive padding to admin layout: Reduce padding on mobile (px-4 py-6) compared to desktop (px-8 py-10) for better space utilization
- [ ] T054 [US2] Test admin dashboard on desktop (1920px): Login, view dashboard, verify table displays all columns, actions work, proper spacing
- [ ] T055 [US2] Test admin dashboard on tablet (768px): Login, view dashboard, verify table is scrollable or columns collapse, actions are tappable
- [ ] T056 [US2] Test admin dashboard on mobile (375px): Login, view dashboard, verify table is usable (scroll or cards), navigation accessible, no horizontal scroll
- [ ] T057 [US2] Test admin companies page across viewports: Verify responsive behavior consistent with dashboard tests

---

## Phase 6: User Story 4 (P2) - Touch-Friendly Mobile Interface

**Goal**: Optimize mobile experience with proper touch targets, spacing, scrolling, and mobile-friendly controls.

**Priority**: P2 (Medium) - Important for mobile users but builds on previous responsive work

**Time Estimate**: 3-4 hours

**Independent Test Criteria**:
- Use mobile device (or emulator at 375px) to complete form submission and admin tasks
- All interactive elements are easily tappable without accidental clicks
- All touch targets meet 44x44px minimum with 8px spacing
- Scrolling is smooth without layout shift
- Dropdowns and controls are appropriately sized for touch

### Tasks

- [x] T058 [P] [US4] Audit all interactive elements for touch target size: Find buttons, links, inputs, checkboxes, radio buttons that are <44x44px and fix using HeroUI size prop or custom padding
- [x] T059 [P] [US4] Ensure adequate spacing between interactive elements: Verify minimum 8px gap (gap-1) between adjacent buttons, links, or inputs on mobile
- [x] T060 [P] [US4] Optimize select dropdowns for mobile in form components: Ensure HeroUI Select components have large enough touch targets, proper dropdown sizing
- [x] T061 [P] [US4] Optimize date pickers for mobile (if applicable): Ensure date inputs use native mobile date picker or appropriately sized custom picker
- [x] T062 [P] [US4] Test scrolling performance on mobile: Verify smooth scrolling without janky animations, no layout shift during scroll (CLS < 0.1)
- [ ] T063 [US4] Mobile touch test - Form inputs: On mobile device, tap each form field, verify correct field receives focus without triggering adjacent elements
- [ ] T064 [US4] Mobile touch test - Buttons and actions: On mobile device, tap all buttons and links, verify proper activation without accidental adjacent clicks
- [ ] T065 [US4] Mobile touch test - Admin dashboard: On mobile device, perform admin tasks (view submissions, export CSV, navigate), verify all actions are easily tappable

---

## Phase 7: User Story 5 (P3) - Clear Visual Hierarchy and Typography

**Goal**: Establish clear visual hierarchy through proper heading sizes, body text, labels, and secondary information using fontAndColour.css.

**Priority**: P3 (Lower) - Enhances UX but not blocking for functionality

**Time Estimate**: 2-3 hours

**Independent Test Criteria**:
- Review each page and verify h1, h2, h3 headings are visually distinct
- Body text is readable (16px minimum, line-height 1.5-1.8)
- Labels are clearly associated with inputs
- Secondary text (hints, captions) is visually subordinate to primary content

### Tasks

- [x] T066 [P] [US5] Define typography scale in apps/web/tailwind.config.ts or global CSS: Establish h1 (text-3xl or text-4xl), h2 (text-2xl), h3 (text-xl), body (text-base = 16px), small (text-sm)
- [x] T067 [P] [US5] Apply heading hierarchy to form page in apps/web/src/app/page.tsx: Use h1 for page title, h2 for section headings, proper font weight (font-semibold or font-bold)
- [x] T068 [P] [US5] Apply heading hierarchy to admin pages: Use h1 for page titles, h2 for sections in apps/web/src/app/admin/dashboard/page.tsx and apps/web/src/app/admin/companies/page.tsx
- [x] T069 [P] [US5] Ensure body text readability: Verify all paragraphs and lists use text-base (16px) with line-height-relaxed (1.5) or line-height-loose (1.8)
- [x] T070 [P] [US5] Style form labels for clarity: Ensure labels use proper font weight (font-medium) and spacing (mb-1 or mb-2) to associate with inputs
- [x] T071 [P] [US5] Style secondary information (hints, captions, metadata): Use text-sm with muted color (text-gray-600 or text-secondary) to indicate lower importance
- [ ] T072 [US5] Visual inspection - Typography hierarchy: Review each page, verify headings are visually distinct, body text is readable, labels are clear
- [ ] T073 [US5] Test typography at 200% zoom: Zoom browser to 200%, verify text remains readable and layout doesn't break

---

## Phase 8: Polish & Integration

**Goal**: Add responsive viewport tests, run full test suite, optimize performance, final validation.

**Time Estimate**: 4-5 hours

**Cross-cutting test criteria**:
- All Playwright E2E tests pass with viewport screenshot comparison
- No horizontal scroll on any page at any viewport (320px to 2560px)
- CLS < 0.1 on all pages
- All ESLint errors resolved
- Visual consistency across all pages

### Tasks

- [x] T074 Create viewport test utilities in apps/web/tests/e2e/utils/viewports.ts: Define VIEWPORTS constant with mobile (375x667), tablet (768x1024), desktop (1920x1080)
- [ ] T075 Create responsive test suite in apps/web/tests/e2e/responsive.spec.ts: Implement viewport-specific tests for form page with screenshot comparison **[E2E TEST - REQUIRES PLAYWRIGHT]**
- [ ] T076 [P] Add viewport tests for admin sign-in in apps/web/tests/e2e/responsive.spec.ts: Test responsive layout across mobile, tablet, desktop with screenshots **[E2E TEST - REQUIRES PLAYWRIGHT]**
- [ ] T077 [P] Add viewport tests for admin dashboard in apps/web/tests/e2e/responsive.spec.ts: Test responsive layout, table handling, no horizontal scroll with screenshots **[E2E TEST - REQUIRES PLAYWRIGHT]**
- [ ] T078 [P] Add touch target size tests in apps/web/tests/e2e/responsive.spec.ts: Test all interactive elements meet 44x44px minimum on mobile and tablet viewports **[E2E TEST - REQUIRES PLAYWRIGHT]**
- [x] T079 Update Playwright config in playwright.config.ts: Add viewport configurations for mobile, tablet, desktop test projects
- [x] T080 Update existing E2E tests in apps/web/tests/e2e/form.spec.ts: Update selectors if needed for HeroUI components, ensure tests still pass
- [x] T081 Update existing E2E tests in apps/web/tests/e2e/admin.spec.ts: Update selectors if needed for HeroUI components, ensure tests still pass
- [ ] T082 Run all Playwright tests and generate baseline screenshots: Execute `npx playwright test` to create initial screenshot baselines **[E2E TEST - REQUIRES PLAYWRIGHT]**
- [x] T083 Run full test suite: Execute `npm test` to verify all unit tests pass after changes
- [x] T084 Run ESLint and fix remaining issues: Execute `npm run lint`, address any errors or warnings
- [ ] T085 Run performance audit with Lighthouse: Test form page and admin dashboard, verify CLS < 0.1, FCP < 1.8s, TTI < 3.8s **[MANUAL PERFORMANCE TEST]**
- [ ] T086 Manual cross-browser testing: Test on Chrome, Safari, Mobile Safari, Mobile Chrome - verify responsive behavior consistent **[MANUAL BROWSER TEST]**
- [ ] T087 Measure form completion time improvement: Have users test new form, measure completion time, verify 20% improvement over baseline **[MANUAL USER TEST]**
- [ ] T088 Final visual inspection: Navigate through all pages, verify consistent spacing, no alignment issues, professional appearance **[MANUAL VISUAL TEST]**
- [x] T089 Update CHANGELOG.md: Document NextUI → HeroUI migration, 8-point grid implementation, responsive design improvements
- [x] T090 Commit all changes: Stage changes by category (migration, grid system, responsive components, tests), create descriptive commits

---

## Task Summary

**Total Tasks**: 90

**Phase Breakdown**:
- Phase 1 (Setup): 19 tasks (3-4 hours)
- Phase 2 (Foundational): 9 tasks (2-3 hours)
- Phase 3 (US1 - P1): 11 tasks (4-6 hours)
- Phase 4 (US3 - P1): 9 tasks (3-4 hours)
- Phase 5 (US2 - P2): 9 tasks (4-5 hours)
- Phase 6 (US4 - P2): 8 tasks (3-4 hours)
- Phase 7 (US5 - P3): 8 tasks (2-3 hours)
- Phase 8 (Polish): 17 tasks (4-5 hours)

**User Story Task Distribution**:
- US1 (P1 - Form Layout): 11 tasks
- US3 (P1 - Consistent Spacing): 9 tasks
- US2 (P2 - Admin Dashboard): 9 tasks
- US4 (P2 - Touch-Friendly): 8 tasks
- US5 (P3 - Typography): 8 tasks

**Parallel Execution Opportunities**:
- Phase 1: 7 parallel tasks (T003-T006, T009-T015) - component import updates
- Phase 2: 0 parallel tasks (foundational setup must be sequential)
- Phase 3: 7 parallel tasks (T029-T035) - independent component updates
- Phase 4: 6 parallel tasks (T040-T045) - independent page updates
- Phase 5: 5 parallel tasks (T049-T053) - independent page updates
- Phase 6: 4 parallel tasks (T058-T061) - independent audits
- Phase 7: 6 parallel tasks (T066-T071) - independent typography updates
- Phase 8: 3 parallel tasks (T076-T078) - independent test suites

**Total Parallel Opportunities**: 38 tasks (42% of total)

**Estimated Total Time**: 26-34 hours

**MVP Scope** (Minimum Viable Product):
- Phase 1 (Setup): Required
- Phase 2 (Foundational): Required
- Phase 3 (US1): Required - Public form responsive redesign
- **MVP Total**: ~9-13 hours, delivers improved public form with 8-point grid spacing

**Incremental Delivery Milestones**:
1. **Milestone 1 (MVP)**: Deploy US1 - Improved form layout (highest impact)
2. **Milestone 2**: Deploy US3 - Consistent spacing across all pages
3. **Milestone 3**: Deploy US2 - Responsive admin dashboard
4. **Milestone 4**: Deploy US4 - Touch-friendly mobile optimizations
5. **Milestone 5**: Deploy US5 - Typography refinements

**Independent Test Validation**: Each user story phase includes specific test criteria that can be validated independently without waiting for other stories to complete.

---

## Validation Checklist

**Format Compliance**:
- [x] All tasks follow checkbox format: `- [ ]`
- [x] All tasks have sequential IDs: T001, T002, T003...
- [x] Parallelizable tasks marked with [P]
- [x] User story tasks marked with [US1], [US2], etc.
- [x] All tasks include file paths or clear scope
- [x] No tasks use placeholder syntax like "...existing code..."

**Completeness**:
- [x] Setup phase covers all dependency installation and migration
- [x] Foundational phase establishes 8-point grid and utilities
- [x] Each user story has implementation tasks matching acceptance scenarios
- [x] Each user story has independent test criteria
- [x] Polish phase includes E2E tests, performance, and validation
- [x] Dependencies section shows execution order
- [x] Parallel opportunities identified

**Execution Readiness**:
- [x] Tasks are immediately executable by developer
- [x] Each task is specific with file paths
- [x] No ambiguous tasks requiring clarification
- [x] MVP scope clearly defined
- [x] Incremental delivery path established

---

**Tasks Ready for Execution** ✅

Begin with Phase 1 (Setup) and proceed sequentially through phases. Within each phase, execute [P] tasks in parallel where possible.
