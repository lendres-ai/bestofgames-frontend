'use client';

import { useEffect, useState } from 'react';

interface CircularScoreProps {
  value: number;
  size?: number;
}

export default function CircularScore({ value, size = 120 }: CircularScoreProps) {
  const [progress, setProgress] = useState(0);
  const normalized = Math.max(0, Math.min(10, value));
  const radius = 50;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const timeout = setTimeout(() => setProgress(normalized), 100);
    return () => clearTimeout(timeout);
  }, [normalized]);

  const offset = circumference - (progress / 10) * circumference;

  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className="block">
      <circle
        cx="60"
        cy="60"
        r={radius}
        stroke="var(--muted)"
        strokeWidth="8"
        fill="none"
      />
      <circle
        cx="60"
        cy="60"
        r={radius}
        stroke="var(--accent)"
        strokeWidth="8"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
        className="motion-reduce:transition-none"
      />
      <text
        x="60"
        y="65"
        textAnchor="middle"
        fontSize="32"
        fill="var(--text)"
        fontWeight="bold"
      >
        {normalized.toFixed(1)}
      </text>
    </svg>
  );
}
