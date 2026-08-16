import React from 'react';

interface SmartBuyScoreBadgeProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SmartBuyScoreBadge: React.FC<SmartBuyScoreBadgeProps> = ({
  score,
  label,
  size = 'md',
}) => {
  let badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  let defaultLabel = 'Fair Deal';

  if (score >= 90) {
    badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    defaultLabel = 'Excellent Deal';
  } else if (score >= 75) {
    badgeColor = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    defaultLabel = 'Good Deal';
  } else if (score >= 60) {
    badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    defaultLabel = 'Fair Deal';
  } else {
    badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    defaultLabel = 'Consider Alternatives';
  }

  const displayLabel = label || defaultLabel;

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border ${badgeColor}`}>
        <span className="font-bold">{score}</span>/100 • {displayLabel}
      </span>
    );
  }

  if (size === 'lg') {
    return (
      <div className={`p-4 rounded-xl border ${badgeColor} flex flex-col items-center justify-center text-center space-y-1`}>
        <div className="text-xs uppercase tracking-wider font-semibold opacity-80">Smart Buy Score</div>
        <div className="text-3xl font-extrabold">{score}<span className="text-lg font-medium opacity-60">/100</span></div>
        <div className="text-sm font-semibold tracking-wide">{displayLabel}</div>
      </div>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-semibold border ${badgeColor}`}>
      <span className="font-extrabold text-sm">{score}</span>
      <span className="opacity-40">|</span>
      <span>{displayLabel}</span>
    </span>
  );
};
