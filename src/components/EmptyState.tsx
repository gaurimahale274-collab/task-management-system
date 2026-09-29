import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: LucideIcon;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon: Icon,
}) => {
  return (
    <div className="py-12 px-6 text-center rounded-xl border border-dashed border-[#E8E3D8] dark:border-[#38352F] bg-white/50 dark:bg-[#272521]/40">
      {Icon && (
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#F5F1E8] dark:bg-[#302A22] text-[#8B7355] dark:text-[#A88F72] mb-3">
          <Icon className="w-5 h-5 stroke-[1.75]" />
        </div>
      )}
      <h3 className="text-sm font-medium text-[#292824] dark:text-[#EDE9E3]">{title}</h3>
      {description && (
        <p className="mt-1 text-xs text-[#706D66] dark:text-[#A6A197] max-w-sm mx-auto">
          {description}
        </p>
      )}
      {actionText && onAction && (
        <div className="mt-4">
          <button
            onClick={onAction}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[#8B7355] text-white hover:bg-[#756044] dark:bg-[#A88F72] dark:hover:bg-[#BFAB91] transition-colors"
          >
            {actionText}
          </button>
        </div>
      )}
    </div>
  );
};
