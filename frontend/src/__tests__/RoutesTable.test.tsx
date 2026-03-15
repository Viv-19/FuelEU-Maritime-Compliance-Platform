import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RoutesTable } from '../adapters/ui/RoutesTable';
import { Route } from '../core/domain/Route';

const mockRoutes: Route[] = [
  {
    routeId: 'R001',
    shipId: 'SHIP001',
    vesselType: 'Container',
    fuelType: 'HFO',
    year: 2024,
    ghgIntensity: 91.0,
    fuelConsumption: 5000,
    distance: 12000,
    totalEmissions: 4500,
    isBaseline: true
  },
  {
    routeId: 'R002',
    shipId: 'SHIP002',
    vesselType: 'BulkCarrier',
    fuelType: 'LNG',
    year: 2024,
    ghgIntensity: 88.0,
    fuelConsumption: 3000,
    distance: 8000,
    totalEmissions: 2200,
    isBaseline: false
  }
];

describe('RoutesTable', () => {
  it('renders correctly with given routes', () => {
    const handleSetBaseline = vi.fn();
    render(<RoutesTable routes={mockRoutes} onSetBaseline={handleSetBaseline} />);

    // Check headers
    expect(screen.getByText('Route ID')).toBeInTheDocument();
    expect(screen.getByText('Compliance Balance')).toBeInTheDocument();
    
    // Check Content rows
    expect(screen.getByText('R001')).toBeInTheDocument();
    expect(screen.getByText('R002')).toBeInTheDocument();
    
    // (89.3368 - 91.0) * (5000 * 41000) = deficit
    expect(screen.getByText('DEFICIT')).toBeInTheDocument();
    // (89.3368 - 88.0) * (3000 * 41000) = surplus
    expect(screen.getByText('SURPLUS')).toBeInTheDocument();
  });

  it('renders Baseline badge for baseline route and Set as Baseline button for others', () => {
    const handleSetBaseline = vi.fn();
    render(<RoutesTable routes={mockRoutes} onSetBaseline={handleSetBaseline} />);

    // Baseline route shows a badge in the action column
    expect(screen.getByText('Baseline')).toBeInTheDocument();

    // Non-baseline route shows "Set as Baseline" button
    const setBaselineBtn = screen.getByText('Set as Baseline');
    expect(setBaselineBtn).toBeInTheDocument();
    expect(setBaselineBtn).not.toBeDisabled();
  });

  it('calls onSetBaseline when a non-baseline button is clicked', () => {
    const handleSetBaseline = vi.fn();
    render(<RoutesTable routes={mockRoutes} onSetBaseline={handleSetBaseline} />);

    const setBaselineBtn = screen.getByText('Set as Baseline');
    fireEvent.click(setBaselineBtn);

    expect(handleSetBaseline).toHaveBeenCalledTimes(1);
    expect(handleSetBaseline).toHaveBeenCalledWith('R002');
  });

  it('displays empty state when array is empty', () => {
    const handleSetBaseline = vi.fn();
    render(<RoutesTable routes={[]} onSetBaseline={handleSetBaseline} />);

    expect(screen.getByText(/No routes found matching the current filters/i)).toBeInTheDocument();
  });
});
