import { handlers } from '@/lib/auth';

/**
 * IRONFORGE — Auth.js v5 catch-all route.
 *
 * Handles:
 *  - GET  /api/auth/signin
 *  - GET  /api/auth/signout
 *  - GET  /api/auth/session
 *  - POST /api/auth/callback/credentials
 *  - POST /api/auth/signout
 *
 * force-dynamic: prevents prerender failure (DrizzleAdapter needs env vars
 * at module load — Anti-pattern #18 from Skills KB).
 */
export const { GET, POST } = handlers;
