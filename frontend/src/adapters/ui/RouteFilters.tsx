import React from 'react';

interface RouteFiltersProps {
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
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-wrap gap-4 items-center">
      <div className="flex flex-col gap-1 min-w-[150px]">
        <label htmlFor="vesselFilter" className="text-xs font-semibold text-gray-500 uppercase">
          Vessel Type
        </label>
        <select
          id="vesselFilter"
          value={selectedVessel}
          onChange={(e) => onFilterChange('vessel', e.target.value)}
          className="border border-gray-300 bg-white text-gray-700 px-3 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Vessels</option>
          {vesselTypes.map((v) => (
            <option key={v} value={v}>{v}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1 min-w-[150px]">
        <label htmlFor="fuelFilter" className="text-xs font-semibold text-gray-500 uppercase">
          Fuel Type
        </label>
        <select
          id="fuelFilter"
          value={selectedFuel}
          onChange={(e) => onFilterChange('fuel', e.target.value)}
          className="border border-gray-300 bg-white text-gray-700 px-3 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Fuels</option>
          {fuelTypes.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1 min-w-[150px]">
        <label htmlFor="yearFilter" className="text-xs font-semibold text-gray-500 uppercase">
          Year
        </label>
        <select
          id="yearFilter"
          value={selectedYear}
          onChange={(e) => onFilterChange('year', e.target.value)}
          className="border border-gray-300 bg-white text-gray-700 px-3 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Years</option>
          {years.map((y) => (
            <option key={y} value={y.toString()}>{y}</option>
          ))}
        </select>
      </div>

      <div className="flex items-end min-w-[120px] mt-5">
        <button
          onClick={onResetFilters}
          className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm transition-colors"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};
