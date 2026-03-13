import React from 'react';

interface ApplyButtonProps {
  disabled: boolean;
  onApply: () => void;
}

export const ApplyButton: React.FC<ApplyButtonProps> = ({ disabled, onApply }) => {
  return (
    <button
      onClick={onApply}
      disabled={disabled}
      className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm ${
        disabled
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
          : 'bg-emerald-600 text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2'
      }`}
    >
      Apply Banked Surplus
    </button>
  );
};
