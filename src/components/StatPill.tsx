import { ReactNode } from 'react';

interface StatPillProps {
  icon: ReactNode;
  label: string;
}

export default function StatPill({ icon, label }: StatPillProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-surface px-3 py-1 text-sm text-text-muted">
      {icon}
      {label}
    </span>
  );
}
