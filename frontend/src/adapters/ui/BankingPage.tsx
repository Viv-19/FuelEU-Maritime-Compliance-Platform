import React, { useMemo, useState } from 'react';
import { apiPost } from '../infrastructure/apiClient';
import { useRoutes } from './context/RoutesContext';
import { aggregateShips } from '../../shared/utils/shipAggregation';
import { BankButton } from './BankButton';
import { TransferCreditsModal, DropdownShip } from './TransferCreditsModal';

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

export const BankingPage: React.FC = () => {
  const { routes, loading, error: routesError, fetchRoutes, selectedShipId } = useRoutes();
  const [bankingError, setBankingError] = useState<string | null>(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter states
  const [filterShipId, setFilterShipId] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterYear, setFilterYear] = useState<string>('');

  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const error = routesError || bankingError;

  // Apply year filter to routes before aggregation
  const yearFilteredRoutes = useMemo(() => {
    if (!filterYear) return routes;
    return routes.filter((r) => r.year.toString() === filterYear);
  }, [routes, filterYear]);

  // Aggregate ships from routes (Part 5 fix — derive from routes, no hardcoded data)
  const shipAggregates = useMemo(() => aggregateShips(yearFilteredRoutes), [yearFilteredRoutes]);

  // Derive unique values for filters
  const shipIds = useMemo(() => Array.from(new Set(routes.map((r) => r.shipId))).sort(), [routes]);
  const years = useMemo(() => Array.from(new Set(routes.map((r) => r.year))).sort((a, b) => b - a), [routes]);

  // Apply filters
  const filteredShips = useMemo(() => {
    let result = shipAggregates;

    // Global ship filter
    if (selectedShipId) {
      result = result.filter((s) => s.shipId === selectedShipId);
    }
    // Local ship filter
    if (filterShipId) {
      result = result.filter((s) => s.shipId === filterShipId);
    }
    // Status filter
    if (filterStatus) {
      result = result.filter((s) => s.status === filterStatus);
    }

    return result;
  }, [shipAggregates, selectedShipId, filterShipId, filterStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredShips.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedShips = filteredShips.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset page on filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterShipId, filterStatus, filterYear, selectedShipId]);

  // KPI calculations (Part 8)
  const totalShips = shipAggregates.length;
  const surplusCount = useMemo(() => shipAggregates.filter((s) => s.status === 'Surplus').length, [shipAggregates]);
  const deficitCount = useMemo(() => shipAggregates.filter((s) => s.status === 'Deficit').length, [shipAggregates]);
  const totalFleetCredits = useMemo(
    () => shipAggregates.filter((s) => s.totalCB > 0).reduce((sum, s) => sum + s.totalCB, 0),
    [shipAggregates]
  );

  // Transfer modal data
  const surplusShips: DropdownShip[] = useMemo(
    () => shipAggregates.filter((s) => s.totalCB > 0).map((s) => ({ shipId: s.shipId, amount: s.totalCB })),
    [shipAggregates]
  );
  const deficitShips: DropdownShip[] = useMemo(
    () => shipAggregates.filter((s) => s.totalCB < 0).map((s) => ({ shipId: s.shipId, amount: Math.abs(s.totalCB) })),
    [shipAggregates]
  );

  const handleBank = async (shipId: string, amount: number) => {
    if (amount <= 0) return;
    try {
      setBankingError(null);
      await apiPost('/banking/bank', { shipId, year: 2024, amount });
      showToast(`Successfully banked surplus for ${shipId}`);
      fetchRoutes();
    } catch (err: any) {
      setBankingError(err.message || 'Failed to bank surplus.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Compliance Banking</h2>
          <p className="text-sm text-gray-500 mt-1">Bank surplus credits and manage ship compliance balances.</p>
        </div>
        <button
          onClick={() => setIsTransferModalOpen(true)}
          disabled={surplusShips.length === 0 || deficitShips.length === 0}
          className="bg-blue-600 border border-transparent rounded-md py-2 px-4 shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
        >
          Transfer Credits
        </button>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg z-50 text-sm font-medium transition-all duration-150">
          {toastMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      {/* KPI Cards (Part 8) */}
      {!loading && routes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard icon="🚢" title="Total Ships" value={totalShips} />
          <KpiCard icon="📈" title="Surplus Ships" value={surplusCount} accent="text-green-700" />
          <KpiCard icon="⚠️" title="Deficit Ships" value={deficitCount} accent="text-red-700" />
          <KpiCard
            icon="🏦"
            title="Total Fleet Credits"
            value={`+${totalFleetCredits.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            accent="text-blue-700"
          />
        </div>
      )}

      {/* Filter Panel (Part 7) */}
      {routes.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-1.5 min-w-[160px]">
              <label htmlFor="bankingShipFilter" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Ship ID
              </label>
              <select
                id="bankingShipFilter"
                value={filterShipId}
                onChange={(e) => setFilterShipId(e.target.value)}
                className="border border-gray-300 bg-white text-gray-700 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-150"
              >
                <option value="">All Ships</option>
                {shipIds.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5 min-w-[140px]">
              <label htmlFor="bankingStatusFilter" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Status
              </label>
              <select
                id="bankingStatusFilter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 bg-white text-gray-700 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-150"
              >
                <option value="">All</option>
                <option value="Surplus">Surplus</option>
                <option value="Deficit">Deficit</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 min-w-[120px]">
              <label htmlFor="bankingYearFilter" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Year
              </label>
              <select
                id="bankingYearFilter"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="border border-gray-300 bg-white text-gray-700 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-150"
              >
                <option value="">All Years</option>
                {years.map((y) => (
                  <option key={y} value={y.toString()}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                setFilterShipId('');
                setFilterStatus('');
                setFilterYear('');
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow border border-gray-200">
          <p className="text-gray-500 font-medium animate-pulse">Loading banking data...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3.5 text-left text-xs uppercase tracking-wider font-semibold text-gray-600">
                    Ship ID
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-right text-xs uppercase tracking-wider font-semibold text-gray-600">
                    Total Compliance Balance
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-center text-xs uppercase tracking-wider font-semibold text-gray-600">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-right text-xs uppercase tracking-wider font-semibold text-gray-600">
                    Banked Credits
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-center text-xs uppercase tracking-wider font-semibold text-gray-600">
                    Routes Count
                  </th>
                  <th scope="col" className="px-4 py-3.5 text-center text-xs uppercase tracking-wider font-semibold text-gray-600">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginatedShips.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                      No ships data available.
                    </td>
                  </tr>
                ) : (
                  paginatedShips.map((ship, idx) => {
                    const cb = ship.totalCB;
                    const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50';
                    return (
                      <tr key={ship.shipId} className={`${rowBg} hover:bg-blue-50 transition-all duration-150`}>
                        <td className="px-4 py-4 whitespace-nowrap font-medium text-gray-900">{ship.shipId}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-gray-700 font-mono">
                          {cb > 0
                            ? `+${cb.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                            : cb.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          {ship.status === 'Surplus' ? (
                            <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 rounded-md px-2.5 py-1 text-xs font-semibold">
                              Surplus
                            </span>
                          ) : ship.status === 'Deficit' ? (
                            <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 rounded-md px-2.5 py-1 text-xs font-semibold">
                              Deficit
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 rounded-md px-2.5 py-1 text-xs font-semibold">
                              Neutral
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-gray-700 font-mono">0</td>
                        <td className="px-4 py-4 whitespace-nowrap text-center text-gray-700">{ship.routesCount}</td>
                        <td className="px-4 py-4 whitespace-nowrap text-center">
                          <BankButton disabled={cb <= 0} onBank={() => handleBank(ship.shipId, cb)} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {filteredShips.length > 0 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">{Math.min(startIndex + ITEMS_PER_PAGE, filteredShips.length)}</span> of{' '}
                <span className="font-medium">{filteredShips.length}</span> ships
              </p>
              <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-3 py-1.5 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`relative inline-flex items-center px-3.5 py-1.5 border text-sm font-medium ${
                      currentPage === page
                        ? 'z-10 bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-3 py-1.5 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-40"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      )}

      <TransferCreditsModal
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        onSuccess={fetchRoutes}
        surplusShips={surplusShips}
        deficitShips={deficitShips}
        showToast={showToast}
      />
    </div>
  );
};
