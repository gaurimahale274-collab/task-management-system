import React from 'react';

interface StatCardProps {
  label: string;
  value: number;
  sublabel?: string;
  accent?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, sublabel, accent }) => {
  return (
    <div
      className={`p-5 rounded-xl border bg-white dark:bg-[#272521] transition-colors ${
        accent
          ? 'border-[#8B7355]/40 dark:border-[#A88F72]/40 ring-1 ring-[#8B7355]/20 dark:ring-[#A88F72]/20'
          : 'border-[#E8E3D8] dark:border-[#38352F]'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-[#706D66] dark:text-[#A6A197]">
          {label}
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span
          className={`text-3xl font-semibold tabular-nums ${
            accent ? 'text-[#8B7355] dark:text-[#A88F72]' : 'text-[#292824] dark:text-[#EDE9E3]'
          }`}
        >
          {value}
        </span>
        {sublabel && (
          <span className="text-xs text-[#96928A] dark:text-[#7E7970]">{sublabel}</span>
        )}
      </div>
    </div>
  );
};
