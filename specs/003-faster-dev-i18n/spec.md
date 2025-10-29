# Feature Specification: Faster Dev Feedback and LT/EN i18n

**Feature Branch**: `003-faster-dev-i18n`  
**Created**: 2025-10-29  
**Status**: Draft  
**Input**: User description: "Development and internationalization. Currently, to check changes we launch our app with docker. That takes a few minutes, so checking quickly if changes fix something takes some time. We want it to be quicker. Also, we want our page to be in Lithuanian since most of our customers will be lithuanian or speak the language. We also want to keep english as a choice, so we want to support 2 languages - English and Lithuanian. (See <attachments> above for file contents. You may not need to search or read the file again.)"

## Clarifications

### Session 2025-10-29

- Q: Default language logic for new visitors? → A: Always default to Lithuanian.
- Q: Preference persistence scope? → A: Session-based (stored server-side; no URL locale).
- Q: Translation scope beyond UI (emails/docs)? → A: UI + emails + PDFs/exports.

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

### User Story 1 - Use the site in Lithuanian or English (Priority: P1)

Visitors can view all customer-facing content in Lithuanian by default and switch to English at any time via a clear language control present on every page.

**Why this priority**: Primary audience is Lithuanian-speaking; offering a bilingual experience increases accessibility and conversion while keeping English available.

**Independent Test**: On a fresh session, confirm default language; toggle the language control; verify the entire page content and navigation reflect the selected language without page errors.

**Acceptance Scenarios**:

1. **Given** a new visitor on any page, **When** the page loads, **Then** the content appears in Lithuanian by default (no browser/region detection).
2. **Given** a visitor sees the language control, **When** they select English, **Then** all visible text on the current and subsequent pages is in English until changed again.
3. **Given** a deep-linked page (e.g., bookmarked URL), **When** the user switches language, **Then** the same page is shown in the chosen language with the URL remaining shareable.

---

### User Story 2 - Remember my language (Priority: P2)

As a returning visitor (anonymous or signed-in), my language preference is remembered so I don’t need to switch every time.

**Why this priority**: Reduces friction and improves returning user experience.

**Independent Test**: Set a language and keep the session cookie; on returning while the session is still valid, verify the site opens in the previously chosen language. If the session expired or cookies were cleared, verify default Lithuanian is applied.

**Acceptance Scenarios**:

1. **Given** a visitor sets English and the session remains valid, **When** they return later, **Then** the site opens in English without additional actions.
2. **Given** a visitor’s session has expired or cookies are cleared, **When** they return, **Then** the site opens in Lithuanian by default until they select a language again.

---

### User Story 3 - Quick preview of changes (Priority: P3)

As a developer, I can preview content/UI changes quickly without waiting minutes for the full environment to start, enabling a rapid change-test cycle.

**Why this priority**: Shorter feedback loops increase productivity and reduce context switching.

**Independent Test**: Start the local preview, make a small text/style change, and verify that the change is visible within 30 seconds end-to-end (from save to seeing it in the browser).

**Acceptance Scenarios**:

1. **Given** a running preview session, **When** I update a visible string or style, **Then** the page reloads or updates and shows the new result in under 30 seconds (90th percentile) without manual restarts.
2. **Given** I navigate across key pages, **When** using the preview, **Then** page behavior is representative of production for content and navigation (no auth or secrets exposed inappropriately).

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

