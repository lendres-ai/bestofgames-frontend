"use client";

import { Heart } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { isInWishlist, toggleWishlist } from "@/lib/wishlist";
import { Dictionary } from "@/lib/dictionaries";

type WishlistButtonProps = {
  slug: string;
  dict: Dictionary;
};

export default function WishlistButton({ slug, dict }: WishlistButtonProps) {
  const [inWishlist, setInWishlist] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setInWishlist(isInWishlist(slug));
  }, [slug]);

  function onToggle() {
    startTransition(() => {
      const nowIn = toggleWishlist(slug);
      setInWishlist(nowIn);
    });
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={inWishlist}
      aria-label={inWishlist ? dict.game_detail.remove_from_wishlist : dict.game_detail.add_to_wishlist}
      data-umami-event="Wishlist" data-umami-event-action={inWishlist ? "remove" : "add"}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-2.5 text-sm font-semibold shadow-sm ring-1 ring-black/5 backdrop-blur transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 ${inWishlist
          ? "bg-pink-600 text-white hover:brightness-110"
          : "bg-white/60 text-gray-900 dark:bg-gray-900/60 dark:text-white"
        }`}
      disabled={isPending}
    >
      <Heart className={`h-4 w-4 ${inWishlist ? "fill-white" : ""}`} />
      {inWishlist ? dict.game_detail.remove_from_wishlist : dict.game_detail.add_to_wishlist}
    </button>
  );
}
