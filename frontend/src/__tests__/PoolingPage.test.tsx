import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PoolingPage } from '../adapters/ui/PoolingPage';
import * as apiClient from '../adapters/infrastructure/apiClient';

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

describe('PoolingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads and displays ship compliance data', async () => {
    vi.mocked(apiClient.apiGet).mockResolvedValueOnce({ success: true, data: mockShips });

    render(<PoolingPage />);

    expect(screen.getByText(/Loading ship compliance data.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Ship-A')).toBeInTheDocument();
      expect(screen.getByText('Ship-B')).toBeInTheDocument();
      expect(screen.getByText('Ship-C')).toBeInTheDocument();
    });
  });

  it('shows valid pool when total CB >= 0', async () => {
    vi.mocked(apiClient.apiGet).mockResolvedValueOnce({ success: true, data: mockShips });

    render(<PoolingPage />);

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
    vi.mocked(apiClient.apiGet).mockResolvedValueOnce({ success: true, data: invalidShips });

    render(<PoolingPage />);

    await waitFor(() => {
      expect(screen.getByText('Invalid Pool')).toBeInTheDocument();
      expect(screen.getByText('Create Pool')).toBeDisabled();
    });
  });

  it('creates pool and updates cb_after values', async () => {
    vi.mocked(apiClient.apiGet).mockResolvedValueOnce({ success: true, data: mockShips });
    vi.mocked(apiClient.apiPost).mockResolvedValueOnce({ success: true, data: mockPoolResult });

    render(<PoolingPage />);

    await waitFor(() => {
      expect(screen.getByText('Create Pool')).not.toBeDisabled();
    });

    fireEvent.click(screen.getByText('Create Pool'));

    await waitFor(() => {
      // After pooling, Ship-A has cb_after=1000
      expect(screen.getByText('1,000')).toBeInTheDocument();
      // Ship-B and Ship-C have cb_after=0
      expect(apiClient.apiPost).toHaveBeenCalledTimes(1);
    });
  });

  it('handles API errors gracefully', async () => {
    vi.mocked(apiClient.apiGet).mockRejectedValueOnce(new Error('Server down'));

    render(<PoolingPage />);

    await waitFor(() => {
      expect(screen.getByText(/Server down/i)).toBeInTheDocument();
    });
  });
});
