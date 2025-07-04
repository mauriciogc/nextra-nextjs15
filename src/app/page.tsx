// src/app/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Nextra Docs Template',
  description: 'Modern documentation site built with Nextra & Next.js 15+',
};

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-24">
      <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight bg-gradient-to-b from-white to-neutral-400 text-transparent bg-clip-text">
        Build Beautiful Docs with
        <br />
        Next.js & Nextra
      </h1>

      <p className="mt-6 text-lg md:text-xl text-neutral-400 max-w-xl">
        A modern, blazing-fast documentation starter using the power of MDX,
        Tailwind and Pagefind.
      </p>

      <div className="mt-10 flex gap-4">
        <Link
          href="/docs"
          className="px-6 py-3 text-sm font-semibold rounded-lg bg-white text-black hover:bg-neutral-200 transition-colors"
        >
          Get Started
        </Link>
        <a
          href="https://github.com/mauriciogc/nextra-nextjs15"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3 text-sm font-semibold rounded-lg border border-white/30 hover:bg-white/10 transition-colors"
        >
          GitHub
        </a>
      </div>
    </main>
  );
}
