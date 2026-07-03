import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { rateLimitAuth } from '@/lib/ratelimit';

/**
 * IRONFORGE — Auth.js v5 configuration.
 *
 * Providers:
 *  - Credentials (email + password, bcrypt-hashed)
 *
 * Session:
 *  - JWT strategy (stateless — no DB sessions table needed)
 *  - 30-day expiry
 *
 * NOTE: We intentionally do NOT use DrizzleAdapter because:
 *  1. We use JWT strategy (stateless) — no DB sessions needed
 *  2. The Credentials provider does its own user lookup via bcrypt
 *  3. The adapter's type expectations (sessionToken as PK) conflict with
 *     our schema (id as PK + sessionToken unique)
 *
 * trustHost: true (T2 lesson — mandatory for reverse-proxy deployments)
 *
 * Reference: Skills KB §12 (Auth.js v5 patterns from nextjs16-react19-next-auth5-drizzle-orm).
 * Reference: T2 lesson — trustHost:true prevents P0 production outage.
 */

// Lazy-init DB (avoids crash when env vars are missing)
async function getDb() {
  const { db } = await import('@/lib/db/client');
  return db;
}

async function getSchema() {
  return await import('@/lib/db/schema');
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // trustHost: true is mandatory for reverse-proxy (Vercel, Cloudflare) — T2 lesson
  trustHost: true,
  // JWT strategy — stateless, no DB sessions table needed
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 }, // 30 days
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email);
        const password = String(credentials.password);

        // P1 fix (OWASP A04/A07): Rate limit login attempts — 5 per 10 min per IP
        const headersList = await headers();
        const forwarded = headersList.get('x-forwarded-for');
        const ip = forwarded?.split(',')[0]?.trim() ?? 'unknown';
        const { success: rateLimitOk } = await rateLimitAuth(ip);
        if (!rateLimitOk) {
          console.warn('[auth:authorize] Rate limited', { email, ip });
          return null;
        }

        try {
          const db = await getDb();
          const { users } = await getSchema();

          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

          if (!user || !user.passwordHash) {
            // P2 fix (OWASP A09): Log failed login — user not found
            console.warn('[auth:authorize] Login failed — user not found', { email, ip });
            return null;
          }

          const valid = await bcrypt.compare(password, user.passwordHash);
          if (!valid) {
            // P2 fix: Log failed login — wrong password
            console.warn('[auth:authorize] Login failed — invalid password', { email, ip, userId: user.id });
            return null;
          }

          // P2 fix: Log successful login
          console.info('[auth:authorize] Login success', { email, ip, userId: user.id, role: user.role });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (err) {
          console.error('[auth:authorize] DB error:', err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // Include role in the JWT
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? 'member';
        token.id = user.id;
      }
      return token;
    },
    // Include role + id in the session
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
    // Redirect after sign-in — always go to /admin
    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/admin`;
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
});

// Type augmentation — add `role` and `id` to session.user
declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    };
  }

  interface User {
    role?: string;
  }
}
