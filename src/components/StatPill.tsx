import { ReactNode } from 'react';

interface StatPillProps {
  icon?: ReactNode;
  label: string;
  className?: string;
}

export default function StatPill({ icon, label, className = '' }: StatPillProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full bg-surface text-text-muted text-xs ${className}`}
    >
      {icon && <span className="text-accent">{icon}</span>}
      <span>{label}</span>
    </span>
  );
}
