/**
 * IRONFORGE — Home page loading skeleton.
 *
 * Shown while async Server Components (ProgramsSection, CoachesSection,
 * StoriesSection) fetch data. Matches the hero + section structure with
 * pulse-animated placeholder blocks.
 */
export default function Loading() {
  return (
    <div className="min-h-dvh bg-[var(--color-bg)]">
      {/* Hero skeleton */}
      <div className="relative flex min-h-dvh flex-col justify-end overflow-hidden px-6 pb-24 pt-32 lg:px-10">
        <div className="absolute inset-0 animate-pulse bg-[var(--color-bg-card)]" />
        <div className="relative z-10 max-w-5xl">
          <div className="mb-6 h-4 w-32 animate-pulse bg-[var(--color-border-light)]" />
          <div className="h-24 w-full animate-pulse bg-[var(--color-border-light)] md:h-32 lg:h-40" />
          <div className="mt-8 h-4 w-64 animate-pulse bg-[var(--color-border)]" />
          <div className="mt-2 h-4 w-48 animate-pulse bg-[var(--color-border)]" />
        </div>
      </div>

      {/* Section skeletons */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="border-t border-[var(--color-border)] py-20 md:py-32">
          <div className="mx-auto max-w-[var(--container-max)] px-6 lg:px-10">
            <div className="mb-12 max-w-3xl">
              <div className="mb-6 h-3 w-40 animate-pulse bg-[var(--color-border-light)]" />
              <div className="h-12 w-full animate-pulse bg-[var(--color-border-light)] md:h-16" />
              <div className="mt-4 h-4 w-3/4 animate-pulse bg-[var(--color-border)]" />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((j) => (
                <div
                  key={j}
                  className="h-64 animate-pulse border border-[var(--color-border)] bg-[var(--color-bg-card)]"
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
