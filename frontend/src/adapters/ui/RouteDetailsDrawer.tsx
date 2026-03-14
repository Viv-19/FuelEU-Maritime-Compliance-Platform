import React from 'react';
import { Route } from '../../core/domain/Route';

interface RouteDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  route: Route | null;
}

export const RouteDetailsDrawer: React.FC<RouteDetailsDrawerProps> = ({ isOpen, onClose, route }) => {
  const TARGET_INTENSITY = 89.3368;
  
  if (!isOpen && !route) return null;

  // We can calculate values even if route is temporarily null during close animation
  const safeRoute = route || {} as Route;
  const energyInScope = safeRoute.fuelConsumption ? safeRoute.fuelConsumption * 41000 : 0;
  const complianceBalance = safeRoute.ghgIntensity ? (TARGET_INTENSITY - safeRoute.ghgIntensity) * energyInScope : 0;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black transition-opacity z-40 ${
          isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 max-w-md w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="px-6 py-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">Route Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md p-1"
          >
            <span className="sr-only">Close panel</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {route && (
          <div className="px-6 py-6 space-y-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Route ID</h3>
              <p className="text-lg font-bold text-gray-900">{route.routeId}</p>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-6 border-t border-gray-200 pt-6">
              <div>
                <dt className="text-sm font-medium text-gray-500">Vessel Type</dt>
                <dd className="mt-1 text-base text-gray-900 font-medium">{route.vesselType}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Fuel Type</dt>
                <dd className="mt-1 text-base text-gray-900 font-medium">{route.fuelType}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Year</dt>
                <dd className="mt-1 text-base text-gray-900 font-medium">{route.year}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Distance</dt>
                <dd className="mt-1 text-base text-gray-900 font-medium font-mono">
                  {route.distance.toLocaleString()} <span className="text-gray-500 text-sm ml-1 line-through">nm</span>
                </dd>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-500">GHG Intensity</span>
                <span className="text-base text-gray-900 font-mono font-medium">
                  {route.ghgIntensity.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-500">Fuel Consumption</span>
                <span className="text-base text-gray-900 font-mono font-medium">
                  {route.fuelConsumption.toLocaleString()} t
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-500">Total Emissions</span>
                <span className="text-base text-gray-900 font-mono font-medium">
                  {route.totalEmissions.toLocaleString()} tCO₂e
                </span>
              </div>
              
              <div className="bg-blue-50/50 p-4 rounded-lg mt-6 border border-blue-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-blue-800">Energy Scope</span>
                  <span className="text-base text-blue-900 font-mono font-semibold">
                    {energyInScope.toLocaleString(undefined, { maximumFractionDigits: 0 })} MJ
                  </span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm font-medium text-gray-700">Compliance Balance</span>
                  <span className={`text-base font-mono font-bold px-2 py-1 rounded bg-white shadow-sm border ${
                    complianceBalance > 0 ? 'text-green-700 border-green-200' : complianceBalance < 0 ? 'text-red-700 border-red-200' : 'text-gray-700 border-gray-200'
                  }`}>
                    {complianceBalance > 0 ? '+' : ''}{complianceBalance.toLocaleString(undefined, { maximumFractionDigits: 0 })} CB
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
