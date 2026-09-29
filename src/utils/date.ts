/**
 * Date utility functions for TaskFlow
 */

export function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/**
 * Returns today's date formatted as YYYY-MM-DD for date inputs
 */
export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Add days to today and return YYYY-MM-DD
 */
export function getDateOffset(days: number): string {
  const target = new Date();
  target.setDate(target.getDate() + days);
  const year = target.getFullYear();
  const month = String(target.getMonth() + 1).padStart(2, '0');
  const day = String(target.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * A task is overdue when dueDate is strictly before today and status is not completed.
 */
export function isTaskOverdue(dueDate: string, status: string): boolean {
  if (!dueDate || status === 'completed') return false;
  const today = getTodayString();
  return dueDate < today;
}

/**
 * A task is due today
 */
export function isTaskDueToday(dueDate: string): boolean {
  if (!dueDate) return false;
  return dueDate === getTodayString();
}

/**
 * A task is due soon (today or tomorrow)
 */
export function isTaskDueSoon(dueDate: string, status: string): boolean {
  if (!dueDate || status === 'completed') return false;
  const today = getTodayString();
  const tomorrow = getDateOffset(1);
  return dueDate === today || dueDate === tomorrow;
}

/**
 * Get human-readable deadline relative string (e.g. "Overdue by 2 days", "Due today", "Due in 3 days")
 */
export function getRelativeDeadlineString(dueDate: string, status: string): string {
  if (!dueDate) return '';
  if (status === 'completed') return 'Completed';

  const todayStr = getTodayString();
  if (dueDate === todayStr) return 'Due today';

  const due = new Date(dueDate + 'T00:00:00');
  const today = new Date(todayStr + 'T00:00:00');
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const overdueDays = Math.abs(diffDays);
    return `Overdue by ${overdueDays} ${overdueDays === 1 ? 'day' : 'days'}`;
  } else if (diffDays === 1) {
    return 'Due tomorrow';
  } else {
    return `Due in ${diffDays} days`;
  }
}
