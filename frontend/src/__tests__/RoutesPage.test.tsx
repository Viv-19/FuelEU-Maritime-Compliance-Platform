import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RoutesPage } from '../adapters/ui/RoutesPage';
import * as apiClient from '../adapters/infrastructure/apiClient';

// Mock the API Client exactly
vi.mock('../adapters/infrastructure/apiClient', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
}));

const mockData = [
  {
    routeId: 'R001',
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

describe('RoutesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and renders routes data on load', async () => {
    vi.mocked(apiClient.apiGet).mockResolvedValueOnce({ success: true, data: mockData });

    const { container } = render(<RoutesPage />);

    // Skeleton loading rows should be visible (animate-pulse divs)
    const skeletonElements = container.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);

    await waitFor(() => {
      expect(screen.getByText('R001')).toBeInTheDocument();
      expect(screen.getByText('R002')).toBeInTheDocument();
    });
  });

  it('filters data appropriately using dropdowns', async () => {
    vi.mocked(apiClient.apiGet).mockResolvedValueOnce({ success: true, data: mockData });

    render(<RoutesPage />);

    await waitFor(() => {
      expect(screen.getByText('R001')).toBeInTheDocument();
    });

    // Select Container Only
    const vesselFilter = screen.getByLabelText(/Vessel Type/i);
    fireEvent.change(vesselFilter, { target: { value: 'Container' } });

    await waitFor(() => {
      expect(screen.getByText('R001')).toBeInTheDocument();
      expect(screen.queryByText('R002')).not.toBeInTheDocument(); // BulkCarrier shouldn't be here
    });
  });

  it('calls apiPost when Set Baseline is clicked and reloads', async () => {
    // Initial fetch
    vi.mocked(apiClient.apiGet).mockResolvedValueOnce({ success: true, data: mockData });
    // Post succeeds
    vi.mocked(apiClient.apiPost).mockResolvedValueOnce({ success: true });
    // Refetch resolves baseline swapped
    const swappedMock = [mockData[0], { ...mockData[1], isBaseline: true }];
    vi.mocked(apiClient.apiGet).mockResolvedValueOnce({ success: true, data: swappedMock });

    render(<RoutesPage />);

    await waitFor(() => {
      expect(screen.getByText('R002')).toBeInTheDocument();
    });

    const setBaselineBtn = screen.getByText('Set as Baseline');
    fireEvent.click(setBaselineBtn);

    await waitFor(() => {
      expect(apiClient.apiPost).toHaveBeenCalledWith('/routes/R002/baseline', {});
      expect(apiClient.apiGet).toHaveBeenCalledTimes(2); // Initial mount + refresh
    });
  });

  it('handles API errors gracefully', async () => {
    vi.mocked(apiClient.apiGet).mockRejectedValueOnce(new Error('Network disconnected'));

    render(<RoutesPage />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load routes/i)).toBeInTheDocument();
      expect(screen.getByText(/Retry/i)).toBeInTheDocument();
    });
  });
});
