    'use client';
    import React, { useState } from 'react';

    export default function ImageEditor() {
      const [file, setFile] = useState<File | null>(null);
      const [previewUrl, setPreviewUrl] = useState<string | null>(null);
      const [isLoading, setIsLoading] = useState(false);

      const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
          const uploadedFile = e.target.files[0];
          setFile(uploadedFile);
          setPreviewUrl(URL.createObjectURL(uploadedFile));
        }
      };

      const handleProcessImage = async () => {
        if (!file) {
          alert('Please upload an image first.');
          return;
        }

        setIsLoading(true);

        const formData = new FormData();
        formData.append('image', file);
        // We will send this formData to our API endpoint later.
        // For now, let's simulate the process.
        console.log('Processing image with AI...');

        // Simulate a 3-second delay for the AI to process the image
        await new Promise(resolve => setTimeout(resolve, 3000));

        setIsLoading(false);
        alert('Image processed successfully!');
      };

      return (
        <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-xl max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">AI Image Editor</h2>
          <p className="text-gray-600 mb-8 text-center">
            Upload an image to get started. The AI will process it and give you the result.
          </p>

          {!previewUrl ? (
            <div
              className="w-full h-80 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-colors"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <span className="text-gray-500 text-lg">Drag & Drop an image here or click to browse</span>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="w-full mb-6">
              <div className="border border-gray-300 rounded-lg p-2">
                <img src={previewUrl} alt="Preview" className="w-full rounded-md" />
              </div>
            </div>
          )}

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