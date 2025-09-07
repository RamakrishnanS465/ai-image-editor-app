'use client';
import React from 'react';

type MonetizationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MonetizationModal({ isOpen, onClose }: MonetizationModalProps) {
  if (!isOpen) {
    return null;
  }

  const pricingTiers = [
    { name: 'Paid Tier 1', price: '₹99', credits: 50 },
    { name: 'Paid Tier 2', price: '₹199', credits: 150 },
  ];

  const handlePurchase = (tierName: string) => {
    // This is a placeholder for a real payment gateway integration.
    // In a production app, you would integrate with a service like Razorpay or Stripe here.
    console.log(`User selected to purchase: ${tierName}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
          Buy More Credits
        </h2>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pricingTiers.map((tier, index) => (
              <div key={index} className="bg-indigo-50 p-6 rounded-lg text-center shadow-md">
                <h3 className="text-xl font-semibold text-indigo-600 mb-2">{tier.name}</h3>
                <p className="text-4xl font-extrabold text-gray-900 mb-4">{tier.price}</p>
                <p className="text-md text-gray-600 mb-6">{tier.credits} credits</p>
                <button
                  onClick={() => handlePurchase(tier.name)}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition duration-300 transform hover:scale-105"
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
