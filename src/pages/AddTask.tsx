import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { TaskPriority, TaskStatus } from '../types';
import { getTodayString } from '../utils/date';
import { ArrowLeft, PlusCircle } from 'lucide-react';

export const AddTask: React.FC = () => {
  const { addTask } = useTasks();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState(getTodayString());
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Please provide a task title.');
      return;
    }

    if (!dueDate) {
      setError('Please select a due date.');
      return;
    }

    try {
      setIsSubmitting(true);
      await addTask({
        title: title.trim(),
        description: description.trim(),
        priority,
        dueDate,
        status,
      });
      setIsSubmitting(false);
      navigate('/tasks');
    } catch {
      setError('Failed to create task. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Header with back link */}
      <div>
        <Link
          to="/tasks"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#706D66] dark:text-[#A6A197] hover:text-[#292824] dark:hover:text-[#EDE9E3] mb-3 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to My Tasks</span>
        </Link>
        <h1 className="text-xl sm:text-2xl font-semibold text-[#292824] dark:text-[#EDE9E3] tracking-tight">
          Add Task
        </h1>
        <p className="mt-1 text-xs text-[#706D66] dark:text-[#A6A197]">
          Create a new personal task to keep track of deadlines and milestones.
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-xl border border-[#E8E3D8] dark:border-[#38352F] bg-white dark:bg-[#272521] p-6 sm:p-8 shadow-xs">
        {error && (
          <div className="mb-5 p-3 rounded-lg bg-[#B56B67]/15 border border-[#B56B67]/30 text-[#B56B67] dark:text-[#E89E9A] text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Task Title */}
          <div>
            <label className="block text-xs font-medium text-[#706D66] dark:text-[#A6A197] mb-1.5">
              Task Title <span className="text-[#B56B67]">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Complete project documentation"
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] dark:border-[#38352F] bg-[#FAF9F6] dark:bg-[#211F1C] text-[#292824] dark:text-[#EDE9E3] text-sm focus:outline-none focus:border-[#8B7355] dark:focus:border-[#A88F72] transition-colors"
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-[#706D66] dark:text-[#A6A197] mb-1.5">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key notes, reference links, or steps required to complete this task..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] dark:border-[#38352F] bg-[#FAF9F6] dark:bg-[#211F1C] text-[#292824] dark:text-[#EDE9E3] text-sm focus:outline-none focus:border-[#8B7355] dark:focus:border-[#A88F72] transition-colors resize-none"
            />
          </div>

          {/* Priority, Due Date, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#706D66] dark:text-[#A6A197] mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 rounded-lg border border-[#E8E3D8] dark:border-[#38352F] bg-[#FAF9F6] dark:bg-[#211F1C] text-[#292824] dark:text-[#EDE9E3] text-xs font-medium focus:outline-none focus:border-[#8B7355] cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#706D66] dark:text-[#A6A197] mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 rounded-lg border border-[#E8E3D8] dark:border-[#38352F] bg-[#FAF9F6] dark:bg-[#211F1C] text-[#292824] dark:text-[#EDE9E3] text-xs font-medium focus:outline-none focus:border-[#8B7355] cursor-pointer"
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#706D66] dark:text-[#A6A197] mb-1.5">
                Due Date <span className="text-[#B56B67]">*</span>
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#E8E3D8] dark:border-[#38352F] bg-[#FAF9F6] dark:bg-[#211F1C] text-[#292824] dark:text-[#EDE9E3] text-xs font-medium focus:outline-none focus:border-[#8B7355] cursor-pointer"
                required
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#EEEAE1] dark:border-[#38352F]">
            <button
              type="button"
              onClick={() => navigate('/tasks')}
              className="px-4 py-2 rounded-lg text-xs font-medium border border-[#E8E3D8] dark:border-[#38352F] bg-white dark:bg-[#211F1C] text-[#292824] dark:text-[#EDE9E3] hover:bg-[#F5F1E8] dark:hover:bg-[#272521] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#8B7355] hover:bg-[#756044] dark:bg-[#A88F72] dark:hover:bg-[#BFAB91] transition-colors shadow-xs disabled:opacity-50"
            >
              <PlusCircle className="w-3.5 h-3.5 stroke-[2]" />
              <span>{isSubmitting ? 'Adding...' : 'Add Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
