import React from 'react';

interface BaselineButtonProps {
  routeId: string;
  isBaseline: boolean;
  onSetBaseline: (routeId: string) => void;
}

export const BaselineButton: React.FC<BaselineButtonProps> = ({ routeId, isBaseline, onSetBaseline }) => {
  return (
    <button
      onClick={() => onSetBaseline(routeId)}
      disabled={isBaseline}
      className={`px-3 py-1 rounded text-sm font-medium transition-colors border shadow-sm ${
        isBaseline
          ? 'bg-indigo-100 text-indigo-700 border-indigo-200 cursor-not-allowed'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500'
      }`}
    >
      {isBaseline ? 'Baseline' : 'Set Baseline'}
    </button>
  );
};
