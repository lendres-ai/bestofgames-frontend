import Link from "next/link";
import { Gamepad2 } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import HeaderClient from "./HeaderClient";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gradient-to-r from-indigo-600 via-sky-500 to-fuchsia-500 shadow-lg dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="mx-auto max-w-screen-xl px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Brand / Logo */}
          <Link
            href="/"
            aria-label="BestOfGames - Go to homepage"
            className="flex items-center gap-2 rounded-md text-2xl font-extrabold tracking-tight text-white drop-shadow-sm transition-opacity hover:opacity-90 focus:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <Gamepad2 className="h-6 w-6 text-white" aria-hidden="true" />
            BestOfGames
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-8 text-sm font-medium" role="navigation" aria-label="Main navigation">
              <Link 
                href="/games" 
                className="text-white/90 transition-colors hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:rounded"
              >
                Games
              </Link>
              <Link 
                href="/about" 
                className="text-white/90 transition-colors hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:rounded"
              >
                About
              </Link>
            </nav>
            <ThemeToggle />
          </div>

          <HeaderClient />
        </div>
      </div>
    </header>
  );
}