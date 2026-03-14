import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Route } from '../../core/domain/Route';
import { apiGet, apiPost } from '../infrastructure/apiClient';
import { RouteFilters } from './RouteFilters';
import { RoutesTable } from './RoutesTable';
import { AddRouteModal } from './AddRouteModal';
import { RouteDetailsDrawer } from './RouteDetailsDrawer';

const TARGET_INTENSITY = 89.3368;

interface KpiCardProps {
  icon: string;
  title: string;
  value: string | number;
  accent?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ icon, title, value, accent = 'text-gray-900' }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-start gap-4 transition-all duration-150 hover:shadow-md">
    <div className="text-2xl">{icon}</div>
    <div>
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      <p className={`text-2xl font-semibold ${accent} mt-0.5`}>{value}</p>
    </div>
  </div>
);

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
    }, 300); // 300ms debounce for real time filtering

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const isMounted = React.useRef(true);

  React.useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchRoutes = async () => {
    try {
      if (!isMounted.current) return;
      setLoading(true);
      setError(null);
      const res = await apiGet('/routes');
      if (res.success && Array.isArray(res.data)) {
        setRoutes(res.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      if (!isMounted.current) return;
      setError('Failed to load routes');
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
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
        await fetchRoutes();
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

  // KPI calculations
  const surplusCount = useMemo(() => routes.filter(r => r.ghgIntensity <= TARGET_INTENSITY).length, [routes]);
  const deficitCount = useMemo(() => routes.filter(r => r.ghgIntensity > TARGET_INTENSITY).length, [routes]);
  const avgGhg = useMemo(() => {
    if (routes.length === 0) return '—';
    return (routes.reduce((sum, r) => sum + r.ghgIntensity, 0) / routes.length).toFixed(2);
  }, [routes]);

  const handleExportCSV = useCallback(() => {
    const headers = ['routeId', 'vesselType', 'fuelType', 'year', 'ghgIntensity', 'fuelConsumption', 'distance', 'totalEmissions'];
    const csvRows = [
      headers.join(','),
      ...filteredRoutes.map(r => [
        r.routeId,
        r.vesselType,
        r.fuelType,
        r.year,
        r.ghgIntensity,
        r.fuelConsumption,
        r.distance,
        r.totalEmissions,
      ].join(','))
    ];
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'routes_export.csv';
    link.click();
    URL.revokeObjectURL(url);
  }, [filteredRoutes]);

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header + Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Routes Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Monitor and manage your maritime route compliance data.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchRoutes}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-all duration-150"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
          <button
            onClick={handleExportCSV}
            disabled={filteredRoutes.length === 0}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-all duration-150"
          >
            <svg className="h-4 w-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export CSV
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all duration-150"
          >
            <svg className="h-4 w-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add Route
          </button>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg z-50 text-sm font-medium transition-all duration-150">
          {toastMessage}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <svg className="h-5 w-5 text-red-500 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-700 font-medium">{error}</p>
            <button
              onClick={fetchRoutes}
              className="ml-auto text-sm font-medium text-red-600 hover:text-red-800 underline transition-all duration-150"
              disabled={loading}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      {!loading && routes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard icon="🚢" title="Total Routes" value={routes.length} />
          <KpiCard icon="📈" title="Surplus Ships" value={surplusCount} accent="text-green-700" />
          <KpiCard icon="⚠️" title="Deficit Ships" value={deficitCount} accent="text-red-700" />
          <KpiCard icon="🌍" title="Avg GHG Intensity" value={avgGhg} accent="text-blue-700" />
        </div>
      )}

      {/* Filters */}
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

      {/* Table */}
      <RoutesTable
        routes={filteredRoutes}
        onSetBaseline={handleSetBaseline}
        resetSortTrigger={resetSortTrigger}
        onRowClick={setSelectedRoute}
        loading={loading}
      />

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
