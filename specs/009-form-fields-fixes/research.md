# Research & Decisions: Page-wide Form Field & UI Fixes

**Date**: 2025-11-24  
**Branch**: `009-form-fields-fixes`

## Overview
Clarifications resolved (JS required, error summary overflow message, no progressive enhancement fallback). Research focuses on accessibility, validation feedback patterns, localization coverage enforcement, and layout consistency without introducing new backend endpoints.

## Decisions

### D1: JavaScript Requirement
**Decision**: JavaScript is required for the form; if disabled, user sees upgrade message and cannot submit.
**Rationale**: Dynamic sections (organs, measures, attachments) and client-side validation rely on JS; implementing a non-JS path adds complexity with low user impact.
**Alternatives Considered**:
- Progressive enhancement (rejected: complexity + maintenance overhead)
- Minimal HTML-only submission (rejected: dynamic repeated sections require JS)

### D2: Error Summary Overflow Pattern
**Decision**: Show first N (default 5) errors; append “+ X more not shown” line for remainder.
**Rationale**: Balances clarity and avoids overwhelming users; accessible screen reader-friendly phrasing.
**Alternatives**:
- Show all errors (risk of clutter)
- Expandable toggle (adds extra interaction cost)

### D3: Inline Error Clearing Trigger
**Decision**: Clear inline errors on field input blur if value now valid.
**Rationale**: Immediate feedback; avoids noisy re-validation on each keystroke; consistent with existing form behavior.
**Alternatives**: Real-time keystroke validation (more CPU/bandwidth, potential jitter).

### D4: Required Field Indicators
**Decision**: Use visual asterisk + `aria-required="true"` + programmatic required mapping.
**Rationale**: Dual signaling for assistive tech and visual users; widely understood pattern.
**Alternatives**: Text-only “(required)” suffix (longer labels) or color-only (fails WCAG contrast/symbol reliance).

### D5: Localization Enforcement
**Decision**: Add automated check (during PR or test) scanning for new hardcoded strings in form page and components; failing test if missing dictionary key.
**Rationale**: Prevent regression where new fields appear in English only.
**Alternatives**: Manual reviewer checklist (less reliable).

### D6: Focus Management on Validation Failure
**Decision**: Move focus to error summary heading using `tabIndex=-1` and `.focus()` after submit failure.
**Rationale**: Standard accessibility pattern; helps screen reader users orient quickly.
**Alternatives**: Focus first invalid field (could be far down page; summary gives overview first).

### D7: Min Width for Select Components
**Decision**: Apply shared Tailwind class (e.g. `min-w-64 sm:min-w-[18rem]`) via component prop default; adjustable via override.
**Rationale**: Central control avoids repeated style fragments; predictable layout.
**Alternatives**: Per-instance width definitions (risk inconsistency).

### D8: Prevent Duplicate Submission
**Decision**: Disable submit button + guard promise to ignore second click until resolution.
**Rationale**: Simple; avoids race conditions and duplicate rows.
**Alternatives**: Global form lock overlay (heavier visually).

### D9: Validation Issue Data Shape
**Decision**: `{ fieldKey: string, message: string }` with stable fieldKey matching DOM id; summary lists unique fieldKeys.
**Rationale**: Simplifies mapping to both inline and summary; id-based focusing possible later.
**Alternatives**: Include severity levels (not needed now).

### D10: Accessibility Audit Target
**Decision**: Use axe or testing-library + jest-axe for automated checks on required fields & error summary.
**Rationale**: Quick feedback loop in CI; measurable compliance with SC-002 and SC-008.
**Alternatives**: Manual audit only (slower, less consistent).

## Unchanged Architecture
No backend endpoints added; existing submission POST remains. No schema migration expected; if mismatch discovered (e.g., missing field), will raise separate change.

## Implementation Implications
- Shared UI component refinements may affect other pages—coordinate regression test run for admin views.
- i18n dictionary growth: maintain alphabetical grouping; ensure LT and EN both updated simultaneously.
- Testing additions: unit tests for error summary logic; accessibility tests; snapshot or visual regression optional.

## Performance Considerations
Minimal impact; validation and DOM updates limited to user interactions. Avoid full re-renders by scoping state updates to field-level changes.

## Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
| Missed string i18n | Partial localization | Automated scan test |
| Overly aggressive error clearing | Confusion | Clear only on blur + valid value |
| Layout regressions in admin | UI inconsistency | Run visual diff / manual spot check post change |
| Disabled JS message ignored | User confusion | Prominent styled banner + disabled form controls |

## Open Items
None pending; all clarifications resolved.

## Summary
Research supports streamlined JS-required approach, accessible validation patterns, and strict localization enforcement. Ready for data modeling and task planning.
