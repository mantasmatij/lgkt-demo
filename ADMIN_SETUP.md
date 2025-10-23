# Admin User Setup

## Default Admin Credentials

✅ An admin user has been created with the following credentials:

- **Email**: `admin@example.com`
- **Password**: `admin123`

⚠️ **Change these credentials in production!**

## Sign In

1. Make sure Docker containers are running:
   ```bash
   npm run dev:up
   ```

2. Navigate to: **http://localhost:3000/admin/sign-in**

3. Use the credentials above to sign in

## Admin Pages

After signing in, you can access:

- **Dashboard**: http://localhost:3000/admin/dashboard - View all submissions
- **Companies**: http://localhost:3000/admin/companies - View companies grouped by code
- **Reports**: http://localhost:3000/admin/reports - Export CSV reports by date range

## Creating Additional Admin Users

To create more admin users:

1. Generate a password hash:
   ```bash
   node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('YOUR_PASSWORD', 10).then(console.log)"
   ```

2. Insert the user:
   ```bash
   docker compose -f docker/docker-compose.yml exec postgres psql -U forma -d forma \
     -c "INSERT INTO admin_users (email, password_hash, role) VALUES ('email@example.com', 'HASH_FROM_STEP_1', 'admin');"
   ```

## Using the Seed Script

Alternatively, you can use the seed script to create admin users:

```bash
DATABASE_URL='postgres://forma:forma@localhost:5432/forma' \
ADMIN_EMAIL='admin@example.com' \
ADMIN_PASSWORD='admin123' \
npx tsx db/scripts/seed-admin.ts
```

Note: This requires the database to be accessible from your host machine.

