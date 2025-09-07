// src/components/Layout.tsx
import Head from 'next/head';
import React from 'react';

type LayoutProps = {
  children: React.ReactNode;
  title?: string;
};

export default function Layout({ children, title = 'AI Image Editor App' }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="An AI-powered image editing application with a pay-per-process model." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
        <header className="bg-white shadow-sm p-4 sticky top-0 z-50">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-600">
              AI-Editor
            </h1>
            {/* We will add navigation and auth buttons here later */}
            <nav className="space-x-4">
              {/* This will be our main nav */}
            </nav>
          </div>
        </header>

        <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        <footer className="bg-white border-t border-gray-100 py-4 text-center text-gray-500">
          © {new Date().getFullYear()} AI-Editor. All rights reserved.
        </footer>
      </div>
    </>
  );
}