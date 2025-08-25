import { ReactNode } from 'react';

interface SectionProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Section({ title, children, className = '' }: SectionProps) {
  return (
    <section className={`my-8 space-y-4 ${className}`}>
      {title && <h2 className="text-2xl font-semibold">{title}</h2>}
      {children}
    </section>
  );
}
