import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { TaskFilters } from '../components/TaskFilters';
import { TaskTable } from '../components/TaskTable';
import { TaskCard } from '../components/TaskCard';
import { EmptyState } from '../components/EmptyState';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { TaskEditModal } from '../components/TaskEditModal';
import { TaskDetailsModal } from '../components/TaskDetailsModal';
import { Task, TaskFilterState } from '../types';
import { PlusCircle, CheckSquare, Search } from 'lucide-react';

export const MyTasks: React.FC = () => {
  const { tasks, changeTaskStatus, deleteTask } = useTasks();

  const [filters, setFilters] = useState<TaskFilterState>({
    search: '',
    status: 'all',
    priority: 'all',
    sortBy: 'dueDate',
    sortOrder: 'asc',
  });

  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const hasActiveFilters = Boolean(
    filters.search || filters.status !== 'all' || filters.priority !== 'all'
  );

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      priority: 'all',
      sortBy: 'dueDate',
      sortOrder: 'asc',
    });
  };

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Search filter (title or description)
        if (filters.search) {
          const q = filters.search.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchDesc = task.description.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc) return false;
        }

        // Status filter
        if (filters.status !== 'all' && task.status !== filters.status) {
          return false;
        }

        // Priority filter
        if (filters.priority !== 'all' && task.priority !== filters.priority) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'dueDate') {
          const comp = a.dueDate.localeCompare(b.dueDate);
          return filters.sortOrder === 'asc' ? comp : -comp;
        } else if (filters.sortBy === 'createdAt') {
          const comp = a.createdAt.localeCompare(b.createdAt);
          return filters.sortOrder === 'asc' ? comp : -comp;
        } else if (filters.sortBy === 'priority') {
          const priorityWeight = { high: 3, medium: 2, low: 1 };
          const comp = priorityWeight[a.priority] - priorityWeight[b.priority];
          return filters.sortOrder === 'asc' ? comp : -comp;
        }
        return 0;
      });
  }, [tasks, filters]);

  const confirmDelete = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete);
      setTaskToDelete(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#292824] dark:text-[#EDE9E3] tracking-tight">
            My Tasks
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#706D66] dark:text-[#A6A197]">
            Manage, filter, and track all your personal tasks.
          </p>
        </div>

        <Link
          to="/tasks/add"
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-white bg-[#8B7355] hover:bg-[#756044] dark:bg-[#A88F72] dark:hover:bg-[#BFAB91] transition-colors shadow-xs"
        >
          <PlusCircle className="w-4 h-4 stroke-[2]" />
          <span>+ Add Task</span>
        </Link>
      </div>

      {/* Filter and Search controls */}
      <TaskFilters
        filters={filters}
        onChange={setFilters}
        onClear={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Task List / Table */}
      {filteredTasks.length === 0 ? (
        tasks.length === 0 ? (
          <EmptyState
            title="You don't have any tasks yet."
            description="Start building your task list by adding your first project or study task."
            actionText="Create First Task"
            onAction={() => {}}
            icon={CheckSquare}
          />
        ) : (
          <EmptyState
            title="No tasks match your search."
            description="Try adjusting your keywords, priority level, or status filters."
            actionText="Clear all filters"
            onAction={handleClearFilters}
            icon={Search}
          />
        )
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <TaskTable
              tasks={filteredTasks}
              onStatusChange={changeTaskStatus}
              onEdit={(task) => setTaskToEdit(task)}
              onDelete={(id) => setTaskToDelete(id)}
              onSelect={(task) => setSelectedTask(task)}
            />
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={changeTaskStatus}
                onEdit={(t) => setTaskToEdit(t)}
                onDelete={(id) => setTaskToDelete(id)}
                onSelect={(t) => setSelectedTask(t)}
              />
            ))}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(taskToDelete)}
        title="Delete this task?"
        message="This action cannot be undone. The task will be permanently removed from your workspace."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setTaskToDelete(null)}
      />

      {/* Edit Task Modal */}
      <TaskEditModal
        task={taskToEdit}
        isOpen={Boolean(taskToEdit)}
        onClose={() => setTaskToEdit(null)}
      />

      {/* Task Details Modal */}
      <TaskDetailsModal
        task={selectedTask}
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        onEdit={() => {
          setTaskToEdit(selectedTask);
          setSelectedTask(null);
        }}
      />
    </div>
  );
};
