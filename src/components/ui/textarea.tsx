import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, hint, id, required, ...props }, ref) => {
    const textareaId = id ?? props.name;
    const hintId = hint ? `${textareaId}-hint` : undefined;
    const errorId = error ? `${textareaId}-error` : undefined;

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={textareaId}
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]"
          >
            {label}
            {required && (
              <>
                <span className="ml-1 text-[var(--color-accent)]" aria-hidden="true">
                  *
                </span>
                <span className="sr-only">(required)</span>
              </>
            )}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={!!error}
          aria-describedby={[hintId, errorId].filter(Boolean).join(' ') || undefined}
          aria-required={required || undefined}
          className={cn(
            'w-full border-0 border-b border-[var(--color-border-light)] bg-transparent px-0 py-3 font-heading text-base tracking-[0.04em] text-[var(--color-fg)] placeholder:font-mono placeholder:text-[0.7rem] placeholder:uppercase placeholder:tracking-[0.15em] placeholder:text-[var(--color-muted)] focus:border-[var(--color-accent)] focus:outline-hidden',
            error && 'border-red-500 focus:border-red-500',
            className,
          )}
          {...props}
        />
        {hint && !error && (
          <p id={hintId} className="font-mono text-[10px] text-[var(--color-muted)]">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} role="alert" className="font-mono text-[10px] text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
