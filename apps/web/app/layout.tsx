import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'VentureSketch',
  description: 'The premium workspace for your next big idea',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
