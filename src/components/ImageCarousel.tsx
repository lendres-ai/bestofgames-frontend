'use client';
import Image from 'next/image';
import { useRef, useState } from 'react';

interface ImageCarouselProps {
  images: string[];
  alt?: string;
}

export default function ImageCarousel({ images, alt = '' }: ImageCarouselProps) {
  const hasImages = images && images.length > 0;
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const diff = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        prev();
      } else {
        next();
      }
    }
    startX.current = null;
  };

  if (!hasImages) {
    return (
      <div className="flex h-64 items-center justify-center bg-surface text-text-muted">No image</div>
    );
  }

  return (
    <div className="relative" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="relative h-64 overflow-hidden">
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={alt}
            fill
            className={`absolute inset-0 h-full w-full object-cover transition-transform duration-300 ease-out ${
              i === index ? 'translate-x-0' : i < index ? '-translate-x-full' : 'translate-x-full'
            }`}
            sizes="100vw"
            priority={i === 0}
          />
        ))}
      </div>
      {images.length > 1 && (
        <>
          <button
            aria-label="Previous image"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-bg/60 p-2 text-text hover:bg-bg/80 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            aria-label="Next image"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-bg/60 p-2 text-text hover:bg-bg/80 focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 w-2 rounded-full ${
                  i === index ? 'bg-accent' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
