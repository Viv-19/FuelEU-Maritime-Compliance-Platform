import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PoolSummary } from '../adapters/ui/PoolSummary';

describe('PoolSummary', () => {
  it('renders valid pool indicator when totalCB >= 0', () => {
    render(<PoolSummary totalCBBefore={1000} totalCBAfter={null} isValid={true} />);

    expect(screen.getByText('VERIFIED POOL')).toBeInTheDocument();
    expect(screen.getByText('+1,000')).toBeInTheDocument();
  });

  it('renders invalid pool indicator when totalCB < 0', () => {
    render(<PoolSummary totalCBBefore={-500} totalCBAfter={null} isValid={false} />);

    expect(screen.getByText('INVALID POOL')).toBeInTheDocument();
  });

  it('displays CB After when provided', () => {
    render(<PoolSummary totalCBBefore={1000} totalCBAfter={1000} isValid={true} />);

    expect(screen.getAllByText('+1,000').length).toBe(2);
  });

  it('shows dash when CB After is null', () => {
    render(<PoolSummary totalCBBefore={1000} totalCBAfter={null} isValid={true} />);

    expect(screen.getByText('—')).toBeInTheDocument();
  });
});
