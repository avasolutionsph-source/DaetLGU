import {
  AlertTriangle,
  Info,
  CheckCircle2,
  ShieldAlert,
  X,
} from 'lucide-react';
import { classNames } from '../../lib/utils';

interface Notification {
  id: string;
  type: 'alert' | 'info' | 'success' | 'warning';
  message: string;
  time: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'alert',
    message: 'Typhoon warning issued for Camarines Norte. MDRRMO on standby.',
    time: '5 min ago',
    read: false,
  },
  {
    id: '2',
    type: 'success',
    message: 'Q1 2026 revenue collection target exceeded by 12%.',
    time: '1 hour ago',
    read: false,
  },
  {
    id: '3',
    type: 'warning',
    message: '47 business permits expiring this week. Send renewal notices?',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '4',
    type: 'info',
    message: 'Infrastructure project "Daet Bypass Road" moved to Phase 2.',
    time: '4 hours ago',
    read: true,
  },
  {
    id: '5',
    type: 'info',
    message: 'System maintenance scheduled for March 28, 2:00 AM.',
    time: 'Yesterday',
    read: true,
  },
];

const ICON_MAP = {
  alert: ShieldAlert,
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
};

const COLOR_MAP = {
  alert: 'text-red-500 bg-red-50',
  info: 'text-blue-500 bg-blue-50',
  success: 'text-emerald-500 bg-emerald-50',
  warning: 'text-amber-500 bg-amber-50',
};

interface NotificationPanelProps {
  onClose: () => void;
}

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div className="absolute right-0 top-full mt-2 w-96 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
          {unreadCount > 0 && (
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button className="rounded-md px-2 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50">
            Mark all as read
          </button>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto">
        {MOCK_NOTIFICATIONS.map((notif) => {
          const Icon = ICON_MAP[notif.type];
          return (
            <div
              key={notif.id}
              className={classNames(
                'flex gap-3 border-b border-gray-50 px-4 py-3 transition-colors hover:bg-gray-50',
                !notif.read && 'bg-blue-50/30'
              )}
            >
              <div
                className={classNames(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                  COLOR_MAP[notif.type]
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className={classNames('text-sm leading-snug', !notif.read ? 'font-medium text-gray-900' : 'text-gray-600')}>
                  {notif.message}
                </p>
                <p className="mt-1 text-[11px] text-gray-400">{notif.time}</p>
              </div>
              {!notif.read && (
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 px-4 py-2.5 text-center">
        <button className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700">
          View all notifications
        </button>
      </div>
    </div>
  );
}
