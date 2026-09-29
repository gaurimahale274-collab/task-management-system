import { Task, AppNotification } from '../types';
import { isTaskOverdue, isTaskDueToday, getDateOffset } from './date';

/**
 * Check if the browser supports notifications
 */
export function isBrowserNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Get current browser notification permission
 */
export function getBrowserNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isBrowserNotificationSupported()) return 'unsupported';
  return Notification.permission;
}

/**
 * Gracefully request browser notification permission
 */
export async function requestBrowserNotificationPermission(): Promise<boolean> {
  if (!isBrowserNotificationSupported()) return false;
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (err) {
    console.warn('Failed to request notification permission:', err);
    return false;
  }
}

/**
 * Send a browser desktop notification if permission is granted
 */
export function sendBrowserNotification(title: string, options?: NotificationOptions): void {
  if (!isBrowserNotificationSupported()) return;
  if (Notification.permission !== 'granted') return;

  try {
    new Notification(title, {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      ...options,
    });
  } catch (err) {
    console.warn('Browser notification error:', err);
  }
}

/**
 * Audit user tasks for approaching deadlines and overdue tasks,
 * generating in-app notifications without duplicates.
 */
export function auditTaskNotifications(
  tasks: Task[],
  existingNotifications: AppNotification[]
): AppNotification[] {
  const newNotifications: AppNotification[] = [...existingNotifications];
  const nowStr = new Date().toISOString();
  const tomorrowStr = getDateOffset(1);

  // Set of already notified task + type combinations
  const notifiedKeys = new Set(
    existingNotifications.map((n) => `${n.taskId}_${n.type}`)
  );

  tasks.forEach((task) => {
    if (task.status === 'completed') return;

    // Check overdue
    if (isTaskOverdue(task.dueDate, task.status)) {
      const key = `${task.id}_danger`;
      if (!notifiedKeys.has(key)) {
        notifiedKeys.add(key);
        newNotifications.unshift({
          id: 'notif_' + Math.random().toString(36).substring(2, 9),
          title: 'Task Overdue',
          message: `'${task.title}' was due on ${task.dueDate} and is overdue.`,
          type: 'danger',
          createdAt: nowStr,
          read: false,
          taskId: task.id,
        });
      }
    }
    // Check due today
    else if (isTaskDueToday(task.dueDate)) {
      const key = `${task.id}_warning`;
      if (!notifiedKeys.has(key)) {
        notifiedKeys.add(key);
        newNotifications.unshift({
          id: 'notif_' + Math.random().toString(36).substring(2, 9),
          title: 'Task Due Today',
          message: `'${task.title}' is due today.`,
          type: 'warning',
          createdAt: nowStr,
          read: false,
          taskId: task.id,
        });
      }
    }
    // Check due tomorrow
    else if (task.dueDate === tomorrowStr) {
      const key = `${task.id}_info`;
      if (!notifiedKeys.has(key)) {
        notifiedKeys.add(key);
        newNotifications.unshift({
          id: 'notif_' + Math.random().toString(36).substring(2, 9),
          title: 'Deadline Approaching',
          message: `'${task.title}' is due tomorrow.`,
          type: 'info',
          createdAt: nowStr,
          read: false,
          taskId: task.id,
        });
      }
    }
  });

  // Limit notifications list to the most recent 25 items
  return newNotifications.slice(0, 25);
}
