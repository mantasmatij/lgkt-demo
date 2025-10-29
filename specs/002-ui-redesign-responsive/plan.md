# Implementation Plan: UI Redesign & Responsive Implementation

**Branch**: `002-ui-redesign-responsive` | **Date**: 2025-01-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-ui-redesign-responsive/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

**Primary Requirement**: Redesign UI with consistent spacing (8-point grid system), responsive layouts across mobile/tablet/desktop viewports, and WCAG 2.1 Level AA accessibility compliance. Address current issues with inconsistent alignment, navigation difficulty, and poor mobile experience.

**Technical Approach**: 
1. **Migrate from NextUI v2.4.0 to HeroUI v2.5.x** (NextUI deprecated) with minimal API changes
2. **Implement 8-point grid spacing system** via custom Tailwind theme extension (8px, 16px, 24px, 32px, 40px, 48px base units)
3. **Extend Playwright E2E tests** with viewport-specific screenshot comparison (375px mobile, 768px tablet, 1920px desktop)
4. **Integrate recommended dependencies**: Framer Motion (animations), React Hook Form (form state), clsx/tailwind-merge (class composition)
5. **Map fontAndColour.css variables** to HeroUI theme tokens for constitutional compliance (exclusive styling source)
6. **Big bang deployment** after comprehensive testing per user clarification

## Technical Context

**Language/Version**: TypeScript (ES2022 target), Node 20+  
**Primary Dependencies**: 
  - **HeroUI v2.5.x** (migrating from NextUI v2.4.0 - deprecated)
  - **Framer Motion v11+** (animations, micro-interactions)
  - **React Hook Form v7+** (form state management with Zod integration)
  - **clsx + tailwind-merge** (conditional Tailwind class composition)
  - **Tailwind CSS v3+** (utility-first CSS with custom 8-point grid theme)
  - **Playwright** (E2E testing with viewport screenshot comparison)

**Storage**: N/A (UI-only feature, no database schema changes)  
**Testing**: 
  - **Playwright**: E2E viewport testing (375px mobile, 768px tablet, 1920px desktop) with screenshot comparison
  - **Jest**: Unit tests for utility functions (if needed)
  - **Cucumber**: Frontend behavior-driven testing (per constitution, if applicable)

**Target Platform**: Web (Next.js 15 SSR), responsive across mobile (320-767px), tablet (768-1023px), desktop (1024px+)  
**Project Type**: Web application (Nx monorepo with `apps/web`, `packages/ui`)  

**Performance Goals**: 
  - Cumulative Layout Shift (CLS) < 0.1 (Success Criterion SC-004)
  - First Contentful Paint (FCP) < 1.8s on 3G mobile (Success Criterion SC-005)
  - Time to Interactive (TTI) < 3.8s on 3G mobile (Success Criterion SC-006)
  - 20% faster form completion time (Success Criterion SC-003)

**Constraints**: 
  - **fontAndColour.css exclusive styling source**: All fonts and colors MUST be sourced from fontAndColour.css CSS variables (Constitutional Principle III)
  - **8-point grid system**: All spacing MUST use 8px base unit multiples (8px, 16px, 24px, 32px, 40px, 48px) per user clarification
  - **44x44px minimum touch targets**: WCAG 2.1 Level AA compliance (Success Criterion SC-002)
  - **No horizontal scroll**: At any viewport width (Success Criterion SC-001)
  - **200% zoom support**: Layout must remain functional at 200% browser zoom (Edge Case EC-001)
  - **Maintain existing functionality**: UI redesign only, no feature additions or removals

**Scale/Scope**: 
  - **7 files using NextUI components** to migrate to HeroUI
  - **5 primary pages**: Company form, form success, admin sign-in, admin dashboard, admin companies list
  - **3 viewport breakpoints**: mobile (375px reference), tablet (768px reference), desktop (1920px reference)
  - **~40 UI components** from NextUI/HeroUI library (Button, Input, Card, Table, Select, etc.)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with LGKT Forma Constitution v1.0.0:

