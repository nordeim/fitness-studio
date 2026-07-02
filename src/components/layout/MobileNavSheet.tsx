'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
}

interface MobileNavSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: ReadonlyArray<NavItem>;
}

/**
 * IRONFORGE MobileNavSheet — Radix Dialog side="right".
 *
 * Behaviors:
 *  - Slides in from the right (300px wide on mobile, 400px on sm+)
 *  - Body scroll lock (Radix handles automatically)
 *  - Esc closes; focus trap active; focus returns to trigger on close
 *  - min-h-dvh (Dynamic Viewport Height — avoids Safari UI shift)
 *  - Closes on nav link click
 *
 * Reference: Skills KB §7 (Mobile navigation debugging — class A–H taxonomy).
 */
export function MobileNavSheet({ open, onOpenChange, items }: MobileNavSheetProps) {
  // Body scroll lock (T6 lesson — Radix handles automatically, but explicit guard)
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cn(
            'fixed inset-0 z-[var(--z-overlay)] bg-black/80 backdrop-blur-sm',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0',
          )}
        />
        <Dialog.Content
          id="mobile-nav"
          aria-describedby={undefined}
          className={cn(
            'fixed right-0 top-0 z-[var(--z-modal)] flex min-h-dvh w-[300px] flex-col border-l border-[var(--color-border)] bg-[var(--color-bg-darker)] sm:w-[400px]',
            'data-[state=open]:slide-in-from-right',
            'data-[state=closed]:slide-out-to-right',
          )}
        >
          <Dialog.Title className="sr-only">IRONFORGE navigation menu</Dialog.Title>
          <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-5">
            <span className="font-display text-xl tracking-wider text-[var(--color-fg)]">
              IRONFORGE
            </span>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close navigation menu"
                className="flex h-10 w-10 items-center justify-center text-[var(--color-fg-dim)] hover:bg-white/[0.04] hover:text-[var(--color-fg)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </Dialog.Close>
          </div>
          <nav className="flex flex-col gap-1 p-6" aria-label="Mobile primary">
            {items.map((item, i) => (
              <Dialog.Close asChild key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-baseline gap-4 px-3 py-4 font-heading text-lg uppercase tracking-[0.04em] text-[var(--color-fg-dim)] transition-colors hover:bg-white/[0.04] hover:text-[var(--color-fg)] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]',
                  )}
                >
                  <span className="font-mono text-xs text-[var(--color-accent)]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{item.label}</span>
                </Link>
              </Dialog.Close>
            ))}
          </nav>
          <div className="mt-auto border-t border-[var(--color-border)] p-6">
            <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--color-muted)]">
              <span className="text-[var(--color-accent)]" aria-hidden="true">
                ◆
              </span>
              <span>47 EASTBOUND ALLEY · NYC</span>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
