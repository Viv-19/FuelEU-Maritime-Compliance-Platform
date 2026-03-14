import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ComparePageContent } from '../adapters/ui/ComparePage';
import * as apiClient from '../adapters/infrastructure/apiClient';

vi.mock('../adapters/infrastructure/apiClient', () => ({
  apiGet: vi.fn(),
}));

vi.mock('../adapters/ui/context/BaselineContext', () => ({
  useBaseline: () => ({
    baselineRouteId: 'R001',
    setBaselineRouteId: vi.fn(),
  }),
}));

const mockData = [
  { routeId: 'R001', ghgIntensity: 91.0, isBaseline: true, vesselType: 'Container', fuelType: 'HFO', year: 2024 },
  { routeId: 'R002', ghgIntensity: 88.0, isBaseline: false, vesselType: 'Container', fuelType: 'HFO', year: 2024 },
  { routeId: 'R003', ghgIntensity: 95.0, isBaseline: false, vesselType: 'Container', fuelType: 'HFO', year: 2024 }
];

describe('ComparePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and processes comparison data correctly', async () => {
    vi.mocked(apiClient.apiGet).mockResolvedValueOnce({ success: true, data: mockData });

    render(<ComparePageContent />);

    // Skeleton loaders are shown instead of text during loading

    await waitFor(() => {
      // Check if data is rendered in the table
      expect(screen.getByText('R001')).toBeInTheDocument();
      expect(screen.getByText('-3.30%')).toBeInTheDocument(); // Processed diff R002 vs R001
      expect(screen.getAllByText('Compliant').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('Non-compliant').length).toBeGreaterThanOrEqual(2);
    });
  });

  it('shows warning when no comparison data is available', async () => {
    vi.mocked(apiClient.apiGet).mockResolvedValueOnce({ success: true, data: [] });

    render(<ComparePageContent />);

    await waitFor(() => {
      expect(screen.getByText(/Please select a Baseline Route above/i)).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    vi.mocked(apiClient.apiGet).mockRejectedValueOnce(new Error('Connection failed'));

    render(<ComparePageContent />);

    await waitFor(() => {
      expect(screen.getByText(/Unable to load comparison data/i)).toBeInTheDocument();
    });
  });
});

