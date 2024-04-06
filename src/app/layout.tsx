import type { Metadata } from 'next';
import { fontPrimary } from '@/utils/fonts';
import { Providers } from './providers';

import './globals.css';

export const metadata: Metadata = {
  title: 'Next Auth - Vivek',
  description: 'Next Auth - Vivek',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" className="dark">
      <body className={fontPrimary.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
};

export default RootLayout;
