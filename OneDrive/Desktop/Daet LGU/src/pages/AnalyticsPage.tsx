import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Lightbulb,
  AlertTriangle,
  Download,
  Activity,
  DollarSign,
  FileCheck,
  Clock,
  Shield,
  Target,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  PieChart as PieChartIcon,
  Zap,
  Users,
  Building2,
  HardHat,
  Siren,
  CalendarDays,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import PageHeader from '../components/ui/PageHeader';

const TIME_RANGES = ['This Week', 'This Month', 'This Quarter', 'This Year'] as const;

const REVENUE_FORECAST = [
  { month: 'Jan', actual: 22, projected: 22 },
  { month: 'Feb', actual: 24, projected: 24 },
  { month: 'Mar', actual: 28, projected: 27 },
  { month: 'Apr', actual: 26, projected: 26 },
  { month: 'May', actual: 30, projected: 29 },
  { month: 'Jun', actual: 27, projected: 28 },
  { month: 'Jul', actual: 32, projected: 31 },
  { month: 'Aug', actual: 29, projected: 30 },
  { month: 'Sep', actual: null, projected: 32 },
  { month: 'Oct', actual: null, projected: 34 },
  { month: 'Nov', actual: null, projected: 33 },
  { month: 'Dec', actual: null, projected: 36 },
];

const PERMIT_FORECAST = [
  { month: 'Jan', actual: 180, projected: 180 },
  { month: 'Feb', actual: 145, projected: 150 },
  { month: 'Mar', actual: 162, projected: 155 },
  { month: 'Apr', actual: 138, projected: 140 },
  { month: 'May', actual: 155, projected: 150 },
  { month: 'Jun', actual: 142, projected: 145 },
  { month: 'Jul', actual: 170, projected: 165 },
  { month: 'Aug', actual: 148, projected: 150 },
  { month: 'Sep', actual: null, projected: 155 },
  { month: 'Oct', actual: null, projected: 160 },
  { month: 'Nov', actual: null, projected: 150 },
  { month: 'Dec', actual: null, projected: 145 },
];

const REVENUE_VS_TARGET = [
  { month: 'Jan', actual: 22.5, target: 24 },
  { month: 'Feb', actual: 24.1, target: 24 },
  { month: 'Mar', actual: 28.2, target: 26 },
  { month: 'Apr', actual: 25.8, target: 26 },
  { month: 'May', actual: 30.1, target: 28 },
  { month: 'Jun', actual: 27.4, target: 28 },
  { month: 'Jul', actual: 32.0, target: 30 },
  { month: 'Aug', actual: 29.3, target: 30 },
];

const PERMIT_ACTIVITY = [
  { month: 'Jan', applications: 180, approvals: 162 },
  { month: 'Feb', applications: 145, approvals: 130 },
  { month: 'Mar', applications: 162, approvals: 148 },
  { month: 'Apr', applications: 138, approvals: 125 },
  { month: 'May', applications: 155, approvals: 140 },
  { month: 'Jun', applications: 142, approvals: 132 },
  { month: 'Jul', applications: 170, approvals: 155 },
  { month: 'Aug', applications: 148, approvals: 138 },
];

const TAX_COMPLIANCE = [
  { name: 'Paid', value: 58, color: '#10b981' },
  { name: 'Partial', value: 20.5, color: '#f59e0b' },
  { name: 'Delinquent', value: 21.5, color: '#ef4444' },
];

const INFRASTRUCTURE_PROJECTS = [
  { name: 'Paracale Road Widening', progress: 72, budget: '₱18M' },
  { name: 'Drainage System - Borabod', progress: 45, budget: '₱12M' },
  { name: 'Public Market Renovation', progress: 88, budget: '₱25M' },
  { name: 'Bagasbas Seawall', progress: 35, budget: '₱30M' },
  { name: 'School Building - Gahonon', progress: 95, budget: '₱8M' },
  { name: 'Health Center Expansion', progress: 60, budget: '₱15M' },
];

