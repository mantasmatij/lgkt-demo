# Feature Specification: Admin Navigation Sidebar

**Feature Branch**: `007-admin-nav-sidebar`  
**Created**: 2025-11-14  
**Status**: Draft  
**Input**: User description: "We want to have some kind of navigation on admin side. Currently we have to enter URLs manually to reach company list, report generation. Also, we can add the language changer there. I think it should be on the right, as a sidebar, with the ability to collapse it."

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Navigate Admin Sections Quickly (Priority: P1)

An admin user opens the application and immediately sees a right-hand sidebar listing primary admin destinations (Companies, Forms & Reports, Submissions / Exports, Settings). They click a link to reach the Companies list without typing a URL.

**Why this priority**: Core value: removes friction and guesswork, reduces time to reach key data pages, eliminates manual URL entry.

**Independent Test**: Provision an admin account, load any admin page, confirm sidebar appears and each primary link changes view to correct destination within one click.

**Acceptance Scenarios**:

1. **Given** an authenticated admin on any admin page, **When** they click "Companies", **Then** the Companies listing page loads.
2. **Given** an authenticated admin viewing the Companies page, **When** they click "Forms & Reports", **Then** the Forms/Reports overview loads.

---

### User Story 2 - Change Interface Language (Priority: P2)

An admin wants to switch the interface language while staying on the current view. They use the language selector located inside the sidebar without page reload-driven navigation complexity.

**Why this priority**: Supports internationalization goals; improves usability for multilingual users.

**Independent Test**: From any admin page, use the language control in the sidebar to change language; verify visible text updates appropriately while remaining on same functional page.

**Acceptance Scenarios**:

1. **Given** an admin on the Companies page, **When** they select a different language, **Then** all translatable labels in the view reflect the chosen language.

---

### User Story 3 - Collapse / Expand Sidebar (Priority: P3)

An admin prefers a wider content area and collapses the sidebar, which shrinks to a narrow strip showing only icons or a minimal affordance to re-expand. They can later expand it and the system remembers their last state during the session.

**Why this priority**: Enhances productivity and layout control; optional convenience not blocking core navigation.

**Independent Test**: Toggle collapse state; verify content area expands; refresh page or navigate and confirm persistence for session.

**Acceptance Scenarios**:

1. **Given** an expanded sidebar, **When** the admin activates the collapse control, **Then** the sidebar reduces width showing minimal navigation affordances.
2. **Given** a collapsed sidebar, **When** the admin activates the expand control, **Then** full labels and language selector return.

---

Optional later stories (deferred): Role-based link filtering; keyboard shortcuts for direct navigation.

### Edge Cases

- Extremely narrow viewport (< 480px): sidebar defaults to collapsed state while still accessible.
- Very long list of future links: vertical scrolling within sidebar does not shift main content.
- Language switch while collapsed: language control accessible after expand without losing pending form state.
- No navigation permission (non-admin visits admin URL): sidebar does not render; user is redirected per existing access control.
- Failed language load: retains previous language and displays non-intrusive notification.
- High contrast / accessibility mode: focus outline and ARIA attributes expose state (expanded / collapsed).

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST render a persistent right-side admin navigation panel on all admin pages ONLY for authenticated admin users (no render for non-admin/unauthorized). (Merged former FR-001 & FR-011)
- **FR-002**: System MUST list at minimum these primary destinations: Companies, Forms & Reports, Submissions / Exports, Settings (placeholder if not yet implemented).
- **FR-003**: System MUST allow navigation via both mouse click and keyboard (tab focus & enter/space activation) for each link.
- **FR-004**: System MUST provide a language change control within the sidebar that updates visible interface text without page re-entry to manually typed URLs.
- **FR-005**: System MUST offer a collapse/expand control clearly indicating current state (e.g., aria-expanded true/false) and adjust layout accordingly.
- **FR-006**: System MUST preserve the collapse state for the current browsing session across page navigations.
- **FR-007**: System MUST ensure sidebar does not obstruct main content on narrow viewports (auto-collapsing under defined width threshold).
- **FR-008**: System MUST visually differentiate the currently active destination.
- **FR-009**: System MUST provide accessible names for all controls (screen reader friendly) and logical tab order starting with primary navigation links.
- **FR-010**: System MUST degrade gracefully if language data fails to load (retain previous language, show unobtrusive notice) without blocking navigation.
- **FR-011**: (Removed – merged into FR-001)
- **FR-012**: System MUST allow future addition of links by editing a single configuration file (`navItems.ts`) with no component refactor and all tests still passing.

