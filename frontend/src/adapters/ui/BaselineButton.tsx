import React from 'react';

interface BaselineButtonProps {
  routeId: string;
  isBaseline: boolean;
  onSetBaseline: (routeId: string) => void;
}

export const BaselineButton: React.FC<BaselineButtonProps> = ({ routeId, isBaseline, onSetBaseline }) => {
  if (isBaseline) {
    return (
      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-medium">
        Baseline
      </span>
    );
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onSetBaseline(routeId);
      }}
      className="px-3 py-1 rounded text-sm font-medium transition-colors border shadow-sm bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      Set as Baseline
    </button>
  );
};
