"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function NotFound() {
  const { locale } = useParams<{ locale: string }>();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold">404 - Page Not Found</h1>
      <p className="text-gray-600 dark:text-gray-400">
        {"Sorry, we couldn't find the page you're looking for."}
      </p>
      <Link href={`/${locale}`} className="text-indigo-600 underline dark:text-sky-400">
        Go back home
      </Link>
    </main>
  );
}
