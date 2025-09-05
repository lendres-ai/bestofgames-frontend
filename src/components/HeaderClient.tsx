"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function HeaderClient() {
  const [open, setOpen] = useState(false);
  return (
    <>
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

      {/* Mobile menu */}
      {open && (
        <nav id="mobile-menu" className="md:hidden pb-4" role="navigation" aria-label="Mobile navigation">
          <div className="flex flex-col gap-2 rounded-lg bg-white/20 p-3 ring-1 ring-white/20 backdrop-blur">
            <Link 
              onClick={() => setOpen(false)} 
              href="/games" 
              className="rounded px-3 py-2 text-white/95 transition-colors hover:bg-white/10 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              Games
            </Link>
            <Link 
              onClick={() => setOpen(false)} 
              href="/about" 
              className="rounded px-3 py-2 text-white/95 transition-colors hover:bg-white/10 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              About
            </Link>
            <div className="flex items-center justify-between rounded px-3 py-2">
              <span className="text-white/95 text-sm">Theme</span>
              <ThemeToggle />
            </div>
          </div>
        </nav>
      )}
    </>
  );
}

