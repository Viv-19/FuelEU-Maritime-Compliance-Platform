import React, { useEffect, useState, useMemo } from 'react';
import { Route } from '../../core/domain/Route';
import { apiGet, apiPost } from '../infrastructure/apiClient';
import { RouteFilters } from './RouteFilters';
import { RoutesTable } from './RoutesTable';

export const RoutesPage: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [selectedVessel, setSelectedVessel] = useState<string>('');
  const [selectedFuel, setSelectedFuel] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiGet('/routes');
      if (res.success && Array.isArray(res.data)) {
        setRoutes(res.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load routes.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleSetBaseline = async (routeId: string) => {
    try {
      setError(null);
      const res = await apiPost(`/routes/${routeId}/baseline`, {});
      if (res.success && Array.isArray(res.data)) {
        setRoutes(res.data);
      } else {
        await fetchRoutes(); // Fallback: refresh the full list
      }
    } catch (err: any) {
      setError(err.message || 'Failed to set baseline.');
    }
  };

  const handleFilterChange = (filterType: 'vessel' | 'fuel' | 'year', value: string) => {
    if (filterType === 'vessel') setSelectedVessel(value);
    if (filterType === 'fuel') setSelectedFuel(value);
    if (filterType === 'year') setSelectedYear(value);
  };

  // Derive unique filter options from the full dataset
  const vesselTypes = useMemo(() => Array.from(new Set(routes.map(r => r.vesselType))).sort(), [routes]);
  const fuelTypes = useMemo(() => Array.from(new Set(routes.map(r => r.fuelType))).sort(), [routes]);
  const years = useMemo(() => Array.from(new Set(routes.map(r => r.year))).sort((a, b) => b - a), [routes]);

  // Apply filters linearly
  const filteredRoutes = useMemo(() => {
    return routes.filter(route => {
      if (selectedVessel && route.vesselType !== selectedVessel) return false;
      if (selectedFuel && route.fuelType !== selectedFuel) return false;
      if (selectedYear && route.year.toString() !== selectedYear) return false;
      return true;
    });
  }, [routes, selectedVessel, selectedFuel, selectedYear]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-gray-900">Routes Dashboard</h2>
        <button
          onClick={fetchRoutes}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <RouteFilters
        vesselTypes={vesselTypes}
        fuelTypes={fuelTypes}
        years={years}
        selectedVessel={selectedVessel}
        selectedFuel={selectedFuel}
        selectedYear={selectedYear}
        onFilterChange={handleFilterChange}
      />

      {loading && routes.length === 0 ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow border border-gray-200">
          <p className="text-gray-500 font-medium animate-pulse">Loading routes...</p>
        </div>
      ) : (
        <RoutesTable
          routes={filteredRoutes}
          onSetBaseline={handleSetBaseline}
        />
      )}
    </div>
  );
};
