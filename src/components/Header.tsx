import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 shadow">
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex items-center justify-center">
        <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
          BestOfGames
        </Link>
      </div>
    </header>
  );
}
