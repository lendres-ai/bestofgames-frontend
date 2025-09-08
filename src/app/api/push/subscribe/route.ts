import { NextRequest, NextResponse } from 'next/server';
import { upsertSubscription, type ClientSubscription } from '@/lib/push';

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<ClientSubscription>;
    if (!body?.endpoint || !body?.keys?.p256dh || !body?.keys?.auth) {
      return NextResponse.json({ error: 'Invalid subscription payload' }, { status: 400 });
    }
    const id = await upsertSubscription({
      endpoint: body.endpoint,
      keys: { p256dh: body.keys.p256dh, auth: body.keys.auth },
      userAgent: body.userAgent,
    });
    return NextResponse.json({ id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
  }
}


