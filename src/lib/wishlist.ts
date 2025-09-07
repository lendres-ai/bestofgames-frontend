"use client";

const WISHLIST_KEY = "wishlist:slugs";

export function getWishlistSlugs(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(WISHLIST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

export function isInWishlist(slug: string): boolean {
  return getWishlistSlugs().includes(slug);
}

export function addToWishlist(slug: string) {
  if (typeof window === "undefined") return;
  const current = new Set(getWishlistSlugs());
  current.add(slug);
  window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(Array.from(current)));
}

export function removeFromWishlist(slug: string) {
  if (typeof window === "undefined") return;
  const current = new Set(getWishlistSlugs());
  current.delete(slug);
  window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(Array.from(current)));
}

export function toggleWishlist(slug: string): boolean {
  if (typeof window === "undefined") return false;
  const current = new Set(getWishlistSlugs());
  if (current.has(slug)) {
    current.delete(slug);
  } else {
    current.add(slug);
  }
  window.localStorage.setItem(WISHLIST_KEY, JSON.stringify(Array.from(current)));
  return current.has(slug);
}