const DEPT_PERFORMANCE = [
  { metric: 'Efficiency', Treasury: 88, BPLO: 75, Engineering: 70, MDRRMO: 82, Planning: 78 },
  { metric: 'Response Time', Treasury: 82, BPLO: 68, Engineering: 65, MDRRMO: 90, Planning: 72 },
  { metric: 'Completion', Treasury: 90, BPLO: 80, Engineering: 72, MDRRMO: 85, Planning: 76 },
  { metric: 'Satisfaction', Treasury: 78, BPLO: 72, Engineering: 68, MDRRMO: 88, Planning: 74 },
  { metric: 'Compliance', Treasury: 92, BPLO: 85, Engineering: 78, MDRRMO: 80, Planning: 82 },
];

const RADAR_DATA = [
  { subject: 'Efficiency', Treasury: 88, BPLO: 75, Engineering: 70, MDRRMO: 82, Planning: 78 },
  { subject: 'Response', Treasury: 82, BPLO: 68, Engineering: 65, MDRRMO: 90, Planning: 72 },
  { subject: 'Completion', Treasury: 90, BPLO: 80, Engineering: 72, MDRRMO: 85, Planning: 76 },
  { subject: 'Satisfaction', Treasury: 78, BPLO: 72, Engineering: 68, MDRRMO: 88, Planning: 74 },
  { subject: 'Compliance', Treasury: 92, BPLO: 85, Engineering: 78, MDRRMO: 80, Planning: 82 },
];

const EMERGENCY_HEATMAP = [
  { day: 'Mon', '6AM': 2, '9AM': 5, '12PM': 8, '3PM': 6, '6PM': 4, '9PM': 3, '12AM': 1 },
  { day: 'Tue', '6AM': 1, '9AM': 4, '12PM': 6, '3PM': 5, '6PM': 3, '9PM': 2, '12AM': 1 },
  { day: 'Wed', '6AM': 2, '9AM': 3, '12PM': 7, '3PM': 5, '6PM': 4, '9PM': 2, '12AM': 1 },
  { day: 'Thu', '6AM': 1, '9AM': 4, '12PM': 5, '3PM': 4, '6PM': 3, '9PM': 3, '12AM': 2 },
  { day: 'Fri', '6AM': 3, '9AM': 6, '12PM': 9, '3PM': 7, '6PM': 6, '9PM': 5, '12AM': 3 },
  { day: 'Sat', '6AM': 4, '9AM': 7, '12PM': 10, '3PM': 8, '6PM': 7, '9PM': 6, '12AM': 4 },
  { day: 'Sun', '6AM': 2, '9AM': 4, '12PM': 6, '3PM': 5, '6PM': 4, '9PM': 3, '12AM': 2 },
];

const SMART_INSIGHTS = [
  {
    text: 'Revenue collection peaks on Mondays and first week of month',
    category: 'Revenue',
    impact: 'High',
  },
  {
    text: 'Business permit renewals spike in January and July',
    category: 'Permits',
    impact: 'Medium',
  },
  {
    text: 'Barangay Borabod has highest incident rate — recommend increased patrol',
    category: 'Safety',
    impact: 'High',
  },
  {
    text: 'Property tax delinquency concentrated in 3 barangays',
    category: 'Tax',
    impact: 'High',
  },
];

const RISK_FLAGS = [
  {
    text: 'Revenue shortfall risk for Q3 based on current trends',
    severity: 'red',
    department: 'Treasury',
  },
  {
    text: '12 business permits expiring without renewal applications',
    severity: 'amber',
    department: 'BPLO',
  },
  {
    text: 'Infrastructure project delays may cause budget overrun',
    severity: 'red',
    department: 'Engineering',
  },
];

