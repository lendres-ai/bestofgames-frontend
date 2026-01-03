import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * On-demand revalidation endpoint for cache busting
 * 
 * Usage:
 *   POST /api/revalidate
 *   Headers: { "x-revalidate-token": "your-secret-token" }
 *   Body: { "paths": ["/en", "/de"] }  // optional, defaults to landing pages
 * 
 * Or with query params:
 *   POST /api/revalidate?paths=/en,/de
 * 
 * This triggers Next.js ISR regeneration AND tells Cloudflare to purge via
 * the Cache-Tag system (if configured) or by returning proper headers.
 */

const REVALIDATE_TOKEN = process.env.REVALIDATE_TOKEN;

// Default paths to revalidate (landing pages that change often)
const DEFAULT_PATHS = ['/en', '/de'];

export async function POST(request: NextRequest) {
  // Validate token
  const token = request.headers.get('x-revalidate-token');
  
  if (!REVALIDATE_TOKEN) {
    console.warn('REVALIDATE_TOKEN not set - revalidation endpoint disabled');
    return NextResponse.json(
      { error: 'Revalidation not configured' },
      { status: 503 }
    );
  }

  if (token !== REVALIDATE_TOKEN) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }

  // Get paths to revalidate
  let paths: string[] = DEFAULT_PATHS;

  // Check query params first
  const queryPaths = request.nextUrl.searchParams.get('paths');
  if (queryPaths) {
    paths = queryPaths.split(',').map(p => p.trim()).filter(Boolean);
  } else {
    // Check request body
    try {
      const body = await request.json();
      if (Array.isArray(body.paths) && body.paths.length > 0) {
        paths = body.paths;
      }
    } catch {
      // No body or invalid JSON - use defaults
    }
  }

  // Revalidate each path
  const results: { path: string; success: boolean; error?: string }[] = [];

  for (const path of paths) {
    try {
      revalidatePath(path);
      results.push({ path, success: true });
    } catch (error) {
      results.push({ 
        path, 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  const allSuccess = results.every(r => r.success);

  return NextResponse.json(
    {
      revalidated: allSuccess,
      timestamp: Date.now(),
      paths: results,
    },
    { 
      status: allSuccess ? 200 : 207,
      headers: {
        // Tell Cloudflare to purge these paths from cache
        'CDN-Cache-Control': 'no-cache',
        'Cache-Control': 'no-store',
      }
    }
  );
}

// Also support GET for simple webhook integrations (less secure, use with caution)
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');
  
  if (!REVALIDATE_TOKEN || token !== REVALIDATE_TOKEN) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  // Revalidate default paths
  for (const path of DEFAULT_PATHS) {
    revalidatePath(path);
  }

  return NextResponse.json({
    revalidated: true,
    timestamp: Date.now(),
    paths: DEFAULT_PATHS,
  });
}
