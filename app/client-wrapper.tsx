// app/client-wrapper.tsx
'use client';

import { MantineProvider, createTheme } from '@mantine/core';
import { ReactNode } from 'react';
import '@mantine/core/styles.css';

const theme = createTheme({
  colors: {
    dark: [
      '#ffffff', // Lightest
      '#e0e0e0',
      '#c0c0c0',
      '#a0a0a0',
      '#808080',
      '#606060',
      '#404040',
      '#303030',
      '#202020',
      '#2F3136', // Darkest (matches the image background)
    ],
  },
  primaryColor: 'blue',
  defaultRadius: 'md',
});

export default function ClientWrapper({ children }: { children: ReactNode }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      {children}
    </MantineProvider>
  );
}