import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BankButton } from '../adapters/ui/BankButton';

describe('BankButton', () => {
  it('renders enabled when not disabled', () => {
    const onBank = vi.fn();
    render(<BankButton disabled={false} onBank={onBank} />);

    const btn = screen.getByText('Bank Surplus');
    expect(btn).toBeInTheDocument();
    expect(btn).not.toBeDisabled();
  });

  it('renders disabled when disabled prop is true', () => {
    const onBank = vi.fn();
    render(<BankButton disabled={true} onBank={onBank} />);

    const btn = screen.getByText('Bank Surplus');
    expect(btn).toBeDisabled();
  });

  it('calls onBank when clicked', () => {
    const onBank = vi.fn();
    render(<BankButton disabled={false} onBank={onBank} />);

    fireEvent.click(screen.getByText('Bank Surplus'));
    expect(onBank).toHaveBeenCalledTimes(1);
  });

  it('does not call onBank when disabled', () => {
    const onBank = vi.fn();
    render(<BankButton disabled={true} onBank={onBank} />);

    fireEvent.click(screen.getByText('Bank Surplus'));
    expect(onBank).not.toHaveBeenCalled();
  });
});
