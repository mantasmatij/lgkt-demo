# Research & Decisions: Company Form Updates

Created: 2025-10-31

## Decisions

### 1) Payload treatment for removed fields
- Decision: Keep payload keys with null/empty values for Country and Contact & Other
- Rationale: Preserves schema for downstream consumers; avoids breaking changes
- Alternatives considered:
  - Omit keys entirely (risk of breaking consumers expecting keys)
  - Hybrid only for in-flight drafts (adds complexity with minimal benefit)

### 2) Section 12 reasons requirement
- Decision: Always required
- Rationale: Ensures consistent reporting and enforces completeness regardless of counts
- Alternatives considered:
  - Conditionally required when underrepresentation detected (more logic, potential gaps)
  - Optional (insufficient data quality)

### 3) Company Type enum
- Decision: Stable payload enum values with bilingual labels (LT/EN)
- Rationale: Clear UX in both languages; robust persistence
- Alternatives considered:
  - Store localized labels directly (breaks i18n and analytics)

### 4) Date constraints
- Decision: Enforce min date 1990-01-01 across all date inputs
- Rationale: Matches business rules and avoids invalid historical entries
- Alternatives considered:
  - Per-field overrides (unnecessary complexity)

### 5) Layout strategy
- Decision: Single-line groupings on desktop; vertical stacking on mobile
- Rationale: Improves scannability and speed while maintaining accessibility
- Alternatives considered:
  - Two-column fixed layout (worse on small screens)

## Best Practices Referenced
- Bilingual UI labels map to stable backend values
- Client-side validation mirrors backend constraints (Zod schemas)
- Responsive design verified across common breakpoints
- Optional file uploads and links must not block submission

