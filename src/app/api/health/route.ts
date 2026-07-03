import { NextResponse } from 'next/server';

/**
 * GET /api/health
 *
 * Lightweight health check endpoint used by the Dockerfile HEALTHCHECK
 * and container orchestration (docker-compose, Kubernetes, etc.).
 *
 * Returns 200 with a JSON body when the Next.js process is alive and
 * able to serve requests. Does NOT check DB connectivity — that is a
 * deeper health check that would fail in dev without a database. The
 * purpose of this endpoint is to verify the web process is running.
 *
 * Reference: Dockerfile HEALTHCHECK (line 101-102).
 */

export const dynamic = 'force-dynamic';

export function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    { status: 200 },
  );
}
