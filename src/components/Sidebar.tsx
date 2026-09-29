import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  CheckSquare,
  CheckCircle,
  BarChart3,
  User,
  LogOut,
  Layers,
} from 'lucide-react';

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '', onNavigate }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/tasks/add', label: 'Add Task', icon: PlusCircle },
    { to: '/tasks', label: 'My Tasks', icon: CheckSquare, end: true },
    { to: '/tasks/completed', label: 'Completed Tasks', icon: CheckCircle },
    { to: '/reports', label: 'Reports', icon: BarChart3 },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <aside
      className={`w-64 flex flex-col justify-between border-r border-[#E8E3D8] dark:border-[#38352F] bg-[#F5F1E8] dark:bg-[#211F1C] h-screen sticky top-0 ${className}`}
    >
      {/* Top brand header */}
      <div>
        <div className="p-6 border-b border-[#E8E3D8] dark:border-[#38352F] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#8B7355] text-white flex items-center justify-center shadow-xs">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="font-semibold text-base text-[#292824] dark:text-[#EDE9E3] tracking-tight">
                TaskFlow
              </span>
              <span className="block text-[10px] text-[#96928A] dark:text-[#7E7970] uppercase tracking-wider font-medium">
                Personal Workspace
              </span>
            </div>
          </div>
        </div>

        {/* Main navigation list */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all relative ${
                    isActive
                      ? 'bg-white dark:bg-[#272521] text-[#292824] dark:text-[#EDE9E3] shadow-xs before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-[#8B7355] dark:before:bg-[#A88F72] before:rounded-r'
                      : 'text-[#706D66] dark:text-[#A6A197] hover:text-[#292824] dark:hover:text-[#EDE9E3] hover:bg-white/40 dark:hover:bg-[#272521]/40'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0 stroke-[1.75]" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom user profile & Logout */}
      <div className="p-4 border-t border-[#E8E3D8] dark:border-[#38352F] space-y-2">
        {user && (
          <div className="px-2 py-1.5 flex items-center justify-between">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-medium text-[#292824] dark:text-[#EDE9E3] truncate">
                {user.name}
              </p>
              <p className="text-[11px] text-[#96928A] dark:text-[#7E7970] truncate">
                {user.email}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#706D66] hover:text-[#B56B67] hover:bg-white/60 dark:text-[#A6A197] dark:hover:text-[#E89E9A] dark:hover:bg-[#272521]/60 transition-colors"
        >
          <LogOut className="w-4 h-4 stroke-[1.75]" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};
