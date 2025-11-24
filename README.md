# LGKT Forma - Anonymous Company Form & Admin Portal

A web application for collecting company information through a public form, with an admin portal for viewing submissions, managing companies, and exporting reports.

## Features

### Public Form
- Anonymous form submission without login
- File upload support (PDF, PNG, JPEG)
- CAPTCHA verification
- Client and server-side validation
- Success confirmation page

### Admin Portal
- Secure authentication with session management
- Submissions dashboard with pagination
- Companies list with search, type filter, pagination, and accessible tables
- Company detail with submissions ordered by submission date (desc)
- CSV export with date range filtering

### Reporting MVP (Feature 008)
- Unified reports entry point (Companies list & Forms list scope)
- Preview table honoring filters & sorting
- CSV export (UTF-8+BOM) with metadata row (timestamp, filters)
- 50k row / ~25MB synchronous export limit and guidance
- Future extensibility for XLSX/PDF/DOCX without UI flow change

Documentation:
- Spec: `specs/008-expand-reporting-mvp/spec.md`
- Plan: `specs/008-expand-reporting-mvp/plan.md`
- Tasks: `specs/008-expand-reporting-mvp/tasks.md`
- Contracts: `specs/008-expand-reporting-mvp/contracts/openapi.yaml`

## Tech Stack

- **Frontend**: Next.js 15, React 19, NextUI 2.x, Tailwind CSS
- **Backend**: Node.js 20, Express 4
- **Database**: PostgreSQL 15, Drizzle ORM
- **Validation**: Zod schemas (shared between frontend/backend)
- **Monorepo**: Nx workspace
- **Containerization**: Docker & Docker Compose

## Prerequisites

- Node.js 20+
- Docker & Docker Compose
- npm 10+

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd lgkt-forma
npm install
```

### 2. Start Development Environment

```bash
# Start all services (postgres, api, web)
npm run dev:up

# Wait for containers to be healthy (~30 seconds)
```

### 3. Run Migrations

```bash
# Option A: Apply all SQL migrations (psql)
docker compose -f docker/docker-compose.yml exec -T postgres psql -U forma -d forma < db/migrations/0000_slim_jamie_braddock.sql
docker compose -f docker/docker-compose.yml exec -T postgres psql -U forma -d forma < db/migrations/0001_add_company_type_to_submissions.sql
docker compose -f docker/docker-compose.yml exec -T postgres psql -U forma -d forma < db/migrations/0002_perf_indexes.sql

# Option B: Use Drizzle to apply pending migrations
npm run db:migrate

# Create admin user
docker compose -f docker/docker-compose.yml exec -T postgres psql -U forma -d forma -c "INSERT INTO admin_users (email, password_hash, role) VALUES ('admin@example.com', '\$2b\$10\$uhq25W40udVMcDshMT3yk.pAeFpjv8c.ILBad8RXq91CZNzwbmR7e', 'admin');"
```

### 4. Access the Application

- **Public Form**: http://localhost:3000/form
- **Admin Sign In**: http://localhost:3000/admin/sign-in
  - Email: `admin@example.com`
  - Password: `admin123`

## Project Structure

```
lgkt-forma/
├── api/                    # Express API server
│   └── src/
│       ├── routes/         # API endpoints
│       ├── middleware/     # Auth, CSRF, etc.
│       └── services/       # Business logic
├── web/                    # Next.js frontend
│   └── src/app/           # App router pages
├── db/                     # Database package
│   ├── src/lib/           # Schema, repositories
│   └── migrations/        # SQL migrations
├── validation/             # Shared Zod schemas
├── ui/                     # Shared UI components
├── contracts/              # OpenAPI specs
└── docker/                # Dockerfiles & compose config
```

## Development

### Available Commands

```bash
# Development
npm run dev:up              # Start Docker services
npm run dev:down            # Stop containers (preserves database volume)
npm run dev:destroy         # Stop containers AND remove volumes (DB wiped)

For the i18n + faster dev feature, see the Quickstart guide:

- specs/003-faster-dev-i18n/quickstart.md

# Testing
npm test                    # Run all unit tests
npm run test:e2e            # Run E2E tests with Playwright
npm run test:e2e:ui         # Run E2E tests in UI mode
npm run test:e2e:headed     # Run E2E tests in headed mode (see browser)
npm run lint                # Run linters

# Database
npm run db:migrate          # Run migrations
```

### Running Tests

```bash
# Unit tests
npm test

# E2E tests (requires services running)
npm run dev:up              # Start services first
npm run test:e2e            # Run all E2E tests

# E2E tests in UI mode (interactive)
npm run test:e2e:ui

# Specific project unit tests
npx nx test api
npx nx test web

# With coverage
npx nx test api --coverage
```

### E2E Testing

The project includes comprehensive E2E tests using Playwright:

- **Form submission tests**: Happy path, validation, consent requirements
- **Admin authentication tests**: Sign-in, session management, redirects
- **CSV export tests**: Date range filtering, rate limiting
- **Responsive design tests**: Mobile, tablet, desktop viewports
- **Accessibility tests**: Keyboard navigation, screen readers

Tests run against multiple browsers (Chromium, Firefox, WebKit) and viewports.

Dev servers are auto-started by the Playwright config (API via Nx + Web via Next dev). Docker is not required to run E2E, but a reachable PostgreSQL instance is. If you don't have a local DB, start only Postgres via Docker Compose and keep the rest local:

```bash
# Optional: start only Postgres
docker compose -f docker/docker-compose.yml up -d postgres

