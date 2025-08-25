import { ReactNode } from 'react';

interface StatPillProps {
  icon: ReactNode;
  label: string;
  className?: string;
}

export default function StatPill({ icon, label, className = '' }: StatPillProps) {
  return (
    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface text-text text-sm ${className}`}>
      {icon}
      <span>{label}</span>
    </div>
  );
}
