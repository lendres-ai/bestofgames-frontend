'use client';

import { useEffect, useState } from 'react';

interface CircularScoreProps {
  value: number; // 0-10
  size?: number;
}

export default function CircularScore({ value, size = 120 }: CircularScoreProps) {
  const radius = size / 2 - 8;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const progress = Math.min(Math.max(value, 0), 10) / 10;
    setOffset(circumference * (1 - progress));
  }, [value, circumference]);

  return (
    <div style={{ width: size, height: size }} className="relative">
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={8}
          className="fill-none stroke-surface"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={8}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="fill-none stroke-accent transition-[stroke-dashoffset] duration-700 ease-out motion-reduce:transition-none"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
        {value.toFixed(1)}
      </span>
    </div>
  );
}
