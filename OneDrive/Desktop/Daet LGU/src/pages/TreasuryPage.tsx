import { useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area,
} from 'recharts';
import {
  Landmark, CalendarDays, TrendingUp, TrendingDown, Banknote,
  ArrowUpRight, ArrowDownRight, FileDown, FileSpreadsheet, FileText,
  AlertTriangle, Receipt, Users, ChevronRight, Home, Download,
  Clock, Search,
} from 'lucide-react';

// ─── Helpers ────────────────────────────────────────────────────────────────
const peso = (n: number) =>
  '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const pesoFull = (n: number) =>
  '₱' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Top-level Stats ────────────────────────────────────────────────────────
const topStats = [
  { label: "Today's Collection", value: 2_847_500, icon: Banknote, color: 'blue' },
  { label: 'This Week', value: 14_235_000, icon: CalendarDays, color: 'indigo' },
  { label: 'This Month', value: 58_420_000, icon: Landmark, color: 'emerald' },
  { label: 'YTD Total', value: 285_000_000, icon: TrendingUp, color: 'amber' },
  { label: 'vs Last Year', value: null, percent: '+12.5%', icon: ArrowUpRight, color: 'green' },
] as const;

// ─── Comparison Data ────────────────────────────────────────────────────────
const comparisons = [
  {
    title: 'Today vs Yesterday',
    current: 2_847_500,
    previous: 2_610_000,
    up: true,
  },
  {
    title: 'This Month vs Last Month',
    current: 58_420_000,
    previous: 52_180_000,
    up: true,
  },
];

// ─── Daily Collection Summary ───────────────────────────────────────────────
const dailyCollections = [
  { date: '2026-03-24', cashier: 'Maria L. Santos', source: 'Business Tax', amount: 485_000, receipt: 'OR-2026-1580', status: 'Verified' },
  { date: '2026-03-24', cashier: 'Jose R. Dela Cruz', source: 'Real Property Tax', amount: 672_500, receipt: 'OR-2026-1581', status: 'Verified' },
  { date: '2026-03-24', cashier: 'Anna B. Reyes', source: 'Regulatory Fees', amount: 125_000, receipt: 'OR-2026-1582', status: 'Pending' },
  { date: '2026-03-24', cashier: 'Maria L. Santos', source: 'Building Permit', amount: 340_000, receipt: 'OR-2026-1583', status: 'Verified' },
  { date: '2026-03-24', cashier: 'Jose R. Dela Cruz', source: 'Service Charges', amount: 95_000, receipt: 'OR-2026-1584', status: 'Verified' },
  { date: '2026-03-23', cashier: 'Anna B. Reyes', source: 'Business Tax', amount: 520_000, receipt: 'OR-2026-1575', status: 'Verified' },
  { date: '2026-03-23', cashier: 'Roberto M. Tan', source: 'Real Property Tax', amount: 780_000, receipt: 'OR-2026-1576', status: 'Verified' },
  { date: '2026-03-23', cashier: 'Maria L. Santos', source: 'Occupational Permit', amount: 62_000, receipt: 'OR-2026-1577', status: 'Verified' },
  { date: '2026-03-22', cashier: 'Jose R. Dela Cruz', source: 'Community Tax (Cedula)', amount: 18_500, receipt: 'OR-2026-1570', status: 'Verified' },
  { date: '2026-03-22', cashier: 'Roberto M. Tan', source: 'Market Rental Fees', amount: 145_000, receipt: 'OR-2026-1571', status: 'Verified' },
  { date: '2026-03-22', cashier: 'Anna B. Reyes', source: 'Business Tax', amount: 390_000, receipt: 'OR-2026-1572', status: 'Pending' },
  { date: '2026-03-21', cashier: 'Maria L. Santos', source: 'Real Property Tax', amount: 915_000, receipt: 'OR-2026-1565', status: 'Verified' },
  { date: '2026-03-21', cashier: 'Roberto M. Tan', source: 'Regulatory Fees', amount: 73_500, receipt: 'OR-2026-1566', status: 'Verified' },
];

