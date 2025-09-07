// src/components/Dashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/firebase';

export default function Dashboard() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(0); // This will be fetched from Firestore later

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      // TODO: Fetch user's credit from Firestore here
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center py-20 text-red-500">You must be signed in to view this page.</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
        Welcome, {user.email}!
      </h2>
      <p className="text-xl text-gray-600 mb-8">
        Your current credit balance is:
        <span className="font-bold text-indigo-600 ml-2">{credits}</span>
      </p>
      <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 transform hover:scale-105">
        Buy More Credits
      </button>
      <button
        onClick={handleSignOut}
        className="mt-4 text-gray-500 hover:text-red-500 transition-colors underline"
      >
        Sign out
      </button>
    </div>
  );
}