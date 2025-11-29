import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'QR Orders Platform',
  description: 'QR-based ordering for hotels and restaurants',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container">
          <header className="header">
            <div className="logo">QR Orders</div>
            <nav style={{ display: 'flex', gap: 12 }}>
              <a className="button ghost" href="/">Home</a>
              <a className="button ghost" href="/dashboard">Dashboard</a>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
