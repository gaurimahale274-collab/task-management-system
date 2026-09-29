import React, { useState, useMemo } from 'react';
import { useTasks } from '../context/TaskContext';
import { formatDate, formatDateTime } from '../utils/date';
import { PriorityBadge } from '../components/PriorityBadge';
import { EmptyState } from '../components/EmptyState';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { TaskDetailsModal } from '../components/TaskDetailsModal';
import { Task } from '../types';
import {
  CheckCircle,
  Search,
  RotateCcw,
  Trash2,
  Eye,
  Calendar,
  Clock,
  ArrowUpDown,
  X,
} from 'lucide-react';

export const CompletedTasks: React.FC = () => {
  const { tasks, markTaskIncomplete, deleteTask } = useTasks();

  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Filter completed tasks
  const completedTasks = useMemo(() => {
    return tasks
      .filter((t) => t.status === 'completed')
      .filter((t) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
      })
      .sort((a, b) => {
        const dateA = a.completedAt || a.updatedAt || '';
        const dateB = b.completedAt || b.updatedAt || '';
        return sortOrder === 'desc'
          ? dateB.localeCompare(dateA)
          : dateA.localeCompare(dateB);
      });
  }, [tasks, search, sortOrder]);

  const confirmDelete = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete);
      setTaskToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-[#292824] dark:text-[#EDE9E3] tracking-tight">
          Completed Tasks
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#706D66] dark:text-[#A6A197]">
          Review all the tasks and milestones you have successfully accomplished.
        </p>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#96928A] dark:text-[#7E7970]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search completed tasks..."
            className="w-full pl-9 pr-8 py-2 rounded-lg border border-[#E8E3D8] dark:border-[#38352F] bg-white dark:bg-[#272521] text-xs font-medium text-[#292824] dark:text-[#EDE9E3] placeholder-[#96928A] dark:placeholder-[#7E7970] focus:outline-none focus:border-[#8B7355] dark:focus:border-[#A88F72] transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#96928A] hover:text-[#292824] dark:text-[#7E7970] dark:hover:text-[#EDE9E3]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort by completion date */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'desc' | 'asc')}
              aria-label="Sort completed tasks by date"
              className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-[#E8E3D8] dark:border-[#38352F] bg-white dark:bg-[#272521] text-xs font-medium text-[#292824] dark:text-[#EDE9E3] focus:outline-none focus:border-[#8B7355] cursor-pointer"
            >
              <option value="desc">Completed: Newest First</option>
              <option value="asc">Completed: Oldest First</option>
            </select>
            <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#96928A] dark:text-[#7E7970] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Task List */}
      {completedTasks.length === 0 ? (
        <EmptyState
          title="No completed tasks yet."
          description={
            search
              ? 'No completed tasks match your search.'
              : 'Tasks marked as completed will automatically appear here.'
          }
          icon={CheckCircle}
        />
      ) : (
        <div className="divide-y divide-[#EEEAE1] dark:divide-[#38352F] rounded-xl border border-[#E8E3D8] dark:border-[#38352F] bg-white dark:bg-[#272521] overflow-hidden">
          {completedTasks.map((task) => (
            <div
              key={task.id}
              className="p-4 hover:bg-[#FAF9F6] dark:hover:bg-[#211F1C]/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              {/* Left Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-medium text-[#292824] dark:text-[#EDE9E3] truncate">
                    {task.title}
                  </h3>
                  <PriorityBadge priority={task.priority} />
                </div>

                {task.description && (
                  <p className="mt-1 text-xs text-[#706D66] dark:text-[#A6A197] truncate max-w-xl">
                    {task.description}
                  </p>
                )}

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#706D66] dark:text-[#A6A197]">
                  <span className="flex items-center gap-1.5 tabular-nums text-[#6F8F72] dark:text-[#7FA383] font-medium">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      Finished {task.completedAt ? formatDateTime(task.completedAt) : 'Recently'}
                    </span>
                  </span>

                  <span className="flex items-center gap-1.5 tabular-nums text-[#96928A] dark:text-[#7E7970]">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>Target Due: {formatDate(task.dueDate)}</span>
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => setSelectedTask(task)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-[#E8E3D8] dark:border-[#38352F] bg-white dark:bg-[#211F1C] text-[#706D66] hover:text-[#292824] dark:text-[#A6A197] dark:hover:text-[#EDE9E3] hover:bg-[#F5F1E8] dark:hover:bg-[#272521] transition-colors"
                  title="View task details"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>

                <button
                  onClick={() => markTaskIncomplete(task.id)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-[#E8E3D8] dark:border-[#38352F] bg-white dark:bg-[#211F1C] text-[#8B7355] dark:text-[#A88F72] hover:bg-[#F1EBDD] dark:hover:bg-[#302A22] transition-colors"
                  title="Move back to In Progress"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Mark as incomplete</span>
                </button>

                <button
                  onClick={() => setTaskToDelete(task.id)}
                  className="p-1.5 rounded-lg text-[#706D66] hover:text-[#B56B67] hover:bg-[#B56B67]/10 dark:text-[#A6A197] dark:hover:text-[#E89E9A] transition-colors"
                  title="Delete task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(taskToDelete)}
        title="Delete this task?"
        message="This will permanently delete this completed task record from your history."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setTaskToDelete(null)}
      />

      {/* Details Modal */}
      <TaskDetailsModal
        task={selectedTask}
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
};
