"use client";

import { Dice5 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
    locale: string;
    label: string;
};

export default function RandomGameButton({ locale, label }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await fetch('/api/games/random');
            if (!res.ok) throw new Error('Failed to fetch random game');
            const { slug } = await res.json();
            if (slug) {
                router.push(`/${locale}/games/${slug}`);
            }
        } catch (error) {
            console.error('Error fetching random game:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:scale-105 hover:shadow-lg hover:shadow-fuchsia-500/25 focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:ring-offset-2 disabled:opacity-70 disabled:hover:scale-100"
        >
            <Dice5
                className={`h-4 w-4 transition-transform duration-500 ${loading ? 'animate-spin' : 'group-hover:rotate-180'}`}
            />
            <span>{loading ? '...' : label}</span>
            {/* Shimmer effect on hover */}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </button>
    );
}

