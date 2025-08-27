"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Brand */}
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-gray-900 hover:opacity-90 transition dark:text-white"
          >
            BestOfGames – Indie Gems
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <Link href="/games" className="text-gray-700 hover:text-black transition dark:text-gray-300 dark:hover:text-white">Games</Link>
            <Link href="/reviews" className="text-gray-700 hover:text-black transition dark:text-gray-300 dark:hover:text-white">Reviews</Link>
            <Link href="/about" className="text-gray-700 hover:text-black transition dark:text-gray-300 dark:hover:text-white">About</Link>
          </nav>

          {/* Mobile toggle */}
          <button
            aria-label="Open menu"
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 md:hidden dark:text-gray-300"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <nav className="pb-4 md:hidden">
            <div className="flex flex-col gap-2 rounded-lg bg-gray-50 p-3 ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700">
              <Link onClick={() => setOpen(false)} href="/games" className="rounded px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">Games</Link>
              <Link onClick={() => setOpen(false)} href="/reviews" className="rounded px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">Reviews</Link>
              <Link onClick={() => setOpen(false)} href="/about" className="rounded px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700">About</Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}