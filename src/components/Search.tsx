"use client";

import { useRouter } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";

export default function Search() {
  const router = useRouter();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get("query") as string;
    router.push(`/search?query=${query}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="search"
        name="query"
        placeholder="Search games..."
        className="w-full rounded-md border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/50 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
      />
      <button
        type="submit"
        aria-label="Search"
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/50 transition-colors hover:text-white focus:text-white focus:outline-none"
      >
        <SearchIcon className="h-5 w-5" />
      </button>
    </form>
  );
}
