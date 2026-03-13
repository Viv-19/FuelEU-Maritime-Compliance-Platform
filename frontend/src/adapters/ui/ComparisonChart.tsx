import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';
import { RouteComparison } from '../../core/domain/Route';

interface ComparisonChartProps {
  data: RouteComparison[];
  targetIntensity: number;
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ data, targetIntensity }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 h-[400px]">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">
        GHG Intensity Comparison (gCO2e/MJ)
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="routeId" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <Tooltip 
            cursor={{ fill: '#f9fafb' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <ReferenceLine 
            y={targetIntensity} 
            label={{ position: 'right', value: 'Target', fill: '#ef4444', fontSize: 10 }} 
            stroke="#ef4444" 
            strokeDasharray="3 3" 
          />
          <Bar dataKey="ghgIntensity" radius={[4, 4, 0, 0]} barSize={40}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.isBaseline ? '#6366f1' : entry.compliant ? '#10b981' : '#f43f5e'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-2 flex justify-center gap-6 text-[10px] uppercase font-bold tracking-widest text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-indigo-500 rounded-sm"></div>
          <span>Baseline</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-emerald-500 rounded-sm"></div>
          <span>Compliant</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-rose-500 rounded-sm"></div>
          <span>Non-Compliant</span>
        </div>
      </div>
    </div>
  );
};
