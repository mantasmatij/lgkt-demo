/**
 * Standard viewport configurations for responsive testing
 * Used across E2E tests to ensure consistent viewport testing
 */

export const VIEWPORTS = {
  mobile: {
    name: 'Mobile',
    width: 375,
    height: 667,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  },
  tablet: {
    name: 'Tablet',
    width: 768,
    height: 1024,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  },
  desktop: {
    name: 'Desktop',
    width: 1920,
    height: 1080,
    deviceScaleFactor: 1,
    isMobile: false,
    hasTouch: false,
  },
} as const;

export type ViewportName = keyof typeof VIEWPORTS;

/**
 * Helper function to set viewport for a page
 */
export async function setViewport(page: { setViewportSize: (size: { width: number; height: number }) => Promise<void> }, viewportName: ViewportName) {
  const viewport = VIEWPORTS[viewportName];
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
}
