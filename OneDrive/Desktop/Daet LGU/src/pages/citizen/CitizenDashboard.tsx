import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import {
  AlertTriangle,
  FileText,
  ClipboardList,
  MessageSquareWarning,
  Megaphone,
  CreditCard,
  User,
  Building2,
  Phone,
  LogOut,
  ChevronRight,
  Bell,
  Shield,
} from 'lucide-react';

const FEATURES = [
  {
    path: '/citizen-report',
    label: 'Report Emergency',
    desc: 'Report fires, floods, accidents with camera',
    icon: AlertTriangle,
    color: 'bg-red-600',
    badge: 'URGENT',
    badgeColor: 'bg-red-100 text-red-700',
  },
  {
    path: '/citizen-documents',
    label: 'Request Documents',
    desc: 'Barangay clearance, cedula, certificates',
    icon: FileText,
    color: 'bg-blue-600',
  },
  {
    path: '/citizen-track',
    label: 'Track My Requests',
    desc: 'Check status of your pending requests',
    icon: ClipboardList,
    color: 'bg-emerald-600',
    badge: '3 Active',
    badgeColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    path: '/citizen-complaint',
    label: 'File a Complaint',
    desc: 'Report issues in your area with photos',
    icon: MessageSquareWarning,
    color: 'bg-amber-600',
  },
  {
    path: '/citizen-announcements',
    label: 'Announcements',
    desc: 'News and advisories from the LGU',
    icon: Megaphone,
    color: 'bg-violet-600',
    badge: '5 New',
    badgeColor: 'bg-violet-100 text-violet-700',
  },
  {
    path: '/citizen-payments',
    label: 'Pay Taxes & Fees',
    desc: 'Real property tax, permits, and fees',
    icon: CreditCard,
    color: 'bg-teal-600',
  },
  {
    path: '/citizen-profile',
    label: 'My Profile',
    desc: 'Update your personal information',
    icon: User,
    color: 'bg-gray-600',
  },
  {
    path: '/citizen-directory',
    label: 'Barangay Directory',
    desc: 'Contact info of barangay officials',
    icon: Building2,
    color: 'bg-cyan-700',
  },
];

export default function CitizenDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 px-4 pb-16 pt-6 text-white sm:px-6">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-sm font-bold backdrop-blur-sm">
                D
              </div>
              <div>
                <p className="text-xs text-blue-200">Municipality of Daet</p>
                <h1 className="text-base font-bold">Maogmang Daet Smart System</h1>
              </div>
            </div>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur-sm transition hover:bg-white/25"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>

          {currentUser && (
            <div className="mt-5">
              <p className="text-sm text-blue-200">Magandang araw,</p>
              <p className="text-xl font-bold">{currentUser.name}</p>
            </div>
          )}
        </div>
      </div>

      {/* Content overlapping header */}
      <div className="mx-auto -mt-10 max-w-2xl px-4 pb-8 sm:px-6">
        {/* Emergency banner */}
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-600 text-white">
            <Phone className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800">Emergency? Call 911</p>
            <p className="text-xs text-red-600">MDRRMO Daet: (054) 721-XXXX</p>
          </div>
          <a href="tel:911" className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-red-700">
            Call
          </a>
        </div>

        {/* Quick announcement */}
        <div className="mb-4 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
          <Bell className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-blue-800">Water Service Advisory</p>
            <p className="text-xs text-blue-600 line-clamp-2">Scheduled water interruption on March 28, 2026 from 8AM-5PM in Brgy. Alawihao and Lag-on areas.</p>
          </div>
          <button onClick={() => navigate('/citizen-announcements')} className="shrink-0 text-blue-600">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 gap-3">
          {FEATURES.map((f) => (
            <button
              key={f.path}
              onClick={() => navigate(f.path)}
              className="group relative flex flex-col items-start rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
            >
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${f.color} text-white shadow-sm`}>
                <f.icon className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-gray-900">{f.label}</p>
              <p className="mt-0.5 text-[11px] leading-tight text-gray-500">{f.desc}</p>
              {f.badge && (
                <span className={`mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${f.badgeColor}`}>
                  {f.badge}
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 h-0.5 rounded-b-xl bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          ))}
        </div>

        {/* Security notice */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
          <Shield className="h-3.5 w-3.5" />
          <span>Your data is secured and protected</span>
        </div>
      </div>
    </div>
  );
}
