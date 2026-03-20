'use client';

import { useState } from 'react';

interface ResultDisplayProps {
  originalImage: string;
  processedImage: string;
  onReset: () => void;
}

export default function ResultDisplay({
  originalImage,
  processedImage,
  onReset,
}: ResultDisplayProps) {
  const [showOriginal, setShowOriginal] = useState(false);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = `removed-bg-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Image Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original Image */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Original
            </h3>
            <button
              onClick={() => setShowOriginal(true)}
              className={`
                text-xs px-3 py-1 rounded-full transition-all
                ${showOriginal ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}
              `}
            >
              {showOriginal ? 'Viewing' : 'View'}
            </button>
          </div>
          <div className="border rounded-lg overflow-hidden dark:border-gray-700">
            <img
              src={originalImage}
              alt="Original"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Processed Image */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Background Removed
            </h3>
            <button
              onClick={() => setShowOriginal(false)}
              className={`
                text-xs px-3 py-1 rounded-full transition-all
                ${!showOriginal ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'}
              `}
            >
              {!showOriginal ? 'Viewing' : 'View'}
            </button>
          </div>
          <div className="border rounded-lg overflow-hidden bg-checkerboard dark:bg-checkerboard-dark dark:border-gray-700">
            <img
              src={processedImage}
              alt="Background removed"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PNG
        </button>

        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-all dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Process Another Image
        </button>
      </div>
    </div>
  );
}
