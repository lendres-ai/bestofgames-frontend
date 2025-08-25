'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

interface CarouselImage {
  src: string;
  alt?: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const items = images.length > 0 ? images : [{ src: '/placeholder.svg', alt: 'No image' }];
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);

  const prev = () => setIndex((index - 1 + items.length) % items.length);
  const next = () => setIndex((index + 1) % items.length);

  const onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    startX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (startX.current === null) return;
    const diff = startX.current - e.changedTouches[0].clientX;
    if (diff > 50) next();
    if (diff < -50) prev();
    startX.current = null;
  };

  return (
    <div
      className="relative overflow-hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {items.map((img, i) => (
        <div
          key={i}
          className={`relative w-full aspect-video transition-opacity duration-500 ease-out ${i === index ? 'opacity-100' : 'opacity-0 absolute inset-0'}`}
        >
          <Image
            src={img.src}
            alt={img.alt || ''}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
            priority={i === index}
          />
        </div>
      ))}
      {items.length > 1 && (
        <>
          <button
            aria-label="Previous image"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-surface/70 text-text p-2 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            aria-label="Next image"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-surface/70 text-text p-2 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                aria-label={`Show slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`w-2 h-2 rounded-full ${i === index ? 'bg-accent' : 'bg-muted'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
