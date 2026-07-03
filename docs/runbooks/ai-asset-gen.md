# Runbook: AI Asset Generation

> Operational guide for the Replicate SDXL + Cloudflare R2 image generation pipeline.
> Covers configuration, triggering, troubleshooting, and fallback behavior.

---

## Architecture

```
Admin → POST /api/admin/assets/generate { type, entitySlug, promptOverride? }
  → Auth check (admin role)
  → Zod validation (AssetGenerationRequestSchema)
  → If Replicate + R2 configured:
    → Inngest event send ('asset.generate')
    → Inngest function 'asset-generate' (3 steps):
      1. replicate: generateNoirImage(prompt)
         → Replicate SDXL (1024×1024, K_EULER, guidance 7.5)
         → Returns output URL (replicate.delivery)
      2. upload: downloadImage(url) [SSRF-validated]
         → putObject to R2 (generated bucket)
         → Returns R2 key
      3. notify: console.log (Phase 9 wires DB update)
  → If not configured:
    → Return placeholder SVG immediately (generatePlaceholderSvg)
```

**Key files:**
- `src/lib/ai/replicate.ts` — Replicate SDXL client + downloadImage (SSRF-validated)
- `src/lib/storage/r2.ts` — Cloudflare R2 S3 client (500MB size guard)
- `src/inngest/functions/asset-generate.ts` — Inngest function (3 steps)
- `src/app/api/admin/assets/generate/route.ts` — Admin API trigger
- `src/app/admin/(guarded)/assets/generate/page.tsx` — Admin trigger UI
- `src/features/assets/domain/schemas.ts` — Zod schema + prompt builder + SVG placeholder

---

## Configuration

### 1. Replicate

