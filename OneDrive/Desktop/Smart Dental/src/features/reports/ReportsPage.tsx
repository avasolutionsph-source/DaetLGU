import { useState, useEffect } from 'react';
import {
  FileDown, CalendarRange, Loader2, AlertTriangle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import type { Invoice, Patient } from '@/types/models';
import { api } from '@/lib/api';
import { formatMoney, getShortName } from '@/lib/utils';
import { Card, Button, Badge } from '@/components/ui';
import { useToast } from '@/components/ui/Toast';

// ─── Chart Colors ─────────────────────────────────────────────────
const CHART_BLUE = '#2563eb';
const CHART_BLUE_LIGHT = '#93c5fd';
const CHART_COLORS = [
  '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd',
  '#1d4ed8', '#1e40af', '#6366f1', '#818cf8',
];

// ─── Dummy Chart Data ─────────────────────────────────────────────
const dailyCollections = [
  { date: 'Mon', amount: 25000 },
  { date: 'Tue', amount: 18500 },
  { date: 'Wed', amount: 32000 },
  { date: 'Thu', amount: 14200 },
  { date: 'Fri', amount: 28700 },
  { date: 'Sat', amount: 41000 },
  { date: 'Sun', amount: 5300 },
];

const monthlyRevenue = [
  { month: 'Sep', revenue: 385000 },
  { month: 'Oct', revenue: 420000 },
  { month: 'Nov', revenue: 395000 },
  { month: 'Dec', revenue: 510000 },
  { month: 'Jan', revenue: 455000 },
  { month: 'Feb', revenue: 480000 },
];

const topProcedures = [
  { name: 'Oral Prophylaxis', count: 45 },
  { name: 'Tooth Extraction', count: 32 },
  { name: 'Dental Filling', count: 28 },
  { name: 'Root Canal', count: 15 },
  { name: 'Teeth Whitening', count: 12 },
  { name: 'Dental Crown', count: 10 },
  { name: 'Braces Adjustment', count: 8 },
  { name: 'Consultation', count: 42 },
];

// ─── Custom Tooltip ───────────────────────────────────────────────
function CustomTooltip({ active, payload, label, prefix = '' }: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
  prefix?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="text-sm font-bold text-gray-900">
        {prefix}{payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

// ─── ReportsPage ──────────────────────────────────────────────────

export default function ReportsPage() {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [dateFrom, setDateFrom] = useState('2026-01-01');
  const [dateTo, setDateTo] = useState('2026-02-05');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [inv, pat] = await Promise.all([
          api.getInvoices(),
          api.getPatients(),
        ]);
        if (!cancelled) {
          setInvoices(inv);
          setPatients(pat);
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // ─── Derived: Outstanding Balances Table ────────────────────
  const outstandingRows = invoices
    .filter((inv) => inv.balance_int > 0)
    .map((inv) => {
      const patient = patients.find((p) => p.patient_id === inv.patient_id);
      return {
        invoice_no: inv.invoice_no,
        patient_name: patient ? getShortName(patient) : 'Unknown',
        total: inv.total_int,
        paid: inv.amount_paid_int,
        balance: inv.balance_int,
        status: inv.status,
        due_date: inv.due_date,
      };
    })
    .sort((a, b) => b.balance - a.balance);

  const handleExport = (type: 'pdf' | 'excel') => {
    toast.info(`Export to ${type.toUpperCase()} feature coming soon`);
  };

  // ─── Loading State ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ─── Header ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="mt-1 text-sm text-gray-500">
            Analytics, charts, and financial reports for your clinic.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range Filter */}
          <div className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-1.5">
            <CalendarRange className="h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="border-0 bg-transparent text-sm text-gray-700 outline-none"
            />
            <span className="text-xs text-gray-400">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="border-0 bg-transparent text-sm text-gray-700 outline-none"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('pdf')}
            leftIcon={<FileDown className="h-4 w-4" />}
          >
            Export PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('excel')}
            leftIcon={<FileDown className="h-4 w-4" />}
          >
            Export Excel
          </Button>
        </div>
      </div>

      {/* ─── Charts Row 1 ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Daily Collections */}
        <Card title="Daily Collections" headerAction={<Badge variant="info">Last 7 days</Badge>}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyCollections} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip prefix="PHP " />} />
                <Bar
                  dataKey="amount"
                  fill={CHART_BLUE}
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Monthly Revenue Trend */}
        <Card title="Monthly Revenue" headerAction={<Badge variant="info">6-month trend</Badge>}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip prefix="PHP " />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={CHART_BLUE}
                  strokeWidth={3}
                  dot={{ r: 5, fill: CHART_BLUE, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 7, fill: CHART_BLUE }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ─── Charts Row 2 ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top Procedures - Horizontal Bar */}
        <Card title="Top Procedures" headerAction={<Badge variant="info">All time</Badge>}>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProcedures} layout="vertical" barSize={20}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  width={120}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="count"
                  fill={CHART_BLUE_LIGHT}
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Procedure Distribution - Pie Chart */}
        <Card title="Procedure Distribution" headerAction={<Badge variant="info">Percentage</Badge>}>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topProcedures}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={110}
                  paddingAngle={2}
                  label={({ name, percent }: any) =>
                    `${(name || '').split(' ')[0]} ${((percent || 0) * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {topProcedures.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value: string) => (
                    <span className="text-xs text-gray-600">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* ─── Outstanding Balances Table ─────────────────────────── */}
      <Card
        title="Outstanding Balances"
        headerAction={
          outstandingRows.length > 0 ? (
            <Badge variant="warning">{outstandingRows.length} patient{outstandingRows.length !== 1 ? 's' : ''}</Badge>
          ) : undefined
        }
      >
        {outstandingRows.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-gray-500">No outstanding balances. All invoices are settled.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Patient
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Invoice
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Total
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Paid
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Balance
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Due Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {outstandingRows.map((row) => (
                  <tr key={row.invoice_no} className="border-b border-gray-100 transition hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {row.status === 'overdue' && (
                          <AlertTriangle className="h-4 w-4 text-danger-500" />
                        )}
                        <span className="font-medium text-gray-900">{row.patient_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{row.invoice_no}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatMoney(row.total)}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatMoney(row.paid)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-danger-600">
                      {formatMoney(row.balance)}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          row.status === 'overdue' ? 'danger'
                            : row.status === 'partial' ? 'warning'
                            : 'info'
                        }
                      >
                        {row.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{row.due_date}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-200 bg-gray-50">
                  <td colSpan={4} className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                    Total Outstanding:
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-bold text-danger-600">
                    {formatMoney(outstandingRows.reduce((s, r) => s + r.balance, 0))}
                  </td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
