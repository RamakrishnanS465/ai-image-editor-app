// src/components/ImageEditor.tsx
'use client';
import React, { useState } from 'react';
import { auth } from '@/firebase';

export default function ImageEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const uploadedFile = e.target.files[0];
      setFile(uploadedFile);
      setPreviewUrl(URL.createObjectURL(uploadedFile));
      setProcessedUrl(null);
      setError(null);
    }
  };

  const handleProcessImage = async () => {
    if (!file) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const user = auth.currentUser;
    if (!user) {
      setError('Authentication is required to process images. Please sign in.');
      setIsLoading(false);
      return;
    }

    const token = await user.getIdToken();

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/process-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process image.');
      }

      const data = await response.json();
      setProcessedUrl(data.processedImageUrl);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-xl max-w-4xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6">AI Image Editor</h2>
      <p className="text-gray-600 mb-8 text-center">
        Upload an image to get started. The AI will process it and give you the result.
      </p>

      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
        <div className="flex-1 w-full">
          <h3 className="text-xl font-bold mb-2">Original</h3>
          {!previewUrl ? (
            <div
              className="w-full h-80 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <span className="text-gray-500 text-lg text-center">Drag & Drop or click to browse</span>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="border border-gray-300 rounded-lg p-2 h-80 flex items-center justify-center">
              <img src={previewUrl} alt="Original" className="max-w-full max-h-full rounded-md" />
            </div>
          )}
        </div>

        <div className="flex-1 w-full">
          <h3 className="text-xl font-bold mb-2">Processed</h3>
          <div className="w-full h-80 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            {isLoading ? (
              <div className="text-indigo-600 animate-pulse">Processing...</div>
            ) : processedUrl ? (
              <img src={processedUrl} alt="Processed" className="max-w-full max-h-full rounded-md" />
            ) : (
              <span className="text-gray-500 text-lg">Your result will appear here.</span>
            )}
          </div>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {previewUrl && (
        <button
          onClick={handleProcessImage}
          disabled={isLoading}
          className={`w-full py-3 px-8 rounded-lg shadow-lg transition duration-300 transform ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white font-bold hover:scale-105'}`}
        >
          {isLoading ? 'Processing...' : 'Process Image'}
        </button>
      )}
    </div>
  );
}