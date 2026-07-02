import { forwardRef, type LabelHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        'font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]',
        className,
      )}
      {...props}
    >
      {children}
      {required && (
        <>
          <span className="ml-1 text-[var(--color-accent)]" aria-hidden="true">
            *
          </span>
          <span className="sr-only">(required)</span>
        </>
      )}
    </label>
  ),
);

Label.displayName = 'Label';
