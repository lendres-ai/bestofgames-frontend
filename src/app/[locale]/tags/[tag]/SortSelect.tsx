'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {useTranslations} from 'next-intl';

const options: {value: string; key: 'newest' | 'score' | 'title'}[] = [
  { value: 'publishedAt', key: 'newest' },
  { value: 'score', key: 'score' },
  { value: 'title', key: 'title' },
];

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get('sort') ?? 'publishedAt';
  const t = useTranslations('Sort');

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
          {t(o.key)}
        </option>
      ))}
    </select>
  );
}
