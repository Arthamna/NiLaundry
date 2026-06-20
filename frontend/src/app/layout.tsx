import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NiLaundry',
  description: 'Smart Laundry Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-800 antialiased dark:bg-[#0b0f0e] dark:text-gray-100`}>
        {children}
      </body>
    </html>
  );
}