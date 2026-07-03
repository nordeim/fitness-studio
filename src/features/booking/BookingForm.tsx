'use client';

import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GOAL_OPTIONS, TIME_OPTIONS } from '@/features/booking/domain/schemas';
import { submitTrialRequest } from '@/features/booking/actions';
import { cn } from '@/lib/utils';

interface CoachOption {
  id: string;
  name: string;
  title: string;
}

interface BookingFormProps {
  coaches: ReadonlyArray<CoachOption>;
}

type FormState = {
  name: string;
  email: string;
  phone: string;
  goal: string;
  preferredTime: string;
  preferredCoachId: string;
  notes: string;
  consent: boolean;
  company_website: string; // honeypot
};

const INITIAL_STATE: FormState = {
  name: '',
  email: '',
  phone: '',
  goal: 'muscle',
  preferredTime: 'early',
  preferredCoachId: '',
  notes: '',
  consent: false,
  company_website: '',
};

/**
 * BookingForm — multi-field trial class intake form.
 *
 * Fields:
 *  - Name (required, 2-80 chars)
 *  - Email (required, valid email)
 *  - Phone (optional, max 40 chars)
 *  - Goal (required, 5 radio pills)
 *  - Preferred time (required, 4 radio cards)
 *  - Preferred coach (optional dropdown)
 *  - Notes (optional textarea, max 500 chars)
 *  - Consent checkbox (required)
 *  - Honeypot: company_website (hidden, must be empty)
 *
 * Behaviors:
 *  - Submit button disabled during async; shows spinner
 *  - On success: toast confirmation, form resets
 *  - On error: toast with error message, form retains input
 *  - Honeypot field hidden via CSS (sr-only + absolute positioning)
 *
 * Reference: Visual Strategy — Book a Trial Class clear CTA.
 * Reference: Skills KB §6 (a11y — form labels, aria-invalid, aria-describedby).
 */
