'use client';

import { useState, useCallback } from 'react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  isProcessing: boolean;
}

export default function ImageUploader({ onImageSelect, isProcessing }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && isValidImage(file)) {
      onImageSelect(file);
    }
  }, [onImageSelect]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isValidImage(file)) {
      onImageSelect(file);
    }
  }, [onImageSelect]);

  const isValidImage = (file: File): boolean => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      alert('Please upload a JPG, PNG, or WEBP image.');
      return false;
    }

    if (file.size > maxSize) {
      alert('File is too large. Maximum size is 10MB.');
      return false;
    }

    return true;
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all
        ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
        ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
        dark:border-gray-600 dark:hover:border-gray-500 dark:bg-blue-900/10
      `}
    >
      <input
        type="file"
        onChange={handleFileSelect}
        accept="image/jpeg,image/png,image/webp"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isProcessing}
      />
      
      <div className="space-y-4">
        <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center dark:bg-gray-700">
          <svg
            className="w-8 h-8 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        
        <div>
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            {isDragging ? 'Drop image here' : 'Upload Image'}
          </p>
          <p className="text-sm text-gray-500 mt-2 dark:text-gray-400">
            Drag and drop an image, or click to select
          </p>
          <p className="text-xs text-gray-400 mt-1 dark:text-gray-500">
            Supports: JPG, PNG, WEBP (max 10MB)
          </p>
        </div>
      </div>
    </div>
  );
}
