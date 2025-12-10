import { NextRequest } from 'next/server';

/**
 * Verify that a request is authorized to access cron endpoints.
 * Checks for either:
 * - Vercel Cron's Authorization: Bearer <CRON_SECRET> header
 * - Custom x-cron-secret header (for manual/local triggering)
 */
export function verifyCronSecret(req: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;

  // Vercel Cron sends: Authorization: Bearer <CRON_SECRET>
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader === `Bearer ${expected}`) return true;

  // Fallback for manual/local triggering with a custom header
  const provided = req.headers.get('x-cron-secret');
  return provided === expected;
}

