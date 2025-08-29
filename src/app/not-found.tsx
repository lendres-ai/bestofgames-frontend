import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold">404 – Seite nicht gefunden</h1>
      <p className="text-gray-600 dark:text-gray-400">
        {"Entschuldigung, die gesuchte Seite wurde nicht gefunden."}
      </p>
      <Link href="/" className="text-indigo-600 underline dark:text-sky-400">
        Zur Startseite
      </Link>
    </main>
  );
}
