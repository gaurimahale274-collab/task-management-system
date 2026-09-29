import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { AppNotification, ToastMessage, ToastType } from '../types';
import { getNotifications, saveNotifications, getSettings } from '../utils/storage';
import { sendBrowserNotification } from '../utils/notifications';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
  addNotification: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'danger', taskId?: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAllNotifications: () => void;
  refreshNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode; userEmail?: string }> = ({
  children,
  userEmail,
}) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Load notifications when user changes
  useEffect(() => {
    if (userEmail) {
      setNotifications(getNotifications(userEmail));
    } else {
      setNotifications([]);
    }
  }, [userEmail]);

  const refreshNotifications = useCallback(() => {
    if (userEmail) {
      setNotifications(getNotifications(userEmail));
    }
  }, [userEmail]);

  // Toast management
  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 3.2 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3200);
  }, [removeToast]);

  const addNotification = useCallback((
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'danger' = 'info',
    taskId?: string
  ) => {
    if (!userEmail) return;

    const newNotif: AppNotification = {
      id: 'notif_' + Math.random().toString(36).substring(2, 9),
      title,
      message,
      type,
      createdAt: new Date().toISOString(),
      read: false,
      taskId,
    };

    setNotifications((prev) => {
      const updated = [newNotif, ...prev].slice(0, 30);
      saveNotifications(userEmail, updated);
      return updated;
    });

    // If browser notifications are enabled in user settings, send desktop notification
    const settings = getSettings(userEmail);
    if (settings.browserNotifications) {
      sendBrowserNotification(title, { body: message });
    }
  }, [userEmail]);

  const markAsRead = useCallback((id: string) => {
    if (!userEmail) return;
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      saveNotifications(userEmail, updated);
      return updated;
    });
  }, [userEmail]);

  const markAllAsRead = useCallback(() => {
    if (!userEmail) return;
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      saveNotifications(userEmail, updated);
      return updated;
    });
  }, [userEmail]);

  const clearAllNotifications = useCallback(() => {
    if (!userEmail) return;
    setNotifications([]);
    saveNotifications(userEmail, []);
  }, [userEmail]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        toasts,
        showToast,
        removeToast,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearAllNotifications,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export function useNotifications(): NotificationContextType {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
