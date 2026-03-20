'use client';

import { useState, useCallback } from 'react';
import ImageUploader from '@/components/ImageUploader';
import ResultDisplay from '@/components/ResultDisplay';

type ProcessingState = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string>('');
  const [processedImage, setProcessedImage] = useState<string>('');
  const [state, setState] = useState<ProcessingState>('idle');
  const [error, setError] = useState<string>('');

  const handleImageSelect = useCallback(async (file: File) => {
    setState('processing');
    setError('');
    
    // 创建原始图片预览
    const originalUrl = URL.createObjectURL(file);
    setOriginalImage(originalUrl);

    try {
      // 创建 FormData
      const formData = new FormData();
      formData.append('image', file);

      // 调用 API
      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process image');
      }

      // 获取处理后的图片
      const blob = await response.blob();
      const processedUrl = URL.createObjectURL(blob);
      setProcessedImage(processedUrl);
      setState('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setState('error');
    }
  }, []);

  const handleReset = useCallback(() => {
    // 清理 URL 对象
    if (originalImage) URL.revokeObjectURL(originalImage);
    if (processedImage) URL.revokeObjectURL(processedImage);
    
    setOriginalImage('');
    setProcessedImage('');
    setState('idle');
    setError('');
  }, [originalImage, processedImage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Image Background Remover
            <span className="block text-2xl md:text-3xl mt-2 text-blue-600 dark:text-blue-400">
              Remove backgrounds instantly with AI
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Upload your image and watch the magic happen. No complex tools, just one click.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {(state === 'idle' || state === 'error') && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
              <ImageUploader
                onImageSelect={handleImageSelect}
                isProcessing={false}
              />
            </div>
          )}

          {state === 'processing' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Processing your image...
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                This usually takes a few seconds
              </p>
            </div>
          )}

          {state === 'error' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <div className="text-center space-y-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full dark:bg-red-900">
                  <svg className="w-8 h-8 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Oops! Something went wrong
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {error}
                  </p>
                </div>

                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {state === 'success' && originalImage && processedImage && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
              <ResultDisplay
                originalImage={originalImage}
                processedImage={processedImage}
                onReset={handleReset}
              />
            </div>
          )}
        </div>

        {/* Features Section */}
        {state === 'idle' && (
          <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Lightning Fast',
                description: 'Process images in seconds with our AI-powered technology',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                title: 'High Quality',
                description: 'Get transparent PNG images with perfect edge detection',
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: 'Secure & Private',
                description: 'Your images are processed and never stored on our servers',
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg"
              >
                <div className="text-blue-500 mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-500 dark:text-gray-400 text-sm">
          <p>Powered by Remove.bg API • Built with Next.js & Tailwind CSS</p>
        </footer>
      </div>
    </div>
  );
}
