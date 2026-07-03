import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GoalSelector } from '@/components/sections/programs/GoalSelector';

/**
 * GoalSelector — pill cluster for program filtering.
 *
 * Tests:
 *  - Renders all 5 goal options
 *  - Active pill uses accent bg + black text (aria-checked=true)
 *  - onChange fires with correct value on click
 *  - Keyboard accessible (role="radio", aria-checked)
 */

describe('GoalSelector', () => {
  it('renders all 5 goal options', () => {
    render(<GoalSelector value="muscle" onChange={() => {}} />);

    expect(screen.getByRole('radiogroup', { name: /filter programs by goal/i })).toBeInTheDocument();

    const radios = screen.getAllByRole('radio');
    expect(radios).toHaveLength(5);

    expect(screen.getByText('Muscle Gain')).toBeInTheDocument();
    expect(screen.getByText('Fat Loss')).toBeInTheDocument();
    expect(screen.getByText('General Fitness')).toBeInTheDocument();
    expect(screen.getByText('Athletic Perf.')).toBeInTheDocument();
    expect(screen.getByText('Rehab / Mobility')).toBeInTheDocument();
  });

  it('marks the active option as checked', () => {
    render(<GoalSelector value="fat" onChange={() => {}} />);

    const fatRadio = screen.getByRole('radio', { name: /fat loss/i });
    expect(fatRadio).toHaveAttribute('aria-checked', 'true');

    const muscleRadio = screen.getByRole('radio', { name: /muscle gain/i });
    expect(muscleRadio).toHaveAttribute('aria-checked', 'false');
  });

  it('calls onChange with the new goal when an option is clicked', () => {
    const onChange = vi.fn();
    render(<GoalSelector value="muscle" onChange={onChange} />);

    fireEvent.click(screen.getByText('Fat Loss'));
    expect(onChange).toHaveBeenCalledWith('fat');

    fireEvent.click(screen.getByText('Rehab / Mobility'));
    expect(onChange).toHaveBeenCalledWith('rehab');
  });

  it('all pills have 44px+ touch target (min-h-11 class)', () => {
    render(<GoalSelector value="muscle" onChange={() => {}} />);

    const radios = screen.getAllByRole('radio');
    radios.forEach((radio) => {
      expect(radio.className).toContain('min-h-11');
    });
  });

  it('all pills are focusable (native <button> elements)', () => {
    render(<GoalSelector value="muscle" onChange={() => {}} />);

    const radios = screen.getAllByRole('radio');
    radios.forEach((radio) => {
      // Native <button> elements are inherently focusable (tabindex=0 by default)
      expect(radio.tagName).toBe('BUTTON');
      // Verify focus actually works
      radio.focus();
      expect(radio).toHaveFocus();
    });
  });
});
