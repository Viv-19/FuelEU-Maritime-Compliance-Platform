import React from 'react';

interface BankingInfoProps {
  cbBefore: number;
  bankedAmount: number;
  cbAfter: number;
}

export const BankingInfo: React.FC<BankingInfoProps> = ({ cbBefore, bankedAmount, cbAfter }) => {
  const formatValue = (val: number) => {
    const color = val > 0 ? 'text-green-600' : val < 0 ? 'text-red-600' : 'text-gray-700';
    return <span className={`font-mono font-bold ${color}`}>{val.toLocaleString()}</span>;
  };

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
        Compliance Balance Overview
      </h3>
      <div className="grid grid-cols-3 gap-6">
        <div className="flex flex-col items-center gap-1 p-4 bg-gray-50 rounded-lg">
          <span className="text-xs font-semibold text-gray-400 uppercase">CB Before</span>
          <span className="text-2xl">{formatValue(cbBefore)}</span>
        </div>
        <div className="flex flex-col items-center gap-1 p-4 bg-indigo-50 rounded-lg">
          <span className="text-xs font-semibold text-indigo-400 uppercase">Banked Amount</span>
          <span className="text-2xl">{formatValue(bankedAmount)}</span>
        </div>
        <div className="flex flex-col items-center gap-1 p-4 bg-gray-50 rounded-lg">
          <span className="text-xs font-semibold text-gray-400 uppercase">CB After</span>
          <span className="text-2xl">{formatValue(cbAfter)}</span>
        </div>
      </div>
    </div>
  );
};
