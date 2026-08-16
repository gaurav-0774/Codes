import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-4 w-20 bg-slate-800 rounded" />
        <div className="h-6 w-6 bg-slate-800 rounded-lg" />
      </div>
      <div className="h-44 bg-slate-800/60 rounded-xl w-full" />
      <div className="h-5 w-3/4 bg-slate-800 rounded" />
      <div className="h-4 w-1/2 bg-slate-800 rounded" />
      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between">
        <div className="h-6 w-24 bg-slate-800 rounded" />
        <div className="h-8 w-24 bg-brand-900/40 rounded-xl" />
      </div>
    </div>
  );
};
