import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ApplyButton } from '../adapters/ui/ApplyButton';

describe('ApplyButton', () => {
  it('renders enabled when not disabled', () => {
    const onApply = vi.fn();
    render(<ApplyButton disabled={false} onApply={onApply} />);

    const btn = screen.getByText('Apply Banked Surplus');
    expect(btn).toBeInTheDocument();
    expect(btn).not.toBeDisabled();
  });

  it('renders disabled when disabled prop is true', () => {
    const onApply = vi.fn();
    render(<ApplyButton disabled={true} onApply={onApply} />);

    const btn = screen.getByText('Apply Banked Surplus');
    expect(btn).toBeDisabled();
  });

  it('calls onApply when clicked', () => {
    const onApply = vi.fn();
    render(<ApplyButton disabled={false} onApply={onApply} />);

    fireEvent.click(screen.getByText('Apply Banked Surplus'));
    expect(onApply).toHaveBeenCalledTimes(1);
  });

  it('does not call onApply when disabled', () => {
    const onApply = vi.fn();
    render(<ApplyButton disabled={true} onApply={onApply} />);

    fireEvent.click(screen.getByText('Apply Banked Surplus'));
    expect(onApply).not.toHaveBeenCalled();
  });
});
