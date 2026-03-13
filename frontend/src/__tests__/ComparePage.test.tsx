import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ComparePage } from '../adapters/ui/ComparePage';
import * as apiClient from '../adapters/infrastructure/apiClient';

vi.mock('../adapters/infrastructure/apiClient', () => ({
  apiGet: vi.fn(),
}));

const mockData = [
  { routeId: 'R001', ghgIntensity: 91.0, isBaseline: true },
  { routeId: 'R002', ghgIntensity: 88.0, isBaseline: false },
  { routeId: 'R003', ghgIntensity: 95.0, isBaseline: false }
];

describe('ComparePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and processes comparison data correctly', async () => {
    vi.mocked(apiClient.apiGet).mockResolvedValueOnce({ success: true, data: mockData });

    render(<ComparePage />);

    expect(screen.getByText(/Loading comparison data.../i)).toBeInTheDocument();

    await waitFor(() => {
      // Check if data is rendered in the table
      expect(screen.getByText('R001')).toBeInTheDocument();
      expect(screen.getByText('-3.30%')).toBeInTheDocument(); // Processed diff R002 vs R001
      expect(screen.getAllByText('✅').length).toBe(1);    // R002 is compliant
      expect(screen.getAllByText('❌').length).toBe(2);    // R001 & R003 are not
    });
  });

  it('shows warning when no baseline route is detected', async () => {
    const noBaselineData = mockData.map(r => ({ ...r, isBaseline: false }));
    vi.mocked(apiClient.apiGet).mockResolvedValueOnce({ success: true, data: noBaselineData });

    render(<ComparePage />);

    await waitFor(() => {
      expect(screen.getByText(/No baseline route set/i)).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    vi.mocked(apiClient.apiGet).mockRejectedValueOnce(new Error('Connection failed'));

    render(<ComparePage />);

    await waitFor(() => {
      expect(screen.getByText(/Connection failed/i)).toBeInTheDocument();
    });
  });
});
