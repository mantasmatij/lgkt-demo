# Research: Faster Dev Feedback and LT/EN i18n

Date: 2025-10-29
Branch: 003-faster-dev-i18n
Spec: ../spec.md

## Decisions and Rationale

### 1) Primary dev workflow (no Docker)
- Decision: Run API and Web locally without Docker for fastest feedback.
- Rationale: Avoids image rebuilds; leverages Nx/Next dev modes with watch/reload; meets <30s p90.
- Alternatives:
  - Docker with bind mounts and dev commands: Works but adds compose overrides and container watch setup; slightly slower feedback.
  - Full Docker rebuild per change: Too slow; defeats goal.

### 2) Optional Docker dev override (file sync)
- Decision: Provide a docker-compose.override.yml sample with bind mounts and dev commands (next dev / node dev) as a secondary path.
- Rationale: Helpful for contributors who need a containerized env; keeps primary flow simple.
- Alternatives:
  - Mutagen/colima sync tooling: Extra dependencies and complexity; not needed initially.

### 3) i18n routing model
- Decision: No URL locale prefix. Locale chosen by session preference; default Lithuanian.
- Rationale: Matches business request; avoids SEO/URL churn.
- Alternatives:
  - URL prefix (/lt, /en): Easier SEO/analytics but rejected per requirement.
  - Subdomain (lt.example): Not requested; more infra.

### 4) Preference storage
- Decision: Store preferred language in session.
- Rationale: Explicit user request; avoids device cookie coordination; simple server-side read.
- Implication: Preference resets when session expires; persistence across browser restarts is limited.
- Alternatives:
  - Cookie/device storage: Better long-term persistence but not requested.
  - Account-level profile: Better cross-device UX but out of current scope.

### 5) Emails and PDFs/exports localization
- Decision: Localize transactional emails and a standard PDF/export for LT/EN.
- Rationale: Spec scope includes communications/documents.
- Alternatives:
  - UI-only: Smaller scope, but we accepted broader scope.
  - Full TMS integration: Overkill now; future enhancement.

### 6) Locale formatting
- Decision: Use locale-aware formatting for dates/numbers/currency based on chosen language.
- Rationale: Required by spec; essential for user comprehension.

## Unknowns resolved
- None remaining; spec clarifications closed. Plan acknowledges that session storage reduces persistence compared to device cookies.

## Best Practices Notes
- Keep translation keys stable and human-readable.
- Provide missing-key logging in non-production only (avoid noise in prod).
- Ensure the language switcher is accessible (aria-labels, keyboard nav).
- Guard against mixed-language UI; prefer explicit fallbacks.

