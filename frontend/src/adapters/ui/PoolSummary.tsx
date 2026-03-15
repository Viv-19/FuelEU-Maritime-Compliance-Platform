import React from 'react';

interface PoolSummaryProps {
  totalCBBefore: number;
  totalCBAfter: number | null;
  isValid: boolean;
}

export const PoolSummary: React.FC<PoolSummaryProps> = ({ totalCBBefore, totalCBAfter, isValid }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
        Pool Summary
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center gap-1 p-4 bg-gray-50 rounded-lg">
          <span className="text-xs font-semibold text-gray-400 uppercase">Total CB Before</span>
          <span className={`text-2xl font-mono font-bold ${totalCBBefore >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {totalCBBefore > 0 ? '+' : ''}{totalCBBefore.toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1 p-4 bg-gray-50 rounded-lg">
          <span className="text-xs font-semibold text-gray-400 uppercase">Total CB After</span>
          <span className={`text-2xl font-mono font-bold ${
            totalCBAfter !== null
              ? totalCBAfter >= 0 ? 'text-green-600' : 'text-red-600'
              : 'text-gray-400'
          }`}>
            {totalCBAfter !== null ? `${totalCBAfter > 0 ? '+' : ''}${totalCBAfter.toLocaleString()}` : '—'}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center gap-1 p-4 rounded-lg">
          <span className="text-xs font-semibold text-gray-500 uppercase">Status</span>
          <div className={`px-4 py-2 rounded-lg text-sm font-bold uppercase ${
            isValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {isValid ? 'VERIFIED POOL' : 'INVALID POOL'}
          </div>
        </div>
      </div>
    </div>
  );
};
