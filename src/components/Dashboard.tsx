// src/components/Dashboard.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import MonetizationModal from '@/components/MonetizationModal';

export default function Dashboard() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState(0);
  const [isMonetizationModalOpen, setIsMonetizationModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Check for user document in Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setCredits(userDoc.data().credits);
        } else {
          // Create new user document with initial credits
          await setDoc(userDocRef, {
            email: currentUser.email,
            credits: 2, // Free tier credits
            createdAt: new Date(),
          });
          setCredits(2);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
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
      <button
        onClick={() => setIsMonetizationModalOpen(true)}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition duration-300 transform hover:scale-105"
      >
        Buy More Credits
      </button>
      <button
        onClick={handleSignOut}
        className="mt-4 text-gray-500 hover:text-red-500 transition-colors underline"
      >
        Sign out
      </button>
      <MonetizationModal isOpen={isMonetizationModalOpen} onClose={() => setIsMonetizationModalOpen(false)} />
    </div>
  );
}
