import React from 'react';
import { RouteComparison } from '../../core/domain/Route';

interface CompareTableProps {
  comparisons: RouteComparison[];
  baselineIntensity: number | null;
}

export const CompareTable: React.FC<CompareTableProps> = ({ comparisons, baselineIntensity }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th scope="col" className="px-6 py-3 text-left font-semibold tracking-wider">Route ID</th>
              <th scope="col" className="px-6 py-3 text-right font-semibold tracking-wider">Baseline Intensity</th>
              <th scope="col" className="px-6 py-3 text-right font-semibold tracking-wider">Comp. Intensity</th>
              <th scope="col" className="px-6 py-3 text-right font-semibold tracking-wider">% Diff</th>
              <th scope="col" className="px-6 py-3 text-center font-semibold tracking-wider">Compliance</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {comparisons.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No comparison data available.
                </td>
              </tr>
            ) : (
              comparisons.map((comp) => (
                <tr 
                  key={comp.routeId} 
                  className={`hover:bg-gray-50 transition-colors ${comp.isBaseline ? 'bg-blue-50/50 font-bold' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{comp.routeId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-600 font-mono">
                    {baselineIntensity?.toFixed(2) ?? '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-900 font-mono">
                    {comp.ghgIntensity.toFixed(2)}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right font-mono ${
                    comp.percentDiff > 0 ? 'text-red-600' : comp.percentDiff < 0 ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {comp.percentDiff > 0 ? '+' : ''}{comp.percentDiff.toFixed(2)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center text-xl">
                    {comp.compliant ? (
                      <span title="Compliant" className="text-green-500">✅</span>
                    ) : (
                      <span title="Non-Compliant" className="text-red-500">❌</span>
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
