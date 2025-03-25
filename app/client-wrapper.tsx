// app/client-wrapper.tsx
'use client';

import { MantineProvider } from '@mantine/core';
import { ReactNode } from 'react';
import '@mantine/core/styles.css';

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <MantineProvider defaultColorScheme="light">
      {children}
    </MantineProvider>
  );
}