import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  Calendar,
  ChevronDown,
  FileBarChart,
  Bell,
  BanknoteIcon,
  Building2,
  AlertTriangle,
  HardHat,
  Siren,
  MessageSquareWarning,
  CheckCircle2,
  Clock,
  FileText,
  Users,
  ShieldAlert,
  Briefcase,
  Landmark,
  Wallet,
  Map,
  MapPin,
  ArrowRight,
  Activity,
  Flame,
  Droplets,
  Car,
  HeartPulse,
  TrendingUp,
  Receipt,
  CircleDollarSign,
  FolderOpen,
  Home,
  Phone,
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import { useAuth } from '../lib/auth';
import {
  monthlyRevenue,
  permitApprovalTrend,
  taxCollectionStatus,
  incidentsByCategory,
  recentActivities,
  notifications,
  departmentPerformance,
  barangaySnapshot,
  alerts,
  quickNavItems,
} from '../data/mockData';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `₱${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₱${(n / 1_000).toFixed(0)}K`;
  return `₱${n.toLocaleString()}`;
}

function formatFullCurrency(n: number): string {
  return `₱${n.toLocaleString()}`;
}

const activityIcons: Record<string, typeof CheckCircle2> = {
  permit: Briefcase,
  payment: BanknoteIcon,
  incident: Siren,
  project: HardHat,
  document: FileText,
  concern: MessageSquareWarning,
};

const activityIconColors: Record<string, string> = {
  permit: 'text-blue-500 bg-blue-50',
  payment: 'text-emerald-500 bg-emerald-50',
  incident: 'text-red-500 bg-red-50',
  project: 'text-amber-500 bg-amber-50',
  document: 'text-purple-500 bg-purple-50',
  concern: 'text-orange-500 bg-orange-50',
};

const deptBadgeVariant: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  Treasury: 'success',
  BPLO: 'info',
  MDRRMO: 'danger',
  Engineering: 'warning',
  'Municipal Hall': 'neutral',
  'General Services': 'neutral',
  'Municipal Planning': 'info',
};

const priorityStyles: Record<string, { dot: string; bg: string; border: string }> = {
  critical: { dot: 'bg-red-500', bg: 'bg-red-50', border: 'border-l-red-500' },
  high: { dot: 'bg-orange-500', bg: 'bg-orange-50', border: 'border-l-orange-500' },
  medium: { dot: 'bg-amber-500', bg: 'bg-amber-50', border: 'border-l-amber-500' },
  low: { dot: 'bg-blue-400', bg: 'bg-blue-50', border: 'border-l-blue-400' },
};

const severityMap: Record<string, string> = {
  red: 'border-red-200 bg-red-50',
  amber: 'border-amber-200 bg-amber-50',
};
const severityIconColor: Record<string, string> = {
  red: 'text-red-600',
  amber: 'text-amber-600',
};
const severityCountBg: Record<string, string> = {
  red: 'bg-red-100 text-red-700',
  amber: 'bg-amber-100 text-amber-700',
};

const navIconMap: Record<string, typeof Briefcase> = {
  Briefcase,
  Landmark,
  Wallet,
  FileText,
  Users,
  Siren,
  HardHat,
  Map,
};

