# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added - UI Redesign & Responsive Implementation (002-ui-redesign-responsive)

#### Migration & Foundation
- **NextUI → HeroUI Migration**: Migrated from deprecated NextUI v2.4.0 to HeroUI v2.5.x
  - Updated all component imports across codebase
  - Updated `NextUIProvider` to `HeroUIProvider`
  - Configured HeroUI theme with fontAndColour.css variable mappings
  - All components API-compatible with minimal breaking changes

- **8-Point Grid System**: Implemented consistent spacing system
  - Configured Tailwind spacing scale: 1→8px, 2→16px, 3→24px, 4→32px, 5→40px, 6→48px, 8→64px, 10→80px, 12→96px
  - Mapped fontAndColour.css color variables to Tailwind theme
  - Mapped fontAndColour.css font families to Tailwind theme
  - Created `cn()` utility function using clsx + tailwind-merge for class composition

- **Development Tools**: Enhanced code quality tooling
  - Installed eslint-plugin-tailwindcss for spacing enforcement
  - Configured ESLint rules: no-arbitrary-value (warn), enforces-shorthand (warn), no-contradicting-classname (error)
  - Added clsx@^2.1.0 and tailwind-merge@^2.2.0 for utility class management

#### UI/UX Improvements

- **Form Layout Redesign** (User Story 1 - P1)
  - Applied responsive containers with 8-point grid spacing (px-4 py-6)
  - Wrapped all sections in HeroUI Cards with consistent padding (p-6)
  - Updated form components with gap-3 spacing for fields
  - Implemented responsive grid layouts: mobile (1-column), tablet (2-column), desktop (multi-column)
  - Updated success page with consistent Card styling and gap-3 spacing

- **Consistent Spacing** (User Story 3 - P1)
  - Applied 8-point grid across all pages: form, admin sign-in, dashboard, companies, reports
  - Standardized Card padding to p-6 (48px)
  - Standardized container padding to px-4 py-6 (mobile-friendly)
  - Standardized section gaps to gap-3 (24px) or gap-4 (32px)
  - Updated all Button components with consistent sizing: size="lg" (CTAs), size="md"/"sm" (actions)
  - Fixed error Card padding from p-4 to p-6 for consistency

- **Responsive Admin Dashboard** (User Story 2 - P2)
  - Added horizontal scroll wrappers to admin tables for mobile/tablet (<1024px)
  - Applied responsive padding across admin layout
  - Updated reports page padding from p-8 to px-4 py-6 for mobile
  - All admin buttons meet 44x44px minimum touch target size

- **Touch-Friendly Interface** (User Story 4 - P2)
  - Verified all interactive elements meet 44x44px minimum touch target
  - Ensured minimum 8px gap (gap-1) between adjacent interactive elements
  - HeroUI Select and Input components have proper touch targets
  - Date inputs use native HTML5 date picker (mobile-optimized)

- **Typography Hierarchy** (User Story 5 - P3)
  - Established heading hierarchy: h1 (text-3xl font-bold), h2 (text-xl font-semibold), h3 (text-lg font-medium)
  - Updated form page with proper h1 and h2 section headings
  - Updated all admin pages to use text-3xl for h1 consistency
  - HeroUI components use appropriate text sizes (text-base for body, text-sm for secondary)

### Changed

- **Dependencies**: Updated UI library dependencies
  - Added @heroui/react@^2.5.0 (replaces @nextui-org/react@^2.4.0)
  - Added framer-motion@^11.0.0 (required by HeroUI)
  - Added react-hook-form@^7.50.0 and @hookform/resolvers@^3.3.0
  - Fixed validation package: zod version from ^4.1.12 to ^3.25.76 (matches installed)
  - Added clsx and tailwind-merge to ui package dependencies

- **Component Styling**: Updated spacing and alignment
  - Replaced arbitrary spacing values with 8-point grid values
  - Changed `space-y-*` to `flex-col gap-*` for better grid compliance
  - Applied size-16 shorthand instead of h-16 w-16
  - Applied size-12 shorthand in AttachmentsSection

### Fixed

- **Type Errors**: Resolved API type mismatches
  - Fixed genderBalance array type mapping in submissions endpoint
  - Fixed measures array type mapping (required 'name' field)
  - Fixed attachments LINK type mapping (required 'type' and 'url')

- **Build Issues**: Resolved compilation errors
  - Fixed TypeScript type error in web/tailwind.config.ts (heroui plugin)
  - Fixed ESLint errors in validation and ui packages

### Technical Details

**Bundle Size Impact**:
- HeroUI: ~equivalent to NextUI (API-compatible)
- Framer Motion: +32KB (animations)
- React Hook Form: +25KB (form state management)
- clsx + tailwind-merge: +1KB (utility composition)

**Performance Optimizations**:
- All components use 8-point grid for consistent rendering
- Responsive breakpoints: mobile (<768px), tablet (768-1023px), desktop (1024px+)
- Touch targets meet WCAG 2.1 AAA standard (44x44px minimum)

**Browser Compatibility**:
- Modern browsers with ES2022 support
- Mobile Safari, Chrome Mobile, Firefox Mobile
- Desktop: Chrome, Firefox, Safari, Edge

---

## [Previous Versions]

_This is the first major UI redesign. Previous changes not documented in CHANGELOG format._

