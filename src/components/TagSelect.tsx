'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

export default function TagSelect({ tags }: { tags: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get('tag') ?? '';

  return (
    <div className="relative min-w-32">
      <select
        value={current}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString());
          const value = e.target.value;
          if (value) {
            params.set('tag', value);
          } else {
            params.delete('tag');
          }
          router.replace(`?${params.toString()}`);
        }}
        className="h-10 w-full appearance-none rounded-md border bg-white px-3 pr-8 text-sm shadow-sm"
      >
        <option value="">All Tags</option>
        {tags.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
    </div>
  );
}
