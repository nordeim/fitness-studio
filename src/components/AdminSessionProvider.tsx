'use client';

import { SessionProvider } from 'next-auth/react';
import { type ReactNode } from 'react';

/**
 * IRONFORGE — Client-side SessionProvider wrapper.
 *
 * Wraps the admin section so client components (login form, sign-out button)
 * can use useSession() and signIn()/signOut() from next-auth/react.
 *
 * The marketing site (public) does NOT need this provider — it's anonymous.
 */
export function AdminSessionProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
