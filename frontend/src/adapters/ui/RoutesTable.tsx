import React, { useState, useMemo, useEffect } from 'react';
import { Route } from '../../core/domain/Route';
import { BaselineButton } from './BaselineButton';

interface RoutesTableProps {
  routes: Route[];
  onSetBaseline: (routeId: string) => void;
  resetSortTrigger?: number;
  onRowClick?: (route: Route) => void;
  loading?: boolean;
}

export const RoutesTable: React.FC<RoutesTableProps> = ({ 
  routes, 
  onSetBaseline, 
  resetSortTrigger, 
  onRowClick,
  loading = false
}) => {
  const TARGET_INTENSITY = 89.3368;
  const [sortColumn, setSortColumn] = useState<keyof Route | 'complianceBalance' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setSortColumn(null);
    setSortDirection('asc');
    setCurrentPage(1);
  }, [resetSortTrigger]);

  useEffect(() => {
    setCurrentPage(1);
  }, [routes, sortColumn, sortDirection]);

  const handleSort = (column: keyof Route | 'complianceBalance') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedRoutes = useMemo(() => {
    if (!sortColumn) return routes;

    return [...routes].sort((a, b) => {
      let aValue: any = a[sortColumn as keyof Route];
      let bValue: any = b[sortColumn as keyof Route];

      if (sortColumn === 'complianceBalance') {
        aValue = (TARGET_INTENSITY - a.ghgIntensity) * (a.fuelConsumption * 41000);
        bValue = (TARGET_INTENSITY - b.ghgIntensity) * (b.fuelConsumption * 41000);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
  }, [routes, sortColumn, sortDirection]);

  const renderSortIndicator = (column: keyof Route | 'complianceBalance') => {
    if (sortColumn !== column) return <span className="ml-1 text-gray-400 text-xs opacity-0 group-hover:opacity-100 transition-opacity">↕</span>;
    return <span className="ml-1 text-xs text-blue-600">{sortDirection === 'asc' ? '▲' : '▼'}</span>;
  };

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(sortedRoutes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRoutes = sortedRoutes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const thRightClass = "px-4 py-3.5 text-right text-xs uppercase tracking-wider font-semibold text-gray-600 cursor-pointer hover:bg-gray-100 transition-all duration-150 group select-none";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3.5 text-left text-xs uppercase tracking-wider font-semibold text-gray-600">Route ID</th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs uppercase tracking-wider font-semibold text-gray-600">Ship ID</th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs uppercase tracking-wider font-semibold text-gray-600">Vessel Type</th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs uppercase tracking-wider font-semibold text-gray-600">Fuel Type</th>
              <th scope="col" className="px-4 py-3.5 text-left text-xs uppercase tracking-wider font-semibold text-gray-600">Year</th>
              <th scope="col" className={thRightClass} onClick={() => handleSort('ghgIntensity')}>
                GHG Intensity {renderSortIndicator('ghgIntensity')}
              </th>
              <th scope="col" className={thRightClass} onClick={() => handleSort('fuelConsumption')}>
                Fuel Cons. (t) {renderSortIndicator('fuelConsumption')}
              </th>
              <th scope="col" className={thRightClass} onClick={() => handleSort('distance')}>
                Distance (nm) {renderSortIndicator('distance')}
              </th>
              <th scope="col" className={thRightClass} onClick={() => handleSort('totalEmissions')}>
                Emissions (tCO₂e) {renderSortIndicator('totalEmissions')}
              </th>
              <th scope="col" className={thRightClass} onClick={() => handleSort('complianceBalance')}>
                Compliance Balance {renderSortIndicator('complianceBalance')}
              </th>
              <th scope="col" className="px-4 py-3.5 text-center text-xs uppercase tracking-wider font-semibold text-gray-600">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={`skeleton-${idx}`}>
                  <td className="px-4 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div></td>
                  <td className="px-4 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div></td>
                  <td className="px-4 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div></td>
                  <td className="px-4 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div></td>
                  <td className="px-4 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded animate-pulse w-12"></div></td>
                  <td className="px-4 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded animate-pulse w-12 ml-auto"></div></td>
                  <td className="px-4 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded animate-pulse w-24 ml-auto"></div></td>
                  <td className="px-4 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded animate-pulse w-20 ml-auto"></div></td>
                  <td className="px-4 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded animate-pulse w-24 ml-auto"></div></td>
                  <td className="px-4 py-4 whitespace-nowrap"><div className="h-4 bg-gray-200 rounded animate-pulse w-28 ml-auto"></div></td>
                  <td className="px-4 py-4 whitespace-nowrap text-center"><div className="h-7 bg-gray-200 rounded animate-pulse w-24 mx-auto"></div></td>
                </tr>
              ))
            ) : paginatedRoutes.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <svg className="h-8 w-8 text-gray-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <span className="text-sm">No routes found matching the current filters.</span>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedRoutes.map((route) => {
                const energyInScope = route.fuelConsumption * 41000;
                const complianceBalance = (TARGET_INTENSITY - route.ghgIntensity) * energyInScope;
                
                const bgClass = route.isBaseline 
                  ? 'bg-blue-50 border-l-4 border-blue-400' 
                  : (route.ghgIntensity <= TARGET_INTENSITY ? 'bg-green-50/50' : 'bg-red-50/50');

                return (
                  <tr 
                    key={route.routeId} 
                    className={`hover:bg-blue-50 ${bgClass} ${onRowClick ? 'cursor-pointer' : ''} transition-all duration-150`}
                    onClick={() => onRowClick && onRowClick(route)}
                  >
                  <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">{route.routeId}</td>
                  <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">{route.shipId}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-600">{route.vesselType}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-600">{route.fuelType}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-gray-600">{route.year}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-gray-700 font-mono text-sm">{route.ghgIntensity.toFixed(2)}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-gray-700 font-mono text-sm">{route.fuelConsumption.toLocaleString()}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-gray-700 font-mono text-sm">{route.distance.toLocaleString()}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-gray-700 font-mono text-sm">{route.totalEmissions.toLocaleString()}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-right">
                    {complianceBalance > 0 ? (
                      <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 rounded-md px-2.5 py-1 text-xs font-medium">
                        +{complianceBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        <span className="font-semibold">SURPLUS</span>
                      </span>
                    ) : complianceBalance < 0 ? (
                      <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 rounded-md px-2.5 py-1 text-xs font-medium">
                        {complianceBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        <span className="font-semibold">DEFICIT</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center bg-gray-100 text-gray-600 rounded-md px-2.5 py-1 text-xs font-medium">0</span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-center">
                    <BaselineButton
                      routeId={route.routeId}
                      isBaseline={route.isBaseline}
                      onSetBaseline={onSetBaseline}
                    />
                  </td>
                </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {sortedRoutes.length > 0 && (
        <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(startIndex + ITEMS_PER_PAGE, sortedRoutes.length)}</span> of <span className="font-medium">{sortedRoutes.length}</span> routes
          </p>
          <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-3 py-1.5 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-all duration-150"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`relative inline-flex items-center px-3.5 py-1.5 border text-sm font-medium transition-all duration-150 ${
                  currentPage === page
                    ? 'z-10 bg-blue-600 border-blue-600 text-white'
                    : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-3 py-1.5 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-40 transition-all duration-150"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};
