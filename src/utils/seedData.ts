import { Task } from '../types';
import { getDateOffset } from './date';

export const DEMO_USER = {
  id: 'usr_demo_001',
  name: 'Alex Morgan',
  email: 'user@taskflow.demo',
  password: 'user123',
  createdAt: '2026-09-01T08:00:00.000Z',
};

export function getSeedTasks(): Task[] {
  return [
    {
      id: 'task_001',
      title: 'Complete project documentation',
      description: 'Draft the architectural overview, user guides, and deployment notes for the milestone review.',
      priority: 'high',
      status: 'in-progress',
      dueDate: getDateOffset(2),
      createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'task_002',
      title: 'Prepare presentation',
      description: 'Create slide deck for the semester defense, highlighting core features, technical stack, and data persistence.',
      priority: 'high',
      status: 'todo',
      dueDate: getDateOffset(1), // Tomorrow
      createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'task_003',
      title: 'Review machine learning notes',
      description: 'Summarize supervised learning, loss functions, and optimization algorithms for the upcoming exam.',
      priority: 'medium',
      status: 'todo',
      dueDate: getDateOffset(5),
      createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'task_004',
      title: 'Finish UI design',
      description: 'Refine desktop layout spacing, warm cream color system, and responsive card layouts across all viewports.',
      priority: 'high',
      status: 'completed',
      dueDate: getDateOffset(-1),
      createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
      completedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    },
    {
      id: 'task_005',
      title: 'Test login functionality',
      description: 'Validate credential verification, session persistence in localStorage, and redirection to the dashboard.',
      priority: 'medium',
      status: 'completed',
      dueDate: getDateOffset(-2),
      createdAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
      completedAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
    },
    {
      id: 'task_006',
      title: 'Update project report',
      description: 'Incorporate mentor feedback on Chapter 3 and verify citation formats before final submission.',
      priority: 'medium',
      status: 'in-progress',
      dueDate: getDateOffset(3),
      createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    },
    {
      id: 'task_007',
      title: 'Prepare database schema',
      description: 'Structure entity interfaces, data models, and local storage serialization helpers for relational task tracking.',
      priority: 'low',
      status: 'completed',
      dueDate: getDateOffset(-3),
      createdAt: new Date(Date.now() - 6 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
      completedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'task_008',
      title: 'Submit assignment',
      description: 'Upload the final code bundle, project writeup, and demonstration recording to the course portal.',
      priority: 'high',
      status: 'todo',
      dueDate: getDateOffset(-1), // Overdue by 1 day!
      createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    },
  ];
}
