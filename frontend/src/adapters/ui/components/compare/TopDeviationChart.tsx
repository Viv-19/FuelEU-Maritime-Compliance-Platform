import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export interface DeviationData {
  routeId: string;
  percentDiff: number;
}

interface TopDeviationChartProps {
  data: DeviationData[];
}

export const TopDeviationChart: React.FC<TopDeviationChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    // 1. Sort routes by absolute percentDiff
    const sorted = [...data].sort((a, b) => Math.abs(b.percentDiff) - Math.abs(a.percentDiff));
    // 2. Select top 10 routes
    return sorted.slice(0, 10);
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col h-[400px]">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Deviation Routes</h3>
        <div className="flex-1 flex justify-center items-center text-sm text-gray-500">
          No data available for top deviation routes.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col h-[400px]">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Deviation Routes</h3>
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
            <XAxis type="number" unit="%" tick={{ fontSize: 12 }} />
            <YAxis dataKey="routeId" type="category" tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value: any) => [`${Number(value).toFixed(2)}%`, '% Difference']}
              labelStyle={{ color: '#374151', fontWeight: 600 }}
              contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Bar dataKey="percentDiff" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.percentDiff > 0 ? '#EF4444' : '#10B981'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
