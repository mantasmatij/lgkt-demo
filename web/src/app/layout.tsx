import './global.css';
import localFont from 'next/font/local';
import { UIProvider } from 'ui';
import { LocaleProvider } from '../i18n/LocaleProvider';
import { lt } from '../i18n/dictionaries/lt';
import { SkipLink } from './components/SkipLink';

export const metadata = {
  title: lt.common.title,
  description: lt.common.description,
};

// Load Atkinson Hyperlegible from local repo fonts (provided in stuff/)
const atkinson = localFont({
  src: [
    {
      path: '../../../stuff/Atkinson-Hyperlegible-Font-Print-and-Web-2020-0514/Web Fonts/WOFF2/Atkinson-Hyperlegible-Regular-102a.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../../stuff/Atkinson-Hyperlegible-Font-Print-and-Web-2020-0514/Web Fonts/WOFF2/Atkinson-Hyperlegible-Italic-102a.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../../stuff/Atkinson-Hyperlegible-Font-Print-and-Web-2020-0514/Web Fonts/WOFF2/Atkinson-Hyperlegible-Bold-102a.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../../stuff/Atkinson-Hyperlegible-Font-Print-and-Web-2020-0514/Web Fonts/WOFF2/Atkinson-Hyperlegible-BoldItalic-102a.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="lt">
      <body className={atkinson.className}>
        <UIProvider>
          <LocaleProvider>
            {/* Skip to main content link for keyboard navigation */}
            <SkipLink />
            {/* Header language switcher removed; sidebar now controls language */}
            <main id="main-content" tabIndex={-1}>
              {children}
            </main>
          </LocaleProvider>
        </UIProvider>
      </body>
    </html>
  );
}
