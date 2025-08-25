import type { ReactNode } from 'react';

interface StatPillProps {
  icon: ReactNode;
  label: string;
}

export default function StatPill({ icon, label }: StatPillProps) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-surface px-3 py-1 text-sm text-text">
      {icon}
      <span>{label}</span>
    </div>
  );
}

