import { ReactNode } from 'react';
import ImageCarousel from './ImageCarousel';

interface HeroProps {
  title: string;
  subtitle?: string;
  images?: { src: string; alt?: string }[];
  meta?: ReactNode;
}

export default function Hero({ title, subtitle, images = [], meta }: HeroProps) {
  return (
    <header className="relative w-full h-80">
      <ImageCarousel images={images} />
      <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-bg/40 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-6 gap-2">
        <h1 className="text-3xl font-bold">{title}</h1>
        {subtitle && <p className="text-text-muted">{subtitle}</p>}
        {meta && <div className="flex flex-wrap gap-2">{meta}</div>}
      </div>
    </header>
  );
}
