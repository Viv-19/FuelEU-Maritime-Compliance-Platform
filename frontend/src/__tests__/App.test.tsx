import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App', () => {
  it('renders the dashboard heading', () => {
    render(<App />);
    expect(screen.getByText('FuelEU Maritime Dashboard')).toBeDefined();
  });

  it('renders all navigation buttons', () => {
    render(<App />);
    expect(screen.getByText('Routes')).toBeDefined();
    expect(screen.getByText('Compare')).toBeDefined();
    expect(screen.getByText('Banking')).toBeDefined();
    expect(screen.getByText('Pooling')).toBeDefined();
  });
});
