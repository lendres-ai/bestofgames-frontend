"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { Search, X, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Locale, Dictionary } from "@/lib/dictionaries";

type SearchResult = {
  slug: string;
  title: string;
  heroUrl: string | null;
  images: string | null;
  score: string | null;
  developer: string | null;
  matchedTag: string | null;
};

type SearchBarProps = {
  locale: Locale;
  dict: Dictionary;
};

export default function SearchBar({ locale, dict }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const [isMounted, setIsMounted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const router = useRouter();

  // Client-side only mounting for portal
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate dropdown position relative to viewport
  const updateDropdownPosition = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8, // 8px gap (mt-2)
        right: window.innerWidth - rect.right,
      });
    }
  }, []);

  // Update position when opening or on scroll/resize
  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
      window.addEventListener("scroll", updateDropdownPosition, true);
      window.addEventListener("resize", updateDropdownPosition);
      return () => {
        window.removeEventListener("scroll", updateDropdownPosition, true);
        window.removeEventListener("resize", updateDropdownPosition);
      };
    }
  }, [isOpen, updateDropdownPosition]);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&limit=8`
        );
        const data = await res.json();
        setResults(data.results || []);
        setIsOpen(true);
        setSelectedIndex(-1);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen || results.length === 0) {
        if (e.key === "Escape") {
          setQuery("");
          inputRef.current?.blur();
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            router.push(`/${locale}/games/${results[selectedIndex].slug}`);
            setIsOpen(false);
            setQuery("");
          }
          break;
        case "Escape":
          setIsOpen(false);
          break;
      }
    },
    [isOpen, results, selectedIndex, router, locale]
  );

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery("");
  };

  const getCoverImage = (result: SearchResult) =>
    result.heroUrl || result.images || "/logo.png";

  // Dropdown content to be portaled
  const dropdownContent = isOpen && results.length > 0 && (
    <ul
      ref={dropdownRef}
      id="search-results"
      role="listbox"
      style={{
        position: "fixed",
        top: dropdownPosition.top,
        right: dropdownPosition.right,
      }}
      className="z-[100] max-h-[70vh] w-72 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-2xl sm:w-80 dark:border-gray-700 dark:bg-gray-900"
    >
      {results.map((result, index) => (
        <li
          key={result.slug}
          role="option"
          aria-selected={index === selectedIndex}
        >
          <Link
            href={`/${locale}/games/${result.slug}`}
            onClick={handleResultClick}
            data-umami-event="Search Result Click" data-umami-event-game={result.slug}
            className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 ${index === selectedIndex ? "bg-gray-100 dark:bg-gray-800" : ""
              }`}
          >
            <Image
              src={getCoverImage(result)}
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 rounded-lg object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-gray-900 dark:text-white">
                {result.title}
              </p>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                {result.developer}
                {result.matchedTag && (
                  <span className="ml-1 rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                    {result.matchedTag}
                  </span>
                )}
              </p>
            </div>
            {result.score && (
              <span className="shrink-0 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                {result.score}
              </span>
            )}
          </Link>
        </li>
      ))}
    </ul>
  );

  // No results content to be portaled
  const noResultsContent = isOpen &&
    query.length >= 2 &&
    !isLoading &&
    results.length === 0 && (
      <div
        style={{
          position: "fixed",
          top: dropdownPosition.top,
          right: dropdownPosition.right,
        }}
        className="z-[100] w-64 rounded-xl border border-gray-200 bg-white p-4 text-center text-sm text-gray-500 shadow-xl dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
      >
        {dict.search?.no_results || "No games found"}
      </div>
    );

  return (
    <div ref={containerRef} className="relative">
      {/* Search Input */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() =>
            query.length >= 2 && results.length > 0 && setIsOpen(true)
          }
          placeholder={dict.search?.placeholder || "Search..."}
          className="w-40 rounded-lg bg-white/10 py-2 pl-9 pr-8 text-base text-white placeholder:text-white/50 backdrop-blur-sm transition-all duration-200 focus:w-56 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 sm:w-48 sm:text-sm sm:focus:w-64"
          aria-label={dict.search?.aria_label || "Search games"}
          aria-expanded={isOpen}
          aria-controls="search-results"
          aria-autocomplete="list"
          role="combobox"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-white/60 transition-colors hover:text-white"
            aria-label={dict.search?.clear || "Clear search"}
            type="button"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </button>
        )}
      </div>

      {/* Portal dropdown to document.body to escape overflow clipping */}
      {isMounted && createPortal(
        <>
          {dropdownContent}
          {noResultsContent}
        </>,
        document.body
      )}
    </div>
  );
}
