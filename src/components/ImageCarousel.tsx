'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ImageItem {
  src: string;
  alt: string;
}

interface ImageCarouselProps {
  images: ImageItem[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const items = images.length ? images : [{ src: '', alt: 'Placeholder image' }];
  const [index, setIndex] = useState(0);
  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const next = () => setIndex((i) => (i + 1) % items.length);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {items.map((img, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-300 ${i === index ? 'opacity-100' : 'opacity-0'}`}
        >
          {img.src ? (
            <Image src={img.src} alt={img.alt} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface text-text-muted">
              No image available
            </div>
          )}
        </div>
      ))}
      {items.length > 1 && (
        <>
          <button
            aria-label="Previous image"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-bg/60 p-2 text-text hover:bg-bg focus:outline-none focus:ring-2 focus:ring-accent"
          >
            ‹
          </button>
          <button
            aria-label="Next image"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-bg/60 p-2 text-text hover:bg-bg focus:outline-none focus:ring-2 focus:ring-accent"
          >
            ›
          </button>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to image ${i + 1}`}
                className={`h-2 w-2 rounded-full ${i === index ? 'bg-accent' : 'bg-text-muted'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

