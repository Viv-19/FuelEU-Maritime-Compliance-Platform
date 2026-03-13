import React from 'react';
import { PoolMember } from '../../core/domain/PoolMember';

interface PoolMemberListProps {
  members: PoolMember[];
}

export const PoolMemberList: React.FC<PoolMemberListProps> = ({ members }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th scope="col" className="px-6 py-3 text-left font-semibold tracking-wider">Ship ID</th>
              <th scope="col" className="px-6 py-3 text-right font-semibold tracking-wider">CB Before</th>
              <th scope="col" className="px-6 py-3 text-right font-semibold tracking-wider">CB After</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  No ship compliance data available.
                </td>
              </tr>
            ) : (
              members.map((m) => (
                <tr key={m.shipId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{m.shipId}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right font-mono ${
                    m.cb_before > 0 ? 'text-green-600' : m.cb_before < 0 ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {m.cb_before.toLocaleString()}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right font-mono ${
                    m.cb_after != null
                      ? m.cb_after > 0 ? 'text-green-600' : m.cb_after < 0 ? 'text-red-600' : 'text-gray-500'
                      : 'text-gray-300'
                  }`}>
                    {m.cb_after != null ? m.cb_after.toLocaleString() : '—'}
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
