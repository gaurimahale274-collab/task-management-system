import React from 'react';
import { Task, TaskStatus } from '../types';
import { formatDate, isTaskOverdue, getRelativeDeadlineString } from '../utils/date';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { Edit2, Trash2, CheckCircle2, Circle, Clock } from 'lucide-react';

interface TaskTableProps {
  tasks: Task[];
  onStatusChange: (id: string, newStatus: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onSelect: (task: Task) => void;
}

export const TaskTable: React.FC<TaskTableProps> = ({
  tasks,
  onStatusChange,
  onEdit,
  onDelete,
  onSelect,
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-[#E8E3D8] dark:border-[#38352F] bg-white dark:bg-[#272521]">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#EEEAE1] dark:border-[#38352F] bg-[#FAF9F6]/80 dark:bg-[#211F1C]/80 text-[11px] font-semibold uppercase tracking-wider text-[#706D66] dark:text-[#A6A197]">
            <th className="py-3 px-4 w-12 text-center">Done</th>
            <th className="py-3 px-4">Task</th>
            <th className="py-3 px-4 w-28">Priority</th>
            <th className="py-3 px-4 w-36">Due Date</th>
            <th className="py-3 px-4 w-36">Status</th>
            <th className="py-3 px-4 w-24 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#EEEAE1] dark:divide-[#38352F] text-xs">
          {tasks.map((task) => {
            const overdue = isTaskOverdue(task.dueDate, task.status);
            const isCompleted = task.status === 'completed';

            return (
              <tr
                key={task.id}
                className="hover:bg-[#FAF9F6] dark:hover:bg-[#211F1C]/60 transition-colors group"
              >
                {/* Complete checkbox button */}
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() =>
                      onStatusChange(task.id, isCompleted ? 'in-progress' : 'completed')
                    }
                    className="text-[#96928A] hover:text-[#6F8F72] dark:hover:text-[#7FA383] transition-colors p-1"
                    title={isCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-[#6F8F72] dark:text-[#7FA383] fill-[#6F8F72]/20" />
                    ) : (
                      <Circle className="w-4 h-4 hover:stroke-[#6F8F72]" />
                    )}
                  </button>
                </td>

                {/* Title & description */}
                <td className="py-3 px-4 cursor-pointer" onClick={() => onSelect(task)}>
                  <div className="font-medium text-[#292824] dark:text-[#EDE9E3]">
                    <span
                      className={
                        isCompleted
                          ? 'line-through text-[#96928A] dark:text-[#7E7970]'
                          : ''
                      }
                    >
                      {task.title}
                    </span>
                  </div>
                  {task.description && (
                    <p className="mt-0.5 text-[11px] text-[#706D66] dark:text-[#A6A197] truncate max-w-md">
                      {task.description}
                    </p>
                  )}
                </td>

                {/* Priority */}
                <td className="py-3 px-4">
                  <PriorityBadge priority={task.priority} />
                </td>

                {/* Due Date */}
                <td className="py-3 px-4 tabular-nums">
                  <div className="flex flex-col">
                    <span
                      className={`font-medium ${
                        overdue
                          ? 'text-[#B56B67] dark:text-[#E89E9A]'
                          : 'text-[#292824] dark:text-[#EDE9E3]'
                      }`}
                    >
                      {formatDate(task.dueDate)}
                    </span>
                    {!isCompleted && (
                      <span className="text-[10px] text-[#96928A] dark:text-[#7E7970]">
                        {getRelativeDeadlineString(task.dueDate, task.status)}
                      </span>
                    )}
                  </div>
                </td>

                {/* Status selector */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-1.5">
                    <select
                      value={task.status}
                      onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
                      aria-label="Change status"
                      className="px-2 py-1 rounded text-xs border border-[#E8E3D8] dark:border-[#38352F] bg-white dark:bg-[#211F1C] text-[#292824] dark:text-[#EDE9E3] focus:outline-none focus:border-[#8B7355] cursor-pointer"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                    {overdue && !isCompleted && (
                      <span className="text-[10px] font-medium text-[#B56B67] dark:text-[#E89E9A] shrink-0">
                        Overdue
                      </span>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="py-3 px-4 text-right">
                  <div className="inline-flex items-center gap-1">
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
