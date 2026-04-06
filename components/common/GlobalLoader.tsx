import React from 'react';

interface GlobalLoaderProps {
  message: string;
}

const GlobalLoader: React.FC<GlobalLoaderProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-[100]" aria-modal="true" role="dialog" aria-labelledby="loading-message">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-900 mb-4"></div>
      <p id="loading-message" className="text-black text-xl font-semibold">{message}</p>
      <p className="text-gray-600 mt-2">This might take a moment.</p>
    </div>
  );
};

export default GlobalLoader;