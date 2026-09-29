import React, { useEffect } from 'react';
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
  X,
} from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/tasks/add', label: 'Add Task', icon: PlusCircle },
    { to: '/tasks', label: 'My Tasks', icon: CheckSquare, end: true },
    { to: '/tasks/completed', label: 'Completed Tasks', icon: CheckCircle },
    { to: '/reports', label: 'Reports', icon: BarChart3 },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-72 max-w-[80vw] h-full bg-[#F5F1E8] dark:bg-[#211F1C] border-r border-[#E8E3D8] dark:border-[#38352F] flex flex-col justify-between p-4 z-10 shadow-2xl animate-in slide-in-from-left duration-200">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E3D8] dark:border-[#38352F]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#8B7355] text-white flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-base text-[#292824] dark:text-[#EDE9E3]">
                  TaskFlow
                </span>
                <span className="block text-[10px] text-[#96928A] dark:text-[#7E7970] uppercase tracking-wider font-medium">
                  Workspace
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[#706D66] hover:text-[#292824] dark:text-[#A6A197] dark:hover:text-[#EDE9E3]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links */}
          <nav className="mt-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-white dark:bg-[#272521] text-[#292824] dark:text-[#EDE9E3] shadow-xs'
                        : 'text-[#706D66] dark:text-[#A6A197] hover:text-[#292824] dark:hover:text-[#EDE9E3]'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0 stroke-[1.75]" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="pt-4 border-t border-[#E8E3D8] dark:border-[#38352F] space-y-2">
          {user && (
            <div className="px-2 py-1">
              <p className="text-xs font-medium text-[#292824] dark:text-[#EDE9E3] truncate">
                {user.name}
              </p>
              <p className="text-[11px] text-[#96928A] dark:text-[#7E7970] truncate">
                {user.email}
              </p>
            </div>
          )}
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-[#706D66] hover:text-[#B56B67] hover:bg-white/60 dark:text-[#A6A197] dark:hover:text-[#E89E9A] dark:hover:bg-[#272521]/60 transition-colors"
          >
            <LogOut className="w-4 h-4 stroke-[1.75]" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
