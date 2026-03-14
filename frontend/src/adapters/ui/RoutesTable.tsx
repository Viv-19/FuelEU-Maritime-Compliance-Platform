import React, { useState, useMemo, useEffect } from 'react';
import { Route } from '../../core/domain/Route';
import { BaselineButton } from './BaselineButton';

interface RoutesTableProps {
  routes: Route[];
  onSetBaseline: (routeId: string) => void;
  resetSortTrigger?: number;
  onRowClick?: (route: Route) => void;
}

export const RoutesTable: React.FC<RoutesTableProps> = ({ routes, onSetBaseline, resetSortTrigger, onRowClick }) => {
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
      return 0; // Fallback, though we only sort numbers here
    });
  }, [routes, sortColumn, sortDirection]);

  const renderSortIndicator = (column: keyof Route | 'complianceBalance') => {
    if (sortColumn !== column) return null;
    return <span className="ml-1 text-xs">{sortDirection === 'asc' ? '▲' : '▼'}</span>;
  };

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(sortedRoutes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRoutes = sortedRoutes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th scope="col" className="px-6 py-3 text-left font-semibold tracking-wider">Route ID</th>
              <th scope="col" className="px-6 py-3 text-left font-semibold tracking-wider">Vessel Type</th>
              <th scope="col" className="px-6 py-3 text-left font-semibold tracking-wider">Fuel Type</th>
              <th scope="col" className="px-6 py-3 text-left font-semibold tracking-wider">Year</th>
              <th scope="col" className="px-6 py-3 text-right font-semibold tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('ghgIntensity')}>
                GHG Intensity {renderSortIndicator('ghgIntensity')}
              </th>
              <th scope="col" className="px-6 py-3 text-right font-semibold tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('fuelConsumption')}>
                Fuel Cons. (t) {renderSortIndicator('fuelConsumption')}
              </th>
              <th scope="col" className="px-6 py-3 text-right font-semibold tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('distance')}>
                Distance (nm) {renderSortIndicator('distance')}
              </th>
              <th scope="col" className="px-6 py-3 text-right font-semibold tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('totalEmissions')}>
                Emissions (tCO2e) {renderSortIndicator('totalEmissions')}
              </th>
              <th scope="col" className="px-6 py-3 text-right font-semibold tracking-wider cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('complianceBalance')}>
                Compliance Balance (CB) {renderSortIndicator('complianceBalance')}
              </th>
              <th scope="col" className="px-6 py-3 text-center font-semibold tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedRoutes.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
                  No routes found matching the current filters.
                </td>
              </tr>
            ) : (
              paginatedRoutes.map((route) => {
                const energyInScope = route.fuelConsumption * 41000;
                const complianceBalance = (TARGET_INTENSITY - route.ghgIntensity) * energyInScope;
                
                const bgClass = route.isBaseline 
                  ? 'bg-indigo-50/30' 
                  : (route.ghgIntensity <= TARGET_INTENSITY ? 'bg-green-50' : 'bg-red-50');

                return (
                  <tr 
                    key={route.routeId} 
                    className={`hover:bg-gray-100 ${bgClass} ${onRowClick ? 'cursor-pointer' : ''}`}
                    onClick={() => onRowClick && onRowClick(route)}
                  >
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{route.routeId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{route.vesselType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{route.fuelType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{route.year}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-700 font-mono">{route.ghgIntensity.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-700 font-mono">{route.fuelConsumption.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-700 font-mono">{route.distance.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-700 font-mono">{route.totalEmissions.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-mono">
                    {complianceBalance > 0 ? (
                      <span className="text-sm font-medium text-green-700">
                        {complianceBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-xs ml-1">(Surplus)</span>
                      </span>
                    ) : complianceBalance < 0 ? (
                      <span className="text-sm font-medium text-red-700">
                        {complianceBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })} <span className="text-xs ml-1">(Deficit)</span>
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-gray-700">0</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
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
      
      {sortedRoutes.length > 0 && (
        <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(startIndex + ITEMS_PER_PAGE, sortedRoutes.length)}</span> of <span className="font-medium">{sortedRoutes.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Previous</span>
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === page
                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Next</span>
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
