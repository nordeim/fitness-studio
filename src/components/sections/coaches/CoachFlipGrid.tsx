import { CoachFlipCard } from './CoachFlipCard';
import { ScrollReveal } from '@/components/ScrollReveal';

interface Coach {
  name: string;
  title: string;
  imageSrc: string;
  imageAlt: string;
  bio: string;
  certifications: ReadonlyArray<string>;
  signatureWorkout: string;
  specialties: ReadonlyArray<string>;
  href: string;
}

interface CoachFlipGridProps {
  coaches: ReadonlyArray<Coach>;
}

/**
 * CoachFlipGrid — responsive grid of CoachFlipCards.
 *
 * Layout:
 *  - 1-col mobile / 2-col tablet / 4-col desktop
 *  - Staggered reveal on scroll (100ms per card)
 *
 * Reference: Visual Strategy — Coach profiles.
 */
export function CoachFlipGrid({ coaches }: CoachFlipGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {coaches.map((coach, i) => (
        <ScrollReveal key={coach.name} delay={i * 100}>
          <CoachFlipCard {...coach} />
        </ScrollReveal>
      ))}
    </div>
  );
}
