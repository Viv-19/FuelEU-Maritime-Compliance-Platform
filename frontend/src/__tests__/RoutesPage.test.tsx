import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RoutesPage } from '../adapters/ui/RoutesPage';
import * as apiClient from '../adapters/infrastructure/apiClient';
import { RoutesProvider } from '../adapters/ui/context/RoutesContext';

// Mock the API Client
vi.mock('../adapters/infrastructure/apiClient', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
}));

const mockData = [
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

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<RoutesProvider>{ui}</RoutesProvider>);
};

describe('RoutesPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and renders routes data on load', async () => {
    vi.mocked(apiClient.apiGet).mockResolvedValueOnce({ success: true, data: mockData });

    const { container } = renderWithProvider(<RoutesPage />);

    // Skeleton loading rows should be visible (animate-pulse divs)
    const skeletonElements = container.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);

    await waitFor(() => {
      expect(screen.getByText('R001')).toBeInTheDocument();
      expect(screen.getByText('R002')).toBeInTheDocument();
    });
  });

  it('shows ship-level KPI cards (unique ship count, not route count)', async () => {
    vi.mocked(apiClient.apiGet).mockResolvedValueOnce({ success: true, data: mockData });

    renderWithProvider(<RoutesPage />);

    await waitFor(() => {
      expect(screen.getByText('Total Ships')).toBeInTheDocument();
      expect(screen.getByText('Surplus Ships')).toBeInTheDocument();
      expect(screen.getByText('Deficit Ships')).toBeInTheDocument();
    });

    // Two unique ships from mock data
    const totalShipsCard = screen.getByText('Total Ships').closest('div')!.parentElement!;
    expect(totalShipsCard).toHaveTextContent('2');
  });

  it('filters data appropriately using dropdowns', async () => {
    vi.mocked(apiClient.apiGet).mockResolvedValueOnce({ success: true, data: mockData });

    renderWithProvider(<RoutesPage />);

    await waitFor(() => {
      expect(screen.getByText('R001')).toBeInTheDocument();
    });

    // Select Container Only
    const vesselFilter = screen.getByLabelText(/Vessel Type/i);
    fireEvent.change(vesselFilter, { target: { value: 'Container' } });

    await waitFor(() => {
      expect(screen.getByText('R001')).toBeInTheDocument();
      expect(screen.queryByText('R002')).not.toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    vi.mocked(apiClient.apiGet).mockRejectedValueOnce(new Error('Network disconnected'));

    renderWithProvider(<RoutesPage />);

    await waitFor(() => {
      expect(screen.getByText(/Network disconnected/i)).toBeInTheDocument();
      expect(screen.getByText(/Retry/i)).toBeInTheDocument();
    });
  });
});
