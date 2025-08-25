'use client';

import { useEffect, useState } from 'react';

interface CircularScoreProps {
  value: number;
  size?: number;
}

export default function CircularScore({ value, size = 100 }: CircularScoreProps) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const pct = Math.min(Math.max(value, 0), 10) / 10;
    const progress = circumference - pct * circumference;
    const t = setTimeout(() => setOffset(progress), 50);
    return () => clearTimeout(t);
  }, [circumference, value]);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label={`Score: ${value.toFixed(1)} out of 10`}
    >
      <circle
        cx="50"
        cy="50"
        r={radius}
        stroke="var(--muted)"
        strokeWidth="10"
        fill="none"
      />
      <circle
        cx="50"
        cy="50"
        r={radius}
        stroke="var(--accent)"
        strokeWidth="10"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-[stroke-dashoffset] duration-700 ease-out"
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
      />
      <text
        x="50"
        y="55"
        textAnchor="middle"
        className="fill-text text-xl font-bold"
      >
        {value.toFixed(1)}
      </text>
    </svg>
  );
}

