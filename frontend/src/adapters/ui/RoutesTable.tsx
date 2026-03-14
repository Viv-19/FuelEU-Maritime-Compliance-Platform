import React from 'react';
import { Route } from '../../core/domain/Route';
import { BaselineButton } from './BaselineButton';

interface RoutesTableProps {
  routes: Route[];
  onSetBaseline: (routeId: string) => void;
}

export const RoutesTable: React.FC<RoutesTableProps> = ({ routes, onSetBaseline }) => {
  const TARGET_INTENSITY = 89.3368;

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
              <th scope="col" className="px-6 py-3 text-right font-semibold tracking-wider">GHG Intensity</th>
              <th scope="col" className="px-6 py-3 text-right font-semibold tracking-wider">Fuel Cons. (t)</th>
              <th scope="col" className="px-6 py-3 text-right font-semibold tracking-wider">Distance (nm)</th>
              <th scope="col" className="px-6 py-3 text-right font-semibold tracking-wider">Emissions (tCO2e)</th>
              <th scope="col" className="px-6 py-3 text-right font-semibold tracking-wider">Compliance Balance (CB)</th>
              <th scope="col" className="px-6 py-3 text-center font-semibold tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {routes.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
                  No routes found matching the current filters.
                </td>
              </tr>
            ) : (
              routes.map((route) => {
                const energyInScope = route.fuelConsumption * 41000;
                const complianceBalance = (TARGET_INTENSITY - route.ghgIntensity) * energyInScope;
                
                return (
                  <tr key={route.routeId} className={`hover:bg-gray-50 ${route.isBaseline ? 'bg-indigo-50/30' : ''}`}>
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
    </div>
  );
};
