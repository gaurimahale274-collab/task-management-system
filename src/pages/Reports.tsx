import React from 'react';
import { useTasks } from '../context/TaskContext';
import { StatCard } from '../components/StatCard';
import { CheckCircle2, Clock, AlertCircle, BarChart3, Target } from 'lucide-react';

export const Reports: React.FC = () => {
  const { stats } = useTasks();

  const total = stats.total;
  const completed = stats.completed;
  const inProgress = stats.inProgress;
  const pending = stats.pending;
  const overdue = stats.overdue;

  // Percentage calculations
  const completedPct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const inProgressPct = total > 0 ? Math.round((inProgress / total) * 100) : 0;
  const pendingPct = total > 0 ? Math.round((pending / total) * 100) : 0;

  const lowPct = total > 0 ? Math.round((stats.priorityBreakdown.low / total) * 100) : 0;
  const medPct = total > 0 ? Math.round((stats.priorityBreakdown.medium / total) * 100) : 0;
  const highPct = total > 0 ? Math.round((stats.priorityBreakdown.high / total) * 100) : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-[#292824] dark:text-[#EDE9E3] tracking-tight">
          Reports & Productivity
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#706D66] dark:text-[#A6A197]">
          Real-time analysis and completion metrics calculated directly from your tasks.
        </p>
      </div>

      {/* Top 5 Metrics Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard label="Total Tasks" value={total} sublabel="Recorded" />
        <StatCard label="Completed" value={completed} sublabel={`${completedPct}% done`} accent />
        <StatCard label="In Progress" value={inProgress} sublabel="Underway" />
        <StatCard label="Pending" value={pending} sublabel="To Do" />
        <div className="col-span-2 sm:col-span-1">
          <StatCard
            label="Overdue"
            value={overdue}
            sublabel={overdue > 0 ? 'Action required' : 'All on track'}
          />
        </div>
      </div>

      {/* Visual Analytics Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Section 1: Completion Overview */}
        <div className="rounded-xl border border-[#E8E3D8] dark:border-[#38352F] bg-white dark:bg-[#272521] p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#EEEAE1] dark:border-[#38352F]">
            <div>
              <h2 className="text-sm font-semibold text-[#292824] dark:text-[#EDE9E3]">
                Completion Overview
              </h2>
              <p className="text-xs text-[#706D66] dark:text-[#A6A197] mt-0.5">
                Task distribution across lifecycle stages
              </p>
            </div>
            <span className="text-xs font-semibold tabular-nums text-[#8B7355] dark:text-[#A88F72] px-2 py-0.5 rounded bg-[#F1EBDD] dark:bg-[#302A22]">
              {completedPct}% Overall
            </span>
          </div>

          {/* Segmented bar */}
          <div>
            <div className="h-3 w-full rounded-full bg-[#EEEAE1] dark:bg-[#38352F] overflow-hidden flex">
              <div
                style={{ width: `${completedPct}%` }}
                className="bg-[#6F8F72] transition-all duration-300"
                title={`Completed: ${completedPct}%`}
              />
              <div
                style={{ width: `${inProgressPct}%` }}
                className="bg-[#71859A] transition-all duration-300"
                title={`In Progress: ${inProgressPct}%`}
              />
              <div
                style={{ width: `${pendingPct}%` }}
                className="bg-[#B08A4A] transition-all duration-300"
                title={`To Do: ${pendingPct}%`}
              />
            </div>
          </div>

          {/* Breakdown items */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6F8F72]" />
                <span className="text-[#292824] dark:text-[#EDE9E3] font-medium">Completed</span>
              </div>
              <span className="tabular-nums text-[#706D66] dark:text-[#A6A197]">
                <strong className="text-[#292824] dark:text-[#EDE9E3]">{completed}</strong> ({completedPct}%)
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#71859A]" />
                <span className="text-[#292824] dark:text-[#EDE9E3] font-medium">In Progress</span>
              </div>
              <span className="tabular-nums text-[#706D66] dark:text-[#A6A197]">
                <strong className="text-[#292824] dark:text-[#EDE9E3]">{inProgress}</strong> ({inProgressPct}%)
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B08A4A]" />
                <span className="text-[#292824] dark:text-[#EDE9E3] font-medium">To Do (Pending)</span>
              </div>
              <span className="tabular-nums text-[#706D66] dark:text-[#A6A197]">
                <strong className="text-[#292824] dark:text-[#EDE9E3]">{pending}</strong> ({pendingPct}%)
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Priority Breakdown */}
        <div className="rounded-xl border border-[#E8E3D8] dark:border-[#38352F] bg-white dark:bg-[#272521] p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#EEEAE1] dark:border-[#38352F]">
            <div>
              <h2 className="text-sm font-semibold text-[#292824] dark:text-[#EDE9E3]">
                Priority Breakdown
              </h2>
              <p className="text-xs text-[#706D66] dark:text-[#A6A197] mt-0.5">
                Urgency levels assigned to all tasks
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* High */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-[#292824] dark:text-[#EDE9E3] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#B56B67]" />
                  High Priority
                </span>
                <span className="tabular-nums text-[#706D66] dark:text-[#A6A197]">
                  <strong className="text-[#292824] dark:text-[#EDE9E3]">
                    {stats.priorityBreakdown.high}
                  </strong>{' '}
                  ({highPct}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#EEEAE1] dark:bg-[#38352F] overflow-hidden">
                <div
                  style={{ width: `${highPct}%` }}
                  className="h-full bg-[#B56B67] rounded-full transition-all duration-300"
                />
              </div>
            </div>

            {/* Medium */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-[#292824] dark:text-[#EDE9E3] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#B08A4A]" />
                  Medium Priority
                </span>
                <span className="tabular-nums text-[#706D66] dark:text-[#A6A197]">
                  <strong className="text-[#292824] dark:text-[#EDE9E3]">
                    {stats.priorityBreakdown.medium}
                  </strong>{' '}
                  ({medPct}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#EEEAE1] dark:bg-[#38352F] overflow-hidden">
                <div
                  style={{ width: `${medPct}%` }}
                  className="h-full bg-[#B08A4A] rounded-full transition-all duration-300"
                />
              </div>
            </div>

            {/* Low */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-medium text-[#292824] dark:text-[#EDE9E3] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#96928A]" />
                  Low Priority
                </span>
                <span className="tabular-nums text-[#706D66] dark:text-[#A6A197]">
                  <strong className="text-[#292824] dark:text-[#EDE9E3]">
                    {stats.priorityBreakdown.low}
                  </strong>{' '}
                  ({lowPct}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#EEEAE1] dark:bg-[#38352F] overflow-hidden">
                <div
                  style={{ width: `${lowPct}%` }}
                  className="h-full bg-[#96928A] rounded-full transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Productivity Summary Table / Card */}
      <div className="rounded-xl border border-[#E8E3D8] dark:border-[#38352F] bg-white dark:bg-[#272521] p-6 space-y-4">
        <div className="pb-3 border-b border-[#EEEAE1] dark:border-[#38352F]">
          <h2 className="text-sm font-semibold text-[#292824] dark:text-[#EDE9E3]">
            Productivity Summary
          </h2>
          <p className="text-xs text-[#706D66] dark:text-[#A6A197] mt-0.5">
            Key execution ratios based on your task history
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          <div className="p-4 rounded-lg bg-[#FAF9F6] dark:bg-[#211F1C] border border-[#EEEAE1] dark:border-[#38352F]">
            <span className="text-[11px] font-medium text-[#706D66] dark:text-[#A6A197] uppercase tracking-wider block">
              Total Tasks Created
            </span>
            <span className="mt-2 text-2xl font-semibold text-[#292824] dark:text-[#EDE9E3] tabular-nums block">
              {total}
            </span>
            <span className="text-[11px] text-[#96928A] dark:text-[#7E7970] mt-1 block">
              Cumulative lifetime tasks
            </span>
          </div>

          <div className="p-4 rounded-lg bg-[#FAF9F6] dark:bg-[#211F1C] border border-[#EEEAE1] dark:border-[#38352F]">
            <span className="text-[11px] font-medium text-[#706D66] dark:text-[#A6A197] uppercase tracking-wider block">
              Tasks Completed
            </span>
            <span className="mt-2 text-2xl font-semibold text-[#6F8F72] dark:text-[#7FA383] tabular-nums block">
              {completed}
            </span>
            <span className="text-[11px] text-[#96928A] dark:text-[#7E7970] mt-1 block">
              Successfully finished
            </span>
          </div>

          <div className="p-4 rounded-lg bg-[#FAF9F6] dark:bg-[#211F1C] border border-[#EEEAE1] dark:border-[#38352F]">
            <span className="text-[11px] font-medium text-[#706D66] dark:text-[#A6A197] uppercase tracking-wider block">
              Completion Percentage
            </span>
            <span className="mt-2 text-2xl font-semibold text-[#8B7355] dark:text-[#A88F72] tabular-nums block">
              {completedPct}%
            </span>
            <span className="text-[11px] text-[#96928A] dark:text-[#7E7970] mt-1 block">
              completed ÷ total × 100
            </span>
          </div>

          <div className="p-4 rounded-lg bg-[#FAF9F6] dark:bg-[#211F1C] border border-[#EEEAE1] dark:border-[#38352F]">
            <span className="text-[11px] font-medium text-[#706D66] dark:text-[#A6A197] uppercase tracking-wider block">
              Overdue Tasks
            </span>
            <span
              className={`mt-2 text-2xl font-semibold tabular-nums block ${
                overdue > 0
                  ? 'text-[#B56B67] dark:text-[#E89E9A]'
                  : 'text-[#292824] dark:text-[#EDE9E3]'
              }`}
            >
              {overdue}
            </span>
            <span className="text-[11px] text-[#96928A] dark:text-[#7E7970] mt-1 block">
              Past deadline & unfinished
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
