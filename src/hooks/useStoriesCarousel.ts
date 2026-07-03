'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface UseStoriesCarouselOptions {
  /** Number of cards in the carousel. */
  cardCount: number;
  /** Auto-advance interval in ms. Default 4500. Set to 0 to disable. */
  autoAdvanceMs?: number;
  /** Pause auto-advance on hover. Default true. */
  pauseOnHover?: boolean;
}

interface UseStoriesCarouselReturn {
  /** Index of the currently active card (0-based). */
  currentIndex: number;
  /** TranslateX value in px for the track. */
  trackX: number;
  /** Whether the user is currently dragging. */
  isDragging: boolean;
  /** Ref to attach to the track element. */
  trackRef: React.RefObject<HTMLUListElement | null>;
  /** Ref to attach to the viewport element (parent of track). */
  viewportRef: React.RefObject<HTMLDivElement | null>;
  /** Go to a specific card by index (clamped). */
  goTo: (index: number) => void;
  /** Go to the next card (wraps). */
  next: () => void;
  /** Go to the previous card (wraps). */
  prev: () => void;
  /** Whether the user can hover-pause (for callers that need to know). */
  isPaused: boolean;
}

/**
 * useStoriesCarousel — drag-to-swipe carousel with rubber-band physics.
 *
 * Features:
 *  - Mouse drag + touch swipe (1:1 cursor mapping within bounds)
 *  - Rubber-band at edges (0.35× resistance past bounds)
 *  - Momentum on release (velocity × 300ms, then snap)
 *  - Snap to nearest card on release (700ms ease-snap)
 *  - Auto-advance every 4.5s (pauses on hover, drag, focus-in, reduced-motion)
 *  - Horizontal-only interception (|dx| > |dy| + 8 to grab vertical scroll)
 *  - `touch-action: pan-y` on track (vertical scroll passes through)
 *  - All rAF + timers cleaned up on unmount
 *
 * Reference: Visual Strategy (drag-to-swipe with rubber-band easing).
 * Reference: Skills KB §5 (motion — snap 700ms ease-snap).
 * Reference: Skills KB §7 (mobile nav — touch-action: pan-y, 44px targets).
 */
