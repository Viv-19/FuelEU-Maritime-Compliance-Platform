import React, { useEffect, useState, useCallback } from 'react';
import { apiGet } from '../infrastructure/apiClient';
import { Route } from '../../core/domain/Route';
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
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const { baselineRouteId, setBaselineRouteId } = useBaseline();
  
  const isMounted = React.useRef(true);

  React.useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchComparisonData = useCallback(async () => {
    try {
      if (!isMounted.current) return;
      setLoading(true);
      setError(null);
      const res = await apiGet('/routes/comparison');
      if (res.success && Array.isArray(res.data)) {
        setRoutes(res.data);
        const serverBaseline = res.data.find((r: any) => r.isBaseline);
        if (serverBaseline) {
          setBaselineRouteId(serverBaseline.routeId);
        } else if (res.data.length > 0 && !baselineRouteId) {
          setBaselineRouteId(res.data[0].routeId);
        }
      } else {
        throw new Error('Unable to load comparison data.');
      }
    } catch (err: any) {
      if (!isMounted.current) return;
      setError(err.message || 'Unable to load comparison data.');
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [baselineRouteId, setBaselineRouteId]);

  // Fetch on page load
  useEffect(() => {
    fetchComparisonData();
  }, []);

  // Refetch when baseline changes
  useEffect(() => {
    if (baselineRouteId && routes.length > 0) {
      // Re-trigger data processing when baseline changes (no need to refetch API unless needed)
      // The comparison recalculation happens in CompareDashboard via useMemo
    }
  }, [baselineRouteId]);

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
            onClick={fetchComparisonData}
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
        <CompareDashboard routes={routes} />
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

