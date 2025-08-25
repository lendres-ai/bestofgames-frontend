import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  accent?: 'accent' | 'good' | 'bad';
  className?: string;
}

export default function Card({ children, accent, className = '' }: CardProps) {
  const accentClass =
    accent === 'good'
      ? 'border-good'
      : accent === 'bad'
      ? 'border-bad'
      : accent === 'accent'
      ? 'border-accent'
      : 'border-surface';

  return (
    <div
      className={`rounded-lg border ${accentClass} bg-surface p-6 shadow transition-transform duration-300 ease-out hover:scale-[1.02] hover:shadow-lg motion-reduce:transition-none ${className}`}
    >
      {children}
    </div>
  );
}
