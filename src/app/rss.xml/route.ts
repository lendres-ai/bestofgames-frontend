import { NextResponse } from 'next/server';
import { getRecentReviews } from '@/lib/queries';

export const revalidate = 3600;

export async function GET() {
  const baseUrl = 'https://bestof.games';
  const items = await getRecentReviews(20);

  const feedItems = items.map((item) => {
    const link = `${baseUrl}/games/${item.slug}`;
    const title = escapeXml(item.title ?? 'Untitled');
    const description = escapeXml(item.summary ?? '');
    const pubDate = item.publishedAt ? new Date(item.publishedAt).toUTCString() : new Date().toUTCString();
    return `
      <item>
        <title>${title}</title>
        <link>${link}</link>
        <guid isPermaLink="true">${link}</guid>
        <description>${description}</description>
        <pubDate>${pubDate}</pubDate>
      </item>`;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0">
    <channel>
      <title>BestOfGames – Latest Reviews</title>
      <link>${baseUrl}</link>
      <description>Latest indie game reviews and ratings from BestOfGames</description>
      <language>en-us</language>
      ${feedItems}
    </channel>
  </rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=UTF-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

function escapeXml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

