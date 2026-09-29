import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';
import { formatDate } from '../utils/date';
import {
  Bell,
  Menu,
  Sun,
  Moon,
  Check,
  Trash2,
  Layers,
  CheckCircle2,
  AlertCircle,
  Info,
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  pageTitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu, pageTitle }) => {
  const {
    notifications,
    unreadCount,
    markAllAsRead,
    clearAllNotifications,
    markAsRead,
  } = useNotifications();
  const { theme, toggleTheme } = useTheme();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notifications popover on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    };
    if (isNotifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isNotifOpen]);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-[#E8E3D8] dark:border-[#38352F] bg-[#FAF9F6]/90 dark:bg-[#181715]/90 backdrop-blur-md">
      {/* Left: Mobile menu button + Brand (mobile) / Breadcrumb or Page title (desktop) */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-lg text-[#706D66] dark:text-[#A6A197] hover:bg-[#F5F1E8] dark:hover:bg-[#272521] transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 md:hidden">
          <div className="w-6 h-6 rounded-md bg-[#8B7355] text-white flex items-center justify-center">
            <Layers className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-sm text-[#292824] dark:text-[#EDE9E3]">
            TaskFlow
          </span>
        </div>

        {pageTitle && (
          <h1 className="hidden md:block text-sm font-semibold text-[#292824] dark:text-[#EDE9E3]">
            {pageTitle}
          </h1>
        )}
      </div>

      {/* Right controls: Theme toggle + Notifications */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-[#706D66] hover:text-[#292824] hover:bg-[#F5F1E8] dark:text-[#A6A197] dark:hover:text-[#EDE9E3] dark:hover:bg-[#272521] transition-colors"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 stroke-[1.75]" />
          ) : (
            <Sun className="w-4 h-4 stroke-[1.75]" />
          )}
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-lg text-[#706D66] hover:text-[#292824] hover:bg-[#F5F1E8] dark:text-[#A6A197] dark:hover:text-[#EDE9E3] dark:hover:bg-[#272521] transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4 stroke-[1.75]" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#8B7355] dark:bg-[#A88F72] ring-2 ring-[#FAF9F6] dark:ring-[#181715]" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-[#E8E3D8] dark:border-[#38352F] bg-white dark:bg-[#272521] shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="p-3.5 border-b border-[#EEEAE1] dark:border-[#38352F] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-semibold text-[#292824] dark:text-[#EDE9E3]">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-[#F1EBDD] text-[#8B7355] dark:bg-[#302A22] dark:text-[#A88F72]">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="p-1 text-[11px] font-medium text-[#706D66] hover:text-[#292824] dark:text-[#A6A197] dark:hover:text-[#EDE9E3] rounded transition-colors"
                      title="Mark all as read"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      onClick={clearAllNotifications}
                      className="p-1 text-[11px] text-[#706D66] hover:text-[#B56B67] dark:text-[#A6A197] dark:hover:text-[#E89E9A] rounded transition-colors"
                      title="Clear notifications"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Notification list */}
              <div className="max-h-72 overflow-y-auto divide-y divide-[#EEEAE1] dark:divide-[#38352F]">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[#96928A] dark:text-[#7E7970]">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map((notif) => {
                    let Icon = Info;
                    let iconColor = 'text-[#71859A]';
                    if (notif.type === 'danger') {
                      Icon = AlertCircle;
                      iconColor = 'text-[#B56B67]';
                    } else if (notif.type === 'warning') {
                      Icon = AlertCircle;
                      iconColor = 'text-[#B08A4A]';
                    } else if (notif.type === 'success') {
                      Icon = CheckCircle2;
                      iconColor = 'text-[#6F8F72]';
                    }

                    return (
                      <div
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={`p-3 text-xs flex items-start gap-2.5 hover:bg-[#FAF9F6] dark:hover:bg-[#211F1C] cursor-pointer transition-colors ${
                          !notif.read
                            ? 'bg-[#F1EBDD]/40 dark:bg-[#302A22]/40'
                            : ''
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor}`} />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[#292824] dark:text-[#EDE9E3]">
                            {notif.title}
                          </p>
                          <p className="mt-0.5 text-[11px] text-[#706D66] dark:text-[#A6A197] leading-relaxed">
                            {notif.message}
                          </p>
                          <span className="block mt-1 text-[10px] text-[#96928A] dark:text-[#7E7970] tabular-nums">
                            {formatDate(notif.createdAt)}
                          </span>
                        </div>
                        {!notif.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#8B7355] dark:bg-[#A88F72] shrink-0 mt-1.5" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
