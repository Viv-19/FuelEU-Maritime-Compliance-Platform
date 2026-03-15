import React, { useEffect, useState, useMemo } from 'react';
import { apiGet, apiPost } from '../infrastructure/apiClient';
import { PoolSummary } from './PoolSummary';
import { PoolMemberList } from './PoolMemberList';
import { CreatePoolButton } from './CreatePoolButton';
import { PoolingFilters, PoolingFilterState } from './PoolingFilters';

interface ShipCbData {
  shipId: string;
  cbBefore: number;
}

interface PoolResultData {
  totalBefore: number;
  totalAfter: number;
  members: { shipId: string; cbBefore: number; cbAfter: number; }[];
}

export const PoolingPage: React.FC = () => {
  const [ships, setShips] = useState<ShipCbData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedShips, setSelectedShips] = useState<Set<string>>(new Set());
  const [poolResult, setPoolResult] = useState<PoolResultData | null>(null);

  const [filters, setFilters] = useState<PoolingFilterState>({
    shipId: '',
    status: 'All',
    year: 2024
  });

  // 1. Fetch data on mount or year change
  useEffect(() => {
    const fetchShips = async () => {
      try {
        setLoading(true);
        setError(null);
        setPoolResult(null); // Clear previous results on refetch
        const res = await apiGet(`/compliance/adjusted-cb?year=${filters.year}`);
        if (res.success && Array.isArray(res.data)) {
          setShips(res.data);
        } else {
          throw new Error('Invalid compliance data format.');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load ship compliance data.');
      } finally {
        setLoading(false);
      }
    };
    fetchShips();
  }, [filters.year]);

  // Derived ship list for filters
  const allShipIds = useMemo(() => {
    return Array.from(new Set(ships.map(s => s.shipId))).sort();
  }, [ships]);

  // Apply filters
  const filteredShips = useMemo(() => {
    return ships.filter(ship => {
      // Filter by Ship ID
      if (filters.shipId && ship.shipId !== filters.shipId) return false;
      
      // Filter by Status
      if (filters.status !== 'All') {
        if (filters.status === 'Surplus' && ship.cbBefore <= 0) return false;
        if (filters.status === 'Deficit' && ship.cbBefore >= 0) return false;
        if (filters.status === 'Neutral' && ship.cbBefore !== 0) return false;
      }
      return true;
    }).sort((a, b) => a.shipId.localeCompare(b.shipId));
  }, [ships, filters]);

  // Pre-calculated stats for currently selected pool
  const selectedShipData = useMemo(() => {
    return ships.filter(s => selectedShips.has(s.shipId));
  }, [ships, selectedShips]);

  const currentTotalBefore = useMemo(() => {
    return selectedShipData.reduce((sum, s) => sum + s.cbBefore, 0);
  }, [selectedShipData]);

  const isValidPool = selectedShipData.length >= 2 && currentTotalBefore >= 0;

  // Handlers
  const toggleShipSelection = (shipId: string) => {
    const newSelection = new Set(selectedShips);
    if (newSelection.has(shipId)) {
      newSelection.delete(shipId);
    } else {
      newSelection.add(shipId);
    }
    setSelectedShips(newSelection);
    setPoolResult(null); // Clear result when selection changes
  };

  const toggleAllShips = () => {
    if (selectedShips.size === filteredShips.length && filteredShips.length > 0) {
      // Deselect all filtered
      const newSelection = new Set(selectedShips);
      filteredShips.forEach(s => newSelection.delete(s.shipId));
      setSelectedShips(newSelection);
    } else {
      // Select all filtered
      const newSelection = new Set(selectedShips);
      filteredShips.forEach(s => newSelection.add(s.shipId));
      setSelectedShips(newSelection);
    }
    setPoolResult(null);
  };

  const handleCreatePool = async () => {
    try {
      setError(null);
      const payload = {
        year: filters.year,
        members: selectedShipData.map(s => ({ shipId: s.shipId, cb_before: s.cbBefore }))
      };
      
      const res = await apiPost('/pools', payload);
      
      if (res.success && res.data) {
        setPoolResult(res.data);
      } else {
        throw new Error('Invalid pool response format');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create pool.');
    }
  };

  const allFilteredSelected = filteredShips.length > 0 && filteredShips.every(s => selectedShips.has(s.shipId));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Compliance Pooling</h2>
          <p className="text-sm text-gray-500 mt-1">Pool surplus credits to deficit ships according to FuelEU Maritime Article 21.</p>
        </div>
        <CreatePoolButton
          disabled={!isValidPool}
          onCreatePool={handleCreatePool}
        />
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 border border-red-200 rounded-xl text-sm font-medium flex items-center gap-2">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* SECTION 1 - POOL SUMMARY */}
      {selectedShips.size > 0 && (
        <PoolSummary
          totalCBBefore={poolResult ? poolResult.totalBefore : currentTotalBefore}
          totalCBAfter={poolResult ? poolResult.totalAfter : null}
          isValid={poolResult ? poolResult.totalAfter >= 0 : currentTotalBefore >= 0}
        />
      )}

      {/* FILTERS */}
      <PoolingFilters filters={filters} onFilterChange={setFilters} shipIds={allShipIds} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SECTION 2 - SHIP SELECTION TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Ship Selection
            </h3>
            <span className="text-xs text-gray-500 font-medium bg-white px-2.5 py-1 rounded-full border border-gray-200 shadow-sm">
              {selectedShips.size} Selected
            </span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={allFilteredSelected}
                      onChange={toggleAllShips}
                    />
                  </th>
                  <th scope="col" className="px-6 py-3 text-left font-semibold tracking-wider">Ship ID</th>
                  <th scope="col" className="px-6 py-3 text-right font-semibold tracking-wider">CB Before</th>
                  <th scope="col" className="px-6 py-3 text-right font-semibold tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading && filteredShips.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      Loading ships...
                    </td>
                  </tr>
                ) : filteredShips.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No ships match the current filters.
                    </td>
                  </tr>
                ) : (
                  filteredShips.map((ship) => {
                    const isSelected = selectedShips.has(ship.shipId);
                    return (
                      <tr 
                        key={ship.shipId} 
                        className={`transition-colors cursor-pointer ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                        onClick={() => toggleShipSelection(ship.shipId)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap" onClick={e => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleShipSelection(ship.shipId)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{ship.shipId}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-right font-mono ${
                          ship.cbBefore > 0 ? 'text-green-600' : ship.cbBefore < 0 ? 'text-red-600' : 'text-gray-500'
                        }`}>
                          {ship.cbBefore.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            ship.cbBefore > 0 ? 'bg-green-100 text-green-800' : ship.cbBefore < 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {ship.cbBefore > 0 ? 'Surplus' : ship.cbBefore < 0 ? 'Deficit' : 'Neutral'}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 3 - POOL RESULT TABLE */}
        <div className="flex flex-col">
          {poolResult ? (
            <PoolMemberList members={poolResult.members} />
          ) : (
            <div className="bg-gray-50 rounded-xl shadow-sm border border-dashed border-gray-300 flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="bg-white p-3 rounded-full shadow-sm border border-gray-200 mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Pool</h3>
              <p className="text-sm text-gray-500 max-w-sm mb-6">
                {selectedShipData.length < 2 
                  ? "Select at least 2 ships from the list on the left to form a compliance pool." 
                  : !isValidPool 
                    ? "The total compliance balance of selected ships must be positive or zero to create a valid pool."
                    : "You have selected a valid combination. Click Create Pool to see the allocation results."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
