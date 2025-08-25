import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  accent?: 'accent' | 'good' | 'bad';
  className?: string;
}

export default function Card({ children, accent, className = '' }: CardProps) {
  const border =
    accent === 'good'
      ? 'border-t-4 border-good'
      : accent === 'bad'
      ? 'border-t-4 border-bad'
      : accent === 'accent'
      ? 'border-t-4 border-accent'
      : '';
  return (
    <div
      className={`bg-surface rounded-lg p-6 shadow-sm transition-transform duration-300 ease-out hover:scale-105 hover:shadow-lg motion-reduce:transition-none motion-reduce:transform-none ${border} ${className}`}
    >
      {children}
    </div>
  );
}
