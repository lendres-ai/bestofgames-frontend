'use client';

import Image from 'next/image';
import { useState } from 'react';

interface CarouselImage {
  src: string;
  alt?: string;
}

interface ImageCarouselProps {
  images?: CarouselImage[];
}

export default function ImageCarousel({ images = [] }: ImageCarouselProps) {
  const [index, setIndex] = useState(0);
  const hasImages = images.length > 0;

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  const [startX, setStartX] = useState<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => setStartX(e.touches[0].clientX);
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX === null) return;
    const diff = e.changedTouches[0].clientX - startX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        prev();
      } else {
        next();
      }
    }
    setStartX(null);
  };

  if (!hasImages) {
    return (
      <div className="flex items-center justify-center bg-surface w-full h-64 text-text-muted">
        No images available
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-64 overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {images.map((img, i) => (
        <Image
          key={img.src}
          src={img.src}
          alt={img.alt ?? ''}
          fill
          className={`object-cover transition-opacity duration-300 ease-in-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
          sizes="100vw"
        />
      ))}
      <button
        onClick={prev}
        aria-label="Previous image"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-bg/60 text-text rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-accent"
      >
        ‹
      </button>
      <button
        onClick={next}
        aria-label="Next image"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-bg/60 text-text rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-accent"
      >
        ›
      </button>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Show image ${i + 1}`}
            className={`w-2 h-2 rounded-full focus:outline-none focus:ring-2 focus:ring-accent ${
              i === index ? 'bg-accent' : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
