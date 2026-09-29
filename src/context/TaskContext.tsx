import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { Task, TaskPriority, TaskStatus } from '../types';
import { getTasks, saveTasks, getNotifications, saveNotifications } from '../utils/storage';
import { useAuth } from './AuthContext';
import { useNotifications } from './NotificationContext';
import { isTaskOverdue } from '../utils/date';
import { auditTaskNotifications } from '../utils/notifications';

interface TaskContextType {
  tasks: Task[];
  addTask: (taskData: {
    title: string;
    description: string;
    priority: TaskPriority;
    dueDate: string;
    status: TaskStatus;
  }) => Promise<void>;
  updateTask: (
    id: string,
    updates: Partial<Omit<Task, 'id' | 'createdAt'>>
  ) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  changeTaskStatus: (id: string, newStatus: TaskStatus) => Promise<void>;
  markTaskIncomplete: (id: string) => Promise<void>;
  getTaskById: (id: string) => Task | undefined;
  // Computed statistics
  stats: {
    total: number;
    completed: number;
    pending: number;
    inProgress: number;
    overdue: number;
    completionPercentage: number;
    priorityBreakdown: {
      low: number;
      medium: number;
      high: number;
    };
    statusBreakdown: {
      todo: number;
      inProgress: number;
      completed: number;
    };
  };
  upcomingTasks: Task[];
  recentlyCompletedTasks: Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { showToast, addNotification, refreshNotifications } = useNotifications();
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load user tasks when user changes
  useEffect(() => {
    if (user) {
      const loadedTasks = getTasks(user.email);
      setTasks(loadedTasks);

      // Audit deadlines and populate notifications gracefully
      const existingNotifs = getNotifications(user.email);
      const audited = auditTaskNotifications(loadedTasks, existingNotifs);
      if (audited.length !== existingNotifs.length) {
        saveNotifications(user.email, audited);
        refreshNotifications();
      }
    } else {
      setTasks([]);
    }
  }, [user, refreshNotifications]);

  // Persist helper
  const persistTasks = useCallback(
    (newTasks: Task[]) => {
      setTasks(newTasks);
      if (user) {
        saveTasks(user.email, newTasks);
      }
    },
    [user]
  );

  const addTask = async (taskData: {
    title: string;
    description: string;
    priority: TaskPriority;
    dueDate: string;
    status: TaskStatus;
  }): Promise<void> => {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: 'task_' + Math.random().toString(36).substring(2, 9),
      title: taskData.title.trim(),
      description: taskData.description.trim(),
      priority: taskData.priority,
      status: taskData.status,
      dueDate: taskData.dueDate,
      createdAt: now,
      updatedAt: now,
      completedAt: taskData.status === 'completed' ? now : undefined,
    };

    const updated = [newTask, ...tasks];
    persistTasks(updated);
    showToast('Task added successfully.', 'success');
    addNotification('Task Added', `Created '${newTask.title}'`, 'info', newTask.id);
  };

  const updateTask = async (
    id: string,
    updates: Partial<Omit<Task, 'id' | 'createdAt'>>
  ): Promise<void> => {
    const now = new Date().toISOString();
    const updated = tasks.map((task) => {
      if (task.id === id) {
        const isNowCompleted = updates.status === 'completed' && task.status !== 'completed';
        const isNoLongerCompleted = updates.status && updates.status !== 'completed' && task.status === 'completed';

        return {
          ...task,
          ...updates,
          updatedAt: now,
          completedAt: isNowCompleted
            ? now
            : isNoLongerCompleted
            ? undefined
            : updates.completedAt !== undefined
            ? updates.completedAt
            : task.completedAt,
        };
      }
      return task;
    });

    persistTasks(updated);
    showToast('Task updated successfully.', 'success');
  };

  const deleteTask = async (id: string): Promise<void> => {
    const taskToDelete = tasks.find((t) => t.id === id);
    const updated = tasks.filter((t) => t.id !== id);
    persistTasks(updated);
    showToast('Task deleted successfully.', 'info');
  };

  const changeTaskStatus = async (id: string, newStatus: TaskStatus): Promise<void> => {
    const now = new Date().toISOString();
    let changedTaskTitle = '';

    const updated = tasks.map((task) => {
      if (task.id === id) {
        changedTaskTitle = task.title;
        const isCompleted = newStatus === 'completed';
        return {
          ...task,
          status: newStatus,
          updatedAt: now,
          completedAt: isCompleted ? now : undefined,
        };
      }
      return task;
    });

    persistTasks(updated);

    if (newStatus === 'completed') {
      showToast('Task completed!', 'success');
      addNotification('Task Completed', `Nice job finishing '${changedTaskTitle}'`, 'success', id);
    } else {
      showToast(`Status updated to ${newStatus === 'in-progress' ? 'In Progress' : 'To Do'}`, 'info');
    }
  };

  const markTaskIncomplete = async (id: string): Promise<void> => {
    await changeTaskStatus(id, 'in-progress');
  };

  const getTaskById = (id: string): Task | undefined => {
    return tasks.find((t) => t.id === id);
  };

  // Dynamically calculated stats
  const stats = useMemo(() => {
    const total = tasks.length;
    let completed = 0;
    let pending = 0;
    let inProgress = 0;
    let overdue = 0;

    const priorityBreakdown = { low: 0, medium: 0, high: 0 };
    const statusBreakdown = { todo: 0, inProgress: 0, completed: 0 };

    tasks.forEach((t) => {
      // Priority count
      if (t.priority === 'low') priorityBreakdown.low++;
      else if (t.priority === 'medium') priorityBreakdown.medium++;
      else if (t.priority === 'high') priorityBreakdown.high++;

      // Status count
      if (t.status === 'completed') {
        completed++;
        statusBreakdown.completed++;
      } else if (t.status === 'in-progress') {
        inProgress++;
        statusBreakdown.inProgress++;
        if (isTaskOverdue(t.dueDate, t.status)) {
          overdue++;
        }
      } else {
        pending++;
        statusBreakdown.todo++;
        if (isTaskOverdue(t.dueDate, t.status)) {
          overdue++;
        }
      }
    });

    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      inProgress,
      overdue,
      completionPercentage,
      priorityBreakdown,
      statusBreakdown,
    };
  }, [tasks]);

  // Upcoming incomplete tasks ordered by due date
  const upcomingTasks = useMemo(() => {
    return tasks
      .filter((t) => t.status !== 'completed')
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 5);
  }, [tasks]);

  // Recently completed tasks ordered by completed date
  const recentlyCompletedTasks = useMemo(() => {
    return tasks
      .filter((t) => t.status === 'completed' && t.completedAt)
      .sort((a, b) => (b.completedAt || '').localeCompare(a.completedAt || ''))
      .slice(0, 5);
  }, [tasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        changeTaskStatus,
        markTaskIncomplete,
        getTaskById,
        stats,
        upcomingTasks,
        recentlyCompletedTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export function useTasks(): TaskContextType {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
