import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ComparisonChart } from '../adapters/ui/ComparisonChart';
import { RouteComparison } from '../core/domain/Route';

// Mock Recharts because SVG rendering check is hard in RTL/Vitest environment
vi.mock('recharts', async () => {
  const original = await vi.importActual('recharts');
  return {
    ...original,
    ResponsiveContainer: ({ children }: any) => <div style={{ width: 800, height: 400 }}>{children}</div>,
  };
});

const mockData: RouteComparison[] = [
  { routeId: 'R001', ghgIntensity: 91, percentDiff: 0, compliant: false, isBaseline: true },
  { routeId: 'R002', ghgIntensity: 88, percentDiff: -3.3, compliant: true, isBaseline: false }
];

describe('ComparisonChart', () => {
  it('renders without crashing', () => {
    const { container } = render(<ComparisonChart data={mockData} targetIntensity={89.3368} />);
    expect(container).toBeInTheDocument();
    expect(screen.getByText(/GHG Intensity Comparison/i)).toBeInTheDocument();
  });
});
