import React from 'react';
import { Task } from '../types';
import { formatDate, formatDateTime, isTaskOverdue, getRelativeDeadlineString } from '../utils/date';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { X, Calendar, Clock, CheckCircle } from 'lucide-react';

interface TaskDetailsModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
}

export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  task,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!isOpen || !task) return null;

  const isOverdue = isTaskOverdue(task.dueDate, task.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-lg rounded-xl border border-[#E8E3D8] dark:border-[#38352F] bg-white dark:bg-[#272521] p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#EEEAE1] dark:border-[#38352F]">
          <div className="flex items-center gap-2">
            <StatusBadge status={task.status} isOverdue={isOverdue} />
            <PriorityBadge priority={task.priority} />
          </div>
          <button
            onClick={onClose}
            className="text-[#96928A] hover:text-[#292824] dark:text-[#7E7970] dark:hover:text-[#EDE9E3] p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-semibold text-[#292824] dark:text-[#EDE9E3]">
            {task.title}
          </h2>
          <p className="mt-2 text-sm text-[#706D66] dark:text-[#A6A197] whitespace-pre-wrap leading-relaxed">
            {task.description || 'No description provided.'}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-[#EEEAE1] dark:border-[#38352F] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#706D66] dark:text-[#A6A197]">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#8B7355] dark:text-[#A88F72] shrink-0" />
            <span>
              Due Date:{' '}
              <strong className="text-[#292824] dark:text-[#EDE9E3] font-medium tabular-nums">
                {formatDate(task.dueDate)}
              </strong>
              {task.status !== 'completed' && (
                <span className="ml-1 text-[11px] text-[#96928A] dark:text-[#7E7970]">
                  ({getRelativeDeadlineString(task.dueDate, task.status)})
                </span>
              )}
            </span>
          </div>

          {task.completedAt && (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#6F8F72] dark:text-[#7FA383] shrink-0" />
              <span>
                Completed:{' '}
                <strong className="text-[#292824] dark:text-[#EDE9E3] font-medium tabular-nums">
                  {formatDateTime(task.completedAt)}
                </strong>
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#96928A] dark:text-[#7E7970] shrink-0" />
            <span>
              Created:{' '}
              <span className="tabular-nums">{formatDate(task.createdAt)}</span>
            </span>
          </div>
        </div>

        <div className="mt-6 pt-3 flex items-center justify-end gap-2.5 border-t border-[#EEEAE1] dark:border-[#38352F]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium border border-[#E8E3D8] dark:border-[#38352F] bg-white dark:bg-[#211F1C] text-[#292824] dark:text-[#EDE9E3] hover:bg-[#F5F1E8] dark:hover:bg-[#272521] transition-colors"
          >
            Close
          </button>
          {onEdit && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit();
              }}
              className="px-4 py-2 rounded-lg text-xs font-medium text-white bg-[#8B7355] hover:bg-[#756044] dark:bg-[#A88F72] dark:hover:bg-[#BFAB91] transition-colors"
            >
              Edit Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
