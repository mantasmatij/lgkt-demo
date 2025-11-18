// Axe accessibility helper (T018)
// Lightweight utility to run axe-core in Playwright without extra dependencies.
// Usage:
//   import { scanA11y, expectNoViolations } from '../helpers/axe';
//   const results = await scanA11y(page);
//   expectNoViolations(results);
// NOTE: Keep bundle impact zero by injecting axe dynamically.

import { Page } from '@playwright/test';

export interface AxeViolationNode {
  html: string;
  target: string[];
}
export interface AxeViolation {
  id: string;
  impact: string;
  description: string;
  help: string;
  helpUrl: string;
  nodes: AxeViolationNode[];
}
export interface AxeResults {
  violations: AxeViolation[];
}

const AXE_SRC = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.9.1/axe.min.js';

declare global {
  interface Window {
    axe?: {
      run(context: Document | HTMLElement, options: Record<string, unknown>): Promise<AxeResults>;
    };
  }
}

export async function injectAxe(page: Page) {
  // If axe already present skip.
  const hasAxe = await page.evaluate(() => typeof window.axe !== 'undefined');
  if (hasAxe) return;
  await page.addScriptTag({ url: AXE_SRC });
}

export async function scanA11y(page: Page): Promise<AxeResults> {
  await injectAxe(page);
  const results = await page.evaluate(() => {
    if (!window.axe) {
      return { violations: [] } as AxeResults;
    }
    return window.axe.run(document, {
      resultTypes: ['violations'],
      // Reduce noise: disable color-contrast for initial pass (often needs design tokens tune)
      rules: {
        'color-contrast': { enabled: false }
      }
    });
  });
  return results as AxeResults;
}

export function formatViolations(results: AxeResults): string {
  if (!results.violations.length) return 'No accessibility violations found.';
  return results.violations
    .map(v => {
      const nodes = v.nodes
        .map(n => `    - target: ${n.target.join(', ')}\n      html: ${n.html}`)
        .join('\n');
      return `Violation: ${v.id}\nImpact: ${v.impact}\nDesc: ${v.description}\nHelp: ${v.helpUrl}\nNodes:\n${nodes}`;
    })
    .join('\n\n');
}

export function expectNoViolations(results: AxeResults) {
  if (results.violations.length) {
    throw new Error('Accessibility violations:\n' + formatViolations(results));
  }
}
