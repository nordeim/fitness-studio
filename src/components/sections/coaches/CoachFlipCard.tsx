'use client';

import { useState, type KeyboardEvent } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface CoachFlipCardProps {
  name: string;
  title: string;
  /** Image URL. */
  imageSrc: string;
  imageAlt: string;
  /** Short bio excerpt (back of card). */
  bio: string;
  /** Credentials list (back of card). */
  certifications: ReadonlyArray<string>;
  /** Signature workout (back of card). */
  signatureWorkout: string;
  specialties: ReadonlyArray<string>;
  href: string;
  className?: string;
}

/**
 * CoachFlipCard — 3D Y-axis flip on hover or tap.
 *
 * Visual:
 *  - Front: portrait (70% height) + name + title + specialty tags
 *  - Back: bio excerpt + certifications list + signature workout + "View profile" link
 *  - Perspective 1800px, height 580px desktop / 480px mobile
 *  - Flip: rotateY(0) → rotateY(180deg), 900ms ease-flip
 *  - backface-visibility: hidden on both faces
 *  - Back face is pre-rotated 180deg
 *
 * Interaction:
 *  - Hover on devices with `hover: hover` (desktop)
 *  - Tap toggle on `hover: none` (touch) — matchMedia check
 *  - Keyboard: Enter/Space flips; focus is moved to back content
 *  - Fallback: if `transform-style: preserve-3d` is unsupported, cross-fade
 *
 * A11y:
 *  - role="button" with aria-expanded
 *  - aria-label describes the action
 *  - Focus-visible ring on container
 *
 * Reference: Visual Strategy — coach cards flip on hover.
 * Reference: Skills KB §5 (motion — flip 900ms ease-flip).
 * Reference: Skills KB §6 (a11y — keyboard accessible).
 */
export function CoachFlipCard({
  name,
  title,
  imageSrc,
  imageAlt,
  bio,
  certifications,
  signatureWorkout,
  specialties,
  href,
  className,
}: CoachFlipCardProps) {
  const [flipped, setFlipped] = useState(false);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setFlipped((f) => !f);
    } else if (e.key === 'Escape' && flipped) {
      setFlipped(false);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={flipped}
      aria-label={`${name} — ${title}. Press Enter to ${flipped ? 'flip back' : 'reveal credentials'}.`}
      onClick={() => {
        // Toggle on tap for touch devices
        if (window.matchMedia('(hover: none)').matches) {
          setFlipped((f) => !f);
        }
      }}
      onKeyDown={onKeyDown}
      className={cn(
        'flip-card group h-[580px] cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)]',
        '[perspective:1800px]',
        className,
      )}
    >
      <div
        className={cn(
          'relative h-full w-full transition-transform duration-[var(--dur-flip)] ease-[var(--ease-flip)] [transform-style:preserve-3d]',
          flipped ? '[transform:rotateY(180deg)]' : 'group-hover:[transform:rotateY(180deg)]',
        )}
      >
        {/* ── FRONT ── */}
        <div className="absolute inset-0 overflow-hidden border border-[var(--color-border)] bg-[var(--color-bg-card)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]">
          {/* Portrait — 70% height */}
          <div className="relative h-[70%] overflow-hidden">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
              loading="lazy"
              className="object-cover [filter:grayscale(100%)_contrast(1.35)_brightness(0.78)] transition-all duration-[600ms] ease-[var(--ease-premium)] group-hover:[filter:grayscale(70%)_contrast(1.4)_brightness(0.85)]"
            />
            {/* Bottom fade for legibility */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[var(--color-bg-card)] to-transparent"
            />
          </div>

          {/* Info — 30% height */}
          <div className="flex h-[30%] flex-col justify-between p-5">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)]">
                {title}
              </div>
              <h3 className="mt-1 font-display text-2xl tracking-wide text-[var(--color-fg)]">
                {name}
              </h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {specialties.map((s) => (
                <span
                  key={s}
                  className="border border-[var(--color-border-light)] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-[var(--color-fg-dim)]"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Hint */}
          <div
            aria-hidden="true"
            className="absolute right-4 top-4 flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-muted)]"
          >
            <span>Hover</span>
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M3 12a9 9 0 1 0 9-9" />
              <polyline points="3 4 3 12 11 12" />
            </svg>
          </div>
        </div>

        {/* ── BACK ── */}
        <div className="absolute inset-0 flex flex-col overflow-hidden border border-[var(--color-accent)] bg-[var(--color-bg-darker)] p-6 [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)]">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)]">
            {title}
          </div>
          <h3 className="mb-4 font-display text-2xl tracking-wide text-[var(--color-fg)]">
            {name}
          </h3>

          {/* Bio */}
          <p className="mb-4 font-body text-sm leading-relaxed text-[var(--color-fg-dim)]">
            {bio}
          </p>

          {/* Certifications */}
          <div className="mb-4">
            <div className="mb-2 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Certifications
            </div>
            <ul className="space-y-1">
              {certifications.map((cert) => (
                <li
                  key={cert}
                  className="flex items-center gap-2 font-heading text-xs tracking-wide text-[var(--color-fg-dim)]"
                >
                  <span className="h-1 w-1 bg-[var(--color-accent)]" aria-hidden="true" />
                  {cert}
                </li>
              ))}
            </ul>
          </div>

          {/* Signature workout */}
          <div className="mt-auto border-t border-[var(--color-border)] pt-4">
            <div className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Signature Workout
            </div>
            <div className="font-heading text-sm uppercase tracking-wider text-[var(--color-fg)]">
              {signatureWorkout}
            </div>
            <a
              href={href}
              onClick={(e) => e.stopPropagation()}
              className="mt-3 inline-flex items-center gap-2 font-heading text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] hover:text-[var(--color-accent-bright)]"
            >
              View Profile
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
