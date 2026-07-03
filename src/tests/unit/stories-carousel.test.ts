import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

/**
 * useStoriesCarousel — drag-to-swipe carousel state machine.
 *
 * Reference: Skills KB §16 (testing patterns — vi.hoisted, fake timers,
 * mock refs). The hook heavily uses refs internally, so we test the
 * public API: currentIndex, goTo, next, prev.
 */

// Mock useReducedMotion — false by default
vi.mock('@/hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
}));

// Dynamically import after mock is set
const { useStoriesCarousel } = await import('@/hooks/useStoriesCarousel');

describe('useStoriesCarousel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts on index 0 with 0 translateX', () => {
    const { result } = renderHook(() =>
      useStoriesCarousel({ cardCount: 6 }),
    );

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.trackX).toBe(0);
    expect(result.current.isDragging).toBe(false);
  });

  it('goTo jumps to a specific index (clamped)', () => {
    const { result } = renderHook(() =>
      useStoriesCarousel({ cardCount: 6 }),
    );

    act(() => result.current.goTo(3));
    expect(result.current.currentIndex).toBe(3);

    // Negative clamps to 0
    act(() => result.current.goTo(-5));
    expect(result.current.currentIndex).toBe(0);

    // Out of bounds clamps to cardCount - 1
    act(() => result.current.goTo(99));
    expect(result.current.currentIndex).toBe(5);
  });

  it('next wraps from last to first', () => {
    const { result } = renderHook(() =>
      useStoriesCarousel({ cardCount: 6 }),
    );

    act(() => result.current.goTo(5));
    expect(result.current.currentIndex).toBe(5);

    act(() => result.current.next());
    expect(result.current.currentIndex).toBe(0);
  });

  it('prev wraps from first to last', () => {
    const { result } = renderHook(() =>
      useStoriesCarousel({ cardCount: 6 }),
    );

    expect(result.current.currentIndex).toBe(0);

    act(() => result.current.prev());
    expect(result.current.currentIndex).toBe(5);
  });

  it('auto-advances every 4.5s by default', () => {
    const { result } = renderHook(() =>
      useStoriesCarousel({ cardCount: 6, autoAdvanceMs: 4500 }),
    );

    expect(result.current.currentIndex).toBe(0);

    // Advance 4.5s — should auto-advance to next
    act(() => {
      vi.advanceTimersByTime(4500);
    });
    expect(result.current.currentIndex).toBe(1);

    // Another 4.5s
    act(() => {
      vi.advanceTimersByTime(4500);
    });
    expect(result.current.currentIndex).toBe(2);
  });

  it('does not auto-advance when autoAdvanceMs is 0', () => {
    const { result } = renderHook(() =>
      useStoriesCarousel({ cardCount: 6, autoAdvanceMs: 0 }),
    );

    act(() => {
      vi.advanceTimersByTime(20000);
    });

    expect(result.current.currentIndex).toBe(0);
  });

  it('does not auto-advance when cardCount is 1', () => {
    const { result } = renderHook(() =>
      useStoriesCarousel({ cardCount: 1, autoAdvanceMs: 4500 }),
    );

    act(() => {
      vi.advanceTimersByTime(20000);
    });

    expect(result.current.currentIndex).toBe(0);
  });

  it('returns trackRef and viewportRef', () => {
    const { result } = renderHook(() =>
      useStoriesCarousel({ cardCount: 6 }),
    );

    expect(result.current.trackRef).toBeDefined();
    expect(result.current.viewportRef).toBeDefined();
    expect(result.current.trackRef.current).toBeNull();
    expect(result.current.viewportRef.current).toBeNull();
  });

  it('exposes isPaused state', () => {
    const { result } = renderHook(() =>
      useStoriesCarousel({ cardCount: 6 }),
    );

    expect(typeof result.current.isPaused).toBe('boolean');
    expect(result.current.isPaused).toBe(false);
  });
});
