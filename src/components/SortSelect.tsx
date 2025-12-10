'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Locale, Dictionary } from '@/lib/dictionaries';

type SortSelectProps = {
  locale: Locale;
  dict: Dictionary;
};

export default function SortSelect({ dict }: SortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get('sort') ?? 'publishedAt';

  const options = [
    { value: 'publishedAt', label: dict.games.sort_options.publishedAt },
    { value: 'score', label: dict.games.sort_options.score },
    { value: 'title', label: dict.games.sort_options.title },
    { value: 'releaseDate', label: dict.games.sort_options.releaseDate },
  ];

  return (
    <select
      value={current}
      onChange={(e) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', e.target.value);
        router.replace(`?${params.toString()}`);
      }}
      className="rounded-md border p-2 text-sm"
      aria-label={dict.games.sort_by}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
