import React, { useEffect, useState } from 'react';
import { apiGet, apiPost } from '../infrastructure/apiClient';
import { BankingInfo } from './BankingInfo';
import { BankButton } from './BankButton';
import { ApplyButton } from './ApplyButton';

const DEFAULT_SHIP_ID = 'SHIP001';
const DEFAULT_YEAR = 2024;

export const BankingPage: React.FC = () => {
  const [shipId] = useState<string>(DEFAULT_SHIP_ID);
  const [year] = useState<number>(DEFAULT_YEAR);
  const [cbBefore, setCbBefore] = useState<number>(0);
  const [bankedAmount, setBankedAmount] = useState<number>(0);
  const [cbAfter, setCbAfter] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCB = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiGet(`/compliance/cb?shipId=${shipId}&year=${year}`);
      if (res.success && res.data) {
        const cb = res.data.complianceBalance;
        setCbBefore(cb);
        setBankedAmount(0);
        setCbAfter(cb);
      } else {
        throw new Error('Invalid compliance data');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load compliance balance.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCB();
  }, []);

  const handleBank = async () => {
    if (cbBefore <= 0) {
      setError('Cannot bank surplus when CB is negative or zero.');
      return;
    }

    try {
      setError(null);
      await apiPost('/banking/bank', { shipId, year, amount: cbBefore });
      setBankedAmount((prev) => prev + cbBefore);
      setCbAfter(0);
      setCbBefore(0);
    } catch (err: any) {
      setError(err.message || 'Failed to bank surplus.');
    }
  };

  const handleApply = async () => {
    if (cbBefore >= 0 || bankedAmount <= 0) {
      setError('Cannot apply banked surplus: no deficit or no banked amount.');
      return;
    }

    const amountToApply = Math.min(bankedAmount, Math.abs(cbBefore));

    try {
      setError(null);
      await apiPost('/banking/apply', { shipId, year, amount: amountToApply });
      setBankedAmount((prev) => prev - amountToApply);
      const newCb = cbBefore + amountToApply;
      setCbAfter(newCb);
      setCbBefore(newCb);
    } catch (err: any) {
      setError(err.message || 'Failed to apply banked surplus.');
    }
  };

  const canBank = cbBefore > 0;
  const canApply = cbBefore < 0 && bankedAmount > 0;

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-gray-900">Compliance Banking</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow border border-gray-200">
          <p className="text-gray-500 font-medium animate-pulse">Loading compliance balance...</p>
        </div>
      ) : (
        <>
          <BankingInfo
            cbBefore={cbBefore}
            bankedAmount={bankedAmount}
            cbAfter={cbAfter}
          />

          <div className="flex gap-4 items-center">
            <BankButton disabled={!canBank} onBank={handleBank} />
            <ApplyButton disabled={!canApply} onApply={handleApply} />
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs text-gray-500">
            <p><strong>Ship ID:</strong> {shipId} &nbsp;|&nbsp; <strong>Year:</strong> {year}</p>
            <p className="mt-1">
              {canBank && 'Surplus detected. You may bank the current compliance balance.'}
              {canApply && 'Deficit detected. You may apply banked surplus to offset.'}
              {!canBank && !canApply && cbBefore === 0 && bankedAmount === 0 && 'No surplus or deficit. Balance is neutral.'}
              {!canBank && !canApply && cbBefore === 0 && bankedAmount > 0 && 'Balance is zero with banked reserves available.'}
            </p>
          </div>
        </>
      )}
    </div>
  );
};
