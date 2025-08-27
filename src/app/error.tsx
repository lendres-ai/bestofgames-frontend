"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <button
        onClick={() => reset()}
        className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 dark:bg-sky-500 dark:hover:bg-sky-400"
      >
        Try again
      </button>
    </main>
  );
}
