import React from 'react';

interface RouteFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  shipIds: string[];
  selectedShip: string;
  onShipChange: (value: string) => void;
  vesselTypes: string[];
  fuelTypes: string[];
  years: number[];
  selectedVessel: string;
  selectedFuel: string;
  selectedYear: string;
  onFilterChange: (filterType: 'vessel' | 'fuel' | 'year', value: string) => void;
  onResetFilters: () => void;
}

export const RouteFilters: React.FC<RouteFiltersProps> = ({
  searchQuery,
  onSearchChange,
  shipIds,
  selectedShip,
  onShipChange,
  vesselTypes,
  fuelTypes,
  years,
  selectedVessel,
  selectedFuel,
  selectedYear,
  onFilterChange,
  onResetFilters,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col gap-4">
      {/* Search Input */}
      <div className="w-full">
        <label htmlFor="searchFilter" className="sr-only">Search by Route ID</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            id="searchFilter"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by Route ID..."
            className="w-full bg-white text-gray-900 placeholder-gray-400 border border-gray-300 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-150"
          />
        </div>
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex flex-col gap-1.5 min-w-[160px]">
          <label htmlFor="shipFilter" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Ship ID
          </label>
          <select
            id="shipFilter"
            value={selectedShip}
            onChange={(e) => onShipChange(e.target.value)}
            className="border border-gray-300 bg-white text-gray-700 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-150"
          >
            <option value="">All Ships</option>
            {shipIds.map((id) => (
              <option key={id} value={id}>{id}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5 min-w-[160px]">
          <label htmlFor="vesselFilter" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Vessel Type
          </label>
          <select
            id="vesselFilter"
            value={selectedVessel}
            onChange={(e) => onFilterChange('vessel', e.target.value)}
            className="border border-gray-300 bg-white text-gray-700 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-150"
          >
            <option value="">All Vessels</option>
            {vesselTypes.map((v) => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5 min-w-[160px]">
          <label htmlFor="fuelFilter" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Fuel Type
          </label>
          <select
            id="fuelFilter"
            value={selectedFuel}
            onChange={(e) => onFilterChange('fuel', e.target.value)}
            className="border border-gray-300 bg-white text-gray-700 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-150"
          >
            <option value="">All Fuels</option>
            {fuelTypes.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5 min-w-[120px]">
          <label htmlFor="yearFilter" className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Year
          </label>
          <select
            id="yearFilter"
            value={selectedYear}
            onChange={(e) => onFilterChange('year', e.target.value)}
            className="border border-gray-300 bg-white text-gray-700 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-150"
          >
            <option value="">All Years</option>
            {years.map((y) => (
              <option key={y} value={y.toString()}>{y}</option>
            ))}
          </select>
        </div>

        <button
          onClick={onResetFilters}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-150"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};
