'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function TagSelect({ tags }: { tags: string[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get('tag') ?? '';

  return (
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
      className="rounded-md border p-2 text-sm"
    >
      <option value="">All Tags</option>
      {tags.map((t) => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </select>
  );
}