- [x] **I. Clean Code Excellence**: Design promotes readable, maintainable code structure
  - ✅ 8-point grid system provides clear spacing values (no magic numbers)
  - ✅ Tailwind utility classes are self-documenting
  - ✅ HeroUI components follow consistent naming conventions
  - ✅ Responsive breakpoint utilities (sm:, md:, lg:) clearly indicate viewport targeting

- [x] **II. Simple & Intuitive UX**: User interface patterns are simple and use HeroUI components (migrated from NextUI)
  - ✅ HeroUI component library maintains established patterns from NextUI
  - ✅ Consistent spacing improves visual hierarchy and predictability
  - ✅ Responsive design ensures intuitive experience across all devices
  - ✅ WCAG 2.1 Level AA compliance improves accessibility

- [x] **III. Responsive Design First**: Design considers mobile, tablet, and desktop viewports
  - ✅ Mobile-first approach with progressive enhancement
  - ✅ Three breakpoints tested: mobile (375px), tablet (768px), desktop (1920px)
  - ✅ Touch targets meet 44x44px minimum for mobile usability
  - ✅ fontAndColour.css remains exclusive source for fonts/colors (mapped to HeroUI theme)
  - ✅ 200% zoom support for accessibility

- [x] **IV. DRY**: Architecture avoids duplication; shared logic identified for extraction
  - ✅ Custom Tailwind theme extension provides single source of truth for 8-point spacing scale
  - ✅ fontAndColour.css variables mapped once in Tailwind config, reused everywhere
  - ✅ HeroUI components eliminate need for custom component duplication
  - ✅ clsx/tailwind-merge utility function `cn()` centralizes class composition logic
  - ✅ Responsive patterns defined once via Tailwind config, applied via utilities

- [x] **V. Minimal Dependencies**: New dependencies justified; preference for existing stack
  - ✅ **HeroUI v2.5.x**: REQUIRED (NextUI deprecated, maintains API compatibility, -40 packages)
  - ✅ **Framer Motion v11+**: JUSTIFIED (+32KB for enhanced UX, used internally by HeroUI)
  - ✅ **React Hook Form v7+**: JUSTIFIED (+25KB for DRY form state, native Zod integration)
  - ✅ **clsx + tailwind-merge**: JUSTIFIED (+1KB for clean code, prevents Tailwind conflicts)
  - ✅ **eslint-plugin-tailwindcss**: JUSTIFIED (0KB runtime, enforces spacing scale compliance)
  - ⚠️ **@tanstack/react-table**: DEFERRED (+15KB, unclear feature scope, revisit in Phase 1)
  - **Net Impact**: +5 dependencies, +73KB bundle (justified by UX/DX improvements)

- [x] **VI. Comprehensive Testing**: Testing strategy defined (Jest for backend, Cucumber for frontend, Playwright for E2E)
  - ✅ Playwright E2E tests extended with viewport-specific screenshot comparison
  - ✅ Visual regression tests cover all primary pages across 3 viewports
  - ✅ Tests validate no horizontal scroll, touch target sizes, layout stability (CLS)
  - ✅ Existing Jest/Cucumber framework maintained (no changes to backend/validation tests)

- [x] **VII. Technology Stack Compliance**: 
  - [x] **Uses Nx monorepo structure**: ✅ No changes, work in existing `apps/web`, `packages/ui`
  - [x] **TypeScript for all code**: ✅ No changes, all new code in TypeScript
  - [x] **Express for backend**: ✅ N/A, UI-only feature
  - [x] **Drizzle ORM + PostgreSQL with migrations for database**: ✅ N/A, no database changes
  - [x] **Zod for validation (frontend + backend)**: ✅ Enhanced with React Hook Form integration
  - [x] **HeroUI for UI components** (updated from NextUI): ✅ MIGRATION REQUIRED
  - [x] **fontAndColour.css for styling**: ✅ Mapped to Tailwind/HeroUI theme, remains exclusive source

**Constitutional Compliance Status**: ✅ **PASSED** - All principles satisfied with clear justifications

*No complexity tracking entries needed - all decisions align with constitutional principles.*

