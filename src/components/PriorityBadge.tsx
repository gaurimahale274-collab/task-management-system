import React from 'react';
import { TaskPriority } from '../types';

interface PriorityBadgeProps {
  priority: TaskPriority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  switch (priority) {
    case 'high':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#B56B67]/15 text-[#B56B67] dark:bg-[#C97A75]/20 dark:text-[#E89E9A]">
          High
        </span>
      );
    case 'medium':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#B08A4A]/15 text-[#916E31] dark:bg-[#C79E59]/20 dark:text-[#E0BC7D]">
          Medium
        </span>
      );
    case 'low':
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#EEEAE1] text-[#706D66] dark:bg-[#38352F] dark:text-[#A6A197]">
          Low
        </span>
      );
  }
};
