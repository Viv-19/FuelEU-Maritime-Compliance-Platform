import React from 'react';

export interface PoolingFilterState {
  shipId: string;
  status: string;
  year: number;
}

interface PoolingFiltersProps {
  filters: PoolingFilterState;
  onFilterChange: (filters: PoolingFilterState) => void;
  shipIds: string[];
}

export const PoolingFilters: React.FC<PoolingFiltersProps> = ({ filters, onFilterChange, shipIds }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm mb-6">
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex flex-col gap-1.5 min-w-[160px]">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide" htmlFor="poolingShipFilter">
            Ship ID
          </label>
          <select
            id="poolingShipFilter"
            value={filters.shipId}
            onChange={(e) => onFilterChange({ ...filters, shipId: e.target.value })}
            className="border border-gray-300 bg-white text-gray-700 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-150"
          >
            <option value="">All Ships</option>
            {shipIds.map(id => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5 min-w-[140px]">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide" htmlFor="poolingStatusFilter">
            Status
          </label>
          <select
            id="poolingStatusFilter"
            value={filters.status}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
            className="border border-gray-300 bg-white text-gray-700 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-150"
          >
            <option value="All">All Statuses</option>
            <option value="Surplus">Surplus</option>
            <option value="Deficit">Deficit</option>
            <option value="Neutral">Neutral</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5 min-w-[120px]">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide" htmlFor="poolingYearFilter">
            Reporting Year
          </label>
          <select
            id="poolingYearFilter"
            value={filters.year}
            onChange={(e) => onFilterChange({ ...filters, year: parseInt(e.target.value, 10) })}
            className="border border-gray-300 bg-white text-gray-700 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-150"
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
          </select>
        </div>
      </div>
    </div>
  );
};
