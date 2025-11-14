# Research: Admin Navigation Sidebar

## Decisions & Rationale

### Decision: Right-Side Sidebar (vs Left or Top Bar)
- Rationale: Avoid collision with existing left-aligned content patterns; right side emphasizes administrative context and reduces reflow risk for tables.
- Alternatives Considered: Left-side (conflicts with existing content width expectations), Top bar (limited vertical space, weaker scalability for many links), Command palette only (discoverability issues). 

### Decision: Collapsible to Icon Strip
- Rationale: Preserves horizontal space for dense admin data tables while retaining quick access.
- Alternatives: Full hide (increases cognitive friction to rediscover), responsive auto-hide only (less user agency).

### Decision: Session-Scoped Persistence (sessionStorage + cookie fallback)
- Rationale: Low complexity, no DB schema changes; aligns with non-critical preference scope.
- Alternatives: Database-backed user preference (requires table & migration), LocalStorage only (no easy server-side hydration on initial render).

### Decision: Static Nav Item Configuration File
- Rationale: Simple to extend; avoids runtime DB queries or feature flag indirection for initial version.
- Alternatives: Dynamic API-driven items (unnecessary complexity), Hard-coded within component (reduces reusability & DRY).

### Decision: Language Switcher Embedded
- Rationale: Centralizes admin-specific global controls; encourages consistent placement.
- Alternatives: Separate header control (splits user attention), Modal command palette only (lower discoverability).

### Decision: Accessibility Features (ARIA, Focus Order, Keyboard Support)
- Rationale: Mandatory for inclusive design; ensures constitution compliance and reduces future retrofits.
- Alternatives: Minimal semantics (would create future remediation cost).

### Decision: Optional Preference Endpoints
- Rationale: Future-proof integration if long-lived server persistence is desired; plan without mandatory immediate implementation.
- Alternatives: Omit entirely (harder migration if server persistence needed later).

## Unresolved Clarifications
None. All spec requirements are sufficiently defined for planning.

## Risks & Mitigations
- Risk: Bundle size creep -> Mitigation: Lazy load icons or reuse existing set.
- Risk: Layout shift on initial render -> Mitigation: Server-side hint for collapsed state via cookie to render correct width immediately.
- Risk: Language switch flicker -> Mitigation: Preload translation resources for adjacent languages.
- Risk: Accessibility oversight -> Mitigation: Include automated axe-core scan in e2e test.

## Performance Considerations
- Minimal runtime logic (simple state toggles). Target <150ms click-to-paint.
- Avoid heavy animation libraries; use CSS transitions only.

## Metrics Strategy
- Navigation click analytics events (page target + sidebar state).
- Language change events with duration until labels replaced.

## Alternatives Summary
| Area | Chosen | Alternatives | Reason for Rejection |
|------|--------|-------------|----------------------|
| Placement | Right sidebar | Left, Top bar | Preserve existing left layout; top bar cramped |
| Persistence | Session + cookie | DB, LocalStorage only | DB overkill; LocalStorage lacks SSR hydration |
| Config | Static file | API-driven | Simplicity, fewer moving parts |
| Collapse style | Icon strip | Full hide | Maintain affordance and recall |
| Language switch | Sidebar | Header-only | Centralize admin controls |

## Conclusion
Design choices optimize discoverability, low implementation cost, and future extensibility without schema changes. Ready to proceed to data modeling and contracts.
