import './global.css';
import { UIProvider } from 'ui';
import { LocaleProvider } from '../i18n/LocaleProvider';
import LanguageSwitcher from '../components/LanguageSwitcher';

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
    <html lang="lt">
      <body>
        {/* Skip to main content link for keyboard navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded focus:shadow-lg"
        >
          Skip to main content
        </a>
        <UIProvider>
          <LocaleProvider>
            <header className="w-full flex justify-end p-4">
              <LanguageSwitcher />
            </header>
            <main id="main-content" tabIndex={-1}>
              {children}
            </main>
          </LocaleProvider>
        </UIProvider>
      </body>
    </html>
  );
}
