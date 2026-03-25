import { useState } from 'react';
import {
  FileBarChart,
  Download,
  FileText,
  Calendar,
  DollarSign,
  Building2,
  Landmark,
  HardHat,
  Siren,
  Users,
  Clock,
  FileSpreadsheet,
  FilePlus,
  ChevronRight,
  CalendarDays,
  RefreshCw,
  Trash2,
  Eye,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Badge from '../components/ui/Badge';

/* ------------------------------------------------------------------ */
/*  TYPES & DATA                                                        */
/* ------------------------------------------------------------------ */
interface ReportCategory {
  icon: typeof FileBarChart;
  title: string;
  count: number;
  color: string;
  bg: string;
}

const categories: ReportCategory[] = [
  { icon: DollarSign, title: 'Revenue Reports', count: 12, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: Building2, title: 'Permit Reports', count: 8, color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Landmark, title: 'Tax Reports', count: 10, color: 'text-amber-600', bg: 'bg-amber-50' },
  { icon: HardHat, title: 'Project Reports', count: 6, color: 'text-purple-600', bg: 'bg-purple-50' },
  { icon: Siren, title: 'Emergency Reports', count: 4, color: 'text-red-600', bg: 'bg-red-50' },
  { icon: Users, title: 'HR Reports', count: 7, color: 'text-cyan-600', bg: 'bg-cyan-50' },
];

interface RecentReport {
  id: number;
  name: string;
  generatedBy: string;
  date: string;
  size: string;
  format: string;
}

const recentReports: RecentReport[] = [
  { id: 1, name: 'Monthly Revenue Summary - March 2026', generatedBy: 'Maria Santos', date: '2026-03-24', size: '2.4 MB', format: 'PDF' },
  { id: 2, name: 'Business Permit Applications Q1 2026', generatedBy: 'Pedro Garcia', date: '2026-03-23', size: '1.8 MB', format: 'Excel' },
  { id: 3, name: 'Real Property Tax Collection Report', generatedBy: 'Juan Reyes', date: '2026-03-22', size: '3.1 MB', format: 'PDF' },
  { id: 4, name: 'Emergency Response Incidents - Feb 2026', generatedBy: 'Elena Villanueva', date: '2026-03-21', size: '890 KB', format: 'PDF' },
  { id: 5, name: 'Employee Attendance Summary', generatedBy: 'Luisa Ramos', date: '2026-03-20', size: '1.2 MB', format: 'Excel' },
  { id: 6, name: 'Infrastructure Project Status Report', generatedBy: 'Roberto Lim', date: '2026-03-19', size: '4.5 MB', format: 'PDF' },
  { id: 7, name: 'Community Tax Certificate Issuance', generatedBy: 'Ana Cruz', date: '2026-03-18', size: '780 KB', format: 'CSV' },
  { id: 8, name: 'Barangay Revenue Breakdown', generatedBy: 'Rosa Mendoza', date: '2026-03-17', size: '1.6 MB', format: 'Excel' },
];

interface ScheduledReport {
  id: number;
  name: string;
  frequency: string;
  nextRun: string;
  format: string;
}

const scheduledReports: ScheduledReport[] = [
  { id: 1, name: 'Daily Revenue Summary', frequency: 'Daily', nextRun: '2026-03-25 06:00', format: 'PDF' },
  { id: 2, name: 'Weekly Permit Status Report', frequency: 'Weekly', nextRun: '2026-03-31 08:00', format: 'Excel' },
  { id: 3, name: 'Monthly Tax Collection Report', frequency: 'Monthly', nextRun: '2026-04-01 06:00', format: 'PDF' },
  { id: 4, name: 'Quarterly Financial Summary', frequency: 'Quarterly', nextRun: '2026-04-01 06:00', format: 'PDF' },
];

const reportTypes = [
  'Monthly Revenue Summary',
  'Business Permit Applications',
  'Real Property Tax Collection',
  'Community Tax Certificates',
  'Infrastructure Project Status',
  'Emergency Response Summary',
  'Employee Attendance Report',
  'Barangay Revenue Breakdown',
];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                           */
/* ------------------------------------------------------------------ */
export default function ReportsPage() {
  const [reportType, setReportType] = useState(reportTypes[0]);
  const [dateFrom, setDateFrom] = useState('2026-03-01');
  const [dateTo, setDateTo] = useState('2026-03-24');
  const [format, setFormat] = useState('PDF');

  const inputClass =
    'w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all';

  return (
    <div className="p-6">
      <PageHeader
        title="Reports Center"
        subtitle="Generate, download, and schedule reports"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Reports' },
        ]}
      />

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div key={cat.title} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl ${cat.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${cat.color}`} />
                </div>
                <span className="text-xs font-semibold text-gray-400">{cat.count} reports</span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">{cat.title}</h3>
              <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                Generate <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Report Generation Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h3 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
          <FilePlus className="w-5 h-5 text-blue-600" /> Generate New Report
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Report Type</label>
            <select className={inputClass} value={reportType} onChange={(e) => setReportType(e.target.value)}>
              {reportTypes.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Date From</label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="date" className={`${inputClass} pl-10`} value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Date To</label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="date" className={`${inputClass} pl-10`} value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Format</label>
            <div className="flex gap-2">
              {['PDF', 'Excel', 'CSV'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`flex-1 py-2.5 text-sm font-medium rounded-xl border transition-colors ${
                    format === f
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
            <FileBarChart className="w-4 h-4" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Recent Reports Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" /> Recent Reports
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Report Name', 'Generated By', 'Date', 'Size', 'Format', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 bg-gray-50/50">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        {report.format === 'PDF' ? (
                          <FileText className="w-4 h-4 text-red-500" />
                        ) : report.format === 'Excel' ? (
                          <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <FileText className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{report.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{report.generatedBy}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{report.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{report.size}</td>
                  <td className="px-6 py-4">
                    <Badge variant={report.format === 'PDF' ? 'danger' : report.format === 'Excel' ? 'success' : 'neutral'}>
                      {report.format}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Download">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors" title="Preview">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scheduled Reports */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-blue-600" /> Scheduled Reports
          </h3>
          <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            + Add Schedule
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Report Name', 'Frequency', 'Next Run', 'Format', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 bg-gray-50/50">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {scheduledReports.map((sr) => (
                <tr key={sr.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{sr.name}</td>
                  <td className="px-6 py-4">
                    <Badge variant={sr.frequency === 'Daily' ? 'info' : sr.frequency === 'Weekly' ? 'success' : 'warning'}>
                      {sr.frequency}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {sr.nextRun}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{sr.format}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Run Now">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Remove">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
