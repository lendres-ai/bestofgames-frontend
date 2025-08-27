"use client";

import {Link} from "@/navigation";
import { Gamepad2, Menu, X } from "lucide-react";
import { useState } from "react";
import {useTranslations} from 'next-intl';

export default function Header() {
  const [open, setOpen] = useState(false);
  const t = useTranslations('Header');
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gradient-to-r from-indigo-600 via-sky-500 to-fuchsia-500 shadow-lg dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="mx-auto max-w-screen-xl px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Brand / Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 rounded-md text-2xl font-extrabold tracking-tight text-white drop-shadow-sm hover:opacity-90 transition"
          >
            <Gamepad2 className="h-6 w-6 text-white" />
            BestOfGames
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/games" className="text-white/90 hover:text-white transition">{t('games')}</Link>
            <Link href="/reviews" className="text-white/90 hover:text-white transition">{t('reviews')}</Link>
            <Link href="/about" className="text-white/90 hover:text-white transition">{t('about')}</Link>
          </nav>

          {/* Mobile toggle */}
          <button
            aria-label="Open menu"
            className="inline-flex items-center justify-center rounded-md p-2 text-white md:hidden"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <nav className="md:hidden pb-4">
            <div className="flex flex-col gap-2 rounded-lg bg-white/20 p-3 ring-1 ring-white/20 backdrop-blur">
              <Link onClick={() => setOpen(false)} href="/games" className="rounded px-3 py-2 text-white/95 hover:bg-white/10">{t('games')}</Link>
              <Link onClick={() => setOpen(false)} href="/reviews" className="rounded px-3 py-2 text-white/95 hover:bg-white/10">{t('reviews')}</Link>
              <Link onClick={() => setOpen(false)} href="/about" className="rounded px-3 py-2 text-white/95 hover:bg-white/10">{t('about')}</Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}