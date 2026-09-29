import React from 'react';
import { TaskFilterState, TaskPriority, TaskStatus, TaskSortOption, SortOrder } from '../types';
import { Search, X, ArrowUpDown, Filter } from 'lucide-react';

interface TaskFiltersProps {
  filters: TaskFilterState;
  onChange: (filters: TaskFilterState) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filters,
  onChange,
  onClear,
  hasActiveFilters,
}) => {
  return (
    <div className="space-y-3">
      {/* Top Search bar and quick filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#96928A] dark:text-[#7E7970]" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            placeholder="Search tasks by title or description..."
            className="w-full pl-9 pr-8 py-2 rounded-lg border border-[#E8E3D8] dark:border-[#38352F] bg-white dark:bg-[#272521] text-sm text-[#292824] dark:text-[#EDE9E3] placeholder-[#96928A] dark:placeholder-[#7E7970] focus:outline-none focus:border-[#8B7355] dark:focus:border-[#A88F72] transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => onChange({ ...filters, search: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#96928A] hover:text-[#292824] dark:text-[#7E7970] dark:hover:text-[#EDE9E3]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <select
              value={filters.priority}
              onChange={(e) =>
                onChange({ ...filters, priority: e.target.value as TaskPriority | 'all' })
              }
              aria-label="Filter by priority"
              className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-[#E8E3D8] dark:border-[#38352F] bg-white dark:bg-[#272521] text-xs font-medium text-[#292824] dark:text-[#EDE9E3] focus:outline-none focus:border-[#8B7355] cursor-pointer"
            >
              <option value="all">Priority: All</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#96928A] dark:text-[#7E7970] pointer-events-none" />
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-') as [TaskSortOption, SortOrder];
                onChange({ ...filters, sortBy, sortOrder });
              }}
              aria-label="Sort tasks by"
              className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-[#E8E3D8] dark:border-[#38352F] bg-white dark:bg-[#272521] text-xs font-medium text-[#292824] dark:text-[#EDE9E3] focus:outline-none focus:border-[#8B7355] cursor-pointer"
            >
              <option value="dueDate-asc">Due Date (Earliest)</option>
              <option value="dueDate-desc">Due Date (Latest)</option>
              <option value="createdAt-desc">Created (Newest)</option>
              <option value="createdAt-asc">Created (Oldest)</option>
              <option value="priority-desc">Priority (High to Low)</option>
              <option value="priority-asc">Priority (Low to High)</option>
            </select>
            <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#96928A] dark:text-[#7E7970] pointer-events-none" />
          </div>

          {/* Clear filters button */}
          {hasActiveFilters && (
            <button
              onClick={onClear}
              className="px-2.5 py-2 text-xs font-medium text-[#8B7355] dark:text-[#A88F72] hover:text-[#756044] hover:underline whitespace-nowrap transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Segmented Status Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-lg bg-[#F5F1E8] dark:bg-[#211F1C] border border-[#E8E3D8] dark:border-[#38352F] w-fit overflow-x-auto max-w-full">
        <button
          onClick={() => onChange({ ...filters, status: 'all' })}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            filters.status === 'all'
              ? 'bg-white dark:bg-[#272521] text-[#292824] dark:text-[#EDE9E3] shadow-xs'
              : 'text-[#706D66] dark:text-[#A6A197] hover:text-[#292824] dark:hover:text-[#EDE9E3]'
          }`}
        >
          All
        </button>
        <button
          onClick={() => onChange({ ...filters, status: 'todo' })}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            filters.status === 'todo'
              ? 'bg-white dark:bg-[#272521] text-[#292824] dark:text-[#EDE9E3] shadow-xs'
              : 'text-[#706D66] dark:text-[#A6A197] hover:text-[#292824] dark:hover:text-[#EDE9E3]'
          }`}
        >
          To Do
        </button>
        <button
          onClick={() => onChange({ ...filters, status: 'in-progress' })}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            filters.status === 'in-progress'
              ? 'bg-white dark:bg-[#272521] text-[#292824] dark:text-[#EDE9E3] shadow-xs'
              : 'text-[#706D66] dark:text-[#A6A197] hover:text-[#292824] dark:hover:text-[#EDE9E3]'
          }`}
        >
          In Progress
        </button>
        <button
          onClick={() => onChange({ ...filters, status: 'completed' })}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            filters.status === 'completed'
              ? 'bg-white dark:bg-[#272521] text-[#292824] dark:text-[#EDE9E3] shadow-xs'
              : 'text-[#706D66] dark:text-[#A6A197] hover:text-[#292824] dark:hover:text-[#EDE9E3]'
          }`}
        >
          Completed
        </button>
      </div>
    </div>
  );
};
