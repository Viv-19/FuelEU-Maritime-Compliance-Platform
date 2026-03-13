import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BankingPage } from '../adapters/ui/BankingPage';
import * as apiClient from '../adapters/infrastructure/apiClient';

vi.mock('../adapters/infrastructure/apiClient', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
}));

describe('BankingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads and displays compliance balance', async () => {
    vi.mocked(apiClient.apiGet).mockResolvedValueOnce({
      success: true,
      data: { shipId: 'SHIP001', year: 2024, complianceBalance: 4500 }
    });

    render(<BankingPage />);

    expect(screen.getByText(/Loading compliance balance.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Compliance Banking')).toBeInTheDocument();
      // 4,500 appears in both CB Before and CB After cards initially
      expect(screen.getAllByText('4,500').length).toBe(2);
    });
  });

  it('enables Bank Surplus button when CB > 0', async () => {
    vi.mocked(apiClient.apiGet).mockResolvedValueOnce({
      success: true,
      data: { shipId: 'SHIP001', year: 2024, complianceBalance: 4500 }
    });

    render(<BankingPage />);

    await waitFor(() => {
      const bankBtn = screen.getByText('Bank Surplus');
      expect(bankBtn).not.toBeDisabled();

      const applyBtn = screen.getByText('Apply Banked Surplus');
      expect(applyBtn).toBeDisabled();
    });
  });

  it('banks surplus and updates UI state correctly', async () => {
    vi.mocked(apiClient.apiGet).mockResolvedValueOnce({
      success: true,
      data: { shipId: 'SHIP001', year: 2024, complianceBalance: 4500 }
    });
    vi.mocked(apiClient.apiPost).mockResolvedValueOnce({ success: true, data: { bankedAmount: 4500 } });

    render(<BankingPage />);

    await waitFor(() => {
      expect(screen.getByText('Bank Surplus')).not.toBeDisabled();
    });

    fireEvent.click(screen.getByText('Bank Surplus'));

    await waitFor(() => {
      // After banking: cbBefore=0, bankedAmount=4500, cbAfter=0
      expect(screen.getAllByText('0').length).toBeGreaterThanOrEqual(2);
      expect(screen.getByText('4,500')).toBeInTheDocument();
      // Bank button should now be disabled (cbBefore is 0)
      expect(screen.getByText('Bank Surplus')).toBeDisabled();
    });
  });

  it('handles API errors gracefully', async () => {
    vi.mocked(apiClient.apiGet).mockRejectedValueOnce(new Error('Network error'));

    render(<BankingPage />);

    await waitFor(() => {
      expect(screen.getByText(/Network error/i)).toBeInTheDocument();
    });
  });

  it('disables both buttons when CB is zero and no banked amount', async () => {
    vi.mocked(apiClient.apiGet).mockResolvedValueOnce({
      success: true,
      data: { shipId: 'SHIP001', year: 2024, complianceBalance: 0 }
    });

    render(<BankingPage />);

    await waitFor(() => {
      expect(screen.getByText('Bank Surplus')).toBeDisabled();
      expect(screen.getByText('Apply Banked Surplus')).toBeDisabled();
    });
  });
});
