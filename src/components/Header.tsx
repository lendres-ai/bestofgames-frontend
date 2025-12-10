"use client";

import Link from "next/link";
import { Gamepad2, Menu, X } from "lucide-react";
import { useState } from "react";
import { Locale, Dictionary } from "@/lib/dictionaries";

type HeaderProps = {
  locale: Locale;
  dict: Dictionary;
};

export default function Header({ locale, dict }: HeaderProps) {
  const [open, setOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gradient-to-r from-indigo-600 via-sky-500 to-fuchsia-500 shadow-lg dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="mx-auto max-w-screen-xl px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Brand / Logo */}
          <Link
            href={`/${locale}`}
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
                href={`/${locale}/games`} 
                className="text-white/90 transition-colors hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:rounded"
              >
                {dict.nav.games}
              </Link>
              <Link 
                href={`/${locale}/wishlist`} 
                className="text-white/90 transition-colors hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:rounded"
              >
                {dict.nav.wishlist}
              </Link>
              <Link 
                href={`/${locale}/about`} 
                className="text-white/90 transition-colors hover:text-white focus:text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:rounded"
              >
                {dict.nav.about}
              </Link>
            </nav>
          </div>

          {/* Mobile toggle */}
          <button
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="inline-flex items-center justify-center rounded-md p-2 text-white transition-colors hover:bg-white/10 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <nav id="mobile-menu" className="md:hidden pb-4" role="navigation" aria-label="Mobile navigation">
            <div className="flex flex-col gap-2 rounded-lg bg-white/20 p-3 ring-1 ring-white/20 backdrop-blur">
              <Link 
                onClick={() => setOpen(false)} 
                href={`/${locale}/games`} 
                className="rounded px-3 py-2 text-white/95 transition-colors hover:bg-white/10 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                {dict.nav.games}
              </Link>
              <Link 
                onClick={() => setOpen(false)} 
                href={`/${locale}/wishlist`} 
                className="rounded px-3 py-2 text-white/95 transition-colors hover:bg-white/10 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                {dict.nav.wishlist}
              </Link>
              <Link 
                onClick={() => setOpen(false)} 
                href={`/${locale}/about`} 
                className="rounded px-3 py-2 text-white/95 transition-colors hover:bg-white/10 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                {dict.nav.about}
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