# Then run E2E (spins up API + Web locally)
npm run test:e2e
```

### Linting

```bash
# All projects
npm run lint

# Specific project
npx nx lint api

# Auto-fix
npx nx lint api --fix
```

## Docker Services

The application runs three services:

- **postgres**: PostgreSQL 15 database (port 5432)
- **api**: Express API server (port 3001)
- **web**: Next.js frontend (port 3000)

### Environment Variables

**API Service:**
- `PORT`: API server port (default: 3001)
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret for signing sessions
- `DEBUG_COMPANIES`: If set (any value), logs basic timing for companies list/detail/submissions handlers (e.g., `DEBUG_COMPANIES=1`).

**Web Service:**
- `API_INTERNAL_ORIGIN`: Internal API URL for server-side requests

See `.env.example` files for full configuration options.

## Admin Setup

For detailed admin setup instructions, see [ADMIN_SETUP.md](./ADMIN_SETUP.md).

**Default credentials:**
- Email: `admin@example.com`
- Password: `admin123`

⚠️ **Change these in production!**

## API Documentation

API documentation is available in OpenAPI format:
- Location: `specs/001-users-mantas-matijosaitis/contracts/openapi.yaml`
 - Admin Navigation & Preferences (future optional persistence): `specs/007-admin-nav-sidebar/contracts/navigation.openapi.yaml`

### Admin Companies Endpoints (summary)
### Admin Sidebar Feature
Persistent right-side navigation panel for admin users with quick links (Submissions, Companies, Reports), embedded language switcher, and collapsible layout state with persistence.

Collapse/Expand notes:
- Toggle at the top of the sidebar; pill-shaped and centered when collapsed.
- State persists in `sessionStorage` and a cookie (`adminSidebarCollapsed=true|false`).
- Cookie includes `Max-Age` for SSR hydration; the admin layout reads it so first paint reflects the saved width (no flash).
- Auto-collapses on very narrow viewports (<480px).

Current progress summary:
| Aspect | Status |
|--------|--------|
| Static nav items (i18n keys) | ✅ Implemented |
| Icon mapping + fallback | ✅ Implemented |
| Active route highlighting | ✅ Implemented |
| Keyboard navigation & ARIA landmark | ✅ Implemented |
| Analytics events (nav clicks, perf marks) | ✅ Implemented |
| Language switcher | ✅ Implemented |
| Collapse/expand state | ✅ Implemented (session + cookie + SSR hydration) |
| Accessibility axe helper | ✅ Implemented |
| E2E navigation flows | ⏳ Pending |
| Preference API (optional) | 🔒 Deferred |

See `specs/007-admin-nav-sidebar/spec.md`, `plan.md`, `tasks.md` for full roadmap.
- `GET /api/admin/companies` – List companies (search, type filter, pagination)
- `GET /api/admin/companies/allowed-values` – Distinct allowed values for filters (types, registries)
- `GET /api/admin/companies/:id` – Company detail
- `GET /api/admin/companies/:id/submissions` – Company submissions (ordered by submission date desc, with pagination)

## Security

- Password hashing with bcrypt (10 rounds)
- Session-based authentication with signed HTTP-only cookies
- CSRF protection for admin endpoints
- File upload validation (type, size limits)
- CAPTCHA verification for form submissions
- **Rate limiting**:
  - **CSV Export**: 10 requests per 15 minutes per IP
  - **Login**: 5 attempts per 15 minutes per IP (failed attempts only)
  - **Form Submission**: 3 submissions per hour per IP

See [api/SECURITY.md](./api/SECURITY.md) for details.

## Database Schema

The database includes the following main tables:

- `admin_users`: Admin authentication
- `companies`: Company master data
- `submissions`: Form submissions
- `submission_organs`: Organ composition data
- `gender_balance_rows`: Gender balance metrics
- `submission_measures`: Measures and targets
- `submission_meta`: Additional metadata
- `attachments`: File attachments

## Troubleshooting

### Containers won't start

```bash
# Check logs
docker logs docker-api-1
docker logs docker-web-1
docker logs docker-postgres-1

# Rebuild from scratch
npm run dev:down
npm run dev:up
```

### Database connection errors
# Lost data after restart?

If your database appears empty after a restart, ensure you did not run `npm run dev:destroy` (which removes the volume). Use `npm run dev:down` to keep data. To fully reset intentionally, run the destroy command or the explicit reset script `npm run db:reset:dev`.


```bash
# Verify postgres is healthy
docker ps

# Check connection
docker compose -f docker/docker-compose.yml exec postgres psql -U forma -d forma -c "SELECT 1;"
```

### Static files 404 errors

```bash
# Rebuild web container
docker compose -f docker/docker-compose.yml up -d --build web
```

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run tests: `npm test`
4. Run linter: `npm run lint`
5. Commit with descriptive messages
6. Open a pull request

## License

[Add license information]

## Support

For issues and questions, please open a GitHub issue.
