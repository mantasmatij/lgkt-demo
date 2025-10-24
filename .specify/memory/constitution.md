<!--
Sync Impact Report:
Version: 0.0.0 → 1.0.0 (Initial Constitution)
Created: 2025-10-16

Principles Defined:
- I. Clean Code Excellence
- II. Simple & Intuitive UX
- III. Responsive Design First
- IV. DRY (Don't Repeat Yourself)
- V. Minimal Dependencies
- VI. Comprehensive Testing
- VII. Technology Stack Compliance

Sections Added:
- Core Principles (7 principles)
- Mandatory Technology Stack
- Development Standards
- Governance

Templates Status:
✅ .specify/templates/plan-template.md - Constitution Check section aligns
✅ .specify/templates/spec-template.md - Requirements alignment verified
✅ .specify/templates/tasks-template.md - Task categorization aligns
⚠ README.md - Does not exist yet, should be created with constitution reference

Follow-up TODOs:
- TODO(RATIFICATION_DATE): Set official project adoption date (currently unknown)
- Consider creating README.md with reference to constitutional compliance
-->

# LGKT Forma Constitution

## Core Principles

### I. Clean Code Excellence

**All code MUST be clean, readable, and maintainable.** Code is written once but read many times; clarity takes precedence over cleverness.

**Non-Negotiable Rules**:
- Variable and function names MUST be descriptive and self-documenting
- Functions MUST do one thing and do it well (Single Responsibility Principle)
- Code MUST be properly formatted and follow TypeScript best practices
- Magic numbers and hard-coded values MUST be replaced with named constants
- Comments MUST explain "why", not "what"
- Complex logic MUST be broken down into smaller, understandable units

**Rationale**: Clean code reduces cognitive load, accelerates onboarding, minimizes bugs, and ensures long-term maintainability as the project scales.

### II. Simple & Intuitive UX

**User interfaces MUST be simple, intuitive, and require minimal learning curve.** Every interaction MUST feel natural and predictable.

**Non-Negotiable Rules**:
- UI components MUST follow established patterns from HeroUI component library
- Navigation MUST be obvious and consistent across all pages
- Forms MUST provide clear, immediate validation feedback using Zod schemas
- User actions MUST have immediate visual feedback
- Complexity MUST be hidden behind progressive disclosure patterns
- Error messages MUST be user-friendly and actionable

**Rationale**: Simple UX increases user adoption, reduces support burden, and ensures users can accomplish tasks efficiently without frustration.

### III. Responsive Design First

**All user interfaces MUST be fully responsive and provide optimal experience across all device sizes from mobile to desktop.**

**Non-Negotiable Rules**:
- Layouts MUST use flexible grid systems and relative units
- Touch targets MUST be appropriately sized for mobile devices (minimum 44x44px)
- Testing MUST include mobile, tablet, and desktop viewports
- Performance MUST be optimized for mobile networks
- Fonts and colors MUST be sourced exclusively from `fontAndColour.css`
- Breakpoints MUST follow mobile-first design approach

**Rationale**: Users access applications from diverse devices. Responsive design ensures accessibility and usability regardless of screen size or input method.

### IV. DRY (Don't Repeat Yourself)

**Code duplication MUST be eliminated.** Every piece of knowledge MUST have a single, unambiguous representation in the system.

**Non-Negotiable Rules**:
- Repeated logic MUST be extracted into reusable functions or components
- Configuration MUST be centralized and referenced, not duplicated
- Shared types and interfaces MUST be defined once in the Nx monorepo structure
- Database schemas MUST be the single source of truth for data structures
- Utility functions MUST live in shared libraries accessible across apps and packages
- Copy-paste code is prohibited; refactor into shared modules instead

**Rationale**: DRY reduces maintenance burden, eliminates inconsistency bugs, and ensures changes propagate correctly throughout the system.

### V. Minimal Dependencies

**External dependencies MUST be justified and minimized.** Every dependency is a potential maintenance liability and security risk.

**Non-Negotiable Rules**:
- New dependencies MUST have clear written justification in pull requests
- Dependency count MUST be reviewed during code reviews
- Native JavaScript/TypeScript solutions MUST be preferred when practical
- Dependencies MUST be actively maintained and widely adopted
- Unused dependencies MUST be promptly removed
- Dependency updates MUST be monitored and applied regularly

**Rationale**: Each dependency adds bundle size, potential security vulnerabilities, breaking changes risk, and maintenance overhead. Minimal dependencies keep the project lean, secure, and maintainable.

### VI. Comprehensive Testing

**All code MUST be tested thoroughly but efficiently.** Tests MUST be simple, concise, and free of duplication while providing complete coverage.

**Non-Negotiable Rules**:
- Backend code MUST be tested using Jest
- Frontend code MUST be tested using Cucumber for behavior-driven scenarios
- Tests MUST cover happy paths, edge cases, and error conditions
- Test code MUST follow DRY principles (use shared fixtures and test helpers)
- Tests MUST be fast, isolated, and deterministic (no flaky tests)
- Critical paths MUST have integration tests in addition to unit tests
- Tests MUST be written concisely without unnecessary repetition
- Test names MUST clearly describe what is being tested
- All available tests must be passing before commiting changes to repository

**Rationale**: Comprehensive testing catches bugs early, enables confident refactoring, serves as living documentation, and ensures reliability in production.

### VII. Technology Stack Compliance

**The project MUST adhere to the defined technology stack.** Deviations require explicit justification and constitutional amendment.

**Non-Negotiable Rules**:
- All mandatory stack components (listed below) MUST be used
- New libraries MUST integrate with the existing stack
- Alternative solutions require written justification demonstrating significant performance or capability gaps
- Stack changes MUST be documented via constitutional amendments
- Legacy patterns MUST be migrated during refactoring efforts

**Rationale**: Stack consistency ensures team productivity, reduces context switching, simplifies onboarding, enables code reuse across the monorepo, and maintains architectural coherence.

## Mandatory Technology Stack

### Monorepo & Build System
- **Nx** MUST be used for workspace management and monorepo structure
- **TypeScript** MUST be used for all code (frontend and backend)

### Backend Stack
- **Express** MUST be used for the API server runtime
- **Drizzle ORM** MUST be used for all database communication
- **Database Migrations** MUST be used when adding or modifying tables
- **Jest** MUST be used for all backend testing

### Frontend Stack
- **HeroUI** MUST be used as the component library, because NextUI is deprecated.
- **Cucumber** MUST be used for frontend behavior-driven testing
- **fontAndColour.css** MUST be used as the source for all fonts and colors

### Shared Stack (Frontend + Backend)
- **Zod** MUST be used for input validation on both frontend and backend

### Database Requirements
- Additional tables MAY be added as needed for application features
- All schema changes MUST use migrations (no direct schema modifications)

## Development Standards

### Code Review Requirements
- All pull requests MUST reference relevant constitutional principles
- Code reviews MUST verify constitutional compliance
- Violations MUST be documented and resolved before merging

### Architecture Decisions
- Architecture decisions MUST cite constitutional justification
- Trade-offs between principles MUST be explicitly documented
- When principles conflict, prioritize in this order:
  1. User-facing principles (II. Simple UX, III. Responsive Design)
  2. Code quality principles (I. Clean Code, IV. DRY)
  3. Technical principles (V. Minimal Dependencies, VI. Testing, VII. Stack Compliance)

### Documentation Requirements
- New features MUST include user-facing documentation
- Complex architectural decisions MUST be documented
- API contracts MUST be documented and versioned
- README files MUST be maintained in all packages

## Governance

### Constitutional Authority
This constitution supersedes all other practices, guidelines, and preferences. When conflicts arise, the constitution is the final authority.

### Amendment Procedure
1. Amendments MUST be proposed via written rationale document
2. Amendments MUST be reviewed and approved by project maintainers
3. Amendment impact on existing code MUST be assessed
4. Migration plan MUST be provided for breaking amendments
5. Version MUST be updated according to semantic versioning rules

### Versioning Policy
Constitution follows Semantic Versioning (MAJOR.MINOR.PATCH):
- **MAJOR**: Backward-incompatible principle removals or redefinitions
- **MINOR**: New principles added or existing principles materially expanded
- **PATCH**: Clarifications, wording improvements, typo fixes, non-semantic changes

### Compliance Review
- All PRs MUST verify constitutional compliance
- Gate checks in plan-template.md MUST align with constitutional principles
- Complexity that violates principles MUST be explicitly justified
- Regular constitutional audits SHOULD be conducted quarterly

### Enforcement
Violations of this constitution are not permitted to enter the main branch. Maintainers are empowered to reject non-compliant code with reference to specific constitutional violations.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): Set project adoption date | **Last Amended**: 2025-10-16