const RECOMMENDED_ACTIONS = [
  {
    action: 'Issue delinquency notices to 342 accounts',
    priority: 'Urgent',
    department: 'Treasury',
    priorityColor: 'bg-red-100 text-red-800',
    deptColor: 'bg-blue-100 text-blue-800',
  },
  {
    action: 'Expedite delayed road project in Paracale road',
    priority: 'High',
    department: 'Engineering',
    priorityColor: 'bg-orange-100 text-orange-800',
    deptColor: 'bg-purple-100 text-purple-800',
  },
  {
    action: 'Increase MDRRMO staffing for flood season',
    priority: 'High',
    department: 'MDRRMO',
    priorityColor: 'bg-orange-100 text-orange-800',
    deptColor: 'bg-emerald-100 text-emerald-800',
  },
  {
    action: 'Schedule business permit renewal drive',
    priority: 'Medium',
    department: 'BPLO',
    priorityColor: 'bg-amber-100 text-amber-800',
    deptColor: 'bg-indigo-100 text-indigo-800',
  },
];

function getHeatColor(value: number): string {
  if (value >= 8) return 'bg-red-500 text-white';
  if (value >= 6) return 'bg-orange-400 text-white';
  if (value >= 4) return 'bg-amber-300 text-gray-800';
  if (value >= 2) return 'bg-yellow-200 text-gray-700';
  return 'bg-green-100 text-gray-600';
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<(typeof TIME_RANGES)[number]>('This Year');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Data Analytics & Smart Insights"
        subtitle="Executive-grade analytics dashboard for Municipality of Daet"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Analytics' },
        ]}
        actions={
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-sm transition-all">
            <Download className="w-4 h-4" />
            Export Dashboard
          </button>
        }
      />

      {/* Time Range Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 inline-flex gap-1">
        {TIME_RANGES.map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              timeRange === range
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Trend Analysis Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Revenue Trend',
            value: '₱285M',
            subtitle: 'YTD',
            change: '+12.5%',
            changeType: 'up' as const,
            icon: DollarSign,
            color: 'blue',
            sparkline: [22, 24, 28, 26, 30, 27, 32, 29],
          },
          {
            title: 'Permit Activity',
            value: '1,247',
            subtitle: 'Active',
            change: '+5%',
            changeType: 'up' as const,
            icon: FileCheck,
            color: 'emerald',
            sparkline: [180, 145, 162, 138, 155, 142, 170, 148],
          },
          {
            title: 'Tax Compliance',
            value: '78.5%',
            subtitle: 'Rate',
            change: '+3%',
            changeType: 'up' as const,
            icon: Target,
            color: 'purple',
            sparkline: [72, 73, 75, 74, 76, 77, 78, 78.5],
          },
          {
            title: 'Emergency Response',
            value: '8.5 min',
            subtitle: 'Avg',
            change: '-15%',
            changeType: 'down' as const,
            icon: Clock,
            color: 'amber',
            sparkline: [12, 11, 10.5, 10, 9.5, 9, 8.8, 8.5],
          },
        ].map((card) => {
          const Icon = card.icon;
          const isImproving =
            card.title === 'Emergency Response'
              ? card.changeType === 'down'
              : card.changeType === 'up';
          const colorMap: Record<string, { bg: string; icon: string; ring: string }> = {
            blue: { bg: 'bg-blue-50', icon: 'text-blue-600', ring: 'ring-blue-100' },
            emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', ring: 'ring-emerald-100' },
            purple: { bg: 'bg-purple-50', icon: 'text-purple-600', ring: 'ring-purple-100' },
            amber: { bg: 'bg-amber-50', icon: 'text-amber-600', ring: 'ring-amber-100' },
          };
          const c = colorMap[card.color];
          const max = Math.max(...card.sparkline);
          const min = Math.min(...card.sparkline);
          const range = max - min || 1;

          return (
            <div
              key={card.title}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    <span className="text-xs text-gray-400">{card.subtitle}</span>
                  </div>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl ${c.bg} ring-1 ${c.ring} flex items-center justify-center`}
                >
                  <Icon className={`w-5 h-5 ${c.icon}`} />
                </div>
              </div>
              {/* Sparkline */}
              <div className="flex items-end gap-0.5 h-8 mb-3">
                {card.sparkline.map((val, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-t ${
                      isImproving ? 'bg-emerald-400/60' : 'bg-red-400/60'
                    }`}
                    style={{
                      height: `${((val - min) / range) * 100}%`,
                      minHeight: '4px',
                    }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    isImproving
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {isImproving ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {card.change}
                </span>
                <span className="text-xs text-gray-400">vs last period</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Smart Insights */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          Smart Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SMART_INSIGHTS.map((insight, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-5 flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-800 font-medium leading-relaxed">{insight.text}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                    {insight.category}
                  </span>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                      insight.impact === 'High'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {insight.impact} Impact
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Forecast Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Forecast */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Revenue Forecast</h3>
              <p className="text-xs text-gray-400 mt-0.5">Actual vs projected (in ₱M)</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-blue-500 rounded-full" /> Actual
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-blue-300 rounded-full border-dashed" /> Projected
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={REVENUE_FORECAST}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                }}
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#3b82f6' }}
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="projected"
                stroke="#93c5fd"
                strokeWidth={2}
                strokeDasharray="6 3"
                dot={{ r: 3, fill: '#93c5fd' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Permit Forecast */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Permit Applications Forecast</h3>
              <p className="text-xs text-gray-400 mt-0.5">Monthly applications count</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-emerald-500 rounded-full" /> Actual
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-emerald-300 rounded-full" /> Projected
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={PERMIT_FORECAST}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                }}
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#10b981"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#10b981' }}
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="projected"
                stroke="#6ee7b7"
                strokeWidth={2}
                strokeDasharray="6 3"
                dot={{ r: 3, fill: '#6ee7b7' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Risk Flags */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          Predictive Risk Flags
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {RISK_FLAGS.map((flag, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-5 border ${
                flag.severity === 'red'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-amber-50 border-amber-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    flag.severity === 'red' ? 'bg-red-100' : 'bg-amber-100'
                  }`}
                >
                  <AlertTriangle
                    className={`w-4.5 h-4.5 ${
                      flag.severity === 'red' ? 'text-red-600' : 'text-amber-600'
                    }`}
                  />
                </div>
                <div>
                  <p
                    className={`text-sm font-medium leading-relaxed ${
                      flag.severity === 'red' ? 'text-red-800' : 'text-amber-800'
                    }`}
                  >
                    {flag.text}
                  </p>
                  <span
                    className={`inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mt-2 ${
                      flag.severity === 'red'
                        ? 'bg-red-200/60 text-red-800'
                        : 'bg-amber-200/60 text-amber-800'
                    }`}
                  >
                    {flag.department}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Department Performance Radar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Department Performance Comparison</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Comparing Treasury, BPLO, Engineering, MDRRMO, Planning
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={RADAR_DATA}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <Radar name="Treasury" dataKey="Treasury" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.15} />
              <Radar name="BPLO" dataKey="BPLO" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} />
              <Radar name="MDRRMO" dataKey="MDRRMO" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
          {/* Grouped Bar */}
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={DEPT_PERFORMANCE} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis type="category" dataKey="metric" tick={{ fontSize: 11, fill: '#6b7280' }} width={90} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                }}
              />
              <Bar dataKey="Treasury" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={6} />
              <Bar dataKey="BPLO" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={6} />
              <Bar dataKey="Engineering" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={6} />
              <Bar dataKey="MDRRMO" fill="#10b981" radius={[0, 4, 4, 0]} barSize={6} />
              <Bar dataKey="Planning" fill="#ef4444" radius={[0, 4, 4, 0]} barSize={6} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Revenue Insights (Area Chart) & Permit Activity (Bar Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Insights */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-500" />
              Revenue Insights
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Monthly actual vs target (in ₱M)</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={REVENUE_VS_TARGET}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                }}
              />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fill="url(#colorActual)"
              />
              <Line type="monotone" dataKey="target" stroke="#e5e7eb" strokeWidth={2} strokeDasharray="6 3" />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Permit Activity Insights */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-500" />
              Permit Activity Insights
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Applications vs approvals</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={PERMIT_ACTIVITY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                }}
              />
              <Bar dataKey="applications" fill="#6ee7b7" radius={[4, 4, 0, 0]} barSize={20} name="Applications" />
              <Bar dataKey="approvals" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} name="Approvals" />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tax Compliance (Donut) & Infrastructure Progress (Horizontal Bar) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Tax Compliance Donut */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-purple-500" />
              Tax Compliance Breakdown
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Distribution of tax payment status</p>
          </div>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={220}>
              <PieChart>
                <Pie
                  data={TAX_COMPLIANCE}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {TAX_COMPLIANCE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={((value: number) => `${value}%`) as any}
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-4 flex-1">
              {TAX_COMPLIANCE.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Infrastructure Progress */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <HardHat className="w-4 h-4 text-amber-500" />
              Infrastructure Progress
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Project completion percentage</p>
          </div>
          <div className="space-y-4">
            {INFRASTRUCTURE_PROJECTS.map((project) => (
              <div key={project.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium text-gray-700 truncate max-w-[200px]">
                    {project.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-gray-400">{project.budget}</span>
                    <span
                      className={`text-xs font-bold ${
                        project.progress >= 80
                          ? 'text-emerald-600'
                          : project.progress >= 50
                          ? 'text-amber-600'
                          : 'text-red-600'
                      }`}
                    >
                      {project.progress}%
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      project.progress >= 80
                        ? 'bg-emerald-500'
                        : project.progress >= 50
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Pattern Heatmap */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Siren className="w-4 h-4 text-red-500" />
            Emergency Pattern Analysis
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Incident frequency by day of week and time of day
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-xs font-medium text-gray-500 py-2 px-3 text-left w-16">Day</th>
                {['6AM', '9AM', '12PM', '3PM', '6PM', '9PM', '12AM'].map((time) => (
                  <th key={time} className="text-xs font-medium text-gray-500 py-2 px-2 text-center">
                    {time}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EMERGENCY_HEATMAP.map((row) => (
                <tr key={row.day}>
                  <td className="text-xs font-medium text-gray-700 py-1.5 px-3">{row.day}</td>
                  {(['6AM', '9AM', '12PM', '3PM', '6PM', '9PM', '12AM'] as const).map((time) => {
                    const val = row[time];
                    return (
                      <td key={time} className="py-1.5 px-1.5">
                        <div
                          className={`w-full h-9 rounded-lg flex items-center justify-center text-xs font-semibold ${getHeatColor(
                            val
                          )}`}
                        >
                          {val}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-gray-500">
          <span>Low</span>
          <div className="flex gap-0.5">
            <span className="w-6 h-3 bg-green-100 rounded" />
            <span className="w-6 h-3 bg-yellow-200 rounded" />
            <span className="w-6 h-3 bg-amber-300 rounded" />
            <span className="w-6 h-3 bg-orange-400 rounded" />
            <span className="w-6 h-3 bg-red-500 rounded" />
          </div>
          <span>High</span>
        </div>
      </div>

      {/* Recommended Actions Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              Recommended Actions
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Prioritized action items for leadership review
            </p>
          </div>
          <span className="text-xs font-medium text-gray-400">
            {RECOMMENDED_ACTIONS.length} items
          </span>
        </div>
        <div className="space-y-3">
          {RECOMMENDED_ACTIONS.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 flex-shrink-0">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{item.action}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${item.priorityColor}`}
                  >
                    {item.priority}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${item.deptColor}`}
                  >
                    {item.department}
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
