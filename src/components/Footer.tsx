import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-white/10 bg-white/50 backdrop-blur dark:bg-gray-900/50">
      <div className="mx-auto max-w-screen-xl px-6 py-8 text-sm text-gray-600 dark:text-gray-300 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="order-2 sm:order-1">© {new Date().getFullYear()} BestOfGames</p>
          <nav className="order-1 flex items-center gap-5 sm:order-2">
            <Link className="hover:text-gray-900 dark:hover:text-white" href="/about">About</Link>
            <Link className="hover:text-gray-900 dark:hover:text-white" href="/privacy">Privacy</Link>
            <Link className="hover:text-gray-900 dark:hover:text-white" href="/contact">Contact</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}


