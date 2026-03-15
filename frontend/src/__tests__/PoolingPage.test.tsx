import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PoolingPage } from '../adapters/ui/PoolingPage';
import * as apiClient from '../adapters/infrastructure/apiClient';
import { RoutesProvider } from '../adapters/ui/context/RoutesContext';

vi.mock('../adapters/infrastructure/apiClient', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
}));

const mockShips = [
  { shipId: 'Ship-A', cb_before: 6000 },
  { shipId: 'Ship-B', cb_before: -4000 },
  { shipId: 'Ship-C', cb_before: -1000 }
];

const mockPoolResult = [
  { shipId: 'Ship-A', cb_before: 6000, cb_after: 1000 },
  { shipId: 'Ship-B', cb_before: -4000, cb_after: 0 },
  { shipId: 'Ship-C', cb_before: -1000, cb_after: 0 }
];

// Mock routes data for the RoutesProvider
const mockRoutes = [
  { routeId: 'R001', shipId: 'SHIP001', vesselType: 'Container', fuelType: 'HFO', year: 2024, ghgIntensity: 85.0, fuelConsumption: 5000, distance: 12000, totalEmissions: 4500, isBaseline: true }
];

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<RoutesProvider>{ui}</RoutesProvider>);
};

describe('PoolingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads and displays ship compliance data', async () => {
    // First call is RoutesContext fetching routes, second is PoolingPage fetching CB
    vi.mocked(apiClient.apiGet)
      .mockResolvedValueOnce({ success: true, data: mockRoutes })
      .mockResolvedValueOnce({ success: true, data: mockShips });

    renderWithProvider(<PoolingPage />);

    await waitFor(() => {
      expect(screen.getByText('Ship-A')).toBeInTheDocument();
      expect(screen.getByText('Ship-B')).toBeInTheDocument();
      expect(screen.getByText('Ship-C')).toBeInTheDocument();
    });
  });

  it('shows valid pool when total CB >= 0', async () => {
    vi.mocked(apiClient.apiGet)
      .mockResolvedValueOnce({ success: true, data: mockRoutes })
      .mockResolvedValueOnce({ success: true, data: mockShips });

    renderWithProvider(<PoolingPage />);

    await waitFor(() => {
      expect(screen.getByText('Valid Pool')).toBeInTheDocument();
      expect(screen.getByText('Create Pool')).not.toBeDisabled();
    });
  });

  it('shows invalid pool when total CB < 0', async () => {
    const invalidShips = [
      { shipId: 'Ship-A', cb_before: 1000 },
      { shipId: 'Ship-B', cb_before: -4000 }
    ];
    vi.mocked(apiClient.apiGet)
      .mockResolvedValueOnce({ success: true, data: mockRoutes })
      .mockResolvedValueOnce({ success: true, data: invalidShips });

    renderWithProvider(<PoolingPage />);

    await waitFor(() => {
      expect(screen.getByText('Invalid Pool')).toBeInTheDocument();
      expect(screen.getByText('Create Pool')).toBeDisabled();
    });
  });

  it('creates pool and updates cb_after values', async () => {
    vi.mocked(apiClient.apiGet)
      .mockResolvedValueOnce({ success: true, data: mockRoutes })
      .mockResolvedValueOnce({ success: true, data: mockShips });
    vi.mocked(apiClient.apiPost).mockResolvedValueOnce({ success: true, data: mockPoolResult });

    renderWithProvider(<PoolingPage />);

    await waitFor(() => {
      expect(screen.getByText('Create Pool')).not.toBeDisabled();
    });

    fireEvent.click(screen.getByText('Create Pool'));

    await waitFor(() => {
      expect(screen.getByText('1,000')).toBeInTheDocument();
      expect(apiClient.apiPost).toHaveBeenCalledTimes(1);
    });
  });

  it('handles API errors gracefully', async () => {
    vi.mocked(apiClient.apiGet)
      .mockResolvedValueOnce({ success: true, data: mockRoutes })
      .mockRejectedValueOnce(new Error('Server down'));

    renderWithProvider(<PoolingPage />);

    await waitFor(() => {
      expect(screen.getByText(/Server down/i)).toBeInTheDocument();
    });
  });
});
