import './global.css';
import { UIProvider } from 'ui';
import { LocaleProvider } from '../i18n/LocaleProvider';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { lt } from '../i18n/dictionaries/lt';
import { SkipLink } from './components/SkipLink';

export const metadata = {
  title: lt.common.title,
  description: lt.common.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="lt">
      <body>
        <UIProvider>
          <LocaleProvider>
            {/* Skip to main content link for keyboard navigation */}
            <SkipLink />
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
