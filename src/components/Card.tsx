import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  accent?: 'accent' | 'good' | 'bad';
  className?: string;
  title?: string;
}

const accentMap = {
  accent: 'border-accent',
  good: 'border-good',
  bad: 'border-bad',
} as const;

export default function Card({ children, accent, className = '', title }: CardProps) {
  const accentClass = accent ? `border-l-4 ${accentMap[accent]}` : '';
  return (
    <div
      className={`bg-surface rounded-lg p-6 shadow transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg ${accentClass} ${className}`}
    >
      {title && <h3 className="mb-4 font-semibold">{title}</h3>}
      {children}
    </div>
  );
}
