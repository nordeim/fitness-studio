'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Container } from '@/components/layout/Container';
import { SectionMarker } from '@/components/layout/SectionMarker';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createCoach } from '@/features/coaches/actions';

/**
 * IRONFORGE — Admin new coach page.
 *
 * Client component — uses server action createCoach() on submit.
 * Shows toast on success/error, redirects to /admin/coaches on success.
 */
export default function AdminNewCoachPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    slug: '',
    name: '',
    title: '',
    bio: '',
    certificationsText: '', // newline-separated
    specialtiesText: '', // newline-separated
    signatureWorkout: '',
    portraitKey: '',
    yearsExp: '0',
    order: '8',
    published: false,
  });

  const update = (field: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const result = await createCoach({
      slug: form.slug,
      name: form.name,
      title: form.title,
      bio: form.bio,
      certifications: form.certificationsText.split('\n').filter(Boolean),
      specialties: form.specialtiesText.split('\n').filter(Boolean),
      signatureWorkout: form.signatureWorkout || undefined,
      portraitKey: form.portraitKey || undefined,
      yearsExp: Number(form.yearsExp) || 0,
      order: Number(form.order) || 0,
      published: form.published,
    });

    if (result.success) {
      toast.success('Coach created', { description: result.message });
      router.push('/admin/coaches');
      router.refresh();
    } else {
      toast.error(result.code, { description: result.message });
    }

    setLoading(false);
  }

  return (
    <Container className="py-16">
      <Link
        href="/admin/coaches"
        className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)] hover:text-[var(--color-fg-dim)]"
      >
        ← Back to Coaches
      </Link>

      <div className="mt-6">
        <SectionMarker>ADMIN · NEW COACH</SectionMarker>
        <h1 className="mt-6 font-display text-5xl tracking-wide text-[var(--color-fg)] md:text-6xl">
          NEW COACH
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="mt-12 max-w-2xl space-y-6" noValidate>
        <Input
          id="slug"
          name="slug"
          label="Slug"
          required
          value={form.slug}
          onChange={(e) => update('slug', e.target.value)}
          placeholder="marcus-steel"
          hint="Lowercase, hyphens only — used in the URL"
        />

        <Input
          id="name"
          name="name"
          label="Full Name"
          required
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder="Marcus Steel"
        />

        <Input
          id="title"
          name="title"
          label="Title"
          required
          value={form.title}
          onChange={(e) => update('title', e.target.value)}
          placeholder="Head of Strength"
        />

        <Textarea
          id="bio"
          name="bio"
          label="Bio"
          required
          rows={4}
          value={form.bio}
          onChange={(e) => update('bio', e.target.value)}
          placeholder="Former IPF Junior World Champion. 14 years coaching..."
        />

        <Textarea
          id="certificationsText"
          name="certificationsText"
          label="Certifications (one per line)"
          rows={4}
          value={form.certificationsText}
          onChange={(e) => update('certificationsText', e.target.value)}
          placeholder={'NSCA-CSCS\nFRC Mobility Specialist\nUSAW Level 2'}
        />

        <Textarea
          id="specialtiesText"
          name="specialtiesText"
          label="Specialties (one per line)"
          rows={3}
          value={form.specialtiesText}
          onChange={(e) => update('specialtiesText', e.target.value)}
          placeholder={'Hypertrophy\nPowerlifting'}
        />

        <Input
          id="signatureWorkout"
          name="signatureWorkout"
          label="Signature Workout"
          value={form.signatureWorkout}
          onChange={(e) => update('signatureWorkout', e.target.value)}
          placeholder="Conjugate Max Effort"
        />

        <Input
          id="portraitKey"
          name="portraitKey"
          label="Portrait URL (or R2 key)"
          value={form.portraitKey}
          onChange={(e) => update('portraitKey', e.target.value)}
          placeholder="https://... or coaches/marcus-steel.jpg"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            id="yearsExp"
            name="yearsExp"
            type="number"
            label="Years Experience"
            value={form.yearsExp}
            onChange={(e) => update('yearsExp', e.target.value)}
          />

          <Input
            id="order"
            name="order"
            type="number"
            label="Display Order"
            value={form.order}
            onChange={(e) => update('order', e.target.value)}
          />
        </div>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => update('published', e.target.checked)}
            className="h-4 w-4 accent-[var(--color-accent)]"
          />
          <span className="font-body text-sm text-[var(--color-fg-dim)]">
            Published (visible on the public site)
          </span>
        </label>

        <div className="flex gap-4">
          <Button type="submit" size="lg" loading={loading} disabled={loading}>
            {loading ? 'Creating...' : 'Create Coach →'}
          </Button>
          <Link
            href="/admin/coaches"
            className="flex items-center px-6 font-heading text-xs uppercase tracking-[0.2em] text-[var(--color-fg-dim)] hover:text-[var(--color-fg)]"
          >
            Cancel
          </Link>
        </div>
      </form>
    </Container>
  );
}
