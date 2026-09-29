import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { EmptyState } from '../components/EmptyState';
import { TaskDetailsModal } from '../components/TaskDetailsModal';
import { TaskEditModal } from '../components/TaskEditModal';
import { formatDate, formatDateTime, isTaskOverdue, getRelativeDeadlineString } from '../utils/date';
import { Task } from '../types';
import {
  ArrowRight,
  PlusCircle,
  Calendar,
  CheckCircle2,
  CheckSquare,
  Clock,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { tasks, stats, upcomingTasks, recentlyCompletedTasks, changeTaskStatus } = useTasks();
  const navigate = useNavigate();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Recent incomplete tasks (up to 4)
  const recentIncompleteTasks = tasks
    .filter((t) => t.status !== 'completed')
    .slice(0, 4);

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#292824] dark:text-[#EDE9E3] tracking-tight">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'User'}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#706D66] dark:text-[#A6A197]">
            Here's an overview of your tasks.
          </p>
        </div>

        <Link
          to="/tasks/add"
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-[#8B7355] hover:bg-[#756044] dark:bg-[#A88F72] dark:hover:bg-[#BFAB91] transition-colors shadow-xs"
        >
          <PlusCircle className="w-4 h-4 stroke-[2]" />
          <span>Add Task</span>
        </Link>
      </div>

      {/* Dynamic Statistics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          label="Total Tasks"
          value={stats.total}
          sublabel="All created tasks"
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          sublabel="To Do"
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          sublabel="Active"
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          sublabel={`${stats.completionPercentage}% completion rate`}
          accent
        />
      </div>

      {/* Main Grid: My Tasks on left + Deadlines & Recently completed on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left 2 Cols: My Active Tasks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#EEEAE1] dark:border-[#38352F]">
            <h2 className="text-sm font-semibold text-[#292824] dark:text-[#EDE9E3]">
              My Tasks
            </h2>
            <Link
              to="/tasks"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#8B7355] dark:text-[#A88F72] hover:text-[#756044] transition-colors"
            >
              <span>View all tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentIncompleteTasks.length === 0 ? (
            <EmptyState
              title="You don't have any active tasks."
              description="Get started by creating your first task to stay organized."
              actionText="Add Task"
              onAction={() => navigate('/tasks/add')}
              icon={CheckSquare}
            />
          ) : (
            <div className="divide-y divide-[#EEEAE1] dark:divide-[#38352F] rounded-xl border border-[#E8E3D8] dark:border-[#38352F] bg-white dark:bg-[#272521] overflow-hidden">
              {recentIncompleteTasks.map((task) => {
                const overdue = isTaskOverdue(task.dueDate, task.status);

                return (
                  <div
                    key={task.id}
                    className="p-4 hover:bg-[#FAF9F6] dark:hover:bg-[#211F1C]/70 transition-colors flex items-start justify-between gap-3 group"
                  >
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => setSelectedTask(task)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-[#292824] dark:text-[#EDE9E3] truncate">
                          {task.title}
                        </span>
                        <PriorityBadge priority={task.priority} />
                      </div>
                      {task.description && (
                        <p className="mt-1 text-xs text-[#706D66] dark:text-[#A6A197] truncate">
                          {task.description}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-3 text-xs text-[#706D66] dark:text-[#A6A197]">
                        <span className="flex items-center gap-1 tabular-nums">
                          <Calendar className="w-3 h-3 text-[#8B7355] dark:text-[#A88F72]" />
                          <span
                            className={
                              overdue
                                ? 'text-[#B56B67] dark:text-[#E89E9A] font-medium'
                                : ''
                            }
                          >
                            {formatDate(task.dueDate)}
                          </span>
                        </span>
                        <span className="text-[11px] text-[#96928A] dark:text-[#7E7970]">
                          · {getRelativeDeadlineString(task.dueDate, task.status)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={task.status} isOverdue={overdue} />
                      <button
                        onClick={() => changeTaskStatus(task.id, 'completed')}
                        className="px-2.5 py-1 rounded text-xs font-medium border border-[#E8E3D8] dark:border-[#38352F] hover:bg-[#F1EBDD] dark:hover:bg-[#302A22] text-[#8B7355] dark:text-[#A88F72] transition-colors"
                        title="Mark as completed"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Upcoming Deadlines & Recently Completed */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#EEEAE1] dark:border-[#38352F]">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#8B7355] dark:text-[#A88F72]" />
                <h3 className="text-xs font-semibold text-[#292824] dark:text-[#EDE9E3]">
                  Upcoming Deadlines
                </h3>
              </div>
            </div>

            {upcomingTasks.length === 0 ? (
              <p className="text-xs text-[#96928A] dark:text-[#7E7970] py-3 text-center rounded-lg border border-dashed border-[#E8E3D8] dark:border-[#38352F]">
                No upcoming deadlines.
              </p>
            ) : (
              <div className="space-y-2">
                {upcomingTasks.slice(0, 4).map((task) => {
                  const overdue = isTaskOverdue(task.dueDate, task.status);

                  return (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task)}
                      className={`p-3 rounded-lg border bg-white dark:bg-[#272521] hover:border-[#8B7355]/40 transition-colors cursor-pointer ${
                        overdue
                          ? 'border-[#B56B67]/40 dark:border-[#C97A75]/40'
                          : 'border-[#E8E3D8] dark:border-[#38352F]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-[#292824] dark:text-[#EDE9E3] truncate">
                          {task.title}
                        </span>
                        <PriorityBadge priority={task.priority} />
                      </div>
                      <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#706D66] dark:text-[#A6A197]">
                        <span className="tabular-nums">
                          {formatDate(task.dueDate)}
                        </span>
                        <span
                          className={
                            overdue
                              ? 'text-[#B56B67] dark:text-[#E89E9A] font-medium'
                              : 'text-[#96928A] dark:text-[#7E7970]'
                          }
                        >
                          {getRelativeDeadlineString(task.dueDate, task.status)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recently Completed */}
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#EEEAE1] dark:border-[#38352F]">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#6F8F72] dark:text-[#7FA383]" />
                <h3 className="text-xs font-semibold text-[#292824] dark:text-[#EDE9E3]">
                  Recently Completed
                </h3>
              </div>
              <Link
                to="/tasks/completed"
                className="text-[11px] font-medium text-[#8B7355] dark:text-[#A88F72] hover:underline"
              >
                View completed tasks
              </Link>
            </div>

            {recentlyCompletedTasks.length === 0 ? (
              <p className="text-xs text-[#96928A] dark:text-[#7E7970] py-3 text-center rounded-lg border border-dashed border-[#E8E3D8] dark:border-[#38352F]">
                No completed tasks yet.
              </p>
            ) : (
              <div className="space-y-2">
                {recentlyCompletedTasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="p-3 rounded-lg border border-[#E8E3D8] dark:border-[#38352F] bg-white dark:bg-[#272521] cursor-pointer hover:border-[#8B7355]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium line-through text-[#706D66] dark:text-[#A6A197] truncate">
                        {task.title}
                      </span>
                      <PriorityBadge priority={task.priority} />
                    </div>
                    <div className="mt-1 text-[11px] text-[#96928A] dark:text-[#7E7970] tabular-nums">
                      Completed {task.completedAt ? formatDateTime(task.completedAt) : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <TaskDetailsModal
        task={selectedTask}
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        onEdit={() => {
          setTaskToEdit(selectedTask);
          setSelectedTask(null);
        }}
      />

      <TaskEditModal
        task={taskToEdit}
        isOpen={Boolean(taskToEdit)}
        onClose={() => setTaskToEdit(null)}
      />
    </div>
  );
};
