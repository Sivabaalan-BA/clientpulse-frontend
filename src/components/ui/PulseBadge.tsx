import React from 'react';
import { Activity, AlertTriangle, ShieldCheck } from 'lucide-react';

interface PulseBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const PulseBadge: React.FC<PulseBadgeProps> = ({ score, size = 'md', showLabel = true }) => {
  let colorStyles = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let dotColor = 'bg-emerald-500';
  let label = 'Healthy';
  let Icon = ShieldCheck;

  if (score < 50) {
    colorStyles = 'bg-rose-50 text-rose-700 border-rose-200';
    dotColor = 'bg-rose-500 animate-pulse';
    label = 'Churn Alert';
    Icon = AlertTriangle;
  } else if (score < 80) {
    colorStyles = 'bg-amber-50 text-amber-700 border-amber-200';
    dotColor = 'bg-amber-500';
    label = 'At Risk';
    Icon = Activity;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2',
  }[size];

  return (
    <span className={`inline-flex items-center font-medium rounded-full border shadow-sm ${colorStyles} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span className="font-mono font-semibold">{score}/100</span>
      {showLabel && <span className="opacity-80">({label})</span>}
    </span>
  );
};
