import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ComplianceDonutChartProps {
  compliantCount: number;
  nonCompliantCount: number;
}

const COLORS = ['#10B981', '#EF4444']; // Green, Red

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 p-2 shadow-sm rounded-md text-sm">
        <p className="font-semibold text-gray-800">{payload[0].name}</p>
        <p className="text-gray-600">{`Count: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export const ComplianceDonutChart: React.FC<ComplianceDonutChartProps> = ({
  compliantCount,
  nonCompliantCount,
}) => {
  const data = useMemo(
    () => [
      { name: 'Compliant', value: compliantCount },
      { name: 'Non-Compliant', value: nonCompliantCount },
    ],
    [compliantCount, nonCompliantCount]
  );

  const total = compliantCount + nonCompliantCount;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col h-[400px]">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Compliance Distribution</h3>
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={110}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-36px]">
          <span className="text-3xl font-bold text-gray-800">{total}</span>
          <span className="text-sm text-gray-500 font-medium">Routes</span>
        </div>
      </div>
    </div>
  );
};
