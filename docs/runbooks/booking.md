# Runbook: Booking Flow

> Operational guide for the trial class booking system.
> Covers architecture, common issues, and step-by-step troubleshooting.

---

## Architecture

```
Browser → BookingForm (client component)
  → Server Action: submitTrialRequest
    → Rate limit (Upstash, 5/min, fallback: allow)
    → Zod validation (TrialRequestSchema)
    → Honeypot check (company_website)
    → Generate idempotency key (UUID v4)
    → DB insert (trial_requests table, ON CONFLICT DO NOTHING)
    → Inngest event ('trial.requested')
      → Inngest function 'trial-requested' (3 steps):
        1. notify-coach (console.log — wire Resend in Phase 13)
        2. confirm-member (console.log)
        3. schedule-followup (console.log)
    → Return { success: true, requestId }
  → Client shows toast, resets form
```

**Key files:**
- `src/features/booking/BookingForm.tsx` — client component (form UI + toast)
- `src/features/booking/actions.ts` — server action (validate + insert + Inngest)
- `src/features/booking/domain/schemas.ts` — Zod schema (9 fields)
- `src/lib/ratelimit.ts` — Upstash sliding window (5/min)
- `src/inngest/functions/trial-requested.ts` — Inngest function (3 steps)

---

## Common Issues

### 1. Form submission returns VALIDATION error

**Symptom:** Toast shows "Submission failed" with a validation message.

**Diagnosis:**
- Check which field failed — the server action returns the first Zod error message
- Common causes:
  - Name too short (< 2 chars)
  - Invalid email format
  - Goal or preferredTime not selected (enum validation)
  - Consent checkbox not checked
  - Notes > 500 chars

**Fix:** The client component maps error messages to fields via substring matching. If the error message doesn't match a known field, it lands on the `notes` field by default. Check the server action's `firstError.message` for the exact Zod validation failure.

### 2. Form submission returns RATE_LIMITED

**Symptom:** Toast shows "Too many requests. Please wait a minute and try again."

**Diagnosis:**
- The IP has submitted > 5 booking requests in 1 minute
- Check if Upstash Redis is configured (`UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`)
- If Upstash is not configured, rate limiting falls back to "allow all" — this error should not appear

**Fix:** Wait 1 minute. If the issue persists with real Upstash credentials, check the Upstash dashboard for Redis connectivity.

### 3. Form submission returns SPAM_DETECTED

**Symptom:** Toast shows "Spam detected."

**Diagnosis:** The honeypot field (`company_website`) was filled. This means a bot auto-filled all form fields. Real users never see this field (it's positioned at `left: -9999px`).

**Fix:** No action needed — the spam request was correctly blocked. If this happens frequently, consider adding a CAPTCHA (but the honeypot + rate limit combo should be sufficient for a studio site).

### 4. Inngest event not firing

**Symptom:** Booking succeeds (toast shows) but no Inngest event appears in the dev UI.

**Diagnosis:**
1. Check if Inngest dev server is running: `pnpm dlx inngest-cli@latest dev` (should be on `localhost:8288`)
2. Check `/api/inngest` route — `curl http://localhost:3000/api/inngest` should return `{ "mode": "dev", "function_count": 2 }`
3. Check server console for `[submitTrialRequest] Inngest send failed:` error
4. The Inngest client uses `process.env.INNGEST_EVENT_KEY` — if this is a placeholder, events may be silently dropped

**Fix:** Start the Inngest dev server. If in production, verify `INNGEST_SIGNING_KEY` is set and the Inngest Cloud webhook is configured to call `/api/inngest`.

### 5. DB insert fails but booking succeeds

**Symptom:** Server console shows `[submitTrialRequest] DB insert failed (continuing with Inngest):` but the client shows success toast.

**Diagnosis:** This is by design — the booking action is designed to succeed even if the DB is unavailable. The Inngest event still fires (so the coach gets notified via email), but the `trial_requests` row is not persisted. The request is lost from the DB but not from the notification pipeline.

**Fix:** Check DB connectivity. Run `pnpm db:reset` to verify the schema is up to date. If the DB is expected to be unavailable (e.g., CI), this is expected behavior — no action needed.

---

## Testing the Booking Flow

### Manual test (dev)

1. Start dev server: `pnpm dev`
2. Navigate to `http://localhost:3000/#booking-form`
3. Fill in all fields:
   - Name: "Test User"
   - Email: "test@example.com"
   - Phone: "212-555-0100"
   - Goal: "Muscle Gain"
   - Preferred Time: "Early"
   - Preferred Coach: "No preference"
   - Notes: "Testing the booking flow"
   - Consent: checked
4. Click "Submit Trial Request →"
5. Verify toast: "Trial request received"
6. Verify form resets (all fields empty)
7. Check server console for Inngest event log

### Automated test (E2E)

```bash
pnpm test:e2e -- --grep "booking"
```

This runs the 14 Playwright E2E tests in `src/tests/e2e/booking-form.spec.ts`.

### Unit test

```bash
pnpm test -- --grep "booking"
```

This runs 31 Vitest tests (21 schema + 10 server action).
