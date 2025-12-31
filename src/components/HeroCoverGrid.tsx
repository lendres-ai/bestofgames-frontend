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
    // Duplicate the array to create seamless infinite scroll
    const duplicatedCovers = [...covers, ...covers];

    return (
        <div className="hero-cover-grid-container">
            {/* Animated grid */}
            <div className="hero-cover-grid">
                {duplicatedCovers.map((cover, index) => (
                    <div key={`${cover.slug}-${index}`} className="hero-cover-item">
                        <Image
                            src={cover.image}
                            alt={cover.title}
                            width={200}
                            height={280}
                            className="hero-cover-image"
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
