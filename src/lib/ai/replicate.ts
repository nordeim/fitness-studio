import Replicate from 'replicate';

/**
 * IRONFORGE — Replicate client wrapper.
 *
 * Uses process.env directly (with null fallback) instead of the Zod-validated
 * env module, because:
 *  - The Replicate client is infrastructure code (Layer 4)
 *  - It needs to gracefully degrade when env vars are missing (dev without
 *    .env.local, build context, test context)
 *
 * In production with real REPLICATE_API_TOKEN, returns a real Replicate client.
 * In dev/build/test, returns null — callers check for null and fall back
 * to placeholder SVGs.
 *
 * Reference: Skills KB §12 (Replicate patterns from nextjs16-react19-next-auth5-drorm).
 * Reference: T4 lesson — model IDs should be env-configurable with format validation.
 */

function getReplicateToken(): string | null {
  const token = process.env.REPLICATE_API_TOKEN;
  if (!token || token === 'r8_placeholder' || token.startsWith('r8_xxx')) {
    return null;
  }
  return token;
}

let replicateClient: Replicate | null = null;

export function getReplicate(): Replicate | null {
  const token = getReplicateToken();
  if (!token) return null;

  if (!replicateClient) {
    replicateClient = new Replicate({ auth: token });
  }
  return replicateClient;
}

export function isReplicateConfigured(): boolean {
  return getReplicate() !== null;
}

/**
 * SDXL model ID — env-configurable per T4 lesson.
 * Default: stability-ai/sdxl (the canonical SDXL model on Replicate).
 */
export function getSdxlModel(): string {
  return (
    process.env.REPLICATE_SDXL_MODEL ??
    'stability-ai/sdxl:39ed52f2a9bfd5d8b6f5b5b5b5b5b5b5b5b5b5b5'
  );
}

/**
 * Generate a B&W noir athletic photograph via Replicate SDXL.
 *
 * @param prompt - The scene description (e.g., "athlete performing a heavy deadlift")
 * @returns The output URL (Replicate delivery URL), or null if not configured
 *
 * Reference: Visual Strategy — "athletic poses, sweat, muscle definition,
 * equipment texture. High-contrast black and white."
 */
export async function generateNoirImage(prompt: string): Promise<{ url: string; key: string } | null> {
  const replicate = getReplicate();
  if (!replicate) return null;

  const model = getSdxlModel();
  const fullPrompt = `cinematic black and white photograph of ${prompt}, high contrast, sweat, muscle definition, equipment texture, shallow depth of field, 85mm lens, noir lighting, professional athletic photography, grainy film texture`;
  const negativePrompt = 'color, smiling, studio backdrop, watermark, logo, text, low quality, blurry, cartoon, anime, illustration';

  const output = (await replicate.run(
    model as `${string}/${string}` | `${string}/${string}:${string}`,
    {
      input: {
        prompt: fullPrompt,
        negative_prompt: negativePrompt,
        width: 1024,
        height: 1024,
        num_outputs: 1,
        refine: 'expert_ensemble_refiner',
        scheduler: 'K_EULER',
        guidance_scale: 7.5,
        apply_watermark: false,
      },
    },
  )) as unknown;

  // Replicate returns an array of URLs (or a single URL string)
  let url: string;
  if (Array.isArray(output) && output.length > 0) {
    url = String(output[0]);
  } else if (typeof output === 'string') {
    url = output;
  } else {
    throw new Error(`Unexpected Replicate output shape: ${typeof output}`);
  }

  // Generate a storage key from the prompt (slugified)
  const key = `generated/${prompt.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 60)}-${Date.now()}.jpg`;

  return { url, key };
}

/**
 * Download an image from a URL and return it as a Buffer.
 * Used to fetch Replicate output URLs before uploading to R2.
 *
 * P2 fix (OWASP A10 — SSRF): Validates that the URL hostname is in the
 * Replicate delivery allowlist before fetching. Prevents SSRF if the
 * Replicate response is compromised or if an attacker finds a way to
 * influence the output URL.
 */
export async function downloadImage(url: string): Promise<Buffer> {
  const parsed = new URL(url);
  const ALLOWED_HOSTS = ['replicate.delivery', 'replicate.com'];
  const isAllowed = ALLOWED_HOSTS.some(
    (h) => parsed.hostname === h || parsed.hostname.endsWith(`.${h}`),
  );
  if (!isAllowed) {
    throw new Error(`Unexpected image delivery host: ${parsed.hostname}. Expected one of: ${ALLOWED_HOSTS.join(', ')}`);
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
