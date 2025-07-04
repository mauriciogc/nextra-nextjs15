// src/app/layout.tsx
import { getPageMap } from 'nextra/page-map';
import type { Metadata } from 'next';
import { Footer, Layout, Navbar } from 'nextra-theme-docs';
import type { FC, ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  description: 'Next.js v15 documentation, made with Nextra & MDX',
  keywords: ['Nextra', 'Next.js', 'React', 'JavaScript', 'MDX', 'Markdown'],
  generator: 'Next.js',
  applicationName: 'nextjs-v15-doc',
  appleWebApp: {
    title: 'Next.js v15 Documentation',
  },
  title: {
    default: 'Next.js v15 Documentation',
    template: '%s | Next.js v15 Documentation',
  },
};

const navbar = (
  <Navbar
    logo={<h1>Next.js +15</h1>}
    projectLink="https://github.com/mauriciogc/nextjs-v15-doc"
  />
);

const footer = (
  <Footer className="flex-col items-center md:items-start">
    Powered by Next.js & Nextra
  </Footer>
);

const RootLayout: FC<{ children: ReactNode }> = async ({ children }) => {
  const pageMap = await getPageMap();

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body>
        <Layout
          navbar={navbar}
          footer={footer}
          pageMap={pageMap}
          docsRepositoryBase="https://github.com/mauriciogc/nextjs-v15-doc/tree/main"
          editLink="Edit this page on GitHub"
          sidebar={{
            defaultMenuCollapseLevel: 1,
          }}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
};

export default RootLayout;
