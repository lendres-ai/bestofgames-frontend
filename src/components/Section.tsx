import type { ReactNode } from 'react';
import FadeIn from './FadeIn';

interface SectionProps {
  title: string;
  children: ReactNode;
}

export default function Section({ title, children }: SectionProps) {
  const id = title.replace(/\s+/g, '-').toLowerCase();
  return (
    <section className="mx-auto max-w-4xl px-4 py-8" aria-labelledby={id}>
      <FadeIn>
        <h2 id={id} className="mb-4 text-2xl font-semibold text-text">
          {title}
        </h2>
        {children}
      </FadeIn>
    </section>
  );
}

