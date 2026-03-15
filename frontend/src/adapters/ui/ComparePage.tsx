import React from 'react';
import { useRoutes } from './context/RoutesContext';
import { CompareDashboard } from './components/compare/CompareDashboard';
import { useBaseline, BaselineProvider } from './context/BaselineContext';

// Skeleton loader component
const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
    <div className="h-8 bg-gray-200 rounded w-2/3 mb-2"></div>
    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
  </div>
);

const SkeletonTable: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 animate-pulse">
    <div className="h-5 bg-gray-200 rounded w-1/4 mb-4"></div>
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex gap-4 mb-3">
        <div className="h-4 bg-gray-100 rounded w-1/6"></div>
        <div className="h-4 bg-gray-100 rounded w-1/4"></div>
        <div className="h-4 bg-gray-100 rounded w-1/6"></div>
        <div className="h-4 bg-gray-100 rounded w-1/6"></div>
        <div className="h-4 bg-gray-100 rounded w-1/8"></div>
      </div>
    ))}
  </div>
);

// Exported for testing purposes to bypass Context issues if needed
export const ComparePageContent: React.FC = () => {
  const { routes, loading, error, fetchRoutes, selectedShipId } = useRoutes();
  const { baselineRouteId, setBaselineRouteId } = useBaseline();

  // Set baseline from data when routes load
  React.useEffect(() => {
    if (routes.length > 0 && !baselineRouteId) {
      const serverBaseline = routes.find((r) => r.isBaseline);
      if (serverBaseline) {
        setBaselineRouteId(serverBaseline.routeId);
      } else {
        setBaselineRouteId(routes[0].routeId);
      }
    }
  }, [routes, baselineRouteId, setBaselineRouteId]);

  // Apply global ship filter
  const filteredRoutes = React.useMemo(() => {
    if (!selectedShipId) return routes;
    return routes.filter((r) => r.shipId === selectedShipId);
  }, [routes, selectedShipId]);

  return (
    <div className="flex flex-col gap-6 w-full pb-10 max-w-7xl mx-auto px-6 py-6">
      {/* Header */}
      <div className="flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4 mb-4 border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Compare Routes Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Analyze scalable fleet route performance against target and baseline intensity.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchRoutes}
            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Unable to load comparison data.
        </div>
      )}

      {loading && routes.length === 0 ? (
        <div className="flex flex-col gap-6">
          <SkeletonCard />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <SkeletonTable />
        </div>
      ) : (
        <CompareDashboard routes={filteredRoutes} />
      )}
    </div>
  );
};

export const ComparePage: React.FC = () => {
  return (
    <BaselineProvider>
      <ComparePageContent />
    </BaselineProvider>
  );
};
