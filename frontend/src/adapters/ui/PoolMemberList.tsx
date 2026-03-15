import React from 'react';

export interface PoolMemberItem {
  shipId: string;
  cbBefore: number;
  cbAfter?: number;
}

interface PoolMemberListProps {
  members: PoolMemberItem[];
}

export const PoolMemberList: React.FC<PoolMemberListProps> = ({ members }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          Pool Results
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th scope="col" className="px-6 py-3 text-left font-semibold tracking-wider">Ship ID</th>
              <th scope="col" className="px-6 py-3 text-right font-semibold tracking-wider">CB Before</th>
              <th scope="col" className="px-6 py-3 text-right font-semibold tracking-wider">CB After</th>
              <th scope="col" className="px-6 py-3 text-right font-semibold tracking-wider">Change</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  Select ships to create a compliance pool.
                </td>
              </tr>
            ) : (
              members.map((m) => {
                const change = m.cbAfter !== undefined ? m.cbAfter - m.cbBefore : 0;
                return (
                  <tr key={m.shipId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{m.shipId}</td>
                    <td className={`px-6 py-4 whitespace-nowrap text-right font-mono ${
                      m.cbBefore > 0 ? 'text-green-600' : m.cbBefore < 0 ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {(m.cbBefore || 0).toLocaleString()}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-right font-mono ${
                      m.cbAfter !== undefined
                        ? m.cbAfter > 0 ? 'text-green-600' : m.cbAfter < 0 ? 'text-red-600' : 'text-gray-500'
                        : 'text-gray-300'
                    }`}>
                      {m.cbAfter !== undefined ? (m.cbAfter || 0).toLocaleString() : '—'}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-right font-mono font-medium ${
                      change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-400'
                    }`}>
                      {m.cbAfter !== undefined ? `${change > 0 ? '+' : ''}${change.toLocaleString()}` : '—'}
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
