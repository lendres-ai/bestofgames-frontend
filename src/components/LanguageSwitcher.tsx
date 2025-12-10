"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Globe } from "lucide-react";
import { Locale, locales } from "@/lib/dictionaries";

const languageNames: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
};

const languageFlags: Record<Locale, string> = {
  en: "🇬🇧",
  de: "🇩🇪",
};

export default function LanguageSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const pathname = usePathname();

  // Get the path without the current locale prefix
  const getPathWithoutLocale = () => {
    // Remove the locale prefix from the path
    const segments = pathname.split("/");
    if (locales.includes(segments[1] as Locale)) {
      segments.splice(1, 1);
    }
    return segments.join("/") || "/";
  };

  const pathWithoutLocale = getPathWithoutLocale();

  return (
    <div className="relative group">
      <button
        className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
        aria-label="Select language"
        aria-haspopup="true"
      >
        <Globe className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">{languageFlags[currentLocale]}</span>
      </button>

      {/* Dropdown */}
      <div className="absolute right-0 top-full z-50 mt-1 hidden min-w-[120px] overflow-hidden rounded-lg border border-white/20 bg-white shadow-lg ring-1 ring-black/5 group-hover:block dark:bg-gray-800">
        <ul className="py-1" role="menu">
          {locales.map((locale) => (
            <li key={locale} role="menuitem">
              <Link
                href={`/${locale}${pathWithoutLocale}`}
                className={`flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  locale === currentLocale
                    ? "font-medium text-indigo-600 dark:text-sky-400"
                    : "text-gray-700 dark:text-gray-200"
                }`}
                aria-current={locale === currentLocale ? "true" : undefined}
              >
                <span>{languageFlags[locale]}</span>
                <span>{languageNames[locale]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

