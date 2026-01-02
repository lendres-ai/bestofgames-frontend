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
        const newSort = e.target.value;
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', newSort);
        router.replace(`?${params.toString()}`);

        // Track filter_applied event
        if (typeof window !== 'undefined' && window.umami) {
          window.umami.track('filter_applied', {
            filter_type: 'sort',
            filter_value: newSort,
            previous_value: current,
          });
        }
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
