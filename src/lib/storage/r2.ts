import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';

/**
 * IRONFORGE — Cloudflare R2 storage client.
 *
 * R2 is S3-compatible. We use the AWS SDK with the R2 endpoint URL.
 *
 * Graceful degradation:
 *  - If R2 env vars are placeholders (dev/build/test), getR2() returns null
 *  - All consumers check for null and fall back to placeholder SVGs
 *  - This client is SERVER-ONLY
 *
 * Uses process.env directly (not the Zod env module) to avoid crash in dev
 * without .env.local — same pattern as Inngest client + Stripe client.
 *
 * Reference: Skills KB §12 (R2 patterns from nextjs16-react19-next-auth5-drizzle-orm).
 * Reference: T1 lesson — never import this in client components.
 * Reference: T7 lesson — MAX_PUT_OBJECT_BYTES = 500 MB size guard.
 */

export const MAX_PUT_OBJECT_BYTES = 500 * 1024 * 1024; // 500 MB

function getEnv(key: string, fallback = ''): string {
  return process.env[key] ?? fallback;
}

function isR2Configured(): boolean {
  const accountId = getEnv('R2_ACCOUNT_ID');
  const accessKey = getEnv('R2_ACCESS_KEY_ID');
  const secretKey = getEnv('R2_SECRET_ACCESS_KEY');
  return (
    accountId.length > 0 &&
    !accountId.includes('placeholder') &&
    accessKey.length > 0 &&
    !accessKey.includes('placeholder') &&
    secretKey.length > 0 &&
    !secretKey.includes('placeholder')
  );
}

let r2Client: S3Client | null = null;

function getR2(): S3Client | null {
  if (!isR2Configured()) return null;

  if (!r2Client) {
    r2Client = new S3Client({
      region: 'auto',
      endpoint: `https://${getEnv('R2_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: getEnv('R2_ACCESS_KEY_ID'),
        secretAccessKey: getEnv('R2_SECRET_ACCESS_KEY'),
      },
    });
  }
  return r2Client;
}

export function isStorageConfigured(): boolean {
  return getR2() !== null;
}

/**
 * Upload a Buffer to R2.
 *
 * @param bucket - 'uploads' | 'generated' (mapped to R2_BUCKET_UPLOADS / GENERATED)
 * @param key - object key (e.g., 'coaches/marcus-steel-portrait.jpg')
 * @param body - Buffer or Uint8Array
 * @param contentType - MIME type
 * @returns The R2 object key on success, null if R2 not configured
 */
export async function putObject(
  bucket: 'uploads' | 'generated',
  key: string,
  body: Buffer | Uint8Array,
  contentType: string,
): Promise<string | null> {
  const client = getR2();
  if (!client) return null;

  // T7: size guard
  const sizeBytes = body.byteLength;
  if (sizeBytes > MAX_PUT_OBJECT_BYTES) {
    throw new Error(
      `PayloadTooLarge: ${sizeBytes} bytes exceeds MAX_PUT_OBJECT_BYTES (${MAX_PUT_OBJECT_BYTES})`,
    );
  }

  const bucketName =
    bucket === 'uploads' ? getEnv('R2_BUCKET_UPLOADS', 'ironforge-uploads') : getEnv('R2_BUCKET_GENERATED', 'ironforge-generated');

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );

  return key;
}

/**
 * Generate a signed URL for downloading an object from R2.
 *
 * @param bucket - 'uploads' | 'generated'
 * @param key - object key
 * @param expiresIn - URL validity in seconds (default 3600 = 1 hour)
 * @returns Signed URL string, or null if R2 not configured
 */
export async function getSignedDownloadUrl(
  bucket: 'uploads' | 'generated',
  key: string,
  expiresIn = 3600,
): Promise<string | null> {
  const client = getR2();
  if (!client) return null;

  const bucketName =
    bucket === 'uploads' ? getEnv('R2_BUCKET_UPLOADS', 'ironforge-uploads') : getEnv('R2_BUCKET_GENERATED', 'ironforge-generated');

  const url = await getSignedUrl(
    client,
    new GetObjectCommand({ Bucket: bucketName, Key: key }),
    { expiresIn },
  );

  return url;
}

/**
 * Fetch an object from R2 as a Buffer.
 *
 * @param bucket - 'uploads' | 'generated'
 * @param key - object key
 * @returns Buffer + content type, or null if not found / not configured
 */
export async function getObject(
  bucket: 'uploads' | 'generated',
  key: string,
): Promise<{ body: Buffer; contentType: string } | null> {
  const client = getR2();
  if (!client) return null;

  const bucketName =
    bucket === 'uploads' ? getEnv('R2_BUCKET_UPLOADS', 'ironforge-uploads') : getEnv('R2_BUCKET_GENERATED', 'ironforge-generated');

  try {
    const response = await client.send(
      new GetObjectCommand({ Bucket: bucketName, Key: key }),
    );

    if (!response.Body) return null;

    // response.Body is a Readable stream in Node.js runtime
    if (!(response.Body instanceof Readable)) {
      console.error('[r2:getObject] Unexpected body type:', typeof response.Body);
      return null;
    }

    const chunks: Uint8Array[] = [];
    for await (const chunk of response.Body) {
      chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
    }
    const body = Buffer.concat(chunks);

    return {
      body,
      contentType: response.ContentType ?? 'application/octet-stream',
    };
  } catch {
    return null;
  }
}