## Project Structure

### Documentation (this feature)

```
specs/002-ui-redesign-responsive/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command) ✅ COMPLETE
├── data-model.md        # Phase 1 output - NOT NEEDED (UI-only, no DB changes)
├── quickstart.md        # Phase 1 output (/speckit.plan command) - TODO
├── contracts/           # Phase 1 output - NOT NEEDED (no new API contracts)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```
lgkt-forma/ (Nx monorepo)
├── apps/
│   ├── web/                         # Next.js 15 frontend (PRIMARY FOCUS)
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── page.tsx         # Company form (US1: Form layout)
│   │   │   │   ├── form/
│   │   │   │   │   └── success/
│   │   │   │   │       └── page.tsx # Form success page
│   │   │   │   └── admin/
│   │   │   │       ├── sign-in/
│   │   │   │       │   └── page.tsx # Admin sign-in (US2: Admin dashboard)
│   │   │   │       ├── dashboard/
│   │   │   │       │   └── page.tsx # Admin dashboard (US2)
│   │   │   │       └── companies/
│   │   │   │           └── page.tsx # Companies list (US2)
│   │   ├── tailwind.config.ts       # MODIFY: Add 8-point grid, HeroUI plugin, fontAndColour.css mapping
│   │   ├── postcss.config.js        # Existing, no changes
│   │   └── tests/
│   │       └── e2e/
│   │           ├── form.spec.ts           # MODIFY: Add viewport screenshot tests
│   │           ├── admin.spec.ts          # MODIFY: Add viewport screenshot tests
│   │           └── responsive.spec.ts     # NEW: Dedicated responsive test suite
│   │
│   └── api/                         # Express backend (NO CHANGES for this feature)
│
├── packages/
│   ├── ui/                          # Shared UI components (SECONDARY FOCUS)
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── provider.tsx     # MODIFY: NextUIProvider → HeroUIProvider
│   │   │   │   ├── components/
│   │   │   │   │   ├── OrgansSection.tsx     # MODIFY: Update NextUI imports → HeroUI
│   │   │   │   │   ├── GenderBalanceSection.tsx  # MODIFY: Update NextUI imports → HeroUI
│   │   │   │   │   └── AttachmentsSection.tsx    # MODIFY: Update NextUI imports → HeroUI
│   │   │   │   └── utils/
│   │   │   │       └── cn.ts        # NEW: clsx + tailwind-merge utility
│   │   │   └── styles/              # Existing, no changes
│   │   └── package.json             # MODIFY: Replace @nextui-org/react → @heroui/react
│   │
│   ├── db/                          # Database (NO CHANGES)
│   ├── validation/                  # Zod schemas (NO CHANGES, but used by React Hook Form)
│   └── contracts/                   # API contracts (NO CHANGES)
│
├── fontAndColour.css                # Existing CSS variables (NO CHANGES, mapped to theme)
├── package.json                     # MODIFY: Update dependencies
└── playwright.config.ts             # MODIFY: Add viewport configurations
```

**Structure Decision**: 
This is an **Option 2: Web application** implementation within an existing Nx monorepo. Primary work occurs in:
1. **`apps/web`**: Update Next.js pages with responsive layouts, Tailwind config with 8-point grid
2. **`packages/ui`**: Migrate NextUI → HeroUI components, add utility functions
3. **`tests/e2e`**: Extend Playwright tests with viewport screenshot comparison

**No new directories or apps required** - all work modifies existing structure. This maintains DRY principle and monorepo consistency.

## Complexity Tracking

*No constitutional violations or complexity exceptions needed for this feature.*

All design decisions align with constitutional principles:
- HeroUI migration addresses deprecated dependency (Principle V, VII)
- 8-point grid system promotes clean code and DRY (Principles I, IV)
- Responsive design is core constitutional requirement (Principle III)
- All new dependencies have clear justifications (Principle V)
- Testing strategy extends existing Playwright framework (Principle VI)

**No simpler alternatives required** - implementation follows straightforward responsive design patterns using established tools.

