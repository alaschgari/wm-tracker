import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'FIFA World Cup 2026 Tracker & Simulator',
  description: 'Verfolge alle Spiele, Ergebnisse und Gruppentabellen der Fußball-Weltmeisterschaft 2026 live. Simuliere Spielergebnisse und berechne die K.o.-Runden.',
  keywords: ['World Cup 2026', 'WM 2026', 'Ergebnisse', 'Spielplan', 'Fußball', 'Simulator'],
  authors: [{ name: 'World Cup Team' }],
};

export default function RootLayout({
  children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  return (
    <html lang="de" className={inter.variable}>
      <body>
        <div className="glowing-orb orb-green"></div>
        <div className="glowing-orb orb-blue"></div>
        {children}
      </body>
    </html>
  );
}
