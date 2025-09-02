'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [term, setTerm] = useState(searchParams.get('search') ?? '');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        if (term) {
          params.set('search', term);
        } else {
          params.delete('search');
        }
        router.replace(`?${params.toString()}`);
      }}
      className="flex-1"
    >
      <input
        type="search"
        placeholder="Search games..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className="w-full rounded-md border p-2 text-sm"
      />
    </form>
  );
}
