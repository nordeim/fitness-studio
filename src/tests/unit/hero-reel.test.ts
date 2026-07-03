import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useHeroReel } from '@/hooks/useHeroReel';

/**
 * useHeroReel — frame cycling state machine.
 *
 * Reference: Skills KB §16 (testing patterns — vi.hoisted, fake timers).
 */

describe('useHeroReel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts on frame 0 with muted=true', () => {
    const { result } = renderHook(() =>
      useHeroReel({ frameCount: 5, frameDurationMs: 5000 }),
    );

    expect(result.current.currentFrame).toBe(0);
    expect(result.current.muted).toBe(true);
  });

  it('toggleMute flips muted state', () => {
    const { result } = renderHook(() =>
      useHeroReel({ frameCount: 5, frameDurationMs: 5000 }),
    );

    expect(result.current.muted).toBe(true);
    act(() => result.current.toggleMute());
    expect(result.current.muted).toBe(false);
    act(() => result.current.toggleMute());
    expect(result.current.muted).toBe(true);
  });

  it('goTo jumps to a specific frame (clamped)', () => {
    const { result } = renderHook(() =>
      useHeroReel({ frameCount: 5, frameDurationMs: 5000 }),
    );

    act(() => result.current.goTo(3));
    expect(result.current.currentFrame).toBe(3);

    // Negative clamps to 0
    act(() => result.current.goTo(-5));
    expect(result.current.currentFrame).toBe(0);

    // Out of bounds clamps to frameCount - 1
    act(() => result.current.goTo(99));
    expect(result.current.currentFrame).toBe(4);
  });

  it('next wraps from last frame back to 0', () => {
    const { result } = renderHook(() =>
      useHeroReel({ frameCount: 5, frameDurationMs: 5000 }),
    );

    act(() => result.current.goTo(4));
    expect(result.current.currentFrame).toBe(4);

    act(() => result.current.next());
    expect(result.current.currentFrame).toBe(0);
  });

  it('advances frame after frameDurationMs', () => {
    const { result } = renderHook(() =>
      useHeroReel({ frameCount: 5, frameDurationMs: 5000 }),
    );

    // Default IntersectionObserver mock returns isIntersecting=false,
    // but the hook initializes inView=true, so shouldPlay is true.

    // Advance 5000ms — frame should advance
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current.currentFrame).toBe(1);
  });

  it('does not advance when autoAdvance is false', () => {
    const { result } = renderHook(() =>
      useHeroReel({
        frameCount: 5,
        frameDurationMs: 5000,
        autoAdvance: false,
      }),
    );

    expect(result.current.isPlaying).toBe(false);

    // Advance 10 seconds — should not have moved
    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(result.current.currentFrame).toBe(0);
  });

  it('handles frameCount of 1 (no cycling)', () => {
    const { result } = renderHook(() =>
      useHeroReel({ frameCount: 1, frameDurationMs: 5000 }),
    );

    expect(result.current.currentFrame).toBe(0);
    expect(result.current.isPlaying).toBe(false);

    act(() => {
      vi.advanceTimersByTime(10000);
    });

    expect(result.current.currentFrame).toBe(0);
  });

  it('returns a containerRef and frameDurationMs', () => {
    const { result } = renderHook(() =>
      useHeroReel({ frameCount: 5, frameDurationMs: 5000 }),
    );

    expect(result.current.containerRef).toBeDefined();
    expect(result.current.containerRef.current).toBeNull(); // Not attached to DOM in test
    expect(result.current.frameDurationMs).toBe(5000);
  });
});