// ─── Collection by Source (Pie) ─────────────────────────────────────────────
const collectionBySource = [
  { name: 'Business Tax', value: 18_500_000 },
  { name: 'Real Property Tax', value: 15_200_000 },
  { name: 'Regulatory Fees', value: 9_800_000 },
  { name: 'Service Charges', value: 8_420_000 },
  { name: 'Other Income', value: 6_500_000 },
];
const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

// ─── Revenue by Department (Bar) ────────────────────────────────────────────
const revenueByDept = [
  { department: 'Treasury', amount: 22_400_000 },
  { department: 'BPLO', amount: 16_800_000 },
  { department: 'Engineering', amount: 8_500_000 },
  { department: "Assessor's Office", amount: 6_200_000 },
  { department: 'Health Office', amount: 4_520_000 },
];

// ─── Monthly Revenue Trends (Area) ─────────────────────────────────────────
const monthlyRevenue = [
  { month: 'Jan', revenue: 42_000_000 },
  { month: 'Feb', revenue: 38_500_000 },
  { month: 'Mar', revenue: 58_420_000 },
  { month: 'Apr', revenue: 45_200_000 },
  { month: 'May', revenue: 50_100_000 },
  { month: 'Jun', revenue: 47_800_000 },
  { month: 'Jul', revenue: 52_300_000 },
  { month: 'Aug', revenue: 49_600_000 },
  { month: 'Sep', revenue: 55_100_000 },
  { month: 'Oct', revenue: 60_200_000 },
  { month: 'Nov', revenue: 57_400_000 },
  { month: 'Dec', revenue: 68_000_000 },
];

// ─── Cashier Activity ───────────────────────────────────────────────────────
const cashierActivity = [
  { name: 'Maria L. Santos', transactions: 47, collected: 1_245_000, lastTransaction: '3:42 PM' },
  { name: 'Jose R. Dela Cruz', transactions: 38, collected: 987_500, lastTransaction: '3:28 PM' },
  { name: 'Anna B. Reyes', transactions: 31, collected: 415_000, lastTransaction: '2:55 PM' },
  { name: 'Roberto M. Tan', transactions: 22, collected: 200_000, lastTransaction: '1:10 PM' },
];

// ─── Official Receipt Tracking ──────────────────────────────────────────────
const officialReceipts = [
  { or: 'OR-2026-1580', date: '2026-03-24', payor: 'JMR Trading Corp.', amount: 485_000, source: 'Business Tax', cashier: 'Maria L. Santos' },
  { or: 'OR-2026-1581', date: '2026-03-24', payor: 'Sps. Eduardo & Lina Garcia', amount: 672_500, source: 'Real Property Tax', cashier: 'Jose R. Dela Cruz' },
  { or: 'OR-2026-1582', date: '2026-03-24', payor: 'Daet Pharmacy Inc.', amount: 125_000, source: 'Regulatory Fees', cashier: 'Anna B. Reyes' },
  { or: 'OR-2026-1583', date: '2026-03-24', payor: 'Golden Rice Milling', amount: 340_000, source: 'Building Permit', cashier: 'Maria L. Santos' },
  { or: 'OR-2026-1584', date: '2026-03-24', payor: 'Camarines Hardware', amount: 95_000, source: 'Service Charges', cashier: 'Jose R. Dela Cruz' },
  { or: 'OR-2026-1575', date: '2026-03-23', payor: 'Bicol Express Transport', amount: 520_000, source: 'Business Tax', cashier: 'Anna B. Reyes' },
  { or: 'OR-2026-1576', date: '2026-03-23', payor: 'Daet Water District', amount: 780_000, source: 'Real Property Tax', cashier: 'Roberto M. Tan' },
  { or: 'OR-2026-1577', date: '2026-03-23', payor: 'Maria Clara Salon', amount: 62_000, source: 'Occupational Permit', cashier: 'Maria L. Santos' },
];

