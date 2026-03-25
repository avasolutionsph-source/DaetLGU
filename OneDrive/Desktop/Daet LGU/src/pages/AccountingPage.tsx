import { useState } from 'react';
import {
  Calculator, FileText, Banknote, Clock, CheckCircle2,
  TrendingUp, Download, Eye, ChevronRight, AlertCircle,
  Receipt, CreditCard, FileSpreadsheet, BookOpen,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */
const peso = (n: number) =>
  'P ' + n.toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

/* ------------------------------------------------------------------ */
/*  STATIC DATA                                                        */
/* ------------------------------------------------------------------ */
const budgetVsActual = [
  { month: 'Jan', budget: 12_500_000, actual: 11_800_000 },
  { month: 'Feb', budget: 12_500_000, actual: 12_100_000 },
  { month: 'Mar', budget: 13_000_000, actual: 10_200_000 },
  { month: 'Apr', budget: 12_000_000, actual: 11_500_000 },
  { month: 'May', budget: 13_500_000, actual: 13_200_000 },
  { month: 'Jun', budget: 14_000_000, actual: 12_800_000 },
];

const recentTransactions = [
  { id: 'JEV-2026-0412', date: '2026-03-24', payee: 'Daet Water District', description: 'Water utility - Municipal Hall', amount: 48_500, type: 'Disbursement', status: 'Posted' },
  { id: 'JEV-2026-0411', date: '2026-03-24', payee: 'CAMELCO', description: 'Electric utility - All offices', amount: 185_200, type: 'Disbursement', status: 'Posted' },
  { id: 'JEV-2026-0410', date: '2026-03-23', payee: 'Various Employees', description: 'March 16-31 payroll - 1st batch', amount: 2_450_000, type: 'Payroll', status: 'Posted' },
  { id: 'JEV-2026-0409', date: '2026-03-23', payee: 'ABC Construction Co.', description: 'Progress billing - Borabod road project', amount: 1_250_000, type: 'Disbursement', status: 'Pending' },
  { id: 'JEV-2026-0408', date: '2026-03-22', payee: 'Office Warehouse', description: 'Office supplies - Q1 2026', amount: 95_800, type: 'Disbursement', status: 'Posted' },
  { id: 'JEV-2026-0407', date: '2026-03-22', payee: 'PhilHealth', description: 'Employee PhilHealth remittance - March', amount: 320_000, type: 'Remittance', status: 'Posted' },
  { id: 'JEV-2026-0406', date: '2026-03-21', payee: 'GSIS', description: 'Employee GSIS premium remittance', amount: 485_000, type: 'Remittance', status: 'Posted' },
  { id: 'JEV-2026-0405', date: '2026-03-21', payee: 'BIR', description: 'Withholding tax remittance - Feb', amount: 215_600, type: 'Remittance', status: 'Posted' },
  { id: 'JEV-2026-0404', date: '2026-03-20', payee: 'DEF Engineering', description: 'Drainage project - Calasgasan', amount: 875_000, type: 'Disbursement', status: 'Pending' },
];

const pendingApprovals = [
  { id: 'DV-2026-0198', requestor: 'Engineering Office', description: 'Progress billing - Bagasbas seawall repair', amount: 2_100_000, daysAgo: 1, priority: 'High' },
  { id: 'DV-2026-0197', requestor: 'Health Office', description: 'Medical supplies procurement - Q2', amount: 485_000, daysAgo: 2, priority: 'Medium' },
  { id: 'DV-2026-0196', requestor: "Mayor's Office", description: 'Travel expenses - Provincial meeting', amount: 35_000, daysAgo: 2, priority: 'Low' },
  { id: 'DV-2026-0195', requestor: 'MDRRMO', description: 'Emergency response equipment', amount: 320_000, daysAgo: 3, priority: 'High' },
  { id: 'DV-2026-0194', requestor: 'Social Welfare', description: 'AICS beneficiary payouts', amount: 150_000, daysAgo: 3, priority: 'Medium' },
];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */
export default function AccountingPage() {
  const [txFilter, setTxFilter] = useState<'All' | 'Disbursement' | 'Payroll' | 'Remittance'>('All');

  const filteredTx = txFilter === 'All'
    ? recentTransactions
    : recentTransactions.filter(t => t.type === txFilter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Accounting Office"
        subtitle="Financial management and disbursement tracking"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Accounting Office' },
        ]}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Budget Utilization" value="68.4%" icon={TrendingUp} color="blue" change="+3.2%" changeType="up" />
        <StatCard title="Total Disbursements" value={peso(72_450_000)} icon={Banknote} color="green" change="+8.5%" changeType="up" />
        <StatCard title="Pending Vouchers" value={5} icon={Clock} color="amber" />
        <StatCard title="Payroll Status" value="Processed" icon={CheckCircle2} color="purple" />
      </div>

      {/* Chart + Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Budget vs Actual */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" /> Budget vs Actual Expenditure
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgetVsActual} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${(v / 1_000_000).toFixed(0)}M`} />
              <Tooltip formatter={((v: number) => peso(v)) as any} />
              <Legend />
              <Bar dataKey="budget" name="Budget" fill="#93c5fd" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" name="Actual" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { label: 'Process Voucher', desc: 'Create new disbursement voucher', icon: Receipt, color: 'bg-blue-50 text-blue-600' },
              { label: 'Generate Report', desc: 'Financial statements & reports', icon: FileSpreadsheet, color: 'bg-emerald-50 text-emerald-600' },
              { label: 'View Ledger', desc: 'General & subsidiary ledgers', icon: BookOpen, color: 'bg-purple-50 text-purple-600' },
              { label: 'Download Statement', desc: 'Export financial summaries', icon: Download, color: 'bg-amber-50 text-amber-600' },
            ].map(action => (
              <button
                key={action.label}
                className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors text-left"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color}`}>
                  <action.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{action.label}</p>
                  <p className="text-xs text-gray-500">{action.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" /> Recent Transactions
          </h2>
          <div className="flex gap-2">
            {(['All', 'Disbursement', 'Payroll', 'Remittance'] as const).map(f => (
              <button
                key={f}
                onClick={() => setTxFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  txFilter === f
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="pb-3 font-medium">JEV No.</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Payee</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium text-right">Amount</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTx.map(tx => (
                <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-3 font-mono text-xs text-blue-600">{tx.id}</td>
                  <td className="py-3 text-gray-500">{tx.date}</td>
                  <td className="py-3 font-medium text-gray-900">{tx.payee}</td>
                  <td className="py-3 text-gray-600 max-w-xs truncate">{tx.description}</td>
                  <td className="py-3 text-right font-medium text-gray-900">{peso(tx.amount)}</td>
                  <td className="py-3"><Badge variant="info">{tx.type}</Badge></td>
                  <td className="py-3">
                    <Badge variant={tx.status === 'Posted' ? 'success' : 'warning'}>{tx.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-500" /> Pending Approvals
        </h2>
        <div className="space-y-3">
          {pendingApprovals.map(item => (
            <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-gray-900">{item.id}</span>
                    <Badge variant={item.priority === 'High' ? 'danger' : item.priority === 'Medium' ? 'warning' : 'info'}>
                      {item.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{item.description}</p>
                  <p className="text-xs text-gray-400 mt-0.5">From: {item.requestor} &middot; {item.daysAgo} day{item.daysAgo > 1 ? 's' : ''} ago</p>
                </div>
              </div>
              <div className="text-right ml-4">
                <p className="text-sm font-bold text-gray-900">{peso(item.amount)}</p>
                <div className="flex gap-1 mt-2">
                  <button className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors">Approve</button>
                  <button className="px-3 py-1 rounded-lg border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">Review</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