const navColorMap: Record<string, { bg: string; icon: string; hover: string }> = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', hover: 'hover:border-blue-300' },
  green: { bg: 'bg-emerald-50', icon: 'text-emerald-600', hover: 'hover:border-emerald-300' },
  amber: { bg: 'bg-amber-50', icon: 'text-amber-600', hover: 'hover:border-amber-300' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', hover: 'hover:border-purple-300' },
  cyan: { bg: 'bg-cyan-50', icon: 'text-cyan-600', hover: 'hover:border-cyan-300' },
  red: { bg: 'bg-red-50', icon: 'text-red-600', hover: 'hover:border-red-300' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-600', hover: 'hover:border-orange-300' },
  teal: { bg: 'bg-teal-50', icon: 'text-teal-600', hover: 'hover:border-teal-300' },
};

const deptEfficiencyColor: Record<string, { bar: string; text: string; bg: string }> = {
  emerald: { bar: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50' },
  blue: { bar: 'bg-blue-500', text: 'text-blue-700', bg: 'bg-blue-50' },
  amber: { bar: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
  red: { bar: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50' },
  purple: { bar: 'bg-purple-500', text: 'text-purple-700', bg: 'bg-purple-50' },
};

// ─── Custom Recharts Tooltip ──────────────────────────────────────────────────

function CurrencyTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3">
      <p className="text-sm font-semibold text-gray-900 mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {formatFullCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
}

function CountTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3">
      <p className="text-sm font-semibold text-gray-900 mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────

function SectionCard({
  title,
  subtitle,
  children,
  action,
  className = '',
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}>
      <div className="flex items-center justify-between px-6 pt-6 pb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

// ─── Mayor / Admin Dashboard (Full Executive View) ──────────────────────────

export default function DashboardPage() {
  return <MayorDashboard />;
}

function MayorDashboard() {
  const [dateFilter, setDateFilter] = useState('this_month');

  return (
    <div className="space-y-8 pb-12">
      {/* ───────────────────── 1. Page Header ───────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Executive Dashboard
          </h1>
          <p className="text-gray-500 mt-1 text-base">
            Municipal Operations Command Center &mdash; Municipality of Daet, Camarines Norte
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date Filter */}
          <div className="relative">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-200 rounded-xl pl-10 pr-9 py-2.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 cursor-pointer"
            >
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
              <option value="this_year">This Year</option>
            </select>
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          {/* Quick Actions */}
          <button className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            <FileBarChart className="w-4 h-4" />
            Generate Report
          </button>
          <button className="inline-flex items-center gap-2 bg-blue-600 text-white rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
            <Bell className="w-4 h-4" />
            View Alerts
          </button>
        </div>
      </div>

      {/* ───────────────────── 2. Summary Stat Cards ───────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        <StatCard
          title="Today's Revenue"
          value="₱2,847,500"
          change="12%"
          changeType="up"
          icon={BanknoteIcon}
          color="green"
        />
        <StatCard
          title="Active Business Permits"
          value="1,247"
          change="5%"
          changeType="up"
          icon={Building2}
          color="blue"
        />
        <StatCard
          title="Unpaid Tax Accounts"
          value="342"
          change="8%"
          changeType="down"
          icon={AlertTriangle}
          color="amber"
        />
        <StatCard
          title="Ongoing Projects"
          value="14"
          change="0%"
          changeType="neutral"
          icon={HardHat}
          color="purple"
        />
        <StatCard
          title="Emergency Incidents"
          value="3"
          change="2"
          changeType="up"
          icon={Siren}
          color="red"
        />
        <StatCard
          title="Pending Concerns"
          value="28"
          change="15%"
          changeType="down"
          icon={MessageSquareWarning}
          color="amber"
        />
      </div>

      {/* ───────────────────── 3. Charts Row 1 ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue Trend */}
        <SectionCard
          title="Monthly Revenue Trend"
          subtitle="Revenue vs target for current fiscal year"
        >
          <div className="px-6 pb-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenue} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
                />
                <Tooltip content={<CurrencyTooltip />} />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(value: string) => (
                    <span className="text-sm text-gray-600">{value}</span>
                  )}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fill="url(#revenueGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  name="Target"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="6 3"
                  fill="url(#targetGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* Permit Approval Trend */}
        <SectionCard
          title="Permit Approval Trend"
          subtitle="Monthly approvals vs rejections"
        >
          <div className="px-6 pb-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={permitApprovalTrend} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CountTooltip />} />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(value: string) => (
                    <span className="text-sm text-gray-600">{value}</span>
                  )}
                />
                <Bar dataKey="approved" name="Approved" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="rejected" name="Rejected" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* ───────────────────── 4. Charts Row 2 ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tax Collection Status - Pie Chart */}
        <SectionCard
          title="Property Tax Collection Status"
          subtitle="Distribution of tax payment statuses"
        >
          <div className="px-6 pb-6 h-80 flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taxCollectionStatus}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={110}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                  strokeWidth={0}
                >
                  {taxCollectionStatus.map((entry: any, i: number) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={((value: any, name: any) => [`${Number(value).toLocaleString()} accounts`, name]) as any}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                />
                <Legend
                  verticalAlign="middle"
                  align="right"
                  layout="vertical"
                  formatter={(value: string) => (
                    <span className="text-sm text-gray-600">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        {/* Incident Reports by Category */}
        <SectionCard
          title="Incident Reports by Category"
          subtitle="Current month incident breakdown"
        >
          <div className="px-6 pb-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={incidentsByCategory}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="category"
                  tick={{ fontSize: 12, fill: '#64748b' }}
                  axisLine={false}
                  tickLine={false}
                  width={80}
                />
                <Tooltip
                  formatter={((value: any) => [`${value} reports`]) as any}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                />
                <Bar dataKey="count" name="Reports" radius={[0, 6, 6, 0]}>
                  {incidentsByCategory.map((entry: any, i: number) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* ───────────────────── 5 & 6. Activity Feed + Notifications ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Activity Feed */}
        <SectionCard
          title="Recent Activity"
          subtitle="Latest operations across departments"
          className="lg:col-span-3"
          action={
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
              View All
            </button>
          }
        >
          <div className="px-6 pb-4 max-h-[420px] overflow-y-auto divide-y divide-gray-50">
            {recentActivities.map((item) => {
              const IconComp = activityIcons[item.type] || Activity;
              const iconColor = activityIconColors[item.type] || 'text-gray-500 bg-gray-50';
              return (
                <div key={item.id} className="flex items-start gap-4 py-3.5 first:pt-0">
                  <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${iconColor}`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 leading-snug">{item.description}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-gray-400">{item.timestamp}</span>
                      <Badge variant={deptBadgeVariant[item.department] || 'neutral'} size="sm">
                        {item.department}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* Notifications Panel */}
        <SectionCard
          title="Notifications"
          subtitle={`${notifications.filter((n) => !n.read).length} unread`}
          className="lg:col-span-2"
          action={
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
              Mark All Read
            </button>
          }
        >
          <div className="px-4 pb-4 max-h-[420px] overflow-y-auto space-y-2">
            {notifications.map((n) => {
              const pStyle = priorityStyles[n.priority] || priorityStyles.low;
              return (
                <div
                  key={n.id}
                  className={`rounded-xl border-l-4 px-4 py-3 transition-colors cursor-pointer hover:bg-gray-50 ${pStyle.border} ${n.read ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${pStyle.dot}`} />
                      <div>
                        <p className={`text-sm font-semibold ${n.read ? 'text-gray-500' : 'text-gray-900'}`}>
                          {n.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 pl-4.5">{n.time}</p>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      {/* ───────────────────── 7. Department Performance ───────────────────── */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Department Performance</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {departmentPerformance.map((dept) => {
            const colors = deptEfficiencyColor[dept.color] || deptEfficiencyColor.blue;
            return (
              <div
                key={dept.name}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-bold text-gray-900">{dept.name}</h4>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                    {dept.efficiency}%
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-2 bg-gray-100 rounded-full mb-4">
                  <div
                    className={`h-2 rounded-full ${colors.bar} transition-all`}
                    style={{ width: `${dept.efficiency}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{dept.completed.toLocaleString()} done</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>{dept.pending} pending</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ───────────────────── 8. Barangay Activity Snapshot ───────────────────── */}
      <SectionCard
        title="Barangay Activity Snapshot"
        subtitle="Top barangays by activity volume"
        action={
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
            View Full Report
          </button>
        }
      >
        <div className="px-6 pb-6 overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Barangay
                </th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Incidents
                </th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Permits
                </th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">
                  Tax Collections
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {barangaySnapshot.map((brgy) => (
                <tr key={brgy.name} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      Brgy. {brgy.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-center">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold ${
                        brgy.incidents >= 5
                          ? 'bg-red-50 text-red-700'
                          : brgy.incidents >= 3
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {brgy.incidents}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-center text-gray-700 font-medium">
                    {brgy.permits}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-700 font-medium">
                    {formatFullCurrency(brgy.collections)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* ───────────────────── 9. Alerts Section ───────────────────── */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Active Alerts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {alerts.map((alert) => (
            <div
              key={alert.type}
              className={`rounded-2xl border-2 p-6 ${severityMap[alert.severity]} transition-shadow hover:shadow-md`}
            >
              <div className="flex items-start justify-between mb-3">
                <ShieldAlert className={`w-8 h-8 ${severityIconColor[alert.severity]}`} />
                <span
                  className={`text-2xl font-extrabold px-3 py-0.5 rounded-xl ${severityCountBg[alert.severity]}`}
                >
                  {alert.count}
                </span>
              </div>
              <h4 className="text-base font-bold text-gray-900 mb-1">{alert.title}</h4>
              <p className="text-sm text-gray-600 mb-4">{alert.description}</p>
              <Link
                to={alert.link}
                className={`inline-flex items-center gap-1.5 text-sm font-semibold ${severityIconColor[alert.severity]} hover:underline`}
              >
                View Details <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* ───────────────────── 10. Quick Navigation Cards ───────────────────── */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {quickNavItems.map((item) => {
            const NavIcon = navIconMap[item.iconName] || Briefcase;
            const cMap = navColorMap[item.color] || navColorMap.blue;
            return (
              <Link
                key={item.link}
                to={item.link}
                className={`group bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-start gap-4 transition-all hover:shadow-md ${cMap.hover}`}
              >
                <div className={`flex-shrink-0 w-11 h-11 rounded-xl ${cMap.bg} flex items-center justify-center`}>
                  <NavIcon className={`w-5 h-5 ${cMap.icon}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 mt-0.5 transition-colors flex-shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* ───────────────────── 11. Executive Map Placeholder ───────────────────── */}
      <Link to="/gis" className="block">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Municipal GIS Map</h3>
              <p className="text-sm text-gray-500 mt-0.5">
                Geospatial overview of Daet, Camarines Norte
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
          </div>
          <div className="mx-6 mb-6 rounded-xl bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 border border-gray-200 h-56 flex flex-col items-center justify-center gap-3 relative overflow-hidden">
            {/* Decorative grid pattern */}
            <div className="absolute inset-0 opacity-[0.07]" style={{
              backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }} />
            {/* Decorative dots representing locations */}
            <div className="absolute top-[30%] left-[35%] w-2.5 h-2.5 rounded-full bg-blue-400 opacity-40 animate-pulse" />
            <div className="absolute top-[45%] left-[55%] w-3 h-3 rounded-full bg-red-400 opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute top-[60%] left-[40%] w-2 h-2 rounded-full bg-emerald-400 opacity-40 animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-[35%] left-[65%] w-2 h-2 rounded-full bg-amber-400 opacity-40 animate-pulse" style={{ animationDelay: '1.5s' }} />
            <div className="absolute top-[55%] left-[25%] w-2.5 h-2.5 rounded-full bg-purple-400 opacity-40 animate-pulse" style={{ animationDelay: '0.8s' }} />

            <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-16 h-16 rounded-2xl bg-white/80 shadow-sm border border-gray-200 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-sm font-semibold text-gray-500">GIS Map Loading...</p>
              <p className="text-xs text-gray-400">Click to open the full interactive map</p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
