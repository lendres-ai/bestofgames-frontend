'use client';

import Image from 'next/image';

interface CoverItem {
    slug: string;
    title: string;
    image: string;
}

interface HeroCoverGridProps {
    covers: CoverItem[];
}

export default function HeroCoverGrid({ covers }: HeroCoverGridProps) {
    // Use only 8 covers for performance, duplicate for seamless scroll
    const optimizedCovers = covers.slice(0, 8);
    const duplicatedCovers = [...optimizedCovers, ...optimizedCovers];

    return (
        <div className="hero-cover-grid-container" aria-hidden="true">
            {/* Animated grid */}
            <div className="hero-cover-grid">
                {duplicatedCovers.map((cover, index) => (
                    <div key={`${cover.slug}-${index}`} className="hero-cover-item">
                        <Image
                            src={cover.image}
                            alt=""
                            width={150}
                            height={210}
                            className="hero-cover-image"
                            loading="lazy"
                            sizes="(max-width: 640px) 100px, 150px"
                            referrerPolicy="no-referrer"
                        />
                    </div>
                ))}
            </div>

            {/* Gradient overlay for text readability */}
            <div className="hero-cover-overlay" />
        </div>
    );
}
