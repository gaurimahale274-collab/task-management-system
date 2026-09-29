import React from 'react';
import { Task, TaskStatus } from '../types';
import { formatDate, isTaskOverdue, getRelativeDeadlineString } from '../utils/date';
import { PriorityBadge } from './PriorityBadge';
import { CheckCircle2, Circle, Edit2, Trash2, Calendar } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onSelect: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStatusChange,
  onEdit,
  onDelete,
  onSelect,
}) => {
  const isCompleted = task.status === 'completed';
  const overdue = isTaskOverdue(task.dueDate, task.status);

  return (
    <div
      className={`p-4 rounded-xl border bg-white dark:bg-[#272521] transition-all ${
        overdue && !isCompleted
          ? 'border-[#B56B67]/40 dark:border-[#C97A75]/40'
          : 'border-[#E8E3D8] dark:border-[#38352F]'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Toggle complete button */}
        <button
          onClick={() =>
            onStatusChange(task.id, isCompleted ? 'in-progress' : 'completed')
          }
          className="mt-0.5 text-[#96928A] hover:text-[#6F8F72] dark:hover:text-[#7FA383] transition-colors shrink-0"
          title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
        >
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-[#6F8F72] dark:text-[#7FA383] fill-[#6F8F72]/20" />
          ) : (
            <Circle className="w-5 h-5 hover:stroke-[#6F8F72]" />
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0" onClick={() => onSelect(task)}>
          <div className="flex items-start justify-between gap-2">
            <h4
              className={`text-sm font-medium cursor-pointer transition-colors ${
                isCompleted
                  ? 'line-through text-[#96928A] dark:text-[#7E7970]'
                  : 'text-[#292824] dark:text-[#EDE9E3]'
              }`}
            >
              {task.title}
            </h4>
            <PriorityBadge priority={task.priority} />
          </div>

          {task.description && (
            <p className="mt-1 text-xs text-[#706D66] dark:text-[#A6A197] line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Meta details */}
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#706D66] dark:text-[#A6A197]">
            <div className="flex items-center gap-1.5 tabular-nums">
              <Calendar className="w-3.5 h-3.5 text-[#8B7355] dark:text-[#A88F72]" />
              <span
                className={
                  overdue && !isCompleted
                    ? 'font-medium text-[#B56B67] dark:text-[#E89E9A]'
                    : ''
                }
              >
                {formatDate(task.dueDate)}
              </span>
              {!isCompleted && (
                <span className="text-[11px] text-[#96928A] dark:text-[#7E7970]">
                  ({getRelativeDeadlineString(task.dueDate, task.status)})
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer: status selector + actions */}
      <div className="mt-3.5 pt-3 border-t border-[#EEEAE1] dark:border-[#38352F] flex items-center justify-between gap-2">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
          aria-label="Change status"
          className="px-2 py-1 rounded text-xs border border-[#E8E3D8] dark:border-[#38352F] bg-[#FAF9F6] dark:bg-[#211F1C] text-[#292824] dark:text-[#EDE9E3] focus:outline-none focus:border-[#8B7355] cursor-pointer"
        >
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded text-[#706D66] hover:text-[#292824] hover:bg-[#F5F1E8] dark:text-[#A6A197] dark:hover:text-[#EDE9E3] dark:hover:bg-[#38352F] transition-colors"
            title="Edit task"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 rounded text-[#706D66] hover:text-[#B56B67] hover:bg-[#B56B67]/10 dark:text-[#A6A197] dark:hover:text-[#E89E9A] transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
