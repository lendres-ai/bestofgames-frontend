'use client';

import { useState, useEffect, useCallback } from 'react';
import { type Locale, type Dictionary } from '@/lib/dictionaries';
import { type HeroVariant } from '@/lib/ab-test';
import FeaturedGameCard from './FeaturedGameCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GameData {
    slug: string;
    title: string;
    summary?: string | null;
    image: string;
    score?: number | null;
    tags?: string[];
}

interface FeaturedCarouselProps {
    games: GameData[];
    locale: Locale;
    dict: Dictionary;
    heroVariant: HeroVariant;
}

export default function FeaturedCarousel({ games, locale, dict, heroVariant }: FeaturedCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // Auto-rotate
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % games.length);
        }, 3000); // 6 seconds per slide

        return () => clearInterval(interval);
    }, [games.length, isPaused]);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % games.length);
    }, [games.length]);

    const goToPrev = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + games.length) % games.length);
    }, [games.length]);

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsPaused(true);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const handleTouchEnd = () => {
        setIsPaused(false);
        if (!touchStart || !touchEnd) return;

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            goToNext();
        } else if (isRightSwipe) {
            goToPrev();
        }

        setTouchEnd(null);
        setTouchStart(null);
    };

    if (!games.length) return null;

    const currentGame = games[currentIndex];

    return (
        <div
            className="group relative touch-pan-y"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            aria-roledescription="carousel"
        >
            <div className="relative overflow-hidden rounded-3xl">
                {/* We use a key to force re-mounting for fresh animations on each slide change if desired, 
            but for FeaturedGameCard the 3D effect uses refs, so re-mounting is safer to reset state. 
            However, we want a smooth transition. simple crossfade is tricky with complex 3D cards.
            Let's just render the current one for now with a simple fade-in animation key.
        */}
                <div key={currentGame.slug} className="animate-in fade-in zoom-in-95 duration-500">
                    <FeaturedGameCard
                        {...currentGame}
                        locale={locale}
                        dict={dict}
                        heroVariant={heroVariant}
                        position={currentIndex}
                    />
                </div>
            </div>

            {/* Navigation Controls - visible on hover or focus */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-within:opacity-100">
                <button
                    onClick={(e) => {
                        e.preventDefault(); // Prevent navigating if wrapped in a link (though it shouldn't be)
                        goToPrev();
                    }}
                    className="pointer-events-auto rounded-full bg-black/30 p-2 text-white/80 backdrop-blur-md transition hover:bg-black/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label="Previous"
                >
                    <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        goToNext();
                    }}
                    className="pointer-events-auto rounded-full bg-black/30 p-2 text-white/80 backdrop-blur-md transition hover:bg-black/50 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label="Next"
                >
                    <ChevronRight className="h-8 w-8" />
                </button>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 rounded-full bg-black/20 px-3 py-1.5 backdrop-blur-sm">
                {games.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2 transition-all duration-300 rounded-full ${idx === currentIndex ? 'w-6 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                        aria-current={idx === currentIndex}
                    />
                ))}
            </div>
        </div>
    );
}