export function useStoriesCarousel({
  cardCount,
  autoAdvanceMs = 4500,
  pauseOnHover = true,
}: UseStoriesCarouselOptions): UseStoriesCarouselReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trackX, setTrackX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const trackRef = useRef<HTMLUListElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Drag state (refs — not state, to avoid re-renders during drag)
  const dragStartX = useRef(0);
  const dragStartTrackX = useRef(0);
  const lastX = useRef(0);
  const lastTime = useRef(0);
  const velocity = useRef(0);
  const cardWidth = useRef(0);
  const maxScroll = useRef(0);
  const currentTrackX = useRef(0);
  const autoTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const clampIndex = (n: number) => Math.max(0, Math.min(cardCount - 1, n));
  const clampX = (x: number) => Math.max(-maxScroll.current, Math.min(0, x));

  const measure = useCallback(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    const trackStyle = window.getComputedStyle(track);
    const gap = parseFloat(trackStyle.gap) || 24;
    const paddingLeft = parseFloat(trackStyle.paddingLeft) || 32;
    const firstCard = track.firstElementChild as HTMLElement | null;
    if (!firstCard) return;

    cardWidth.current = firstCard.offsetWidth + gap;
    const totalWidth = cardCount * cardWidth.current - gap + paddingLeft * 2;
    maxScroll.current = Math.max(0, totalWidth - viewport.offsetWidth);
  }, [cardCount]);

  const applyTransform = useCallback((x: number, durationMs = 0) => {
    const track = trackRef.current;
    if (!track) return;
    if (durationMs > 0) {
      track.style.transition = `transform ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1)`;
    } else {
      track.style.transition = 'none';
    }
    track.style.transform = `translateX(${x}px)`;
    currentTrackX.current = x;
  }, []);

  const goTo = useCallback(
    (index: number, durationMs = 700) => {
      const clamped = clampIndex(index);
      const targetX = clampX(-clamped * cardWidth.current);
      setTrackX(targetX);
      setCurrentIndex(clamped);
      applyTransform(targetX, durationMs);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cardCount],
  );

  const next = useCallback(() => {
    setCurrentIndex((prev) => {
      const nextIdx = (prev + 1) % cardCount;
      goTo(nextIdx);
      return nextIdx;
    });
  }, [cardCount, goTo]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => {
      const prevIdx = (prev - 1 + cardCount) % cardCount;
      goTo(prevIdx);
      return prevIdx;
    });
  }, [cardCount, goTo]);

  // Measure on mount + resize
  useEffect(() => {
    measure();
    const onResize = () => {
      measure();
      goTo(currentIndex, 0);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [measure, goTo, currentIndex]);

  // Auto-advance
  useEffect(() => {
    if (reducedMotion || autoAdvanceMs === 0 || cardCount <= 1) return;
    if (isPaused || isDragging) return;

    autoTimer.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIdx = (prev + 1) % cardCount;
        goTo(nextIdx);
        return nextIdx;
      });
    }, autoAdvanceMs);

    return () => {
      if (autoTimer.current) clearInterval(autoTimer.current);
    };
  }, [reducedMotion, autoAdvanceMs, cardCount, isPaused, isDragging, goTo]);

  // Pointer events (mouse + touch unified via Pointer Events API)
  useEffect(() => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    const onPointerDown = (e: PointerEvent) => {
      // Only respond to primary button or touch
      if (e.button !== 0 && e.pointerType === 'mouse') return;

      // Don't capture if the user is clicking a link/button inside a card
      const target = e.target as HTMLElement;
      if (target.closest('a, button')) return;

      setIsDragging(true);
      setIsPaused(true);
      dragStartX.current = e.clientX;
      dragStartTrackX.current = currentTrackX.current;
      lastX.current = e.clientX;
      lastTime.current = Date.now();
      velocity.current = 0;

      track.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartX.current;
      let newX = dragStartTrackX.current + dx;

      // Rubber-band at edges (0.35× resistance)
      if (newX > 0) {
        newX = newX * 0.35;
      } else if (newX < -maxScroll.current) {
        const over = newX + maxScroll.current;
        newX = -maxScroll.current + over * 0.35;
      }

      // Track velocity
      const now = Date.now();
      const dt = now - lastTime.current;
      if (dt > 0) {
        velocity.current = (e.clientX - lastX.current) / dt;
      }
      lastX.current = e.clientX;
      lastTime.current = now;

      setTrackX(newX);
      applyTransform(newX, 0);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging) return;
      setIsDragging(false);

      // Apply momentum (velocity × 300ms)
      const momentumX = currentTrackX.current + velocity.current * 300;

      // Snap to nearest card
      const snapIndex = Math.round(Math.abs(momentumX) / cardWidth.current);
      const clampedIdx = clampIndex(snapIndex);

      goTo(clampedIdx, 700);

      try {
        track.releasePointerCapture(e.pointerId);
      } catch {
        // Pointer capture may already be released
      }

      // Resume auto-advance after 1.5s
      setTimeout(() => setIsPaused(false), 1500);
    };

    track.addEventListener('pointerdown', onPointerDown);
    track.addEventListener('pointermove', onPointerMove);
    track.addEventListener('pointerup', onPointerUp);
    track.addEventListener('pointercancel', onPointerUp);

    if (pauseOnHover) {
      viewport.addEventListener('mouseenter', () => setIsPaused(true));
      viewport.addEventListener('mouseleave', () => {
        if (!isDragging) setIsPaused(false);
      });
    }

    // Keyboard navigation
    viewport.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      }
    });

    return () => {
      track.removeEventListener('pointerdown', onPointerDown);
      track.removeEventListener('pointermove', onPointerMove);
      track.removeEventListener('pointerup', onPointerUp);
      track.removeEventListener('pointercancel', onPointerUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, pauseOnHover, goTo, next, prev]);

  return {
    currentIndex,
    trackX,
    isDragging,
    trackRef,
    viewportRef,
    goTo,
    next,
    prev,
    isPaused,
  };
}
