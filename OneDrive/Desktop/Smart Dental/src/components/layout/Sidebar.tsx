import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  PhilippinePeso,
  BarChart3,
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';

// ─── Navigation Items ─────────────────────────────────────────────
const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/patients', label: 'Patients', icon: Users },
  { to: '/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/billing', label: 'Billing', icon: PhilippinePeso },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
] as const;

// ─── Tooth Icon (SVG) ─────────────────────────────────────────────
function ToothIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 2C9.5 2 7 3.5 7 6c0 2-.5 4-1.5 6-.7 1.4-1 3-.5 4.5.5 1.5 1.5 3 2.5 4 .5.5 1 .5 1.5.5s1-.5 1.5-1.5c.3-.7.7-1.5 1.5-1.5s1.2.8 1.5 1.5c.5 1 1 1.5 1.5 1.5s1 0 1.5-.5c1-1 2-2.5 2.5-4 .5-1.5.2-3.1-.5-4.5C16.5 10 16 8 16 6c0-2.5-2-4-4-4z" />
    </svg>
  );
}

// ─── Sidebar Component ────────────────────────────────────────────
export function Sidebar() {
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);

  return (
    <aside
      className={cn(
        'h-screen bg-sidebar flex flex-col shrink-0 transition-all duration-300 ease-in-out no-print',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      {/* Logo Area */}
      <div
        className={cn(
          'flex items-center h-16 border-b border-white/10 shrink-0',
          collapsed ? 'justify-center px-2' : 'px-5 gap-3',
        )}
      >
        <ToothIcon className="h-7 w-7 text-primary-400 shrink-0" />
        {!collapsed && (
          <span className="text-white font-bold text-lg tracking-tight whitespace-nowrap">
            SmartDental
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg transition-colors duration-150 group relative',
                collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5',
                isActive
                  ? 'bg-sidebar-active text-white'
                  : 'text-gray-400 hover:bg-sidebar-hover hover:text-gray-200',
              )
            }
          >
            {({ isActive }) => (
              <>
                {/* Active accent border */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary-400" />
                )}
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium whitespace-nowrap">
                    {item.label}
                  </span>
                )}
                {/* Tooltip on collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 whitespace-nowrap z-50 pointer-events-none">
                    {item.label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-white/10 p-2 shrink-0">
        <button
          onClick={toggleSidebar}
          className={cn(
            'flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-gray-400 hover:bg-sidebar-hover hover:text-gray-200 transition-colors duration-150',
            collapsed && 'justify-center px-2',
          )}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronsRight className="h-5 w-5 shrink-0" />
          ) : (
            <>
              <ChevronsLeft className="h-5 w-5 shrink-0" />
              <span className="text-sm font-medium">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
