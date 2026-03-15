import React, { useState, useEffect } from 'react';
import { apiPost } from '../infrastructure/apiClient';

export interface DropdownShip {
  shipId: string;
  amount: number;
}

interface TransferCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  surplusShips: DropdownShip[];
  deficitShips: DropdownShip[];
  showToast: (message: string) => void;
}

export const TransferCreditsModal: React.FC<TransferCreditsModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  surplusShips,
  deficitShips,
  showToast
}) => {
  const [fromShipId, setFromShipId] = useState('');
  const [toShipId, setToShipId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFromShipId(surplusShips[0]?.shipId || '');
      setToShipId(deficitShips[0]?.shipId || '');
      setAmount('');
      setError(null);
    }
  }, [isOpen, surplusShips, deficitShips]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromShipId || !toShipId || !amount) {
      setError('Please fill in all fields.');
      return;
    }

    const transferAmount = Number(amount);
    if (transferAmount <= 0) {
      setError('Amount must be greater than zero.');
      return;
    }

    const availableSurplus = surplusShips.find(s => s.shipId === fromShipId)?.amount || 0;
    if (transferAmount > availableSurplus) {
      setError(`Amount cannot exceed the available surplus of ${availableSurplus.toLocaleString()}.`);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await apiPost('/banking/apply', { fromShipId, toShipId, amount: transferAmount });
      if (res.success) {
        showToast('Transfer successful!');
        onSuccess();
        onClose();
      } else {
        throw new Error('Failed to transfer credits.');
      }
    } catch (err: any) {
      setError(err.message || 'Error occurred during transfer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl border border-gray-200 w-full max-w-lg p-6 z-50">
        <h2 className="text-xl font-bold text-gray-900 mb-5">Transfer Credits</h2>
        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 font-medium px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">From Ship (Surplus)</label>
            <select
              value={fromShipId}
              onChange={(e) => setFromShipId(e.target.value)}
              className="mt-1 block w-full outline-none border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            >
              <option value="" disabled>Select a ship...</option>
              {surplusShips.map(s => (
                <option key={s.shipId} value={s.shipId}>
                  {s.shipId} (Surplus: +{s.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">To Ship (Deficit)</label>
            <select
              value={toShipId}
              onChange={(e) => setToShipId(e.target.value)}
              className="mt-1 block w-full outline-none border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            >
              <option value="" disabled>Select a ship...</option>
              {deficitShips.map(s => (
                <option key={s.shipId} value={s.shipId}>
                  {s.shipId} (Deficit: {s.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount to Transfer</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="mt-1 block w-full outline-none border border-gray-300 rounded-md py-2 px-3 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter transfer amount"
              required
            />
          </div>
          <div className="mt-8 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-blue-500 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 border border-transparent rounded-md py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-blue-700 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              disabled={loading}
            >
              {loading ? 'Transferring...' : 'Transfer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
