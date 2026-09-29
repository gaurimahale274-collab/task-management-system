export type TaskPriority = 'low' | 'medium' | 'high';

export type TaskStatus = 'todo' | 'in-progress' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string; // YYYY-MM-DD
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  completedAt?: string; // ISO date string
}

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface UserSettings {
  browserNotifications: boolean;
  theme: 'light' | 'dark';
}

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  createdAt: string;
  read: boolean;
  taskId?: string;
}

export type TaskSortOption = 'dueDate' | 'createdAt' | 'priority';
export type SortOrder = 'asc' | 'desc';

export interface TaskFilterState {
  search: string;
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
  sortBy: TaskSortOption;
  sortOrder: SortOrder;
}