- Missing translations for a string: shows a clear fallback (e.g., English) and is flagged for completion; does not break layout.
- Long words or text expansion in Lithuanian: UI remains readable and functional on small screens; controls do not overflow.
- Deep links and query params: language selection persists when sharing URLs or opening in a new tab.
- Third-party or dynamically loaded content: if not translatable, it is clearly separated and does not mix languages mid-sentence.
- Emails, notifications, and documents: transactional emails/notifications and standard PDFs/exports are localized; if a template lacks a translation, apply safe fallback without breaking layout; attachments and headings respect the selected language.

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: The application MUST support two languages site-wide: Lithuanian and English.
- **FR-002**: The application MUST present Lithuanian by default for new visitors (no browser/region detection), and MUST allow switching languages at any time.
- **FR-003**: A language switcher MUST be visible and accessible on all pages, following standard accessibility practices (keyboard navigable, labeled).
- **FR-004**: The selected language MUST persist across page navigations for the duration of the current session; if the session expires or cookies are cleared, default Lithuanian applies.
- **FR-005**: Preference storage is session-based (server-side session backed by cookie); cross-device consistency is not required.
- **FR-006**: All customer-visible text (navigation, forms, validation messages, buttons, headings, empty states, error pages) MUST be available in both languages with no mixed-language sentences.
- **FR-007**: Dates, numbers, currencies, and addresses MUST follow the conventions of the selected language (locale-appropriate formatting).
- **FR-008**: Where a translation is missing, the system MUST display a safe fallback (preferably English), log the missing key for follow-up, and MUST NOT degrade layout.
- **FR-009**: The system MUST provide a quick local preview workflow so that a simple text/style change is visible in under 30 seconds (90th percentile) from save to browser refresh.
- **FR-010**: The local preview workflow MUST include concise instructions for starting, stopping, and verifying changes; these instructions MUST be discoverable by the team.
- **FR-011**: The preview workflow MUST avoid exposing sensitive credentials and SHOULD approximate production behavior for content and routing.
- **FR-012**: Out of scope for this feature: SEO translations for search engines, professional translation management systems, and automated machine translation quality controls (can be future enhancements) unless clarified otherwise.
- **FR-013**: At least one exemplar transactional email and notification MUST be available in both Lithuanian and English; subject lines and message bodies MUST reflect the user’s selected language at send time. Additional emails may be localized in follow-up increments.
- **FR-014**: At least one standard PDF/export MUST be generated in the selected language, including headings, labels, and locale-appropriate formatting; missing strings MUST fall back safely without layout breakage and be logged for follow-up. Additional documents may be localized in follow-up increments.

### Constitutional Requirements *(auto-checked against constitution v1.0.0)*

All features MUST comply with:
- **UX**: Simple, intuitive interfaces using HeroUI components (Principle II)
- **Responsive**: Mobile-first design tested across all viewports (Principle III)
- **Validation**: Zod schemas for all user inputs, frontend and backend (Principle VII)
- **Styling**: Use fonts and colors exclusively from fontAndColour.css (Principle III, VII)
- **Testing**: Jest for backend, Cucumber for frontend (Principle VI)
- **Database**: Drizzle ORM with migrations for schema changes (Principle VII)

### Key Entities *(include if feature involves data)*

- **Language**: A supported human language (Lithuanian, English); identified by a human-readable name and a locale code; used to select content and formatting rules.
- **Translation Key**: A stable identifier for a piece of user-visible text; maps to localized strings in each supported language.
- **User Language Preference**: The user’s selected language; stored in a server-side session and applied for the duration of that session; resets on session expiry or cookie clear; no account-level persistence or URL locale.

*Note: If feature adds database tables, migrations MUST be created using Drizzle ORM (Constitution VII)*

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: 100% of customer-facing UI strings on top 10 user journeys are available in both Lithuanian and English at launch; 0 missing strings on critical paths.
- **SC-002**: 95% of page views render in the user’s selected language without mixed-language UI (measured via automated checks on key pages).
- **SC-003**: Language toggle discoverability: at least 90% of tested users can find and use it within 10 seconds in a simple hallway test.
- **SC-004**: Developer feedback loop: time from saving a small UI/text change to seeing it in the browser is under 30 seconds at the 90th percentile during working hours.
- **SC-005**: No critical layout regressions in either language across mobile and desktop viewports on the top 10 pages (verified by visual checks or screenshot tests).
- **SC-006**: Top transactional emails and a standard PDF/export are available in both languages with 0 mixed-language sections in smoke tests.

