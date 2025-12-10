import { NextRequest, NextResponse } from 'next/server';
import { searchGames } from '@/lib/queries';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';
  const limitParam = searchParams.get('limit');
  const limit = Math.min(parseInt(limitParam || '10', 10) || 10, 50);

  if (query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const results = await searchGames(query, limit);
    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { results: [], error: 'Search failed' },
      { status: 500 }
    );
  }
}

