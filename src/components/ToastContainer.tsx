import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let iconColor = 'text-[#547357] dark:text-[#A7C7AA]';
        let borderColor = 'border-[#E8E3D8] dark:border-[#38352F]';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          iconColor = 'text-[#B56B67] dark:text-[#E89E9A]';
        } else if (toast.type === 'warning') {
          Icon = AlertCircle;
          iconColor = 'text-[#916E31] dark:text-[#E0BC7D]';
        } else if (toast.type === 'info') {
          Icon = Info;
          iconColor = 'text-[#54687C] dark:text-[#A4BCCC]';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl border ${borderColor} bg-white dark:bg-[#272521] shadow-md transition-all duration-200 animate-in slide-in-from-bottom-2 fade-in`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Icon className={`w-4 h-4 shrink-0 stroke-[2] ${iconColor}`} />
              <p className="text-xs font-medium text-[#292824] dark:text-[#EDE9E3] truncate">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#96928A] hover:text-[#292824] dark:text-[#7E7970] dark:hover:text-[#EDE9E3] p-1 rounded-md transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
