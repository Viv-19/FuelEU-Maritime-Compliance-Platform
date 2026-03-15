import React, { useEffect, useState, useMemo } from 'react';
import { apiGet, apiPost } from '../infrastructure/apiClient';
import { useRoutes } from './context/RoutesContext';
import { PoolMember } from '../../core/domain/PoolMember';
import { PoolMemberList } from './PoolMemberList';
import { PoolSummary } from './PoolSummary';
import { CreatePoolButton } from './CreatePoolButton';

const DEFAULT_YEAR = 2024;

export const PoolingPage: React.FC = () => {
  const { selectedShipId } = useRoutes();
  const [members, setMembers] = useState<PoolMember[]>([]);
  const [year] = useState<number>(DEFAULT_YEAR);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiGet(`/compliance/adjusted-cb?year=${year}`);
      if (res.success && Array.isArray(res.data)) {
        setMembers(res.data.map((d: any) => ({ shipId: d.shipId, cb_before: d.cb_before })));
      } else {
        throw new Error('Invalid compliance data');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load ship compliance data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Apply global ship filter
  const filteredMembers = useMemo(() => {
    if (!selectedShipId) return members;
    return members.filter((m) => m.shipId === selectedShipId);
  }, [members, selectedShipId]);

  const totalCBBefore = useMemo(() => filteredMembers.reduce((sum, m) => sum + m.cb_before, 0), [filteredMembers]);
  const totalCBAfter = useMemo(() => {
    const hasAfter = filteredMembers.some(m => m.cb_after != null);
    if (!hasAfter) return null;
    return filteredMembers.reduce((sum, m) => sum + (m.cb_after ?? m.cb_before), 0);
  }, [filteredMembers]);

  const poolValid = useMemo(() => {
    if (filteredMembers.length === 0) return false;
    return totalCBBefore >= 0;
  }, [filteredMembers, totalCBBefore]);

  const handleCreatePool = async () => {
    try {
      setError(null);
      const payload = {
        year,
        members: filteredMembers.map(m => ({ shipId: m.shipId, cb_before: m.cb_before }))
      };
      const res = await apiPost('/pools', payload);
      if (res.success && Array.isArray(res.data)) {
        setMembers(res.data);
      } else {
        throw new Error('Failed to process pool response');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create pool.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-bold text-gray-900">Compliance Pooling</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow border border-gray-200">
          <p className="text-gray-500 font-medium animate-pulse">Loading ship compliance data...</p>
        </div>
      ) : (
        <>
          <PoolSummary
            totalCBBefore={totalCBBefore}
            totalCBAfter={totalCBAfter}
            poolValid={poolValid}
          />

          <PoolMemberList members={filteredMembers} />

          <div className="flex gap-4 items-center">
            <CreatePoolButton
              disabled={!poolValid}
              onCreatePool={handleCreatePool}
            />
            <span className="text-xs text-gray-400">Year: {year}</span>
          </div>
        </>
      )}
    </div>
  );
};
