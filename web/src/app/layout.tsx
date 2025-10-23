import './global.css';
import { UIProvider } from 'ui';

export const metadata = {
  title: 'LGKT Forma - Company Reporting',
  description: 'Anonymous company form submission and admin portal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Skip to main content link for keyboard navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded focus:shadow-lg"
        >
          Skip to main content
        </a>
        <UIProvider>
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
        </UIProvider>
      </body>
    </html>
  );
}