Get an API token from [replicate.com](https://replicate.com):
1. Sign up / log in
2. API Tokens → Create token
3. Copy the `r8_...` token

Set in `.env.local`:
```
REPLICATE_API_TOKEN=r8_...
REPLICATE_SDXL_MODEL=stability-ai/sdxl:39ed52f2a9bfd5d8b6f5b5b5b5b5b5b5b5b5b5b5
```

### 2. Cloudflare R2

1. Cloudflare Dashboard → R2 → Create bucket
   - Bucket 1: `ironforge-uploads` (for user-uploaded content)
   - Bucket 2: `ironforge-generated` (for AI-generated assets)
2. R2 → Manage API tokens → Create API token
   - Permissions: Object Read & Write on both buckets

Set in `.env.local`:
```
R2_ACCOUNT_ID=your-account-id
R2_ACCESS_KEY_ID=your-access-key
R2_SECRET_ACCESS_KEY=your-secret-key
R2_BUCKET_UPLOADS=ironforge-uploads
R2_BUCKET_GENERATED=ironforge-generated
```

### 3. Inngest

For the Inngest function to run, the Inngest dev server must be running (dev) or Inngest Cloud must be configured (production).

**Dev:**
```bash
pnpm dlx inngest-cli@latest dev
# Opens http://localhost:8288
```

**Production:**
Set `INNGEST_SIGNING_KEY` from the Inngest Cloud dashboard. Configure the Inngest Cloud webhook to call `https://yourdomain.com/api/inngest`.

---

## Triggering Asset Generation

### Via Admin UI

1. Navigate to `/admin/assets/generate` (requires admin login)
2. Select asset type:
   - **Coach Portrait** — 3:4 portrait (800×1067 SVG placeholder)
   - **Program Hero** — 4:3 landscape (800×600 SVG placeholder)
   - **Story Before** — before photo
   - **Story After** — after photo
3. Enter entity slug (e.g., `marcus-steel`, `conjugate-max-effort`, `david-k`)
4. Optionally override the prompt
5. Click "Generate Asset →"

**If Replicate + R2 are configured:**
- Response: "Asset generation queued for {type} / {entitySlug}. Check Inngest dev UI for progress."
- Check Inngest dev UI (`localhost:8288`) for function execution
- Console logs show: Replicate URL, R2 key, status (COMPLETE or PARTIAL)

**If Replicate or R2 are NOT configured:**
- Response: "{Service} not configured. Returning placeholder SVG."
- A branded SVG placeholder is returned with the entity slug + type label
- The SVG uses IRONFORGE brand colors (pure black + accent orange + silver)

### Via API

```bash
curl -X POST http://localhost:3000/api/admin/assets/generate \
  -H "Content-Type: application/json" \
  -H "Cookie: authjs.session-token=..." \
  -d '{"type":"coach_portrait","entitySlug":"marcus-steel"}'
```

---

## Prompt Template

The `generateNoirImage(prompt)` function wraps the user prompt in a B&W noir template:

**Positive prompt:**
```
cinematic black and white photograph of {prompt}, high contrast, sweat, muscle
definition, equipment texture, shallow depth of field, 85mm lens, noir lighting,
professional athletic photography, grainy film texture
```

**Negative prompt:**
```
color, smiling, studio backdrop, watermark, logo, text, low quality, blurry,
cartoon, anime, illustration
```

**Parameters:**
- Width: 1024
- Height: 1024
- Scheduler: K_EULER
- Guidance scale: 7.5
- Num outputs: 1
- Refine: expert_ensemble_refiner
- Apply watermark: false

### Default prompts (when no override provided)

| Type | Default Prompt |
|---|---|
| `coach_portrait` | `professional portrait of a strength coach, {slug}, arms crossed, confident expression, wearing athletic apparel, gym background blurred, dramatic side lighting` |
| `program_hero` | `athletic training scene for {slug}, athlete mid-lift, chalk dust in air, power rack and barbell visible, dramatic low-key lighting` |
| `story_before` | `before photo of {slug}, average person standing in gym, neutral expression, soft lighting, documentary style` |
| `story_after` | `after photo of {slug}, transformed athlete, defined musculature, confident posture, gym background, dramatic lighting` |

---

## Common Issues

### 1. "Replicate + R2 not configured" response

**Diagnosis:** Either `REPLICATE_API_TOKEN` or R2 env vars are missing or contain placeholder values.

**Fix:** Set the real env vars in `.env.local`. The system checks for:
- `REPLICATE_API_TOKEN` starting with `r8_` and not containing `placeholder` or `xxx`
- R2 env vars not containing `placeholder`

### 2. Inngest function fails at "replicate" step

**Symptom:** Inngest dev UI shows the `asset-generate` function failed at step 1.

**Diagnosis:**
- Replicate API token is invalid or expired
- Rate limit on Replicate free tier
- Model version is deprecated (check `REPLICATE_SDXL_MODEL`)
- Network error contacting Replicate API

**Fix:**
1. Verify the API token: `curl -H "Authorization: Token r8_..." https://api.replicate.com/v1/account`
2. Check Replicate dashboard for rate limit status
3. Verify the model ID format: `owner/model:sha` (8+ hex chars after colon)
4. Inngest retries failed steps automatically (3 retries by default)

### 3. Inngest function fails at "upload" step

**Symptom:** Replicate succeeded (URL returned) but R2 upload failed.

**Diagnosis:**
- R2 credentials are invalid
- R2 bucket doesn't exist
- Network error downloading from Replicate URL
- SSRF allowlist blocked the URL (hostname not in `replicate.delivery` / `replicate.com`)

**Fix:**
1. Verify R2 credentials: check Cloudflare dashboard → R2 → API tokens
2. Verify bucket names match `R2_BUCKET_GENERATED`
3. Check server console for the specific error message
4. If the Replicate URL hostname is not in the allowlist, the `downloadImage()` function throws — this is a security feature (OWASP A10 SSRF protection)

**Fallback:** If R2 upload fails, the function returns the Replicate URL as `fallbackUrl`. The image is accessible directly from Replicate (temporary, expires after ~1 hour).

### 4. Replicate output URL shape is unexpected

**Symptom:** `generateNoirImage()` throws "Unexpected Replicate output shape."

**Diagnosis:** The Replicate SDK returned an output that is neither an array of URLs nor a single URL string. This can happen if the model version changed its output format.

**Fix:** Check the Replicate model page for output format changes. Update the output parsing in `src/lib/ai/replicate.ts` if needed.

### 5. Placeholder SVG looks wrong

**Symptom:** The SVG placeholder has incorrect dimensions or missing text.

**Diagnosis:** The `generatePlaceholderSvg(type, entitySlug)` function uses different dimensions based on type:
- `coach_portrait`: 800×1067 (3:4 portrait)
- Others: 800×600 (4:3 landscape)

**Fix:** Verify the `type` parameter is one of the 4 valid values. Check the SVG output in the browser — it should show the entity slug (uppercased) + type label + "IRONFORGE · PLACEHOLDER" footer.

---

## Security

- **Admin-only:** The `/api/admin/assets/generate` route requires `session.user.role === 'admin'`. The edge proxy also blocks `/api/admin/*` when no session cookie is present.
- **SSRF protection:** `downloadImage()` validates the hostname against `['replicate.delivery', 'replicate.com']` before fetching. This prevents SSRF if the Replicate response is compromised.
- **R2 size guard:** `putObject()` enforces a 500MB max (`MAX_PUT_OBJECT_BYTES`). Images are typically ~100KB, so this is a safety net.
- **Prompt injection:** The `promptOverride` field is user-supplied (admin only). It's interpolated into the SDXL prompt. This is a prompt-injection vector (admin could inject "ignore previous instructions"), but since only admins can trigger generation, the risk is acceptable.
