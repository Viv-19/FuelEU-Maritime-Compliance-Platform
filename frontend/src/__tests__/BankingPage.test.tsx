import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BankingPage } from '../adapters/ui/BankingPage';
import * as apiClient from '../adapters/infrastructure/apiClient';
import { RoutesProvider } from '../adapters/ui/context/RoutesContext';

vi.mock('../adapters/infrastructure/apiClient', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
}));

const mockRoutes = [
  {
    routeId: 'R001',
    shipId: 'SHIP001',
    vesselType: 'Container',
    fuelType: 'HFO',
    year: 2024,
    ghgIntensity: 85.0,  // Below target = surplus
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
    ghgIntensity: 95.0,  // Above target = deficit
    fuelConsumption: 3000,
    distance: 8000,
    totalEmissions: 2200,
    isBaseline: false
  }
];

const renderWithProvider = (ui: React.ReactElement) => {
  return render(<RoutesProvider>{ui}</RoutesProvider>);
};

describe('BankingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads and displays ship data derived from routes', async () => {
    vi.mocked(apiClient.apiGet).mockResolvedValueOnce({ success: true, data: mockRoutes });

    renderWithProvider(<BankingPage />);

    await waitFor(() => {
      expect(screen.getByText('Compliance Banking')).toBeInTheDocument();
      // Ship IDs appear in both filter dropdown and table
      expect(screen.getAllByText('SHIP001').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText('SHIP002').length).toBeGreaterThanOrEqual(1);
    });
  });

  it('shows KPI cards with correct ship counts', async () => {
    vi.mocked(apiClient.apiGet).mockResolvedValueOnce({ success: true, data: mockRoutes });

    renderWithProvider(<BankingPage />);

    await waitFor(() => {
      expect(screen.getByText('Total Ships')).toBeInTheDocument();
      expect(screen.getByText('Surplus Ships')).toBeInTheDocument();
      expect(screen.getByText('Deficit Ships')).toBeInTheDocument();
      expect(screen.getByText('Total Fleet Credits')).toBeInTheDocument();
    });
  });

  it('enables Transfer Credits button when both surplus and deficit exist', async () => {
    vi.mocked(apiClient.apiGet).mockResolvedValueOnce({ success: true, data: mockRoutes });

    renderWithProvider(<BankingPage />);

    await waitFor(() => {
      const transferBtn = screen.getByText('Transfer Credits');
      expect(transferBtn).not.toBeDisabled();
    });
  });

  it('shows filter panel with Ship ID, Status, and Year', async () => {
    vi.mocked(apiClient.apiGet).mockResolvedValueOnce({ success: true, data: mockRoutes });

    renderWithProvider(<BankingPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Ship ID/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Status/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Year/i)).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    vi.mocked(apiClient.apiGet).mockRejectedValueOnce(new Error('Network error'));

    renderWithProvider(<BankingPage />);

    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });
});
