import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ComparisonTable, ComparisonData } from '../adapters/ui/components/compare/ComparisonTable';

const mockComparisons: ComparisonData[] = [
  {
    routeId: 'R001',
    shipId: 'SHIP001',
    vesselType: 'Container',
    fuelType: 'HFO',
    year: 2024,
    distance: 1000,
    fuelConsumption: 100,
    totalEmissions: 1000,
    ghgIntensity: 91.0,
    percentDiff: 0,
    compliant: false,
    isBaseline: true,
    baselineIntensity: 91.0,
    comparisonIntensity: 91.0
  },
  {
    routeId: 'R002',
    shipId: 'SHIP002',
    vesselType: 'Container',
    fuelType: 'HFO',
    year: 2024,
    distance: 1000,
    fuelConsumption: 100,
    totalEmissions: 1000,
    ghgIntensity: 88.0,
    percentDiff: -3.2967,
    compliant: true,
    isBaseline: false,
    baselineIntensity: 91.0,
    comparisonIntensity: 88.0
  },
  {
    routeId: 'R003',
    shipId: 'SHIP003',
    vesselType: 'Container',
    fuelType: 'HFO',
    year: 2024,
    distance: 1000,
    fuelConsumption: 100,
    totalEmissions: 1000,
    ghgIntensity: 95.0,
    percentDiff: 4.3956,
    compliant: false,
    isBaseline: false,
    baselineIntensity: 91.0,
    comparisonIntensity: 95.0
  }
];

describe('ComparisonTable', () => {
  it('renders comparison rows correctly', () => {
    // We render ComparisonTable instead of old CompareTable
    render(<ComparisonTable data={mockComparisons} />);

    expect(screen.getByText('R001')).toBeInTheDocument();
    expect(screen.getAllByText('91.0000').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('0.00%')).toBeInTheDocument();

    expect(screen.getByText('R002')).toBeInTheDocument();
    expect(screen.getByText('88.0000')).toBeInTheDocument();
    expect(screen.getByText('-3.30%')).toBeInTheDocument(); // Formatted
    expect(screen.getAllByText('Compliant').length).toBe(1);

    expect(screen.getByText('R003')).toBeInTheDocument();
    expect(screen.getByText('95.0000')).toBeInTheDocument();
    expect(screen.getByText('+4.40%')).toBeInTheDocument(); // Formatted with +
    // Baseline (R001) and R003 are non-compliant
    expect(screen.getAllByText('Non-compliant').length).toBe(2);
  });

  it('shows empty state when no data is provided', () => {
    render(<ComparisonTable data={[]} />);
    expect(screen.getByText(/No routes match the selected filters/i)).toBeInTheDocument();
  });
});
