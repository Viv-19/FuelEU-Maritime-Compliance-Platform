import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ComparePageContent } from '../adapters/ui/ComparePage';
import * as apiClient from '../adapters/infrastructure/apiClient';
import { RoutesProvider } from '../adapters/ui/context/RoutesContext';

vi.mock('../adapters/infrastructure/apiClient', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
}));

vi.mock('../adapters/ui/context/BaselineContext', () => ({
  useBaseline: () => ({
    baselineRouteId: 'R001',
    setBaselineRouteId: vi.fn(),
  }),
  BaselineProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const mockData = [
  { routeId: 'R001', shipId: 'SHIP001', ghgIntensity: 91.0, isBaseline: true, vesselType: 'Container', fuelType: 'HFO', year: 2024, fuelConsumption: 5000, distance: 12000, totalEmissions: 4500 },
  { routeId: 'R002', shipId: 'SHIP002', ghgIntensity: 88.0, isBaseline: false, vesselType: 'Container', fuelType: 'HFO', year: 2024, fuelConsumption: 3000, distance: 8000, totalEmissions: 2200 },
  { routeId: 'R003', shipId: 'SHIP003', ghgIntensity: 95.0, isBaseline: false, vesselType: 'Container', fuelType: 'HFO', year: 2024, fuelConsumption: 4000, distance: 9000, totalEmissions: 3500 }
];

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<RoutesProvider>{ui}</RoutesProvider>);
};

describe('ComparePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and processes comparison data correctly', async () => {
    // RoutesContext will call apiGet('/routes')
    vi.mocked(apiClient.apiGet).mockResolvedValueOnce({ success: true, data: mockData });

    renderWithProvider(<ComparePageContent />);

    await waitFor(() => {
      expect(screen.getByText('R001')).toBeInTheDocument();
    });
  });

  it('shows warning when no comparison data is available', async () => {
    vi.mocked(apiClient.apiGet).mockResolvedValueOnce({ success: true, data: [] });

    renderWithProvider(<ComparePageContent />);

    await waitFor(() => {
      expect(screen.getByText(/Please select a Baseline Route above/i)).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    vi.mocked(apiClient.apiGet).mockRejectedValueOnce(new Error('Connection failed'));

    renderWithProvider(<ComparePageContent />);

    await waitFor(() => {
      expect(screen.getByText(/Unable to load comparison data/i)).toBeInTheDocument();
    });
  });
});
