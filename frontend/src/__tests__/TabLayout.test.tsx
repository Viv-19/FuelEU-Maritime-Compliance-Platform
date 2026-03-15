import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { TabLayout } from '../shared/components/TabLayout';
import { RoutesPage } from '../adapters/ui/RoutesPage';
import { ComparePage } from '../adapters/ui/ComparePage';
import { RoutesProvider } from '../adapters/ui/context/RoutesContext';
import * as apiClient from '../adapters/infrastructure/apiClient';

vi.mock('../adapters/infrastructure/apiClient', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
}));

describe('TabLayout Navigation', () => {
  it('renders all tab links', () => {
    render(
      <MemoryRouter initialEntries={['/routes']}>
        <TabLayout>
          <div>Test Child</div>
        </TabLayout>
      </MemoryRouter>
    );

    expect(screen.getByText('FuelEU Maritime Dashboard')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Routes' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Compare' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Banking' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Pooling' })).toBeInTheDocument();
  });

  it('navigates to different route upon tab click', () => {
    vi.mocked(apiClient.apiGet).mockResolvedValue({ success: true, data: [] });

    render(
      <MemoryRouter initialEntries={['/routes']}>
        <RoutesProvider>
          <TabLayout>
            <Routes>
              <Route path="/routes" element={<RoutesPage />} />
              <Route path="/compare" element={<ComparePage />} />
            </Routes>
          </TabLayout>
        </RoutesProvider>
      </MemoryRouter>
    );

    // Initial route should render RoutesPage
    expect(screen.getByText('Routes Dashboard')).toBeInTheDocument();

    // Click on Compare tab
    const compareTab = screen.getByRole('link', { name: 'Compare' });
    fireEvent.click(compareTab);

    // Should now render ComparePage
    expect(screen.getByText('Compare Routes Dashboard')).toBeInTheDocument();
  });
});
