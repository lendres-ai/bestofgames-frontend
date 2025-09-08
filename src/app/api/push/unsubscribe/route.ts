import { NextRequest, NextResponse } from 'next/server';
import { deleteSubscriptionByEndpoint } from '@/lib/push';

type Body = { endpoint: string };

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<Body>;
    if (!body?.endpoint) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }
    await deleteSubscriptionByEndpoint(body.endpoint);
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: 'Failed to unsubscribe' }, { status: 500 });
  }
}


