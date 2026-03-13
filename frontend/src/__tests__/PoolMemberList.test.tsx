import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PoolMemberList } from '../adapters/ui/PoolMemberList';
import { PoolMember } from '../core/domain/PoolMember';

const mockMembers: PoolMember[] = [
  { shipId: 'Ship-A', cb_before: 6000 },
  { shipId: 'Ship-B', cb_before: -4000 },
  { shipId: 'Ship-C', cb_before: -1000, cb_after: 0 }
];

describe('PoolMemberList', () => {
  it('renders all ship rows correctly', () => {
    render(<PoolMemberList members={mockMembers} />);

    expect(screen.getByText('Ship-A')).toBeInTheDocument();
    expect(screen.getByText('Ship-B')).toBeInTheDocument();
    expect(screen.getByText('Ship-C')).toBeInTheDocument();
  });

  it('shows dash for missing cb_after values', () => {
    render(<PoolMemberList members={mockMembers} />);

    // Ship-A and Ship-B have no cb_after so show dashes
    const dashes = screen.getAllByText('—');
    expect(dashes.length).toBe(2);
  });

  it('shows cb_after value when present', () => {
    render(<PoolMemberList members={mockMembers} />);

    // Ship-C has cb_after = 0
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('shows empty state when no members', () => {
    render(<PoolMemberList members={[]} />);

    expect(screen.getByText(/No ship compliance data available/i)).toBeInTheDocument();
  });
});
