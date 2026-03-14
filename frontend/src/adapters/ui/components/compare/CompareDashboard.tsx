import React, { useMemo, useState } from 'react';
import { Route } from '../../../../core/domain/Route';
import { useBaseline } from '../../context/BaselineContext';
import { BaselineSelector } from './BaselineSelector';
import { CompareFilters, CompareFilterState } from './CompareFilters';
import { ComparisonTable, ComparisonData } from './ComparisonTable';
import { TopDeviationChart, DeviationData } from './TopDeviationChart';
import { ComplianceDonutChart } from './ComplianceDonutChart';
import { FleetSummaryChart } from './FleetSummaryChart';

interface CompareDashboardProps {
  routes: Route[];
}

const TARGET_INTENSITY = 89.3368;

export const CompareDashboard: React.FC<CompareDashboardProps> = ({ routes }) => {
  const { baselineRouteId } = useBaseline();

  // Filters state
  const [filters, setFilters] = useState<CompareFilterState>({
    search: '',
    vesselType: '',
    fuelType: '',
    year: '',
    compliance: 'all',
    deviationRange: 'All',
  });

  // Extract unique values for filter dropdowns
  const vesselTypes = useMemo(() => Array.from(new Set(routes.map(r => r.vesselType))).filter(Boolean) as string[], [routes]);
  const fuelTypes = useMemo(() => Array.from(new Set(routes.map(r => r.fuelType))).filter(Boolean) as string[], [routes]);
  const years = useMemo(() => Array.from(new Set(routes.map(r => r.year))).filter(Boolean).sort((a, b) => b - a) as number[], [routes]);

  // Derived filtered & mapped comparisons
  const baselineRoute = useMemo(() => routes.find((r) => r.routeId === baselineRouteId), [routes, baselineRouteId]);

  const filteredComparisons: ComparisonData[] = useMemo(() => {
    if (!baselineRoute) return [];

    let result = routes.map((route) => {
      const comparisonIntensity = route.ghgIntensity;
      const percentDiff = ((comparisonIntensity / baselineRoute.ghgIntensity) - 1) * 100;
      const compliant = comparisonIntensity <= TARGET_INTENSITY;

      return {
        ...route,
        baselineIntensity: baselineRoute.ghgIntensity,
        comparisonIntensity,
        percentDiff,
        compliant,
      };
    });

    // Apply Filters
    if (filters.search) {
      result = result.filter(r => r.routeId.toLowerCase().includes(filters.search.toLowerCase()));
    }
    if (filters.vesselType) {
      result = result.filter(r => r.vesselType === filters.vesselType);
    }
    if (filters.fuelType) {
      result = result.filter(r => r.fuelType === filters.fuelType);
    }
    if (filters.year !== '') {
      result = result.filter(r => r.year === Number(filters.year));
    }
    if (filters.compliance === 'compliant') {
      result = result.filter(r => r.compliant);
    } else if (filters.compliance === 'non-compliant') {
      result = result.filter(r => !r.compliant);
    }
    if (filters.deviationRange !== 'All') {
      result = result.filter(r => {
        if (filters.deviationRange === '> +5%') return r.percentDiff > 5;
        if (filters.deviationRange === '0% to +5%') return r.percentDiff > 0 && r.percentDiff <= 5;
        if (filters.deviationRange === '0% to -5%') return r.percentDiff <= 0 && r.percentDiff >= -5;
        if (filters.deviationRange === '< -5%') return r.percentDiff < -5;
        return true;
      });
    }

    return result;
  }, [routes, baselineRoute, filters]);

  // Data for Charts
  const topDeviationData: DeviationData[] = useMemo(() => {
    return filteredComparisons.map(c => ({ routeId: c.routeId, percentDiff: c.percentDiff }));
  }, [filteredComparisons]);

  const { compliantCount, nonCompliantCount, fleetAverageIntensity } = useMemo(() => {
    let cCount = 0;
    let sumIntensity = 0;
    filteredComparisons.forEach(c => {
      if (c.compliant) cCount++;
      sumIntensity += c.comparisonIntensity;
    });

    return {
      compliantCount: cCount,
      nonCompliantCount: filteredComparisons.length - cCount,
      fleetAverageIntensity: filteredComparisons.length > 0 ? sumIntensity / filteredComparisons.length : 0,
    };
  }, [filteredComparisons]);

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
        <label className="block text-sm font-medium text-gray-700 mb-2">Global Baseline Route</label>
        <BaselineSelector routes={routes} />
        <p className="text-xs text-gray-500 mt-2">All comparison metrics are calculated against this selected route.</p>
      </div>

      <CompareFilters 
        filters={filters} 
        setFilters={setFilters} 
        vesselTypes={vesselTypes} 
        fuelTypes={fuelTypes} 
        years={years} 
      />

      {baselineRoute ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TopDeviationChart data={topDeviationData} />
            <ComplianceDonutChart compliantCount={compliantCount} nonCompliantCount={nonCompliantCount} />
            <FleetSummaryChart baselineIntensity={baselineRoute.ghgIntensity} fleetAverageIntensity={fleetAverageIntensity} />
          </div>

          <div className="mt-2">
            <ComparisonTable data={filteredComparisons} baselineRouteId={baselineRouteId} />
          </div>
        </>
      ) : (
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl flex items-center justify-center h-48">
          <p className="text-sm text-amber-800 font-medium">
            Please select a Baseline Route above to view comparisons.
          </p>
        </div>
      )}
    </div>
  );
};
