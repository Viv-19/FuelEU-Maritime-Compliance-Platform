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
  { shipId: 'Ship-A', cbBefore: 6000 },
  { shipId: 'Ship-B', cbBefore: -4000 },
  { shipId: 'Ship-C', cbBefore: -1000 }
];

const mockPoolResult = {
  totalBefore: 1000,
  totalAfter: 1000,
  members: [
    { shipId: 'Ship-A', cbBefore: 6000, cbAfter: 1000 },
    { shipId: 'Ship-B', cbBefore: -4000, cbAfter: 0 },
    { shipId: 'Ship-C', cbBefore: -1000, cbAfter: 0 }
  ]
};

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
    vi.mocked(apiClient.apiGet).mockImplementation(async (url: string) => {
      if (url.includes('/routes')) return { success: true, data: mockRoutes } as any;
      if (url.includes('/compliance')) return { success: true, data: mockShips } as any;
      return { success: true, data: [] } as any;
    });

    renderWithProvider(<PoolingPage />);

    await waitFor(() => {
      expect(screen.getAllByText('Ship-A').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Ship-B').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Ship-C').length).toBeGreaterThan(0);
    });
  });

  it('selects ships and shows valid pool indicator', async () => {
    vi.mocked(apiClient.apiGet).mockImplementation(async (url: string) => {
      if (url.includes('/routes')) return { success: true, data: mockRoutes } as any;
      if (url.includes('/compliance')) return { success: true, data: mockShips } as any;
      return { success: true, data: [] } as any;
    });

    renderWithProvider(<PoolingPage />);

    await waitFor(() => {
      expect(screen.getAllByText('Ship-A').length).toBeGreaterThan(0);
    });

    // Checkboxes are in the first column, we can click the rows or the checkboxes
    const checkboxes = screen.getAllByRole('checkbox');
    // first checkbox is "select all", next ones are for ships
    fireEvent.click(checkboxes[1]); // Ship-A
    fireEvent.click(checkboxes[2]); // Ship-B

    await waitFor(() => {
      // Total CB = 6000 + -4000 = 2000 >= 0
      expect(screen.getByText('VERIFIED POOL')).toBeInTheDocument();
      expect(screen.getByText('Create Pool')).not.toBeDisabled();
    });
  });

  it('shows invalid pool when total CB < 0', async () => {
    const invalidShips = [
      { shipId: 'Ship-A', cbBefore: 1000 },
      { shipId: 'Ship-B', cbBefore: -4000 }
    ];
    vi.mocked(apiClient.apiGet).mockImplementation(async (url: string) => {
      if (url.includes('/routes')) return { success: true, data: mockRoutes } as any;
      if (url.includes('/compliance')) return { success: true, data: invalidShips } as any;
      return { success: true, data: [] } as any;
    });

    renderWithProvider(<PoolingPage />);

    await waitFor(() => {
      expect(screen.getAllByText('Ship-B').length).toBeGreaterThan(0);
    });

    const checkboxes = screen.getAllByRole('checkbox');
    fireEvent.click(checkboxes[1]); // Ship-A
    fireEvent.click(checkboxes[2]); // Ship-B

    await waitFor(() => {
      // Total CB = 1000 + -4000 = -3000 < 0
      expect(screen.getByText('INVALID POOL')).toBeInTheDocument();
      expect(screen.getByText('Create Pool')).toBeDisabled();
    });
  });

  it('creates pool and shows results', async () => {
    vi.mocked(apiClient.apiGet).mockImplementation(async (url: string) => {
      if (url.includes('/routes')) return { success: true, data: mockRoutes } as any;
      if (url.includes('/compliance')) return { success: true, data: mockShips } as any;
      return { success: true, data: [] } as any;
    });
    
    vi.mocked(apiClient.apiPost).mockResolvedValueOnce({ success: true, data: mockPoolResult });

    renderWithProvider(<PoolingPage />);

    await waitFor(() => {
      expect(screen.getAllByText('Ship-A').length).toBeGreaterThan(0);
    });

    // Select all
    const selectAllCheckbox = screen.getAllByRole('checkbox')[0];
    fireEvent.click(selectAllCheckbox);

    await waitFor(() => {
      expect(screen.getByText('Create Pool')).not.toBeDisabled();
    });

    fireEvent.click(screen.getByText('Create Pool'));

    await waitFor(() => {
      // should display pool results table
      expect(screen.getByText('Pool Results')).toBeInTheDocument();
      expect(apiClient.apiPost).toHaveBeenCalledTimes(1);
    });
  });

  it('handles API errors gracefully', async () => {
    vi.mocked(apiClient.apiGet).mockImplementation(async (url: string) => {
      if (url.includes('/routes')) return { success: true, data: mockRoutes } as any;
      if (url.includes('/compliance')) throw new Error('Server down');
      return { success: true, data: [] } as any;
    });

    renderWithProvider(<PoolingPage />);

    await waitFor(() => {
      expect(screen.getByText(/Server down/i)).toBeInTheDocument();
    });
  });
});
