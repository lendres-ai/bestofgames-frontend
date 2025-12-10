import { NextResponse } from 'next/server';
import { getRecentReviews } from '@/lib/queries';
import { getLocalizedText } from '@/lib/i18n';

export const revalidate = 3600;

export async function GET() {
  const baseUrl = 'https://bestof.games';
  const locale = 'en'; // RSS feed uses English as default
  const items = await getRecentReviews(20);

  const feedItems = items.map((item) => {
    const link = `${baseUrl}/${locale}/games/${item.slug}`;
    const title = escapeXml(getLocalizedText(item.title, locale) || 'Untitled');
    const description = escapeXml(getLocalizedText(item.summary, locale) || '');
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
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>BestOfGames – Latest Reviews</title>
      <link>${baseUrl}/${locale}</link>
      <description>Latest indie game reviews and ratings from BestOfGames</description>
      <language>en-us</language>
      <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
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
