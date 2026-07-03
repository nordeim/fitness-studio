# ADR-006: Replicate for AI Asset Generation

**Status:** Accepted
**Date:** 2026-07-02 (Phase 0)
**Decider:** Super Z

## Context

The project needs AI image generation for B&W noir athletic photography (coach portraits, program heroes, story before/after images). The Visual Strategy specifies: "athletic poses, sweat, muscle definition, equipment texture. High-contrast black and white."

Options:
1. **OpenAI DALL-E 3** — easy API, good quality, but less control over style
2. **Replicate SDXL** — open-source models, more control via prompts + negative prompts, lower cost per image
3. **Stability AI API** — direct SDXL access, but less community support
4. **Midjourney API** — best quality, but no official API (third-party only)

## Decision

Use **Replicate** with the **stability-ai/sdxl** model.

## Rationale

1. **Style control** — SDXL with custom positive + negative prompts gives precise control over the B&W noir aesthetic. Negative prompt: "color, smiling, studio backdrop, watermark, logo, text".
2. **Cost** — Replicate charges per second of compute. SDXL is ~$0.01 per image vs DALL-E 3's ~$0.04.
3. **Already in `package.json`** — `replicate ^1.4.0` is declared.
4. **Model flexibility** — Replicate hosts many models. If SDXL doesn't meet quality, we can swap to `stability-ai/sd-3.5` or a fine-tuned LoRA without changing the client code.
5. **Env-configurable model ID** — Per T4 lesson, the model ID is in env vars with format validation (`owner/model:sha`), not hardcoded.

## Prompt Template

```
Positive: "cinematic black and white photograph of {prompt}, high contrast, sweat,
  muscle definition, equipment texture, shallow depth of field, 85mm lens, noir
  lighting, professional athletic photography, grainy film texture"

Negative: "color, smiling, studio backdrop, watermark, logo, text, low quality,
  blurry, cartoon, anime, illustration"

Parameters: width=1024, height=1024, scheduler=K_EULER, guidance_scale=7.5,
  num_outputs=1, apply_watermark=false
```

## Consequences

**Positive:**
- Precise style control via prompts
- Low cost per image (~$0.01)
- Model ID is env-configurable (T4 lesson)
- SSRF protection on output URL download (host allowlist: replicate.delivery, replicate.com)
- Graceful fallback to branded SVG placeholders when Replicate is not configured

**Negative:**
- External dependency — Replicate API must be available
- Generation is async (5–15 seconds per image)
- Model version drift — if Replicate deprecates a model version, the env var must be updated
- Rate limits on Replicate free tier
