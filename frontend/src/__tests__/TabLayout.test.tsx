import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { TabLayout } from '../shared/components/TabLayout';
import { RoutesPage } from '../adapters/ui/RoutesPage';
import { ComparePage } from '../adapters/ui/ComparePage';

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
    render(
      <MemoryRouter initialEntries={['/routes']}>
        <TabLayout>
          <Routes>
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/compare" element={<ComparePage />} />
          </Routes>
        </TabLayout>
      </MemoryRouter>
    );

    // Initial route should render RoutesPage
    expect(screen.getByText('Routes Dashboard')).toBeInTheDocument();

    // Click on Compare tab
    const compareTab = screen.getByRole('link', { name: 'Compare' });
    fireEvent.click(compareTab);

    // Should now render ComparePage
    expect(screen.getByText('Compare Intensities')).toBeInTheDocument();
  });
});
