// app/layout.tsx
import { ReactNode } from 'react';
import ClientWrapper from './client-wrapper';

export const metadata = {
  title: 'Discord Colored Text Generator',
  description: 'Generate colored text for Discord using markdown syntax',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}