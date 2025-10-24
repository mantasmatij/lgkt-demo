# Quickstart: UI Redesign & Responsive Implementation

**Branch**: `002-ui-redesign-responsive` | **Date**: 2025-01-24
**For**: Developers implementing the responsive UI redesign with HeroUI migration

## Overview

This guide walks through implementing the responsive UI redesign, including:
- Migrating from NextUI v2.4.0 to HeroUI v2.5.x
- Implementing 8-point grid spacing system
- Adding responsive viewport testing with Playwright
- Integrating recommended dependencies (Framer Motion, React Hook Form, clsx/tailwind-merge)

**Estimated Time**: 16-24 hours (8h migration + 8-16h responsive implementation + testing)

---

## Prerequisites

Ensure you have:
- Node 20+ installed
- Nx CLI installed globally: `npm install -g nx`
- Playwright browsers installed: `npx playwright install`
- Working knowledge of Tailwind CSS and React
- Familiarity with existing codebase (see `specs/001-users-mantas-matijosaitis/`)

---

## Step 1: Update Dependencies (30 min)

### 1.1 Remove Deprecated NextUI Packages

```bash
# From repository root
npm uninstall @nextui-org/react @nextui-org/theme
```

### 1.2 Install HeroUI and Recommended Dependencies

```bash
# Install HeroUI (NextUI replacement)
npm install @heroui/react@^2.5.0

# Install recommended dependencies
npm install framer-motion@^11.0.0 \
            react-hook-form@^7.50.0 \
            @hookform/resolvers@^3.3.0 \
            clsx@^2.1.0 \
            tailwind-merge@^2.2.0

# Install dev dependencies
npm install --save-dev eslint-plugin-tailwindcss@^3.14.0
```

### 1.3 Verify Installation

```bash
npm list @heroui/react framer-motion react-hook-form
# Should show installed versions
```

---

## Step 2: Migrate NextUI → HeroUI (2-3 hours)

### 2.1 Update UI Package Provider

**File**: `packages/ui/src/lib/provider.tsx`

```typescript
// BEFORE:
import { NextUIProvider } from '@nextui-org/react';

// AFTER:
import { HeroUIProvider } from '@heroui/react';

// Update component:
export function UIProvider({ children }: { children: React.ReactNode }) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}
```

### 2.2 Update Component Imports

Replace `@nextui-org/react` with `@heroui/react` in all 7 files:

**Files to update**:
1. `packages/ui/src/lib/components/OrgansSection.tsx`
2. `packages/ui/src/lib/components/GenderBalanceSection.tsx`
3. `packages/ui/src/lib/components/AttachmentsSection.tsx`
4. `apps/web/src/app/form/success/page.tsx`
5. `apps/web/src/app/admin/sign-in/page.tsx`
6. `apps/web/src/app/admin/dashboard/page.tsx`
7. `apps/web/src/app/admin/companies/page.tsx`

**Example** (apply pattern to all files):
```typescript
// BEFORE:
import { Button, Input, Card } from '@nextui-org/react';

// AFTER:
import { Button, Input, Card } from '@heroui/react';
```

**Automation Tip**: Use find-and-replace across workspace:
```bash
# From repository root
grep -rl "@nextui-org/react" packages/ui apps/web | \
  xargs sed -i '' 's/@nextui-org\/react/@heroui\/react/g'
```

### 2.3 Update Tailwind Config

**File**: `apps/web/tailwind.config.ts`

```typescript
// BEFORE:
import { nextui } from '@nextui-org/theme';

plugins: [nextui()],

// AFTER:
import { heroui } from '@heroui/react';

plugins: [
  heroui({
    themes: {
      light: {
        colors: {
          primary: {
            DEFAULT: 'var(--bs-primary)',
            foreground: 'var(--bs-white)',
          },
          success: {
            DEFAULT: 'var(--bs-success)',
            foreground: 'var(--bs-white)',
          },
          danger: {
            DEFAULT: 'var(--bs-danger)',
            foreground: 'var(--bs-white)',
          },
          warning: {
            DEFAULT: 'var(--bs-warning)',
            foreground: 'var(--bs-dark)',
          },
          focus: 'var(--bs-primary)',
        },
      },
    },
  }),
],
```

### 2.4 Update UI Package package.json

**File**: `packages/ui/package.json`

```json
// BEFORE:
{
  "dependencies": {
    "@nextui-org/react": "^2.4.0"
  }
}

// AFTER:
{
  "dependencies": {
    "@heroui/react": "^2.5.0"
  }
}
```

### 2.5 Test Migration

