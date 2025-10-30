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
- Companies view with aggregated data
- CSV export with date range filtering

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
# Apply database migrations
docker compose -f docker/docker-compose.yml exec -T postgres psql -U forma -d forma < db/migrations/0000_slim_jamie_braddock.sql

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
npm run dev:down            # Stop and remove containers

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
