import React from 'react';

export interface CompareFilterState {
  search: string;
  shipId: string;
  vesselType: string;
  fuelType: string;
  year: number | '';
  compliance: 'all' | 'compliant' | 'non-compliant';
  deviationRange: string;
}

interface CompareFiltersProps {
  filters: CompareFilterState;
  setFilters: React.Dispatch<React.SetStateAction<CompareFilterState>>;
  shipIds: string[];
  vesselTypes: string[];
  fuelTypes: string[];
  years: number[];
}

export const CompareFilters: React.FC<CompareFiltersProps> = ({
  filters,
  setFilters,
  shipIds,
  vesselTypes,
  fuelTypes,
  years,
}) => {
  const handleChange = (field: keyof CompareFilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {/* Search Route ID */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Route ID</label>
          <input
            type="text"
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full pl-3 pr-3 py-2 text-sm bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Ship ID */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Ship ID</label>
          <select
            value={filters.shipId}
            onChange={(e) => handleChange('shipId', e.target.value)}
            className="w-full pl-3 pr-8 py-2 text-sm bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Ships</option>
            {shipIds.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </div>

        {/* Vessel Type */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Vessel Type</label>
          <select
            value={filters.vesselType}
            onChange={(e) => handleChange('vesselType', e.target.value)}
            className="w-full pl-3 pr-8 py-2 text-sm bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All</option>
            {vesselTypes.map((vt) => (
              <option key={vt} value={vt}>
                {vt}
              </option>
            ))}
          </select>
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Fuel Type</label>
          <select
            value={filters.fuelType}
            onChange={(e) => handleChange('fuelType', e.target.value)}
            className="w-full pl-3 pr-8 py-2 text-sm bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All</option>
            {fuelTypes.map((ft) => (
              <option key={ft} value={ft}>
                {ft}
              </option>
            ))}
          </select>
        </div>

        {/* Year */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Year</label>
          <select
            value={filters.year}
            onChange={(e) => handleChange('year', e.target.value ? Number(e.target.value) : '')}
            className="w-full pl-3 pr-8 py-2 text-sm bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Compliance Status */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Compliance Status</label>
          <select
            value={filters.compliance}
            onChange={(e) => handleChange('compliance', e.target.value)}
            className="w-full pl-3 pr-8 py-2 text-sm bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All</option>
            <option value="compliant">Compliant</option>
            <option value="non-compliant">Non-compliant</option>
          </select>
        </div>

        {/* Deviation Range */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Deviation Range</label>
          <select
            value={filters.deviationRange}
            onChange={(e) => handleChange('deviationRange', e.target.value)}
            className="w-full pl-3 pr-8 py-2 text-sm bg-white text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="All">All</option>
            <option value="> +5%">&gt; +5%</option>
            <option value="0% to +5%">0% to +5%</option>
            <option value="0% to -5%">0% to -5%</option>
            <option value="< -5%">&lt; -5%</option>
          </select>
        </div>
      </div>
    </div>
  );
};
