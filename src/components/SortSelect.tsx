'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

const options = [
  { value: 'publishedAt', label: 'Newest' },
  { value: 'score', label: 'Score' },
  { value: 'title', label: 'Title' },
];

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get('sort') ?? 'publishedAt';

  return (
    <div className="relative min-w-32">
      <select
        value={current}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString());
          params.set('sort', e.target.value);
          router.replace(`?${params.toString()}`);
        }}
        className="h-10 w-full appearance-none rounded-md border bg-white px-3 pr-8 text-sm shadow-sm"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
    </div>
  );
}
