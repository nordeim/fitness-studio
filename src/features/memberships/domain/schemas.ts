import { z } from 'zod';

/**
 * IRONFORGE — Membership Zod schemas (domain layer).
 */

export const CheckoutRequestSchema = z.object({
  priceId: z.string().min(1, 'Price ID is required'),
  tier: z.enum(['forge', 'forge_plus', 'forge_private', 'drop_in'], {
    message: 'Invalid tier',
  }),
});

export type CheckoutRequest = z.infer<typeof CheckoutRequestSchema>;

export const CheckoutResponseSchema = z.object({
  success: z.boolean(),
  code: z.enum([
    'SUCCESS',
    'VALIDATION',
    'NOT_CONFIGURED',
    'UNAUTHORIZED',
    'INTERNAL',
  ]),
  message: z.string(),
  url: z.string().url().nullable().optional(),
  sessionId: z.string().nullable().optional(),
});

export type CheckoutResponse = z.infer<typeof CheckoutResponseSchema>;

export const PortalResponseSchema = z.object({
  success: z.boolean(),
  code: z.enum(['SUCCESS', 'NOT_CONFIGURED', 'UNAUTHORIZED', 'INTERNAL']),
  message: z.string(),
  url: z.string().url().nullable().optional(),
});

export type PortalResponse = z.infer<typeof PortalResponseSchema>;