// ─── Anomaly Alerts ─────────────────────────────────────────────────────────
const anomalyAlerts = [
  {
    severity: 'warning' as const,
    title: 'Unusually low collection from BPLO today',
    description: 'BPLO collections are 68% below the daily average. Only ₱42,000 collected vs ₱131,250 average.',
    time: '2 hours ago',
  },
  {
    severity: 'error' as const,
    title: 'Missing receipts in sequence OR-2026-1547 to OR-2026-1549',
    description: 'Three official receipts are unaccounted for in the sequential numbering. Requires immediate investigation.',
    time: '4 hours ago',
  },
  {
    severity: 'warning' as const,
    title: 'Delayed deposit — March 22 collections',
    description: 'Collections from March 22 totaling ₱553,500 have not yet been deposited to the Land Bank account.',
    time: '1 day ago',
  },
];

// ─── Stat color config ──────────────────────────────────────────────────────
const statColors: Record<string, { bg: string; iconBg: string; text: string }> = {
  blue:    { bg: 'bg-blue-50',    iconBg: 'bg-blue-100',    text: 'text-blue-600' },
  indigo:  { bg: 'bg-indigo-50',  iconBg: 'bg-indigo-100',  text: 'text-indigo-600' },
  emerald: { bg: 'bg-emerald-50', iconBg: 'bg-emerald-100', text: 'text-emerald-600' },
  amber:   { bg: 'bg-amber-50',   iconBg: 'bg-amber-100',   text: 'text-amber-600' },
  green:   { bg: 'bg-green-50',   iconBg: 'bg-green-100',   text: 'text-green-600' },
};

