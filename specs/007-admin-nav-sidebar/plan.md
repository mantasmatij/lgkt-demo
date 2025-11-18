# Implementation Plan: Admin Navigation Sidebar

**Branch**: `007-admin-nav-sidebar` | **Date**: 2025-11-14 | **Spec**: ./spec.md
**Input**: Feature specification from `/specs/007-admin-nav-sidebar/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Introduce a persistent, collapsible right-side admin navigation sidebar listing core destinations (Companies, Forms & Reports, Submissions / Exports, Settings placeholder) plus embedded language switcher. Improves discoverability and reduces manual URL entry. Technical approach: Add reusable `AdminSidebar` client component in `web` app using existing HeroUI + Tailwind tokens, integrate i18n provider for language switch, store collapse state in session (sessionStorage + cookie fallback) and optionally expose lightweight preference endpoints for persistence. Provide accessible semantics (ARIA states, focus order) and keyboard operability. No new database tables; preferences reused via existing session mechanisms. Optional REST endpoints defined for future persistence.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript (ES2022) / Node 20+  
**Primary Dependencies**: Next.js (App Router), HeroUI (components), Tailwind CSS, Express (API), Drizzle ORM, Zod (validation), i18n context (existing)  
**Storage**: PostgreSQL (existing), plus sessionStorage/cookie for sidebar state (no new tables)  
**Testing**: Jest (backend), Playwright (current e2e) + integrate Cucumber-style scenarios (constitution) for new flows  
**Target Platform**: Web (desktop-first admin, responsive support)  
**Project Type**: Nx monorepo (apps: web, api; packages: db, validation, contracts)  
**Performance Goals**: Navigation interaction latency perceived instantaneous (<150ms DOM update); language switch visible update <2s  
**Constraints**: Must not regress layout performance; minimal bundle size increase (<10KB gzipped incremental)  
**Scale/Scope**: Single feature component; affects all admin pages; expected admin user base <500 concurrent.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify compliance with LGKT Forma Constitution v1.0.0 (Re-evaluated Post Design):

- [x] **I. Clean Code Excellence**: Component isolated, descriptive names, clear responsibilities
- [x] **II. Simple & Intuitive UX**: Uses HeroUI (updated stack) with obvious navigation labels
- [x] **III. Responsive Design First**: Collapses automatically under narrow width; tested across breakpoints
- [x] **IV. DRY**: Shared nav item definitions centralised; language switch reuses existing provider
- [x] **V. Minimal Dependencies**: No new external libs introduced
- [x] **VI. Comprehensive Testing**: Plan includes unit tests for state logic + e2e scenarios (Playwright + future Cucumber alignment)
-- [x] **VII. Technology Stack Compliance**: 
  - [x] Uses Nx monorepo structure
  - [x] TypeScript for all code
  - [x] Express for backend (optional preference endpoints)
  - [x] Drizzle ORM + PostgreSQL with migrations (no new migrations needed)
  - [x] Zod for validation (language preference payloads)
  - [x] HeroUI for UI components (constitution update from NextUI)
  - [x] fontAndColour.css for styling tokens

All gates pass; no violations introduced by Phase 1 design artifacts.

## Project Structure

### Documentation (this feature)

```
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```
web/
  src/
    app/
      admin/
        (new) layout.tsx or sidebar injection point
        components/AdminSidebar.tsx
        components/AdminNavItem.tsx
    lib/
      navigation/
        navItems.ts (shared definitions)
        preference.ts (collapse state helpers)
        activeMatch.ts
        analytics.ts
        languageOptions.ts
api/
  src/
    routes/admin/preferences.ts (optional endpoints for sidebar-state, language)
    services/preferences.service.ts
validation/
  src/sidebarState.schema.ts
tests/
  web/e2e/admin_sidebar.spec.ts (navigation + collapse + language + a11y + performance)
  web/unit/components/AdminSidebar.test.ts
  web/unit/navigation/preference.test.ts
  web/unit/navigation/navItems.test.ts
  web/unit/navigation/analytics.test.ts
```

**Structure Decision**: Extend existing `web` app admin area with sidebar component and supportive lib folder for navigation config; optional lightweight API route added under `api/src/routes/admin` for preference persistence; add tests grouped with existing web e2e and unit patterns; no new top-level packages.

## Complexity Tracking

*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (none) | Feature aligns fully | N/A |

