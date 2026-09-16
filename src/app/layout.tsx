import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Gráfica SaaS - Gestão de Serviços',
  description: 'Sistema completo de gestão de serviços para gráficas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-50`}>
        {children}
      </body>
    </html>
  );
}
