"use client";

import { useEffect, useState } from "react";
import { getWishlistSlugs } from "@/lib/wishlist";
import ReviewCard, { ReviewCardProps } from "@/components/ReviewCard";
import AlertsToggle from "@/components/AlertsToggle";

type ApiItem = {
  slug: string;
  title: string;
  heroUrl: string | null;
  images: string | null;
  score: string | number | null;
  releaseDate: string | null;
};

export default function WishlistClient() {
  const [items, setItems] = useState<ReviewCardProps[] | null>(null);

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
      const mapped: ReviewCardProps[] = data.map((r) => ({
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
        <h1 className="text-3xl font-bold tracking-tight">Your Wishlist</h1>
        <AlertsToggle />
      </header>
      {items === null ? (
        <p className="text-sm text-gray-600 dark:text-gray-300">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-gray-600 dark:text-gray-300">Your wishlist is empty.</p>
      ) : (
        <ul className="grid gap-[var(--block-gap)] sm:grid-cols-2 lg:grid-cols-3">
          {items.map((r) => (
            <ReviewCard key={r.slug} {...r} />
          ))}
        </ul>
      )}
    </main>
  );
}

