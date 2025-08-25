'use client';
import { useEffect, useState } from 'react';

interface CircularScoreProps {
  value: number;
  size?: number;
}

export default function CircularScore({ value, size = 120 }: CircularScoreProps) {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const [offset, setOffset] = useState(circumference);

  useEffect(() => {
    const progress = Math.max(0, Math.min(value / 10, 1));
    setOffset(circumference * (1 - progress));
  }, [value, circumference]);

  return (
    <svg width={size} height={size} className="text-accent">
      <circle
        stroke="var(--muted)"
        strokeWidth={stroke}
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />
      <circle
        stroke="var(--accent)"
        strokeWidth={stroke}
        fill="transparent"
        r={radius}
        cx={size / 2}
        cy={size / 2}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="origin-center -rotate-90 transform transition-all duration-500 ease-out"
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        className="fill-text text-xl font-bold"
      >
        {value.toFixed(1)}
      </text>
    </svg>
  );
}
