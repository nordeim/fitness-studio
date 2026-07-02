import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * IRONFORGE Button — shadcn/ui pattern with CVA variants.
 * Wrapped with brand tokens: neon orange accent, silver secondary,
 * metallic dark surfaces. focus-visible ring uses accent.
 *
 * Reference: Skills KB §11 (shadcn/ui patterns).
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-heading text-xs uppercase tracking-[0.2em] transition-all duration-[var(--dur-micro)] disabled:pointer-events-none disabled:opacity-50 outline-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg)] [&_svg]:pointer-events-none [&_svg:not([class*=size-])]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        // Primary — neon orange (the ONLY hue that asserts itself)
        default:
          'bg-[var(--color-accent)] text-black hover:bg-[var(--color-accent-bright)] font-semibold',
        // Secondary — metallic silver (equipment chrome)
        secondary:
          'bg-[var(--color-silver)] text-black hover:bg-white font-semibold',
        // Outline — transparent with border
        outline:
          'border border-[var(--color-border-light)] bg-transparent text-[var(--color-fg-dim)] hover:bg-white/[0.04] hover:text-[var(--color-fg)] hover:border-[var(--color-silver-dim)]',
        // Ghost — no border, hover bg
        ghost:
          'text-[var(--color-fg-dim)] hover:bg-white/[0.04] hover:text-[var(--color-fg)]',
        // Link — underlined accent
        link: 'text-[var(--color-accent)] underline-offset-4 hover:underline',
        // Destructive — red (used for admin delete actions)
        destructive:
          'bg-red-700 text-white hover:bg-red-800 font-semibold',
      },
      size: {
        default: 'h-10 px-5 py-2.5',
        sm: 'h-9 px-4 text-[0.7rem]',
        lg: 'h-12 px-7 text-sm',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  ),
);

Button.displayName = 'Button';

export { buttonVariants };
