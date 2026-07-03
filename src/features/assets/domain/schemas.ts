import { z } from 'zod';

/**
 * IRONFORGE — Asset generation domain schemas.
 *
 * Pure business logic — no Next.js / React / DB runtime imports.
 */

export type AssetType = 'coach_portrait' | 'program_hero' | 'story_before' | 'story_after';

export const AssetGenerationRequestSchema = z.object({
  type: z.enum(['coach_portrait', 'program_hero', 'story_before', 'story_after'], {
    message: 'Invalid asset type',
  }),
  /** Entity slug (e.g., 'marcus-steel', 'conjugate-max-effort', 'david-k') */
  entitySlug: z.string().min(1, 'Entity slug is required').max(80),
  /** Optional prompt override. If omitted, a default is built from type + slug. */
  promptOverride: z.string().max(500).optional().or(z.literal('')),
});

export type AssetGenerationRequest = z.infer<typeof AssetGenerationRequestSchema>;

export const AssetGenerationResponseSchema = z.object({
  success: z.boolean(),
  code: z.enum([
    'SUCCESS',
    'VALIDATION',
    'NOT_CONFIGURED',
    'UNAUTHORIZED',
    'GENERATION_FAILED',
    'INTERNAL',
  ]),
  message: z.string(),
  url: z.string().nullable().optional(),
  key: z.string().nullable().optional(),
  fallbackSvg: z.string().nullable().optional(),
});

export type AssetGenerationResponse = z.infer<typeof AssetGenerationResponseSchema>;

/**
 * Build a default prompt from the asset type + entity slug.
 *
 * Reference: Visual Strategy — "athletic poses, sweat, muscle definition,
 * equipment texture. High-contrast black and white."
 */
export function buildDefaultPrompt(type: AssetType, entitySlug: string): string {
  const slugDisplay = entitySlug.replace(/-/g, ' ');

  switch (type) {
    case 'coach_portrait':
      return `professional portrait of a strength coach, ${slugDisplay}, arms crossed, confident expression, wearing athletic apparel, gym background blurred, dramatic side lighting`;
    case 'program_hero':
      return `athletic training scene for ${slugDisplay}, athlete mid-lift, chalk dust in air, power rack and barbell visible, dramatic low-key lighting`;
    case 'story_before':
      return `before photo of ${slugDisplay}, average person standing in gym, neutral expression, soft lighting, documentary style`;
    case 'story_after':
      return `after photo of ${slugDisplay}, transformed athlete, defined musculature, confident posture, gym background, dramatic lighting`;
  }
}

/**
 * Generate a placeholder SVG when Replicate is not configured.
 * Returns the SVG as a string (data URL ready).
 *
 * The SVG uses IRONFORGE brand colors (pure black bg + accent orange +
 * silver stroke) and shows the entity slug + type.
 */
export function generatePlaceholderSvg(type: AssetType, entitySlug: string): string {
  const w = 800;
  const h = type === 'coach_portrait' ? 1067 : 600; // 3:4 portrait or 4:3 landscape
  const label = entitySlug.replace(/-/g, ' ').toUpperCase();
  const sublabel = type.replace(/_/g, ' ').toUpperCase();

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="#0a0a0a"/>
  <rect x="20" y="20" width="${w - 40}" height="${h - 40}" fill="none" stroke="#FF5400" stroke-width="2" stroke-dasharray="8 4"/>
  <text x="${w / 2}" y="${h / 2 - 20}" font-family="monospace" font-size="28" fill="#C8C8C8" text-anchor="middle" letter-spacing="4">${label}</text>
  <text x="${w / 2}" y="${h / 2 + 20}" font-family="monospace" font-size="14" fill="#FF5400" text-anchor="middle" letter-spacing="3">${sublabel}</text>
  <text x="${w / 2}" y="${h - 40}" font-family="monospace" font-size="10" fill="#6a6a6a" text-anchor="middle" letter-spacing="2">IRONFORGE · PLACEHOLDER</text>
</svg>`;
}
