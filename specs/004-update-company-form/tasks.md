# Tasks: Company Form Updates (Feature 004)

Created: 2025-10-31
Branch: 004-update-company-form
Spec: /specs/004-update-company-form/spec.md
Plan: /specs/004-update-company-form/plan.md

## Phase 1 — Setup

- [ ] T001 Confirm local dev services run with Docker compose (postgres, api, web) in docker/docker-compose.yml
- [ ] T002 Add shared enum and labels for Company Type in web/src/lib/constants/companyType.ts
- [ ] T003 Add i18n keys for Company Type options (LT/EN) in web/src/i18n/company.json
- [ ] T004 Ensure Zod is available in web (package.json already includes zod)
- [ ] T005 Wire root script to run e2e UI tests (already present: test:e2e), verify availability in package.json

## Phase 2 — Foundational

- [ ] T006 Create/extend form validation schema (Zod) for company form in web/src/lib/validation/companyForm.ts
- [ ] T007 Implement stable payload mapping (enum → value; removed fields as null/empty) in web/src/lib/mappers/companyFormMapper.ts
- [ ] T008 Introduce shared date constraint helper (min 1990-01-01) in web/src/lib/validation/date.ts
- [ ] T009 Add gender-balance triplet validator (women + men = total) in web/src/lib/validation/gender.ts

## Phase 3 — User Story 1 (P1): Submit updated company form

Goal: User can complete the updated company form, including Company Type and Section 12 (required), with date constraints, and submit successfully.
Independent test: Fill all fields, ensure validation blocks <1990 dates, submit and verify payload includes Company Type and removed fields keys as null/empty.

- [ ] T010 [US1] Remove Country field from UI components in web/src/components/forms/company/CompanyForm.tsx
- [ ] T011 [US1] Remove Contact & Other section from UI in web/src/components/forms/company/CompanyForm.tsx
- [ ] T012 [US1] Add Company Type select bound to schema in web/src/components/forms/company/CompanyForm.tsx
- [ ] T013 [US1] Add Section 12 reasons text (required) in web/src/components/forms/company/CompanyForm.tsx
- [ ] T014 [US1] Apply min date (>=1990) to all date inputs (report period; governance dates) in web/src/components/forms/company/CompanyForm.tsx
- [ ] T015 [US1] Validate From <= To for report period in web/src/components/forms/company/CompanyForm.tsx
- [ ] T016 [US1] Apply gender-balance totals validation (8.1–8.3) in web/src/components/forms/company/CompanyForm.tsx
- [ ] T017 [US1] Ensure requirements radio + link + optional files continue to work in web/src/components/forms/company/CompanyForm.tsx
- [ ] T018 [US1] Ensure confirmation checkbox is required in web/src/components/forms/company/CompanyForm.tsx
- [ ] T019 [US1] Map payload per FR-004/FR-016/FR-017 in web/src/app/api/submitCompanyForm/route.ts
- [ ] T020 [US1] Manual QA script: follow quickstart.md and verify payload shape via network devtools
 - [ ] T034 [US1] Ensure example link (section 11) remains visible and clickable in web/src/components/forms/company/CompanyForm.tsx

## Phase 4 — User Story 2 (P2): Localized option labels

Goal: Company Type options display localized labels while maintaining stable payload values.
Independent test: Toggle language and verify labels change but underlying value remains the same.

- [ ] T021 [US2] Bind Company Type select to localized labels (LT/EN) in web/src/components/forms/company/CompanyForm.tsx
- [ ] T022 [US2] Add i18n toggles and verify labels switch in web/src/components/forms/company/CompanyForm.tsx
- [ ] T023 [US2] Ensure mapper uses stable enum values independent of label in web/src/lib/mappers/companyFormMapper.ts

## Phase 5 — User Story 3 (P3): Simplified layout

Goal: Most inputs are single-line on desktop; vertical stacking on mobile; labels clear and readable.
Independent test: Desktop shows single-line groupings for 1.1–1.3; mobile stacks vertically.

- [ ] T024 [US3] Implement single-line groupings for 1.1–1.3 in web/src/components/forms/company/CompanyForm.tsx
- [ ] T025 [US3] Align remaining sections per pseudo-layout with clear labels in web/src/components/forms/company/CompanyForm.tsx
- [ ] T026 [US3] Ensure responsive stacking on mobile (Tailwind classes) in web/src/components/forms/company/CompanyForm.tsx

## Final Phase — Polish & Cross-Cutting

- [ ] T027 Add unit tests for validators (date, gender) in web/src/lib/validation/__tests__/validators.test.ts
- [ ] T028 Add Cucumber scenarios for US1 happy path in web/tests/e2e/company-form.feature
- [ ] T029 Add Playwright e2e for submission and layout checks in web/tests/e2e/company-form.spec.ts
- [ ] T030 Update docs if paths differ (research.md/quickstart.md) in specs/004-update-company-form

## Dependencies (Story Order)

1. US1 → US2 → US3 (US1 delivers MVP submission; US2/US3 are UX enhancements)

## Parallel Execution Examples

- [ ] T031 [P] Implement enum + labels (T002, T003) in parallel to schema setup (T006)
- [ ] T032 [P] Build validators (T008, T009) in parallel to removing UI fields (T010, T011)
- [ ] T033 [P] US2 label binding (T021) can run in parallel with US1 payload mapping (T019)

## Implementation Strategy

- MVP is US1: form submission with new fields and validations.
- Deliver in increments: US1 → US2 → US3, validating each independently.
- Keep payload mapping stable and language-independent; UI-only removals preserved as null keys.

## Format validation

All tasks follow the checklist format: `- [ ] T### [P?] [US?] Description with file path`.
