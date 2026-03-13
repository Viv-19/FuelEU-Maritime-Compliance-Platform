import React, { useEffect, useState, useMemo } from 'react';
import { apiGet } from '../infrastructure/apiClient';
import { RouteComparison } from '../../core/domain/Route';
import { CompareTable } from './CompareTable';
import { ComparisonChart } from './ComparisonChart';

const TARGET_INTENSITY = 89.3368;

export const ComparePage: React.FC = () => {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComparisonData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiGet('/routes/comparison');
      if (res.success && Array.isArray(res.data)) {
        setRoutes(res.data);
      } else {
        throw new Error('Failed to parse comparison data');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load comparison data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparisonData();
  }, []);

  const baselineRoute = useMemo(() => routes.find(r => r.isBaseline), [routes]);

  const comparisons: RouteComparison[] = useMemo(() => {
    if (!baselineRoute) return [];

    return routes.map(route => {
      const ghgIntensity = route.ghgIntensity;
      const percentDiff = ((ghgIntensity / baselineRoute.ghgIntensity) - 1) * 100;
      const compliant = ghgIntensity <= TARGET_INTENSITY;

      return {
        routeId: route.routeId,
        ghgIntensity,
        percentDiff,
        compliant,
        isBaseline: route.isBaseline
      };
    });
  }, [routes, baselineRoute]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Compare Routes</h2>
        <button
          onClick={fetchComparisonData}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {loading && routes.length === 0 ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow border border-gray-200">
          <p className="text-gray-500 font-medium animate-pulse">Loading comparison data...</p>
        </div>
      ) : (
        <>
          {!baselineRoute && !loading && (
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
              <p className="text-sm text-amber-700">
                No baseline route set. Please go to the <strong>Routes</strong> tab to select a baseline.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-gray-700">Comparison Data</h3>
              <CompareTable 
                comparisons={comparisons} 
                baselineIntensity={baselineRoute?.ghgIntensity || null} 
              />
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-gray-700">Intensity Metrics</h3>
              <ComparisonChart 
                data={comparisons} 
                targetIntensity={TARGET_INTENSITY} 
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
