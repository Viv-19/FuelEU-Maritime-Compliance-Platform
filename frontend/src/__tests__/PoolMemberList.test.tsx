import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PoolMemberList, PoolMemberItem } from '../adapters/ui/PoolMemberList';

const mockMembers: PoolMemberItem[] = [
  { shipId: 'Ship-A', cbBefore: 6000 },
  { shipId: 'Ship-B', cbBefore: -4000 },
  { shipId: 'Ship-C', cbBefore: -1000, cbAfter: 0 }
];

describe('PoolMemberList', () => {
  it('renders all ship rows correctly', () => {
    render(<PoolMemberList members={mockMembers} />);

    expect(screen.getByText('Ship-A')).toBeInTheDocument();
    expect(screen.getByText('Ship-B')).toBeInTheDocument();
    expect(screen.getByText('Ship-C')).toBeInTheDocument();
  });

  it('shows dash for missing cbAfter values', () => {
    render(<PoolMemberList members={mockMembers} />);

    // Ship-A and Ship-B have no cbAfter so show dashes in both cbAfter and Change columns (2x2 = 4)
    const dashes = screen.getAllByText('—');
    expect(dashes.length).toBe(4);

  });

  it('shows cbAfter value when present', () => {
    render(<PoolMemberList members={mockMembers} />);

    // Ship-C has cbAfter = 0
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('shows empty state when no members', () => {
    render(<PoolMemberList members={[]} />);

    expect(screen.getByText(/Select ships to create a compliance pool/i)).toBeInTheDocument();
  });
});
