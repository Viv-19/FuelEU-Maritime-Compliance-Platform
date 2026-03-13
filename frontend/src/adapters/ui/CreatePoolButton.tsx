import React from 'react';

interface CreatePoolButtonProps {
  disabled: boolean;
  onCreatePool: () => void;
}

export const CreatePoolButton: React.FC<CreatePoolButtonProps> = ({ disabled, onCreatePool }) => {
  return (
    <button
      onClick={onCreatePool}
      disabled={disabled}
      className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm ${
        disabled
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
      }`}
    >
      Create Pool
    </button>
  );
};
