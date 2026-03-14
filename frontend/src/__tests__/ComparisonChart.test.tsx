import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TopDeviationChart, DeviationData } from '../adapters/ui/components/compare/TopDeviationChart';

// Mock Recharts because SVG rendering check is hard in RTL/Vitest environment
vi.mock('recharts', async () => {
  const original = await vi.importActual('recharts');
  return {
    ...original,
    ResponsiveContainer: ({ children }: any) => <div style={{ width: 800, height: 400 }}>{children}</div>,
  };
});

const mockData: DeviationData[] = [
  { routeId: 'R001', percentDiff: 0 },
  { routeId: 'R002', percentDiff: -3.3 },
  { routeId: 'R003', percentDiff: 4.4 },
];

describe('TopDeviationChart', () => {
  it('renders without crashing', () => {
    const { container } = render(<TopDeviationChart data={mockData} />);
    expect(container).toBeInTheDocument();
    expect(screen.getByText(/Top Deviation Routes/i)).toBeInTheDocument();
  });
});

