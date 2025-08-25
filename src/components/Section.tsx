import { ReactNode } from 'react';

interface SectionProps {
  title?: string;
  children: ReactNode;
}

export default function Section({ title, children }: SectionProps) {
  return (
    <section className="px-4 py-8 max-w-4xl mx-auto">
      {title && (
        <h2 className="mb-4 text-2xl font-semibold text-text">{title}</h2>
      )}
      {children}
    </section>
  );
}
