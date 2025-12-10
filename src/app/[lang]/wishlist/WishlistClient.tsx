"use client";

import { useEffect, useState } from "react";
import { getWishlistSlugs } from "@/lib/wishlist";
import ReviewCard from "@/components/ReviewCard";
import AlertsToggle from "@/components/AlertsToggle";
import { Locale, Dictionary } from "@/lib/dictionaries";

type ApiItem = {
  slug: string;
  title: string;
  heroUrl: string | null;
  images: string | null;
  score: string | number | null;
  releaseDate: string | null;
};

type ReviewCardItem = {
  slug: string;
  title: string;
  image: string;
  score: number | null;
  releaseDate: string | null;
};

export default function WishlistClient({ 
  locale, 
  dict 
}: { 
  locale: Locale; 
  dict: Dictionary;
}) {
  const [items, setItems] = useState<ReviewCardItem[] | null>(null);

  useEffect(() => {
    async function load() {
      const slugs = getWishlistSlugs();
      if (slugs.length === 0) {
        setItems([]);
        return;
      }
      const params = new URLSearchParams({ slugs: slugs.join(",") });
      const res = await fetch(`/api/games/by-slugs?${params.toString()}`, { cache: "no-store" });
      const data: ApiItem[] = await res.json();
      const mapped: ReviewCardItem[] = data.map((r) => ({
        slug: r.slug,
        title: r.title,
        image: r.images ?? r.heroUrl ?? "https://placehold.co/1200x675.png",
        score: r.score != null ? Number(r.score) : null,
        releaseDate: r.releaseDate,
      }));
      setItems(mapped);
    }
    load();
  }, []);

  return (
    <main className="mx-auto max-w-screen-xl px-[var(--container-x)] pt-[var(--section-pt)] pb-[var(--section-pb)] 2xl:px-0">
      <header className="mb-[var(--space-8)] flex items-center gap-4 justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{dict.wishlist.title}</h1>
        <AlertsToggle label={dict.wishlist.alerts} />
      </header>
      {items === null ? (
        <p className="text-sm text-gray-600 dark:text-gray-300">{dict.wishlist.loading}</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-600 dark:text-gray-300">{dict.wishlist.empty}</p>
      ) : (
        <ul className="grid gap-[var(--block-gap)] sm:grid-cols-2 lg:grid-cols-3">
          {items.map((r) => (
            <ReviewCard key={r.slug} {...r} locale={locale} />
          ))}
        </ul>
      )}
    </main>
  );
}

