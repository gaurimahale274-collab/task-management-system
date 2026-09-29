import React from 'react';
import { TaskStatus } from '../types';

interface StatusBadgeProps {
  status: TaskStatus;
  isOverdue?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, isOverdue }) => {
  if (isOverdue && status !== 'completed') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#B56B67]/15 text-[#B56B67] dark:bg-[#C97A75]/20 dark:text-[#E89E9A]">
        Overdue
      </span>
    );
  }

  switch (status) {
    case 'completed':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#6F8F72]/15 text-[#547357] dark:bg-[#7FA383]/20 dark:text-[#A7C7AA]">
          Completed
        </span>
      );
    case 'in-progress':
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#71859A]/15 text-[#54687C] dark:bg-[#859DB4]/20 dark:text-[#A4BCCC]">
          In Progress
        </span>
      );
    case 'todo':
    default:
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#EEEAE1] text-[#706D66] dark:bg-[#38352F] dark:text-[#A6A197]">
          To Do
        </span>
      );
  }
};