export function BookingForm({ coaches }: BookingFormProps) {
  const [state, setState] = useState<FormState>(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});

  const update = (field: keyof FormState, value: string | boolean) => {
    setState((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const result = await submitTrialRequest(state);

    if (result.success) {
      toast.success('Trial request received', {
        description: result.message,
      });
      setState(INITIAL_STATE);
    } else {
      // Handle validation errors — route to the field identified by the server
      // (M4 fix: uses the `field` property from the response instead of
      // brittle substring matching on the error message).
      if (result.code === 'VALIDATION' && result.field) {
        const fieldName = result.field as keyof FormState;
        if (fieldName in INITIAL_STATE) {
          setErrors({ [fieldName]: result.message });
        } else {
          setErrors({ notes: result.message });
        }
      } else if (result.code === 'VALIDATION') {
        // Fallback if field is not provided
        setErrors({ notes: result.message });
      }

      toast.error(result.code === 'RATE_LIMITED' ? 'Too many requests' : 'Submission failed', {
        description: result.message,
      });
    }

    setLoading(false);
  };

  return (
    <form
      id="booking-form"
      onSubmit={handleSubmit}
      className="booking-frame relative mt-12 border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6 md:p-10"
      aria-label="Trial class booking form"
      noValidate
    >
      {/* Corner brackets */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-[40px] w-[40px] border-l-2 border-t-2 border-[var(--color-accent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-[40px] w-[40px] border-b-2 border-r-2 border-[var(--color-accent)]"
      />

      {/* Honeypot — hidden from real users, visible to bots */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="company_website">Website (leave blank)</label>
        <input
          id="company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={state.company_website}
          onChange={(e) => update('company_website', e.target.value)}
        />
      </div>

      <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
        {/* Name */}
        <Input
          id="name"
          name="name"
          label="Full Name"
          required
          value={state.name}
          error={errors.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder="John Doe"
        />

        {/* Email */}
        <Input
          id="email"
          name="email"
          type="email"
          label="Email Address"
          required
          value={state.email}
          error={errors.email}
          onChange={(e) => update('email', e.target.value)}
          placeholder="john@example.com"
        />

        {/* Phone */}
        <Input
          id="phone"
          name="phone"
          type="tel"
          label="Phone (optional)"
          value={state.phone}
          error={errors.phone}
          onChange={(e) => update('phone', e.target.value)}
          placeholder="212-555-0100"
        />

        {/* Preferred coach */}
        <div className="space-y-2">
          <label
            htmlFor="preferredCoachId"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]"
          >
            Preferred Coach (optional)
          </label>
          <select
            id="preferredCoachId"
            name="preferredCoachId"
            value={state.preferredCoachId}
            onChange={(e) => update('preferredCoachId', e.target.value)}
            className="w-full border-0 border-b border-[var(--color-border-light)] bg-transparent py-3 font-heading text-base tracking-[0.04em] text-[var(--color-fg)] focus:border-[var(--color-accent)] focus:outline-hidden"
          >
            <option value="">No preference</option>
            {coaches.map((coach) => (
              <option key={coach.id} value={coach.id} className="bg-[var(--color-bg-card)]">
                {coach.name} — {coach.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Goal selector */}
      <div className="mt-8">
        <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
          Training Goal <span className="text-[var(--color-accent)]">*</span>
        </label>
        <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Training goal">
          {GOAL_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={state.goal === opt.value}
              onClick={() => update('goal', opt.value)}
              className={cn(
                'min-h-11 cursor-pointer px-4 py-2 font-heading text-xs uppercase tracking-[0.12em] transition-all',
                'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-bg-card)]',
                state.goal === opt.value
                  ? 'border border-[var(--color-accent)] bg-[var(--color-accent)] font-semibold text-black'
                  : 'border border-[var(--color-border-light)] bg-transparent text-[var(--color-fg-dim)] hover:border-[var(--color-silver-dim)] hover:text-[var(--color-fg)]',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {errors.goal && (
          <p role="alert" className="mt-2 font-mono text-[10px] text-red-400">
            {errors.goal}
          </p>
        )}
      </div>

      {/* Preferred time */}
      <div className="mt-8">
        <label className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
          Preferred Time <span className="text-[var(--color-accent)]">*</span>
        </label>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup" aria-label="Preferred time">
          {TIME_OPTIONS.map((opt) => (
            <label key={opt.value} className="cursor-pointer">
              <input
                type="radio"
                name="preferredTime"
                value={opt.value}
                checked={state.preferredTime === opt.value}
                onChange={(e) => update('preferredTime', e.target.value)}
                className="peer sr-only"
              />
              <div
                className={cn(
                  'flex flex-col items-center py-3 text-center border transition-all',
                  'peer-focus-visible:outline-hidden peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-accent)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--color-bg-card)]',
                  state.preferredTime === opt.value
                    ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-black'
                    : 'border-[var(--color-border-light)] text-[var(--color-fg-dim)] hover:border-[var(--color-silver-dim)] hover:text-[var(--color-fg)]',
                )}
              >
                <span className="font-heading text-xs uppercase tracking-wider">{opt.label}</span>
                <span className="font-mono text-[9px] opacity-70">{opt.hours}</span>
              </div>
            </label>
          ))}
        </div>
        {errors.preferredTime && (
          <p role="alert" className="mt-2 font-mono text-[10px] text-red-400">
            {errors.preferredTime}
          </p>
        )}
      </div>

      {/* Notes */}
      <div className="mt-8">
        <Textarea
          id="notes"
          name="notes"
          label="Notes (optional, max 500 chars)"
          rows={3}
          maxLength={500}
          value={state.notes}
          error={errors.notes}
          onChange={(e) => update('notes', e.target.value)}
          placeholder="Injuries, goals, scheduling constraints..."
        />
      </div>

      {/* Consent */}
      <div className="mt-8">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={state.consent}
            onChange={(e) => update('consent', e.target.checked)}
            className="mt-1 h-4 w-4 accent-[var(--color-accent)]"
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? 'consent-error' : undefined}
          />
          <span className="font-body text-sm text-[var(--color-fg-dim)]">
            I consent to be contacted by IRONFORGE coaches within 24 hours regarding
            my trial class request. I understand my information will be handled per
            the{' '}
            <a href="/legal/privacy" className="text-[var(--color-accent)] underline">
              privacy policy
            </a>
            .
            <span className="text-[var(--color-accent)]"> *</span>
          </span>
        </label>
        {errors.consent && (
          <p id="consent-error" role="alert" className="mt-2 font-mono text-[10px] text-red-400">
            {errors.consent}
          </p>
        )}
      </div>

      {/* Submit */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Button
          type="submit"
          size="lg"
          loading={loading}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {loading ? 'Submitting...' : 'Submit Trial Request →'}
        </Button>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
          Response within 24 hours · No commitment
        </p>
      </div>
    </form>
  );
}
