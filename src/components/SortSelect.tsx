'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const options = [
  { value: 'publishedAt', label: 'Newest' },
  { value: 'score', label: 'Score' },
  { value: 'title', label: 'Title' },
  { value: 'releaseDate', label: 'Release Date' },
];

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get('sort') ?? 'publishedAt';

  return (
    <select
      value={current}
      onChange={(e) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', e.target.value);
        router.replace(`?${params.toString()}`);
      }}
      className="rounded-md border p-2 text-sm"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
