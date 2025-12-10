import { getRandomGame } from '@/lib/queries';
import { NextResponse } from 'next/server';

// Disable caching - we want a fresh random game each time
export const dynamic = 'force-dynamic';

export async function GET() {
    const game = await getRandomGame();

    if (!game) {
        return NextResponse.json({ error: 'No games found' }, { status: 404 });
    }

    return NextResponse.json({ slug: game.slug });
}

