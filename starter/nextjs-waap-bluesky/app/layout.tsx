import type { Metadata } from 'next';
import { WaaPProvider } from '../components/waap.context';

export const metadata: Metadata = {
  title: 'Plasmmer Accounts v0 Starter',
  description: 'Bluesky + WaaP.xyz account bootstrap starter',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WaaPProvider>{children}</WaaPProvider>
      </body>
    </html>
  );
}
