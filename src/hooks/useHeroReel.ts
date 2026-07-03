'use client';
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface UseHeroReelOptions {
  /** Total number of frames in the reel. */
  frameCount: number;
  /** Milliseconds each frame holds before cross-fading to the next. Default 5000. */
  frameDurationMs?: number;
  /** Whether auto-advance is enabled. Default true. */
  autoAdvance?: boolean;
}

interface UseHeroReelReturn {
  /** Index of the currently active frame (0-based). */
  currentFrame: number;
  /** Whether the reel is muted (UI affordance — no audio in v1). */
  muted: boolean;
  /** Whether the reel is currently playing (auto-advancing). Derived, not state. */
  isPlaying: boolean;
  /** Manually jump to a frame by index (clamped). */
  goTo: (index: number) => void;
  /** Advance to the next frame (wraps to 0). */
  next: () => void;
  /** Toggle the muted state. */
  toggleMute: () => void;
  /** Ref to attach to the reel container for IntersectionObserver. */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Frame duration in ms (passed to ReelProgress for CSS animation duration). */
  frameDurationMs: number;
}

/**
 * useHeroReel — cinematic hero reel state machine.
 *
 * Behaviors:
 *  - Cycles through `frameCount` frames every `frameDurationMs` (default 5000ms).
 *  - Cross-fades between frames (handled by ReelFrame CSS, not this hook).
 *  - Pauses auto-advance when:
 *      * `prefers-reduced-motion: reduce` is set
 *      * Container is off-screen (IntersectionObserver, threshold 0.25)
 *      * `autoAdvance` is false
 *  - Mute state is a UI affordance only — no audio in v1.
 *  - All timers cleaned up on unmount.
 *
 * M8 fix: The progress bar is now driven by a CSS `@keyframes progress-fill`
 * animation in the ReelProgress component (using `key={current}` to restart
 * on each frame change). This hook no longer calls `setProgress` every 100ms
 * — it only calls `setCurrentFrame` when the frame advances. This eliminates
 * 10 React re-renders per second.
 *
 * React 19 compliance: `isPlaying` is DERIVED from `shouldPlay`, not synced
 * via setState-in-effect (avoids cascading renders per react-hooks rule).
 *
 * Reference: Skills KB §5 (motion — pause off-screen, respect reduced-motion).
 * Reference: Skills KB §10 (hooks pattern from nextjs16-react19-next-auth5-drizzle-orm).
 */
export function useHeroReel({
  frameCount,
  frameDurationMs = 5000,
  autoAdvance = true,
}: UseHeroReelOptions): UseHeroReelReturn {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [muted, setMuted] = useState(true);
  const [inView, setInView] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Clamp helper
  const clamp = (n: number, max: number) => Math.max(0, Math.min(max - 1, n));

  const goTo = (index: number) => {
    setCurrentFrame(clamp(index, frameCount));
  };

  const next = () => {
    setCurrentFrame((prev) => (prev + 1) % frameCount);
  };

  const toggleMute = () => setMuted((m) => !m);

  // IntersectionObserver — pause when hero is off-screen.
  // setState here is in response to a browser event (not cascading render),
  // so it's compliant with react-hooks/set-state-in-effect.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry) return;
        setInView(entry.isIntersecting);
      },
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // DERIVED: playing state (no setState-in-effect — React 19 compliant)
  const shouldPlay = autoAdvance && !reducedMotion && inView && frameCount > 1;

  // Frame cycling only — no progress bar state (M8 fix: CSS handles the visual).
  // setCurrentFrame happens INSIDE setInterval callback (event-context, not
  // effect-context), so this is compliant with react-hooks/set-state-in-effect.
  useEffect(() => {
    if (!shouldPlay) return;

    const frameTimer = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frameCount);
    }, frameDurationMs);

    return () => clearInterval(frameTimer);
  }, [shouldPlay, frameCount, frameDurationMs]);

  return {
    currentFrame,
    muted,
    isPlaying: shouldPlay, // derived
    goTo,
    next,
    toggleMute,
    containerRef,
    frameDurationMs,
  };
}
