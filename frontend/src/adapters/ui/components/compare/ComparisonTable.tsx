import React, { useState, useMemo } from 'react';
import { Route } from '../../../../core/domain/Route';

export interface ComparisonData extends Route {
  baselineIntensity: number;
  comparisonIntensity: number;
  percentDiff: number;
  compliant: boolean;
  vesselType: string;
  fuelType: string;
  year: number;
}

interface ComparisonTableProps {
  data: ComparisonData[];
  baselineRouteId?: string | null;
}

type SortField = 'routeId' | 'baselineIntensity' | 'comparisonIntensity' | 'percentDiff';
type SortOrder = 'asc' | 'desc';

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ data, baselineRouteId }) => {
  const [sortField, setSortField] = useState<SortField>('routeId');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedData = useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      // Handle specific sorts
      if (sortField === 'routeId') {
        valA = a.routeId.toUpperCase();
        valB = b.routeId.toUpperCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [data, sortField, sortOrder]);

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 ml-1 text-gray-400 group-hover:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l-4-4m4 4l4-4" />
        </svg>
      );
    }
    return sortOrder === 'asc' ? (
      <svg className="w-4 h-4 ml-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 ml-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  const getRowClassName = (row: ComparisonData, index: number) => {
    const isBaseline = baselineRouteId && row.routeId === baselineRouteId;
    if (isBaseline) {
      return 'bg-blue-50 border-l-4 border-blue-500 hover:bg-blue-100 transition-colors';
    }
    const stripe = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';
    return `${stripe} hover:bg-blue-50 transition-colors`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full">
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Intensity Comparison Details</h3>
        <span className="text-xs text-gray-500">{data.length} route{data.length !== 1 ? 's' : ''}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group select-none"
                onClick={() => handleSort('routeId')}
              >
                <div className="flex items-center">
                  Route ID <SortIcon field="routeId" />
                </div>
              </th>
              
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vessel / Fuel / Year
              </th>

              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group select-none"
                onClick={() => handleSort('baselineIntensity')}
              >
                <div className="flex items-center justify-end">
                  Baseline (gCO₂e/MJ) <SortIcon field="baselineIntensity" />
                </div>
              </th>

              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group select-none"
                onClick={() => handleSort('comparisonIntensity')}
              >
                <div className="flex items-center justify-end">
                  Comparison (gCO₂e/MJ) <SortIcon field="comparisonIntensity" />
                </div>
              </th>

              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer group select-none relative"
                onClick={() => handleSort('percentDiff')}
              >
                <div className="flex items-center justify-end">
                  % Diff
                  <div className="ml-1 relative group/tooltip">
                    <svg className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {/* Tooltip */}
                    <div className="absolute hidden group-hover/tooltip:block bottom-full mb-2 right-0 bg-gray-900 text-white text-xs rounded py-1 px-3 whitespace-nowrap z-10 before:content-[''] before:absolute before:top-full before:right-2 before:-mt-1 before:border-4 before:border-transparent before:border-t-gray-900">
                      % Difference formula:<br/>((comparison / baseline) − 1) × 100
                    </div>
                  </div>
                  <SortIcon field="percentDiff" />
                </div>
              </th>

              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-gray-500 font-medium">No routes match the selected filters.</p>
                    <p className="text-xs text-gray-400">Try adjusting your filter criteria.</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedData.map((row, index) => (
                <tr key={row.routeId} className={getRowClassName(row, index)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-600 font-mono uppercase">{row.routeId.toUpperCase()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{row.vesselType} ({row.year})</div>
                    <div className="text-xs text-gray-500">{row.fuelType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 font-mono">
                    {row.baselineIntensity.toFixed(4)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 font-mono">
                    {row.comparisonIntensity.toFixed(4)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium font-mono ${row.percentDiff > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {row.percentDiff > 0 ? '+' : ''}{row.percentDiff.toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {row.compliant ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Compliant
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        Non-compliant
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