```bash
# Build UI package
nx build ui

# Start web app
nx serve web

# Verify no console errors, components render correctly
# Visit http://localhost:4200 (or configured port)
```

---

## Step 3: Implement 8-Point Grid System (2-3 hours)

### 3.1 Update Tailwind Config with Custom Spacing

**File**: `apps/web/tailwind.config.ts`

```typescript
import type { Config } from 'tailwindcss';
import { heroui } from '@heroui/react';

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    '../ui/src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}',
    '../../node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // 8-point grid spacing scale
      spacing: {
        '1': '8px',   // 0.5rem
        '2': '16px',  // 1rem
        '3': '24px',  // 1.5rem
        '4': '32px',  // 2rem
        '5': '40px',  // 2.5rem
        '6': '48px',  // 3rem
        '8': '64px',  // 4rem
        '10': '80px', // 5rem
        '12': '96px', // 6rem
      },
      // Map fontAndColour.css variables
      colors: {
        primary: 'var(--bs-primary)',
        secondary: 'var(--bs-secondary)',
        success: 'var(--bs-success)',
        danger: 'var(--bs-danger)',
        warning: 'var(--bs-warning)',
        info: 'var(--bs-info)',
        light: 'var(--bs-light)',
        dark: 'var(--bs-dark)',
      },
      fontFamily: {
        sans: 'var(--bs-body-font-family)',
        mono: 'var(--bs-font-monospace)',
      },
    },
  },
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: 'var(--bs-primary)',
              foreground: 'var(--bs-white)',
            },
            success: {
              DEFAULT: 'var(--bs-success)',
              foreground: 'var(--bs-white)',
            },
            danger: {
              DEFAULT: 'var(--bs-danger)',
              foreground: 'var(--bs-white)',
            },
            warning: {
              DEFAULT: 'var(--bs-warning)',
              foreground: 'var(--bs-dark)',
            },
            focus: 'var(--bs-primary)',
          },
        },
      },
    }),
  ],
} satisfies Config;
```

### 3.2 Create Utility Function for Class Composition

