import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CompareTable } from '../adapters/ui/CompareTable';
import { RouteComparison } from '../core/domain/Route';

const mockComparisons: RouteComparison[] = [
  {
    routeId: 'R001',
    ghgIntensity: 91.0,
    percentDiff: 0,
    compliant: false,
    isBaseline: true
  },
  {
    routeId: 'R002',
    ghgIntensity: 88.0,
    percentDiff: -3.2967,
    compliant: true,
    isBaseline: false
  },
  {
    routeId: 'R003',
    ghgIntensity: 95.0,
    percentDiff: 4.3956,
    compliant: false,
    isBaseline: false
  }
];

describe('CompareTable', () => {
  it('renders comparison rows correctly', () => {
    render(<CompareTable comparisons={mockComparisons} baselineIntensity={91.0} />);

    expect(screen.getByText('R001')).toBeInTheDocument();
    // 91.00 appears as baseline intensity in all rows (3) + comp intensity in row 1 (1) = 4 times
    expect(screen.getAllByText('91.00').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('0.00%')).toBeInTheDocument();

    expect(screen.getByText('R002')).toBeInTheDocument();
    expect(screen.getByText('88.00')).toBeInTheDocument();
    expect(screen.getByText('-3.30%')).toBeInTheDocument(); // Formatted
    expect(screen.getAllByText('✅').length).toBe(1);

    expect(screen.getByText('R003')).toBeInTheDocument();
    expect(screen.getByText('95.00')).toBeInTheDocument();
    expect(screen.getByText('+4.40%')).toBeInTheDocument(); // Formatted with +
    // Baseline (R001) and R003 are non-compliant
    expect(screen.getAllByText('❌').length).toBe(2);
  });

  it('highlights the baseline row', () => {
    const { container } = render(<CompareTable comparisons={mockComparisons} baselineIntensity={91.0} />);
    const baselineRow = container.querySelector('.bg-blue-50\\/50');
    expect(baselineRow).toBeInTheDocument();
    expect(baselineRow).toHaveTextContent('R001');
  });

  it('shows empty state when no data is provided', () => {
    render(<CompareTable comparisons={[]} baselineIntensity={null} />);
    expect(screen.getByText(/No comparison data available/i)).toBeInTheDocument();
  });
});
