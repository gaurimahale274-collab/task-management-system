import { Task, User, UserSettings, AppNotification } from '../types';
import { DEMO_USER, getSeedTasks } from './seedData';

const STORAGE_KEYS = {
  USERS: 'taskflow_users',
  SESSION: 'taskflow_active_session',
  TASKS_PREFIX: 'taskflow_tasks_',
  SETTINGS_PREFIX: 'taskflow_settings_',
  NOTIFICATIONS_PREFIX: 'taskflow_notifications_',
};

export interface StoredUser extends User {
  password?: string;
}

/**
 * Retrieve all registered users
 */
export function getAllUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) {
      // Seed initial demo user
      const initialUsers: StoredUser[] = [DEMO_USER];
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
      return initialUsers;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to get users from storage', err);
    return [DEMO_USER];
  }
}

/**
 * Save user into registered users list
 */
export function saveUser(user: StoredUser): void {
  try {
    const users = getAllUsers();
    const existingIndex = users.findIndex((u) => u.email.toLowerCase() === user.email.toLowerCase());
    if (existingIndex >= 0) {
      users[existingIndex] = { ...users[existingIndex], ...user };
    } else {
      users.push(user);
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save user', err);
  }
}

/**
 * Get user by email
 */
export function getUserByEmail(email: string): StoredUser | null {
  const users = getAllUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

/**
 * Get active session email
 */
export function getSession(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.SESSION);
  } catch {
    return null;
  }
}

/**
 * Set active session
 */
export function setSession(email: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSION, email);
  } catch (err) {
    console.error('Failed to set session', err);
  }
}

/**
 * Clear active session on logout
 */
export function clearSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  } catch (err) {
    console.error('Failed to clear session', err);
  }
}

/**
 * Get tasks for a given user email
 */
export function getTasks(userEmail: string): Task[] {
  if (!userEmail) return [];
  const key = `${STORAGE_KEYS.TASKS_PREFIX}${userEmail.toLowerCase()}`;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      // If demo user, seed demo tasks automatically
      if (userEmail.toLowerCase() === DEMO_USER.email.toLowerCase()) {
        const initialTasks = getSeedTasks();
        localStorage.setItem(key, JSON.stringify(initialTasks));
        return initialTasks;
      }
      return [];
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to get tasks', err);
    return [];
  }
}

/**
 * Save tasks for a user
 */
export function saveTasks(userEmail: string, tasks: Task[]): void {
  if (!userEmail) return;
  const key = `${STORAGE_KEYS.TASKS_PREFIX}${userEmail.toLowerCase()}`;
  try {
    localStorage.setItem(key, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks', err);
  }
}

/**
 * Get user preferences/settings
 */
export function getSettings(userEmail: string): UserSettings {
  const defaultSettings: UserSettings = {
    browserNotifications: false,
    theme: 'light',
  };
  if (!userEmail) return defaultSettings;
  const key = `${STORAGE_KEYS.SETTINGS_PREFIX}${userEmail.toLowerCase()}`;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultSettings;
    return { ...defaultSettings, ...JSON.parse(raw) };
  } catch {
    return defaultSettings;
  }
}

/**
 * Save user settings
 */
export function saveSettings(userEmail: string, settings: UserSettings): void {
  if (!userEmail) return;
  const key = `${STORAGE_KEYS.SETTINGS_PREFIX}${userEmail.toLowerCase()}`;
  try {
    localStorage.setItem(key, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings', err);
  }
}

/**
 * Get notifications for user
 */
export function getNotifications(userEmail: string): AppNotification[] {
  if (!userEmail) return [];
  const key = `${STORAGE_KEYS.NOTIFICATIONS_PREFIX}${userEmail.toLowerCase()}`;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save notifications for user
 */
export function saveNotifications(userEmail: string, notifications: AppNotification[]): void {
  if (!userEmail) return;
  const key = `${STORAGE_KEYS.NOTIFICATIONS_PREFIX}${userEmail.toLowerCase()}`;
  try {
    localStorage.setItem(key, JSON.stringify(notifications));
  } catch (err) {
    console.error('Failed to save notifications', err);
  }
}
