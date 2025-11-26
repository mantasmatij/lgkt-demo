# Quickstart: Implementing Form Field & UI Fixes

**Feature Branch**: `009-form-fields-fixes`

## 1. Environment Setup
```bash
git checkout 009-form-fields-fixes
npm install
npm run dev:up  # Start docker-compose stack (API, DB, Web)
npm run db:seed:dev
```

## 2. Focus Areas Sequence
1. Accessibility & required indicators (User Story 1)
2. Layout consistency (User Story 2)
3. Validation message unification (User Story 3)
4. Localization completion (User Story 4)

## 3. Key Files
- Form page: `web/src/app/form/page.tsx`
- Shared UI components: `web/src/components/ui/`
- i18n dictionaries: `web/src/i18n/dictionaries/{en,lt}.ts`
- Validation schema: `web/src/lib/validation/companyForm.ts`

## 4. Implementation Guidelines
- Add new text → create i18n key in both EN & LT before commit.
- Required fields: ensure visual asterisk + `aria-required`.
- Error summary limit: show first 5; append line `+ X more not shown` if overflow.
- Blur-based clearing: validate field on blur; remove its error when passing.
- Disable submit once POST initiated; re-enable only on failure.

## 5. Testing
### Unit Tests (Jest)
Add tests for:
- Error summary overflow logic
- Validation issue removal on blur
- Duplicate submission prevention

Run:
```bash
npm test
```

### Accessibility
Use `jest-axe` or similar to verify:
- Required indicators are announced
- Error summary heading focus behavior

### Localization Scan (Optional Automation)
Implement a simple script scanning `web/src/app/form/page.tsx` for quoted strings lacking `t(` invocation.

## 6. Manual QA Checklist
- Submit empty form: summary + inline errors appear; heading focused.
- Correct one field: its error clears; summary updates.
- Resize to 320px width: no horizontal scroll; elements readable.
- Switch locale: all new/changed strings localized.
- Disable JS (DevTools): upgrade banner visible; submission disabled.

## 7. Future Hooks (Not in Scope Now)
- Draft save endpoints
- Field-level autosave
- Inline real-time validation

## 8. Rollback Plan
If issues arise:
1. Revert component refactor commit(s)
2. Restore previous dictionaries from Git history
3. Disable error summary modifications (fallback to legacy behavior)

## 9. Completion Signal
Stakeholder will explicitly state "We Are Done"; after that, tidy up TODO comments and finalize PR.

## 10. Next Steps After Completion
- Generate tasks via `/speckit.tasks` (if not already)
- Prepare PR description referencing spec and success criteria metrics
