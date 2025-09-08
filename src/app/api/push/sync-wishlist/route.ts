import { NextRequest, NextResponse } from 'next/server';
import { syncSubscriptionSlugs } from '@/lib/push';

type Body = { endpoint: string; slugs: string[] };

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<Body>;
    if (!body?.endpoint || !Array.isArray(body?.slugs)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    await syncSubscriptionSlugs(body.endpoint, body.slugs);
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: 'Failed to sync' }, { status: 500 });
  }
}


