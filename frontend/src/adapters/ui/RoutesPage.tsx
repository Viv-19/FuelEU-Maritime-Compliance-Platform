import React, { useEffect, useState, useMemo } from 'react';
import { Route } from '../../core/domain/Route';
import { apiGet, apiPost } from '../infrastructure/apiClient';
import { RouteFilters } from './RouteFilters';
import { RoutesTable } from './RoutesTable';
import { AddRouteModal } from './AddRouteModal';
import { RouteDetailsDrawer } from './RouteDetailsDrawer';

export const RoutesPage: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedQuery, setDebouncedQuery] = useState<string>('');
  const [selectedVessel, setSelectedVessel] = useState<string>('');
  const [selectedFuel, setSelectedFuel] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [resetSortTrigger, setResetSortTrigger] = useState<number>(0);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 3000); // 300ms debounce for real time filtering

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

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
      setError('Failed to fetch routes. Check backend connection.');
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

  const handleResetFilters = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setSelectedVessel('');
    setSelectedFuel('');
    setSelectedYear('');
    setResetSortTrigger((prev) => prev + 1);
    fetchRoutes();
  };

  // Derive unique filter options from the full dataset
  const vesselTypes = useMemo(() => Array.from(new Set(routes.map(r => r.vesselType))).sort(), [routes]);
  const fuelTypes = useMemo(() => Array.from(new Set(routes.map(r => r.fuelType))).sort(), [routes]);
  const years = useMemo(() => Array.from(new Set(routes.map(r => r.year))).sort((a, b) => b - a), [routes]);

  // Apply filters linearly
  const filteredRoutes = useMemo(() => {
    return routes.filter(route => {
      if (debouncedQuery && !route.routeId.toLowerCase().includes(debouncedQuery.toLowerCase())) return false;
      if (selectedVessel && route.vesselType !== selectedVessel) return false;
      if (selectedFuel && route.fuelType !== selectedFuel) return false;
      if (selectedYear && route.year.toString() !== selectedYear) return false;
      return true;
    });
  }, [routes, debouncedQuery, selectedVessel, selectedFuel, selectedYear]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Routes Dashboard</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchRoutes}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Add Route
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded shadow-md z-50">
          {toastMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex flex-col items-start gap-2">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={fetchRoutes}
                className="text-xs font-medium text-red-700 hover:text-red-800 underline border-none bg-transparent cursor-pointer p-0"
                disabled={loading}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      {routes.length > 0 && (
        <RouteFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          vesselTypes={vesselTypes}
          fuelTypes={fuelTypes}
          years={years}
          selectedVessel={selectedVessel}
          selectedFuel={selectedFuel}
          selectedYear={selectedYear}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
        />
      )}

      {loading && routes.length === 0 ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow border border-gray-200">
          <p className="text-gray-500 font-medium animate-pulse">Loading routes...</p>
        </div>
      ) : (
        <RoutesTable
          routes={filteredRoutes}
          onSetBaseline={handleSetBaseline}
          resetSortTrigger={resetSortTrigger}
          onRowClick={setSelectedRoute}
        />
      )}

      <AddRouteModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchRoutes}
        showToast={showToast}
      />

      <RouteDetailsDrawer
        isOpen={!!selectedRoute}
        onClose={() => setSelectedRoute(null)}
        route={selectedRoute}
      />
    </div>
  );
};
