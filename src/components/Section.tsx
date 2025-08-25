import { ReactNode } from 'react';
import FadeIn from './FadeIn';

interface SectionProps {
  title: string;
  children: ReactNode;
}

export default function Section({ title, children }: SectionProps) {
  return (
    <FadeIn className="my-12">
      <section>
        <h2 className="mb-4 text-2xl font-bold">{title}</h2>
        {children}
      </section>
    </FadeIn>
  );
}