**File**: `packages/ui/src/lib/utils/cn.ts` (NEW)

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge Tailwind CSS classes with conditional logic.
 * Combines clsx for conditional classes and tailwind-merge to prevent conflicts.
 * 
 * @example
 * cn('gap-2', isActive && 'bg-primary', className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Export from index**:

**File**: `packages/ui/src/index.ts`

```typescript
// Add to existing exports:
export { cn } from './lib/utils/cn';
```

### 3.3 Update Components to Use 8-Point Grid

**Example**: `packages/ui/src/lib/components/OrgansSection.tsx`

```typescript
import { Button, Input, Select, SelectItem, Card } from '@heroui/react';
import { cn } from '../utils/cn';

export function OrgansSection() {
  return (
    <Card className={cn('p-6')}>  {/* 48px padding, formerly p-8 */}
      <div className="flex flex-col gap-3">  {/* 24px gap, formerly gap-4 */}
        <h2 className="text-xl font-semibold mb-2">  {/* 16px margin, formerly mb-4 */}
          Organų sudėtis
        </h2>
        {/* Rest of component... */}
      </div>
    </Card>
  );
}
```

**Pattern to apply across all components**:
- Replace arbitrary values like `gap-[20px]` with scale values: `gap-3` (24px)
- Replace non-grid padding like `p-5` with grid values: `p-4` (32px) or `p-6` (48px)
- Use responsive utilities: `gap-2 md:gap-3 lg:gap-4` for viewport-specific spacing

### 3.4 Configure ESLint for Tailwind

**File**: `.eslintrc.json` (or `eslint.config.mjs`)

```json
{
  "extends": [
    "plugin:tailwindcss/recommended"
  ],
  "rules": {
    "tailwindcss/no-arbitrary-value": "warn",
    "tailwindcss/enforces-shorthand": "warn",
    "tailwindcss/no-contradicting-classname": "error"
  }
}
```

---

## Step 4: Add Responsive Viewport Testing (3-4 hours)

### 4.1 Create Responsive Test Utilities

**File**: `apps/web/tests/e2e/utils/viewports.ts` (NEW)

```typescript
export const VIEWPORTS = {
  mobile: { width: 375, height: 667 },   // iPhone SE
  tablet: { width: 768, height: 1024 },  // iPad
  desktop: { width: 1920, height: 1080 }, // Full HD
} as const;

export type ViewportName = keyof typeof VIEWPORTS;
```

### 4.2 Create Responsive Test Suite

**File**: `apps/web/tests/e2e/responsive.spec.ts` (NEW)

```typescript
import { test, expect } from '@playwright/test';
import { VIEWPORTS, type ViewportName } from './utils/viewports';

Object.entries(VIEWPORTS).forEach(([name, viewport]) => {
  test.describe(`Responsive layout - ${name}`, () => {
    test.use({ viewport });

    test('company form renders correctly', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // Verify no horizontal scroll (SC-001)
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const clientWidth = await page.evaluate(() => document.body.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);

      // Visual regression check
      await expect(page).toHaveScreenshot(`form-${name}.png`, {
        fullPage: true,
        animations: 'disabled',
      });
    });

    test('admin dashboard renders correctly', async ({ page }) => {
      // Login first
      await page.goto('/admin/sign-in');
      await page.fill('input[name="username"]', 'admin');
      await page.fill('input[name="password"]', 'Admin123!@#');
      await page.click('button[type="submit"]');
      
      await page.waitForURL('/admin/dashboard');
      await page.waitForLoadState('networkidle');

      // Verify no horizontal scroll
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      const clientWidth = await page.evaluate(() => document.body.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth);

      // Visual regression check
      await expect(page).toHaveScreenshot(`dashboard-${name}.png`, {
        fullPage: true,
        animations: 'disabled',
      });
    });

    if (name === 'mobile' || name === 'tablet') {
      test('touch targets meet minimum size', async ({ page }) => {
        await page.goto('/');
        
        // Get all interactive elements
        const buttons = await page.locator('button, a, input[type="submit"]').all();
        
        for (const button of buttons) {
          const box = await button.boundingBox();
          if (box) {
            // WCAG 2.1 Level AA: 44x44px minimum (SC-002)
            expect(box.width).toBeGreaterThanOrEqual(44);
            expect(box.height).toBeGreaterThanOrEqual(44);
          }
        }
      });
    }
  });
});
```

### 4.3 Update Playwright Config

**File**: `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './apps/web/tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'nx serve web',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 4.4 Run Responsive Tests

```bash
# Generate initial baseline screenshots
npx playwright test responsive.spec.ts

# Update screenshots after intentional changes
npx playwright test responsive.spec.ts --update-snapshots

# View test results
npx playwright show-report
```

---

## Step 5: Integrate Recommended Dependencies (2-3 hours)

### 5.1 Add Framer Motion Animations (Optional Enhancement)

**Example**: `apps/web/src/app/page.tsx`

```typescript
'use client';
import { motion } from 'framer-motion';

export default function CompanyFormPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-6"
    >
      {/* Form content */}
    </motion.div>
  );
}
```

**Best Practices**:
- Respect `prefers-reduced-motion` (Framer Motion handles automatically)
- Keep animations subtle (300ms or less)
- Animate layout changes, not just mount/unmount

### 5.2 Integrate React Hook Form with Zod

**Example**: `apps/web/src/app/admin/sign-in/page.tsx`

```typescript
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input, Button } from '@heroui/react';

const signInSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type SignInForm = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInForm) => {
    // Submit logic
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <Input
        {...register('username')}
        label="Username"
        errorMessage={errors.username?.message}
        isInvalid={!!errors.username}
      />
      <Input
        {...register('password')}
        label="Password"
        type="password"
        errorMessage={errors.password?.message}
        isInvalid={!!errors.password}
      />
      <Button type="submit" color="primary">
        Sign In
      </Button>
    </form>
  );
}
```

---

## Step 6: Update Constitution (15 min)

### 6.1 Update constitution.md

**File**: `.specify/memory/constitution.md`

Find and replace references to NextUI with HeroUI:

```markdown
<!-- BEFORE: -->
- UI components MUST follow established patterns from NextUI component library

<!-- AFTER: -->
- UI components MUST follow established patterns from HeroUI component library
```

```markdown
<!-- BEFORE: -->
- **NextUI** MUST be used as the component library

<!-- AFTER: -->
- **HeroUI** MUST be used as the component library (migrated from NextUI v2.4.0, which is deprecated)
```

---

## Step 7: Manual Testing Checklist (1-2 hours)

### 7.1 Visual Inspection

- [ ] Company form page displays correctly on mobile (375px), tablet (768px), desktop (1920px)
- [ ] Admin sign-in page displays correctly across all viewports
- [ ] Admin dashboard table is scrollable/responsive on mobile
- [ ] No horizontal scrolling at any viewport width
- [ ] Spacing is consistent (8px increments) across all pages
- [ ] Touch targets are at least 44x44px on mobile/tablet

### 7.2 Accessibility Testing

- [ ] Test 200% browser zoom (Form should remain functional)
- [ ] Keyboard navigation works (Tab through all interactive elements)
- [ ] Screen reader testing (optional, but recommended)
- [ ] Color contrast meets WCAG 2.1 Level AA (use browser DevTools)

### 7.3 Performance Testing

```bash
# Run Lighthouse audit
npx lighthouse http://localhost:4200 --view

