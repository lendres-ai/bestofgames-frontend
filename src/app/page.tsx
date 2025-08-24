import { getRecentReviews } from '@/lib/queries';

export const revalidate = 3600; // ISR: 1h

export default async function Page() {
  const items = await getRecentReviews();
  return (
    <main className="mx-auto max-w-5xl p-6 space-y-6">
      <h1 className="text-3xl font-bold">Indie Gems</h1>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(x => (
          <li key={x.slug} className="border rounded-lg p-4">
            <a href={`/games/${x.slug}`} className="block">
              <div className="text-xl font-semibold">{x.title}</div>
              <div className="text-zinc-600">{x.summary}</div>
              <div className="mt-2 font-mono">Score: {x.score ?? '—'}</div>
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}