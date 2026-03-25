import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../../lib/auth';
import { classNames } from '../../lib/utils';
import {
  LayoutDashboard,
  Briefcase,
  Landmark,
  Wallet,
  FileText,
  Users,
  ShieldAlert,
  HardHat,
  MapPin,
  BarChart3,
  ClipboardList,
  Building2,
  UserCog,
  Settings,
  ScrollText,
  Shield,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Calculator,
  Construction,
  Crown,
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  roles: UserRole[]; // which roles can see this item
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const ALL_ROLES: UserRole[] = ['mayor', 'treasury', 'bplo', 'engineering', 'mdrrmo', 'barangay', 'admin'];

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'MAIN',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ALL_ROLES },
    ],
  },
  {
    title: 'SERVICES',
    items: [
      { label: 'Business Permits', path: '/business-permits', icon: Briefcase, badge: 12, roles: ['mayor', 'bplo', 'admin'] },
      { label: 'Property Tax', path: '/property-tax', icon: Landmark, roles: ['mayor', 'treasury', 'admin'] },
      { label: 'Treasury', path: '/treasury', icon: Wallet, roles: ['mayor', 'treasury', 'admin'] },
      { label: 'Document Tracking', path: '/documents', icon: FileText, badge: 5, roles: ['mayor', 'admin', 'bplo', 'treasury', 'engineering'] },
      { label: 'Citizen Services', path: '/citizen-services', icon: Users, roles: ['mayor', 'bplo', 'barangay', 'admin'] },
    ],
  },
  {
    title: 'OPERATIONS',
    items: [
      { label: 'Emergency Center', path: '/emergency', icon: ShieldAlert, badge: 3, roles: ['mayor', 'mdrrmo', 'barangay', 'admin'] },
      { label: 'Infrastructure', path: '/infrastructure', icon: HardHat, roles: ['mayor', 'engineering', 'admin'] },
      { label: 'GIS Mapping', path: '/gis', icon: MapPin, roles: ['mayor', 'engineering', 'mdrrmo', 'admin'] },
    ],
  },
  {
    title: 'ANALYTICS',
    items: [
      { label: 'Data Analytics', path: '/analytics', icon: BarChart3, roles: ['mayor', 'treasury', 'admin'] },
      { label: 'Reports', path: '/reports', icon: ClipboardList, roles: ['mayor', 'treasury', 'bplo', 'engineering', 'mdrrmo', 'admin'] },
    ],
  },
  {
    title: 'ADMIN',
    items: [
      { label: 'Barangay Office', path: '/barangay', icon: Building2, roles: ['mayor', 'barangay', 'admin'] },
      { label: 'HR & Personnel', path: '/hr', icon: UserCog, roles: ['mayor', 'admin'] },
      { label: 'Settings', path: '/settings', icon: Settings, roles: ['mayor', 'admin'] },
      { label: 'Audit Trail', path: '/audit-trail', icon: ScrollText, roles: ['mayor', 'admin'] },
      { label: 'User Management', path: '/users', icon: Shield, roles: ['admin'] },
      { label: 'Help', path: '/help', icon: HelpCircle, roles: ALL_ROLES },
    ],
  },
  {
    title: 'OFFICES',
    items: [
      { label: 'Accounting Office', path: '/accounting', icon: Calculator, roles: ['mayor', 'treasury', 'admin'] },
      { label: 'Engineering Office', path: '/engineering', icon: Construction, roles: ['mayor', 'engineering', 'admin'] },
      { label: "Mayor's Office", path: '/mayors-office', icon: Crown, roles: ['mayor', 'admin'] },
    ],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const userRole = currentUser?.role || 'barangay';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Filter nav groups based on user role
  const filteredGroups = NAV_GROUPS
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => item.roles.includes(userRole)),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <aside
      className={classNames(
        'fixed inset-y-0 left-0 z-40 flex flex-col bg-slate-900 text-white transition-all duration-300 ease-in-out',
        collapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* Branding */}
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold">
          D
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-blue-300">Municipality of Daet</p>
            <p className="truncate text-sm font-semibold tracking-wide">Maogmang Daet</p>
          </div>
        )}
      </div>

      {/* Role indicator */}
      {!collapsed && currentUser && (
        <div className="mx-3 mt-3 rounded-lg bg-blue-600/10 border border-blue-500/20 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-blue-400">Logged in as</p>
          <p className="text-xs font-medium text-slate-200 mt-0.5">{currentUser.roleLabel}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 scrollbar-thin">
        {filteredGroups.map((group) => (
          <div key={group.title} className="mb-1">
            {!collapsed && (
              <p className="mb-1 px-4 pt-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                {group.title}
              </p>
            )}
            {collapsed && <div className="mx-auto my-2 h-px w-8 bg-white/10" />}
            <ul>
              {group.items.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive }) =>
                      classNames(
                        'group relative mx-2 mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-blue-600/20 text-blue-400'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white',
                        collapsed && 'justify-center px-0'
                      )
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-blue-400" />
                        )}
                        <item.icon className="h-[18px] w-[18px] shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="truncate">{item.label}</span>
                            {item.badge !== undefined && (
                              <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-semibold text-white">
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                        {collapsed && item.badge !== undefined && (
                          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Collapse Toggle */}
      <button
        onClick={onToggle}
        className="mx-2 mb-2 flex items-center justify-center gap-2 rounded-lg border border-white/10 py-2 text-xs text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        {!collapsed && <span>Collapse</span>}
      </button>

      {/* User Profile */}
      {currentUser && (
        <div className="border-t border-white/10 p-3">
          <div className={classNames('flex items-center gap-3', collapsed && 'justify-center')}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold">
              {currentUser.avatar}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{currentUser.name}</p>
                <p className="truncate text-[11px] text-slate-400">{currentUser.roleLabel}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={classNames(
              'mt-2 flex w-full items-center gap-2 rounded-lg py-2 text-xs text-slate-400 transition-colors hover:bg-white/5 hover:text-red-400',
              collapsed ? 'justify-center' : 'px-2'
            )}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      )}
    </aside>
  );
}
