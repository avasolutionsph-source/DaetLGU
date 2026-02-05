import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, ChevronDown, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { getNotifications } from '@/lib/api';
import type { NotificationItem } from '@/lib/api';

// ─── Page title map ───────────────────────────────────────────────
const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/patients': 'Patients',
  '/appointments': 'Appointments',
  '/billing': 'Billing',
  '/reports': 'Reports',
  '/settings': 'Settings',
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith('/patients/')) return 'Patient Profile';
  return 'Dashboard';
}

// ─── TopBar Component ─────────────────────────────────────────────
export function TopBar() {
  const location = useLocation();
  const setSearchOpen = useAppStore((s) => s.setSearchOpen);
  const currentUser = useAppStore((s) => s.currentUser);

  const [notifications] = useState<NotificationItem[]>(() => getNotifications());
  const unreadCount = notifications.filter((n) => !n.read).length;

  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const pageTitle = getPageTitle(location.pathname);

  // Ctrl+K shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setSearchOpen]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200 shadow-sm shrink-0 no-print">
      {/* Left: Page Title */}
      <div>
        <h1 className="text-lg font-semibold text-gray-900">{pageTitle}</h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Search Button */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-500 text-sm transition-colors duration-150"
        >
          <Search className="h-4 w-4" />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 bg-white border border-gray-200 rounded">
            Ctrl+K
          </kbd>
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors duration-150"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 flex items-center justify-center text-[10px] font-bold text-white bg-danger-500 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">Notifications</p>
              </div>
              {notifications.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-gray-500">
                  No notifications
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        'px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0',
                        !n.read && 'bg-primary-50/50',
                      )}
                    >
                      <p className="text-sm font-medium text-gray-900">{n.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-8 bg-gray-200 mx-1" />

        {/* Clinic Name */}
        <span className="hidden md:inline text-sm font-medium text-gray-600">
          SmartDental Clinic
        </span>

        {/* User Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors duration-150"
          >
            {/* Avatar */}
            <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-semibold">
              {currentUser?.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase() || 'U'}
            </div>
            <span className="hidden lg:inline text-sm font-medium text-gray-700">
              {currentUser?.name || 'User'}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400 hidden lg:block" />
          </button>

          {/* User Dropdown */}
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">{currentUser?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{currentUser?.role}</p>
              </div>
              <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <User className="h-4 w-4" />
                Profile
              </button>
              <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
