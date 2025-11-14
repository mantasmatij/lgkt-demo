# Data Model: Admin Navigation Sidebar

## Overview
No new persistent tables. Ephemeral/session and optional preference data represented via existing mechanisms (cookies/sessionStorage). Potential future persistence endpoints outlined for readiness.

## Entities

### NavigationItem
| Field | Type | Description | Constraints |
|-------|------|-------------|-------------|
| id | string | Unique identifier (e.g., 'companies') | required, stable |
| label | string | Display text (i18n key) | required |
| route | string | Admin-relative path | must start with /admin |
| icon | string | Icon identifier / mapping key | optional |
| order | number | Ordering weight (ascending) | required |
| roles | string[] | Allowed roles (e.g., ['admin']) | defaults to ['admin'] |
| activeMatch | string | Pattern to mark active state | optional |

### LanguagePreference
| Field | Type | Description | Constraints |
| code | string | Locale code (e.g., 'en', 'lt') | validated against supported set |
| updatedAt | ISO timestamp | Last change time | generated |
| source | string | 'cookie' | 'session' fallback | optional |

### SidebarState
| Field | Type | Description | Constraints |
| collapsed | boolean | Current collapsed state | required |
| updatedAt | ISO timestamp | Last toggle time | generated |
| source | string | 'sessionStorage' | 'cookie' fallback | optional |

## Relationships
- LanguagePreference and SidebarState are independent; both scoped per authenticated admin session.
- NavigationItem is static; not user-modifiable.

## Validation Rules
- NavigationItem.route must match /^\/admin\//.
- LanguagePreference.code must be in SupportedLocales list.
- SidebarState.collapsed boolean only; no tri-state.

## State Transitions
SidebarState: collapsed=false → collapsed=true via toggle; reverse on expand. LanguagePreference transitions between codes; previous code retained until update completes.

## Persistence Strategy
- Navigation items: static TypeScript array export.
- SidebarState: sessionStorage key `adminSidebarCollapsed`; mirrored in cookie `adminSidebarCollapsed` for SSR hydration.
- LanguagePreference: existing locale cookie (assumption) updated; no additional storage.

## Assumptions
- SupportedLocales already defined in i18n layer.
- Icons available for all NavigationItem entries.
- Cookie hydration occurs early in Next.js layout to avoid flash of incorrect width.

## Future Extension
- Add user profile persistence table (e.g., user_preferences) if long-term state needed.
- Feature flag-driven dynamic nav items loaded from API.
