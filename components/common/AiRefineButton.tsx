
import React from 'react';
import LoadingSpinner from './LoadingSpinner.tsx';
import SparklesIcon from '../icons/SparklesIcon.tsx';

interface AiRefineButtonProps {
  onClick: () => void;
  isLoading: boolean;
  className?: string;
}

const AiRefineButton: React.FC<AiRefineButtonProps> = ({ onClick, isLoading, className }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-indigo-500 ${
        isLoading
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
      } ${className}`}
    >
      {isLoading ? (
        <>
          <LoadingSpinner />
          <span>Refining...</span>
        </>
      ) : (
        <>
          <SparklesIcon className="w-4 h-4" />
          <span>Refine with AI</span>
        </>
      )}
    </button>
  );
};

export default AiRefineButton;