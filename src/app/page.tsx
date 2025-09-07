// src/app/page.tsx
'use client';

import Layout from '@/components/Layout';
import AuthModal from '@/components/AuthModal';
import Dashboard from '@/components/Dashboard'; // Import Dashboard
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase';
import { getFirestore } from 'firebase/firestore';
import { firebaseApp } from '@/firebase';

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const db = getFirestore(firebaseApp);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-20">Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      {isAuthenticated ? (
        <Dashboard />
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-4">
            Unleash Your Creativity with AI 🎨
          </h2>
          <p className="text-xl text-gray-600 text-center max-w-2xl mb-8">
            Transform your images with powerful AI tools. Remove objects, upscale photos, and more, all with a single click.
          </p>
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
          >
            Get Started
          </button>
        </div>
      )}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </Layout>
  );
}