# Check for CLS < 0.1, FCP < 1.8s, TTI < 3.8s
```

### 7.4 Cross-Browser Testing

- [ ] Chrome/Edge (Chromium)
- [ ] Safari (if on macOS)
- [ ] Mobile Safari (iOS simulator or real device)
- [ ] Mobile Chrome (Android simulator or real device)

---

## Step 8: Run Full Test Suite (30 min)

```bash
# Run all tests
npm test

# Run E2E tests
npm run test:e2e

# Check for lint errors
npm run lint

# Build all projects
nx run-many --target=build --all
```

**Expected Results**:
- All existing tests pass
- New responsive tests pass with baseline screenshots generated
- No TypeScript errors
- No ESLint errors (except warnings for arbitrary Tailwind values if any remain)

---

## Step 9: Commit and Document (30 min)

### 9.1 Git Commit Strategy

```bash
# Stage changes by category
git add package.json package-lock.json
git commit -m "chore: migrate from NextUI v2.4.0 to HeroUI v2.5.x"

git add apps/web/tailwind.config.ts
git commit -m "feat: implement 8-point grid spacing system"

git add packages/ui/src/lib/utils/cn.ts packages/ui/src/index.ts
git commit -m "feat: add clsx/tailwind-merge utility function"

git add apps/web/tests/e2e/responsive.spec.ts
git commit -m "test: add responsive viewport screenshot tests"

# Update components (can be one commit or split by component)
git add packages/ui/src/lib/components/
git commit -m "refactor: update UI components to use HeroUI and 8-point grid"

git add apps/web/src/app/
git commit -m "refactor: update app pages to use HeroUI and 8-point grid"
```

### 9.2 Update CHANGELOG (if applicable)

```markdown
## [Unreleased]

### Changed
- Migrated from NextUI v2.4.0 to HeroUI v2.5.x (NextUI deprecated)
- Implemented 8-point grid spacing system (8px, 16px, 24px, 32px, 40px, 48px)
- Added responsive viewport testing with Playwright screenshot comparison

### Added
- Framer Motion for micro-interactions and layout animations
- React Hook Form with Zod integration for form state management
- clsx + tailwind-merge for conditional Tailwind class composition
- ESLint plugin for Tailwind class linting

### Fixed
- Inconsistent spacing across UI components
- Poor mobile experience with small touch targets
- Horizontal scrolling on narrow viewports
```

---

## Troubleshooting

### Issue: HeroUI components not rendering

**Solution**: Ensure HeroUI provider is wrapping your app:

```typescript
// apps/web/src/app/layout.tsx
import { UIProvider } from '@lgkt-forma/ui';

export default function RootLayout({ children }) {
  return (
    <html lang="lt">
      <body>
        <UIProvider>{children}</UIProvider>
      </body>
    </html>
  );
}
```

### Issue: Tailwind classes not applying

**Solution**: Check Tailwind content paths in `tailwind.config.ts`:

```typescript
content: [
  './src/**/*.{js,ts,jsx,tsx}',
  '../ui/src/**/*.{js,ts,jsx,tsx}',
  './node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}',
],
```

### Issue: Playwright screenshots differ slightly

**Solution**: This is normal due to font rendering differences. Accept minor diffs:

```bash
npx playwright test --update-snapshots
```

### Issue: Touch target test failing

**Solution**: Ensure buttons use HeroUI's default size (which is 46x46px) or explicitly set `size="lg"`:

```typescript
<Button size="lg">Click Me</Button>
```

---

## Next Steps

After completing this quickstart:

1. **Review tasks.md**: See detailed task breakdown (generated by `/speckit.tasks`)
2. **Implement user stories**: Focus on US1 (Form layout), US2 (Admin dashboard), US3 (Consistent spacing)
3. **Monitor success criteria**: Track CLS, form completion time, WCAG compliance
4. **Iterate**: Address feedback from manual testing and stakeholder review

---

## Resources

- [HeroUI Documentation](https://heroui.com/docs) (formerly NextUI)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Playwright Testing Documentation](https://playwright.dev/docs/intro)
- [React Hook Form Documentation](https://react-hook-form.com/get-started)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Quickstart Version**: 1.0 | **Last Updated**: 2025-01-24