// ─── Status badge ───────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const isVerified = status === 'Verified';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isVerified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
      }`}
    >
      {status}
    </span>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// Component
// ═════════════════════════════════════════════════════════════════════════════
export default function TreasuryPage() {
  const [activeTab, setActiveTab] = useState<'collections' | 'receipts' | 'cashiers'>('collections');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  const tabs = [
    { key: 'collections' as const, label: 'Daily Collections' },
    { key: 'receipts' as const, label: 'Official Receipts' },
    { key: 'cashiers' as const, label: 'Cashier Activity' },
  ];

  const filteredCollections = dailyCollections.filter((row) => {
    const matchesSearch =
      row.cashier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.receipt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = dateFilter === 'all' || row.date === dateFilter;
    return matchesSearch && matchesDate;
  });

  const filteredReceipts = officialReceipts.filter((row) =>
    row.payor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.or.toLowerCase().includes(searchTerm.toLowerCase()) ||
    row.source.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50/60">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* ── Header & Breadcrumbs ─────────────────────────────────────── */}
        <div>
          <nav className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
            <Home className="w-4 h-4" />
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Finance</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 font-medium">Treasury & Revenue Monitoring</span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Treasury & Revenue Monitoring</h1>
              <p className="text-sm text-gray-500 mt-1">Municipality of Daet, Camarines Norte</p>
            </div>
            <div className="flex gap-3">
              <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow-sm transition">
                <FileDown className="w-4 h-4" />
                Export Report
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition">
                <Download className="w-4 h-4" />
                Download Summary
              </button>
            </div>
          </div>
        </div>

        {/* ── Top Stats Cards ──────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {topStats.map((stat) => {
            const c = statColors[stat.color];
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.label}</p>
                    <p className="mt-2 text-2xl font-bold text-gray-900">
                      {stat.value !== null ? peso(stat.value) : stat.percent}
                    </p>
                  </div>
                  <div className={`p-2.5 rounded-xl ${c.iconBg}`}>
                    <Icon className={`w-5 h-5 ${c.text}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Comparison Widgets ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {comparisons.map((cmp) => {
            const diff = cmp.current - cmp.previous;
            const pct = ((diff / cmp.previous) * 100).toFixed(1);
            return (
              <div
                key={cmp.title}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-gray-500">{cmp.title}</p>
                  <p className="mt-1 text-xl font-bold text-gray-900">{peso(cmp.current)}</p>
                  <p className="text-sm text-gray-400">Previous: {peso(cmp.previous)}</p>
                </div>
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${
                    cmp.up ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                  }`}
                >
                  {cmp.up ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {cmp.up ? '+' : ''}{pct}%
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Tabs + Search / Filter ──────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="border-b border-gray-100 px-6 pt-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
                {tabs.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                      activeTab === t.key
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 w-56"
                  />
                </div>
                {activeTab === 'collections' && (
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
                  >
                    <option value="all">All Dates</option>
                    <option value="2026-03-24">Mar 24, 2026</option>
                    <option value="2026-03-23">Mar 23, 2026</option>
                    <option value="2026-03-22">Mar 22, 2026</option>
                    <option value="2026-03-21">Mar 21, 2026</option>
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* ── Daily Collection Summary Table ────────────────────────── */}
          {activeTab === 'collections' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/80">
                    <th className="text-left px-6 py-3 font-semibold text-gray-600">Date</th>
                    <th className="text-left px-6 py-3 font-semibold text-gray-600">Cashier</th>
                    <th className="text-left px-6 py-3 font-semibold text-gray-600">Source</th>
                    <th className="text-right px-6 py-3 font-semibold text-gray-600">Amount</th>
                    <th className="text-left px-6 py-3 font-semibold text-gray-600">Receipt No.</th>
                    <th className="text-left px-6 py-3 font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCollections.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3.5 text-gray-600">{row.date}</td>
                      <td className="px-6 py-3.5 font-medium text-gray-900">{row.cashier}</td>
                      <td className="px-6 py-3.5 text-gray-600">{row.source}</td>
                      <td className="px-6 py-3.5 text-right font-semibold text-gray-900">{pesoFull(row.amount)}</td>
                      <td className="px-6 py-3.5 text-gray-500 font-mono text-xs">{row.receipt}</td>
                      <td className="px-6 py-3.5"><StatusBadge status={row.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredCollections.length === 0 && (
                <p className="text-center text-gray-400 py-10 text-sm">No records match your filters.</p>
              )}
            </div>
          )}

          {/* ── Official Receipts Table ───────────────────────────────── */}
          {activeTab === 'receipts' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/80">
                    <th className="text-left px-6 py-3 font-semibold text-gray-600">OR Number</th>
                    <th className="text-left px-6 py-3 font-semibold text-gray-600">Date</th>
                    <th className="text-left px-6 py-3 font-semibold text-gray-600">Payor</th>
                    <th className="text-right px-6 py-3 font-semibold text-gray-600">Amount</th>
                    <th className="text-left px-6 py-3 font-semibold text-gray-600">Source</th>
                    <th className="text-left px-6 py-3 font-semibold text-gray-600">Cashier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredReceipts.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3.5 font-mono text-xs text-blue-600 font-semibold">{row.or}</td>
                      <td className="px-6 py-3.5 text-gray-600">{row.date}</td>
                      <td className="px-6 py-3.5 font-medium text-gray-900">{row.payor}</td>
                      <td className="px-6 py-3.5 text-right font-semibold text-gray-900">{pesoFull(row.amount)}</td>
                      <td className="px-6 py-3.5 text-gray-600">{row.source}</td>
                      <td className="px-6 py-3.5 text-gray-600">{row.cashier}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredReceipts.length === 0 && (
                <p className="text-center text-gray-400 py-10 text-sm">No receipts match your search.</p>
              )}
            </div>
          )}

          {/* ── Cashier Activity Table ────────────────────────────────── */}
          {activeTab === 'cashiers' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50/80">
                    <th className="text-left px-6 py-3 font-semibold text-gray-600">Cashier</th>
                    <th className="text-right px-6 py-3 font-semibold text-gray-600">Transactions Today</th>
                    <th className="text-right px-6 py-3 font-semibold text-gray-600">Total Collected</th>
                    <th className="text-left px-6 py-3 font-semibold text-gray-600">Last Transaction</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {cashierActivity.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-xs">
                            {row.name.split(' ').map((w) => w[0]).join('')}
                          </div>
                          <span className="font-medium text-gray-900">{row.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-right font-semibold text-gray-900">{row.transactions}</td>
                      <td className="px-6 py-3.5 text-right font-semibold text-gray-900">{pesoFull(row.collected)}</td>
                      <td className="px-6 py-3.5 text-gray-500">
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {row.lastTransaction}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ── Charts Grid ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie: Collection by Source */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Collection by Source</h2>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={collectionBySource}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {collectionBySource.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={((v: any) => pesoFull(Number(v))) as any} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar: Revenue by Department */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Revenue by Department</h2>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={revenueByDept} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickFormatter={(v: number) => `₱${(v / 1_000_000).toFixed(0)}M`} />
                <YAxis type="category" dataKey="department" width={120} tick={{ fontSize: 12 }} />
                <Tooltip formatter={((v: any) => pesoFull(Number(v))) as any} />
                <Bar dataKey="amount" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Area Chart: Monthly Revenue Trends ──────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Monthly Revenue Trends (2026)</h2>
          <ResponsiveContainer width="100%" height={340}>
            <AreaChart data={monthlyRevenue} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v: number) => `₱${(v / 1_000_000).toFixed(0)}M`} tick={{ fontSize: 12 }} />
              <Tooltip formatter={((v: any) => pesoFull(Number(v))) as any} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fill="url(#revenueGradient)"
                dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* ── Anomaly Alerts ──────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-semibold text-gray-900">Anomaly Alerts</h2>
          </div>
          <div className="space-y-3">
            {anomalyAlerts.map((alert, i) => (
              <div
                key={i}
                className={`flex items-start gap-4 p-4 rounded-xl border ${
                  alert.severity === 'error'
                    ? 'bg-red-50/60 border-red-200'
                    : 'bg-amber-50/60 border-amber-200'
                }`}
              >
                <div
                  className={`mt-0.5 p-1.5 rounded-lg ${
                    alert.severity === 'error' ? 'bg-red-100' : 'bg-amber-100'
                  }`}
                >
                  <AlertTriangle
                    className={`w-4 h-4 ${alert.severity === 'error' ? 'text-red-600' : 'text-amber-600'}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold ${alert.severity === 'error' ? 'text-red-800' : 'text-amber-800'}`}>
                    {alert.title}
                  </p>
                  <p className={`text-xs mt-0.5 ${alert.severity === 'error' ? 'text-red-600' : 'text-amber-600'}`}>
                    {alert.description}
                  </p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{alert.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Export Section ───────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Export Reports</h2>
          <p className="text-sm text-gray-500 mb-5">Download treasury data in your preferred format.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/40 transition group">
              <div className="p-2.5 rounded-lg bg-red-50 group-hover:bg-red-100 transition">
                <FileText className="w-5 h-5 text-red-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">PDF Report</p>
                <p className="text-xs text-gray-500">Formatted summary with charts</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50/40 transition group">
              <div className="p-2.5 rounded-lg bg-green-50 group-hover:bg-green-100 transition">
                <FileSpreadsheet className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">Excel Spreadsheet</p>
                <p className="text-xs text-gray-500">Detailed data with multiple sheets</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50/40 transition group">
              <div className="p-2.5 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition">
                <Receipt className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900">CSV Data</p>
                <p className="text-xs text-gray-500">Raw data for custom analysis</p>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