### Constitutional Requirements *(auto-checked against constitution v1.0.0)*

All features MUST comply with internal product principles:
- **UX**: Clear, consistent interaction patterns and intuitive labels.
- **Responsive**: Usable across standard desktop and mobile viewport widths.
- **Validation**: All user-modifiable inputs (language selection) validated before persistence.
- **Styling**: Consistent typography and color usage aligned with global design tokens.
- **Testing**: Adequate automated tests for navigation, accessibility states, and language switching flows.
- **Data Management**: Any preference persistence (collapse state, language) follows existing preference handling guidelines.
- **Components**: Must use HeroUI component library per constitution (NextUI deprecated).

### Key Entities *(include if feature involves data)*

- **Navigation Item**: Represents a destination label, icon descriptor, route identifier, and visibility rules (role-based).
- **Language Preference**: Represents the currently selected locale code and fallback logic; tied to user session or profile.
- **Sidebar State**: Represents collapsed/expanded boolean and timestamp of last change (session-scoped persistence).

*Note: Feature does not introduce new persistent tables; preferences reuse existing mechanisms or session storage assumptions.*

### Assumptions

- Feature restricted to admin user role; non-admin sees existing non-sidebar experience.
- Minimum link set will not exceed vertical viewport for typical admin usage; internal scroll acceptable if expanded extensively later.
- Language changing mechanism already exists; this feature exposes it in sidebar location.
- Session persistence for collapse state is sufficient; long-term profile persistence not required initially.
- Icons are available for each navigation item or can be represented with text initials when collapsed.
- Settings route will be `/admin/settings` (placeholder until implemented).
- Icon fallback: first two uppercase letters of label if no icon name provided.
- Cookie used for SSR hydration: name `adminSidebarCollapsed`; attributes SameSite=Lax; Secure=true in production; Path=/; HttpOnly=false (client read needed).
- Performance measurement: click-to-paint measured via `performance.now()` marks; language update timing measured from user interaction to last visible text replacement.
- Baseline for SC-002: 2-week pre-deployment analytics window.
- Extensibility acceptance: adding a new nav item requires only appending to `navItems.ts` and adding translation keys; no changes to sidebar component code.

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: 90% of admin users reach the Companies page from a neutral starting admin page in ≤ 1 click without typing a URL.
- **SC-002**: Average time from page load to first navigation action decreases by ≥ 30% compared to pre-sidebar baseline (baseline = prior 2-week window).
- **SC-003**: 95% of language switch attempts successfully update visible labels within 2 seconds (interaction start to final label render via performance marks) without full logout or manual refresh.
- **SC-004**: At least 80% of sessions where collapse is toggled preserve chosen state across 3+ subsequent page navigations.
- **SC-005**: 0 critical accessibility violations (WCAG AA) for keyboard navigation and focus management in sidebar during audit.

## Clarifications

### Session 2025-11-14
- Q: How restrict rendering & duplication of FR-001/FR-011? → A: Merge into single FR-001 covering presence only for authenticated admins.
- Q: What route for Settings placeholder? → A: `/admin/settings`.
- Q: How to measure performance (SC-002/SC-003)? → A: Use `performance.now()` marks; baseline = previous 2-week analytics; language update measured from interaction to final text.
- Q: What is icon fallback? → A: First two uppercase letters of label.
- Q: Cookie policy for collapse SSR hydration? → A: `adminSidebarCollapsed` SameSite=Lax Secure=true(prod) Path=/.
- Q: Extensibility validation method? → A: Adding nav item only in `navItems.ts` + translations; no component changes.


