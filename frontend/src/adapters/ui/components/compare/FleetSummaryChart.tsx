import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface FleetSummaryChartProps {
  baselineIntensity: number;
  fleetAverageIntensity: number;
}

const TARGET_INTENSITY = 89.3368;

export const FleetSummaryChart: React.FC<FleetSummaryChartProps> = ({
  baselineIntensity,
  fleetAverageIntensity,
}) => {
  const data = useMemo(() => {
    return [
      {
        name: 'Target Intensity',
        value: TARGET_INTENSITY,
        fill: '#3B82F6', // Blue
      },
      {
        name: 'Baseline Intensity',
        value: baselineIntensity,
        fill: '#9CA3AF', // Gray
      },
      {
        name: 'Fleet Average',
        value: fleetAverageIntensity,
        fill: fleetAverageIntensity <= TARGET_INTENSITY ? '#10B981' : '#EF4444', 
        // Green if avg <= target, else red
      },
    ];
  }, [baselineIntensity, fleetAverageIntensity]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col h-[400px]">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Fleet vs Target Intensity</h3>
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#4B5563', fontWeight: 500 }} axisLine={false} tickLine={false} />
            <YAxis 
              domain={['auto', 'auto']} 
              tick={{ fontSize: 12, fill: '#6B7280' }} 
              axisLine={false} 
              tickLine={false} 
              unit=" g" 
            />
            <Tooltip
              formatter={(value: any) => [`${Number(value).toFixed(4)} gCO₂e/MJ`, 'Intensity']}
              cursor={{ fill: '#F3F4F6' }}
              contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={60}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
