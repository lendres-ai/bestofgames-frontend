"use client";

import { useEffect } from "react";
import {useTranslations} from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const t = useTranslations('Error');
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold">{t('title')}</h1>
      <button
        onClick={() => reset()}
        className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 dark:bg-sky-500 dark:hover:bg-sky-400"
      >
        {t('tryAgain')}
      </button>
    </main>
  );
}
