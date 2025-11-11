# Research: Company List & Detail (Phase 0)

## Decisions & Rationale

### Filters (Company type, Registry)
- Decision: Use only Company type and Registry filters in v1.
- Rationale: High signal for segmentation and auditing with minimal UI complexity.
- Alternatives Considered: Adding eDelivery presence, legal form (extra complexity, deferred to future if needed).

### Pagination default (25)
- Decision: Page size 25.
- Rationale: Balances readability and reduces server load; matches existing list defaults.
- Alternatives Considered: 10 (too short, more navigation), 50 (crowded on small screens), infinite scroll (inconsistent with existing lists).

### Search behavior (case-insensitive substring)
- Decision: Case-insensitive, trimmed, substring matching for name/code.
- Rationale: User-friendly; avoids exact-match frustration.
- Alternatives: Prefix-only (less flexible), fuzzy (overkill initial scope).

### Sorting (Company name DESC default)
- Decision: Default descending by Company name.
- Rationale: Mirrors spec; likely near-term interest in Z to A for internal prioritization (can adjust later).
- Alternatives: Ascending A→Z (typical; may revisit based on feedback).

### Submissions ordering (Submission date DESC)
- Decision: Show most recent first.
- Rationale: Admins typically want latest data first for audits.
- Alternatives: Ascending (less useful), manual multi-column sort (scope creep).

### Data access pattern (Service layer + Drizzle queries)
- Decision: Isolate query composition in `companies.service.ts`.
- Rationale: Reusable, testable separation of concerns; supports future caching or performance tuning.
- Alternatives: Inline queries inside route handlers (repetition risk).

### Validation (Zod shared schemas)
- Decision: Define shared Zod schemas for Company and CompanySubmission query parameters and responses.
- Rationale: Single source of truth for request/response shape; reduces divergence between API and UI.
- Alternatives: Ad hoc validation (risk of inconsistent error handling).

### API Contract style (REST JSON)
- Decision: REST endpoints under `/admin/companies` and `/admin/companies/:id` plus `/admin/companies/:id/submissions` (if needed for paging).
- Rationale: Aligns with existing REST patterns; simple extension.
- Alternatives: GraphQL (not currently adopted), combined detail payload always including submissions (may inflate payload size).

### Security (Admin-only access via existing auth guard)
- Decision: Reuse existing admin auth middleware.
- Rationale: Consistent enforcement; avoids bespoke access logic.
- Alternatives: Per-route custom checks (unnecessary duplication).

### Performance target (Filter/search response <2s perceived)
- Decision: Aim for <1s server processing, <2s perceived end-to-end as in success criteria.
- Rationale: Maintains snappy admin UX.
- Alternatives: Explicit p95 ms metrics (defer until perf instrumentation matured).

### Error handling (Graceful empty and invalid states)
- Decision: Provide consistent empty state components and treat invalid query params with 400 + structured error.
- Rationale: Predictable admin experience; reduces confusion.
- Alternatives: Silent fallback (hides issues), generic error pages (less actionable).

## Open Items (Deferred)
- Company legal form enumeration source: assume existing dataset; will confirm during implementation.
- Registry authoritative list: assume existing reference table.
- Future filters (eDelivery presence, submissions existence) deferred.

## Definition of Done (Research Phase)
- All spec clarifications resolved (Yes)
- Contracts ready for design (Yes)
- No additional NEEDS CLARIFICATION markers introduced (Yes)

