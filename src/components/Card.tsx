import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  accent?: 'accent' | 'good' | 'bad';
  className?: string;
}

export default function Card({ children, accent, className = '' }: CardProps) {
  const accentColor = accent
    ? { accent: 'border-accent', good: 'border-good', bad: 'border-bad' }[accent]
    : 'border-transparent';
  return (
    <div
      className={`rounded-lg border ${accentColor} bg-surface p-4 shadow transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}

