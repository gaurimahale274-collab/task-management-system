import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNotifications } from '../context/NotificationContext';
import { getSettings, saveSettings } from '../utils/storage';
import {
  isBrowserNotificationSupported,
  getBrowserNotificationPermission,
  requestBrowserNotificationPermission,
} from '../utils/notifications';
import { formatDate } from '../utils/date';
import { User, Bell, Palette, ShieldCheck, Check } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const { showToast } = useNotifications();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [browserNotifs, setBrowserNotifs] = useState(false);
  const [permStatus, setPermStatus] = useState<NotificationPermission | 'unsupported'>('default');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      const settings = getSettings(user.email);
      setBrowserNotifs(settings.browserNotifications);
      setPermStatus(getBrowserNotificationPermission());
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaveSuccess(false);

    if (!name.trim()) {
      setError('Name cannot be empty.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    setIsSaving(true);
    const res = await updateProfile(name, email);
    setIsSaving(false);

    if (res.success) {
      setSaveSuccess(true);
      showToast('Profile updated successfully.', 'success');
      setTimeout(() => setSaveSuccess(false), 3000);
    } else {
      setError(res.error || 'Failed to update profile.');
    }
  };

  const handleToggleNotifications = async () => {
    if (!user) return;

    if (!browserNotifs) {
      // User is enabling notifications
      if (isBrowserNotificationSupported()) {
        const granted = await requestBrowserNotificationPermission();
        const currentPerm = getBrowserNotificationPermission();
        setPermStatus(currentPerm);

        const updated = granted;
        setBrowserNotifs(updated);
        const settings = getSettings(user.email);
        saveSettings(user.email, { ...settings, browserNotifications: updated });

        if (granted) {
          showToast('Browser notifications enabled.', 'success');
        } else {
          showToast('Notification permission was not granted.', 'warning');
        }
      } else {
        showToast('Browser notifications are not supported by this browser.', 'warning');
      }
    } else {
      // User is disabling notifications
      setBrowserNotifs(false);
      const settings = getSettings(user.email);
      saveSettings(user.email, { ...settings, browserNotifications: false });
      showToast('Browser notifications disabled.', 'info');
    }
  };

  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    showToast(`Switched to ${newTheme} theme.`, 'info');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-[#292824] dark:text-[#EDE9E3] tracking-tight">
          Profile & Preferences
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#706D66] dark:text-[#A6A197]">
          Manage your personal account settings and application preferences.
        </p>
      </div>

      {/* Account Info Form */}
      <div className="rounded-xl border border-[#E8E3D8] dark:border-[#38352F] bg-white dark:bg-[#272521] p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#EEEAE1] dark:border-[#38352F]">
          <User className="w-4 h-4 text-[#8B7355] dark:text-[#A88F72]" />
          <h2 className="text-sm font-semibold text-[#292824] dark:text-[#EDE9E3]">
            Personal Details
          </h2>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-[#B56B67]/15 border border-[#B56B67]/30 text-[#B56B67] dark:text-[#E89E9A] text-xs font-medium">
            {error}
          </div>
        )}

        {saveSuccess && (
          <div className="p-3 rounded-lg bg-[#6F8F72]/15 border border-[#6F8F72]/30 text-[#547357] dark:text-[#A7C7AA] text-xs font-medium flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Profile details saved successfully.</span>
          </div>
        )}

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#706D66] dark:text-[#A6A197] mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] dark:border-[#38352F] bg-[#FAF9F6] dark:bg-[#211F1C] text-[#292824] dark:text-[#EDE9E3] text-sm focus:outline-none focus:border-[#8B7355] dark:focus:border-[#A88F72] transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#706D66] dark:text-[#A6A197] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8E3D8] dark:border-[#38352F] bg-[#FAF9F6] dark:bg-[#211F1C] text-[#292824] dark:text-[#EDE9E3] text-sm focus:outline-none focus:border-[#8B7355] dark:focus:border-[#A88F72] transition-colors"
              required
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-[#96928A] dark:text-[#7E7970] tabular-nums">
              Member since {user?.createdAt ? formatDate(user.createdAt) : '2026'}
            </span>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#8B7355] hover:bg-[#756044] dark:bg-[#A88F72] dark:hover:bg-[#BFAB91] transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Preferences Section */}
      <div className="rounded-xl border border-[#E8E3D8] dark:border-[#38352F] bg-white dark:bg-[#272521] p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-[#EEEAE1] dark:border-[#38352F]">
          <Palette className="w-4 h-4 text-[#8B7355] dark:text-[#A88F72]" />
          <h2 className="text-sm font-semibold text-[#292824] dark:text-[#EDE9E3]">
            Preferences
          </h2>
        </div>

        {/* Theme Preference */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-medium text-[#292824] dark:text-[#EDE9E3]">
              Interface Theme
            </h3>
            <p className="text-[11px] text-[#706D66] dark:text-[#A6A197] mt-0.5">
              Default is warm cream & light white; toggle for low-light mode.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 rounded-lg bg-[#F5F1E8] dark:bg-[#211F1C] border border-[#E8E3D8] dark:border-[#38352F]">
            <button
              type="button"
              onClick={() => handleThemeChange('light')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                theme === 'light'
                  ? 'bg-white dark:bg-[#272521] text-[#292824] dark:text-[#EDE9E3] shadow-xs'
                  : 'text-[#706D66] dark:text-[#A6A197]'
              }`}
            >
              Light
            </button>
            <button
              type="button"
              onClick={() => handleThemeChange('dark')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                theme === 'dark'
                  ? 'bg-white dark:bg-[#272521] text-[#292824] dark:text-[#EDE9E3] shadow-xs'
                  : 'text-[#706D66] dark:text-[#A6A197]'
              }`}
            >
              Dark
            </button>
          </div>
        </div>

        {/* Browser Notifications Preference */}
        <div className="pt-4 border-t border-[#EEEAE1] dark:border-[#38352F] flex items-center justify-between">
          <div className="max-w-md">
            <div className="flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-[#8B7355] dark:text-[#A88F72]" />
              <h3 className="text-xs font-medium text-[#292824] dark:text-[#EDE9E3]">
                Browser Notifications
              </h3>
            </div>
            <p className="text-[11px] text-[#706D66] dark:text-[#A6A197] mt-0.5">
              Receive desktop reminders for approaching deadlines and completed milestones.
            </p>
            {permStatus === 'denied' && (
              <p className="text-[11px] text-[#B56B67] dark:text-[#E89E9A] mt-1">
                Permission blocked by browser settings. Unblock in browser permissions to enable.
              </p>
            )}
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={browserNotifs}
              onChange={handleToggleNotifications}
              className="sr-only peer"
              aria-label="Toggle browser notifications"
            />
            <div className="w-10 h-5 bg-[#E8E3D8] peer-focus:outline-none rounded-full peer dark:bg-[#38352F] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#8B7355] dark:peer-checked:bg-[#A88F72]" />
          </label>
        </div>
      </div>

      {/* Persistence & Prototype Notice */}
      <div className="p-4 rounded-xl border border-[#E8E3D8] dark:border-[#38352F] bg-[#FAF9F6] dark:bg-[#211F1C]/40 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-[#8B7355] dark:text-[#A88F72] shrink-0 mt-0.5" />
        <div className="text-xs text-[#706D66] dark:text-[#A6A197] leading-relaxed">
          <strong className="text-[#292824] dark:text-[#EDE9E3]">Local Persistence Active:</strong> All your tasks, status changes, completed items, and preferences are safely preserved in browser local storage. Your data survives browser refreshes and tab closures.
        </div>
      </div>
    </div>
  );
};
