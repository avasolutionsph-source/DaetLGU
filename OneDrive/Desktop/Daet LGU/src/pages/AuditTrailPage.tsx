import { useState } from 'react';
import {
  Activity,
  Download,
  Search,
  Calendar,
  Filter,
  Users,
  AlertTriangle,
  Clock,
  Shield,
  LogIn,
  LogOut,
  FileText,
  Settings,
  CheckCircle2,
  XCircle,
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';

/* ------------------------------------------------------------------ */
/*  TYPES & DATA                                                        */
/* ------------------------------------------------------------------ */
interface AuditEntry {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  description: string;
  ip: string;
  severity: 'info' | 'warning' | 'critical';
}

const auditLogs: AuditEntry[] = [
  { id: 1, timestamp: '2026-03-24 09:15:23', user: 'Maria Santos', action: 'Approve', module: 'Business Permits', description: 'Approved business permit BP-2024-0891 for Daet General Merchandise', ip: '192.168.1.45', severity: 'info' },
  { id: 2, timestamp: '2026-03-24 09:02:11', user: 'Admin', action: 'Update', module: 'Settings', description: 'Updated system settings — changed session timeout to 30 minutes', ip: '192.168.1.10', severity: 'warning' },
  { id: 3, timestamp: '2026-03-24 08:58:04', user: 'Juan Reyes', action: 'Login', module: 'Authentication', description: 'Juan Reyes logged in from 192.168.1.45', ip: '192.168.1.45', severity: 'info' },
  { id: 4, timestamp: '2026-03-24 08:45:30', user: 'Ana Cruz', action: 'Create', module: 'Treasury', description: 'Recorded real property tax payment of PHP 12,500 for RPT-2026-0234', ip: '192.168.1.22', severity: 'info' },
  { id: 5, timestamp: '2026-03-24 08:30:17', user: 'Pedro Garcia', action: 'Reject', module: 'Business Permits', description: 'Rejected business permit BP-2024-0903 — incomplete requirements', ip: '192.168.1.33', severity: 'warning' },
  { id: 6, timestamp: '2026-03-24 08:15:42', user: 'Rosa Mendoza', action: 'Export', module: 'Reports', description: 'Exported monthly revenue report for February 2026 as PDF', ip: '192.168.1.18', severity: 'info' },
  { id: 7, timestamp: '2026-03-24 07:55:08', user: 'Admin', action: 'Delete', module: 'User Management', description: 'Deactivated user account for retired employee Carlos Tan', ip: '192.168.1.10', severity: 'critical' },
  { id: 8, timestamp: '2026-03-24 07:40:55', user: 'Maria Santos', action: 'Update', module: 'Business Permits', description: 'Updated permit details for BP-2024-0885 — corrected business address', ip: '192.168.1.45', severity: 'info' },
  { id: 9, timestamp: '2026-03-24 07:30:22', user: 'System', action: 'Backup', module: 'System', description: 'Automated daily database backup completed successfully', ip: '127.0.0.1', severity: 'info' },
  { id: 10, timestamp: '2026-03-23 17:45:11', user: 'Elena Villanueva', action: 'Create', module: 'Emergency', description: 'Filed emergency report ER-2026-0045 — flooding in Barangay Borabod', ip: '192.168.1.55', severity: 'critical' },
  { id: 11, timestamp: '2026-03-23 16:30:08', user: 'Juan Reyes', action: 'Approve', module: 'Treasury', description: 'Approved refund request RF-2026-0012 for PHP 3,200', ip: '192.168.1.45', severity: 'warning' },
  { id: 12, timestamp: '2026-03-23 15:20:44', user: 'Admin', action: 'Update', module: 'User Management', description: 'Changed role of Luisa Ramos from Clerk to Senior Clerk', ip: '192.168.1.10', severity: 'info' },
  { id: 13, timestamp: '2026-03-23 14:10:33', user: 'Pedro Garcia', action: 'View', module: 'Reports', description: 'Viewed quarterly tax collection summary Q1 2026', ip: '192.168.1.33', severity: 'info' },
  { id: 14, timestamp: '2026-03-23 13:05:19', user: 'Ana Cruz', action: 'Create', module: 'Business Permits', description: 'Created new business permit application BP-2024-0910 for Daet Pharmacy', ip: '192.168.1.22', severity: 'info' },
  { id: 15, timestamp: '2026-03-23 11:50:07', user: 'System', action: 'Alert', module: 'System', description: 'Storage usage exceeded 80% threshold — cleanup recommended', ip: '127.0.0.1', severity: 'critical' },
  { id: 16, timestamp: '2026-03-23 10:30:55', user: 'Rosa Mendoza', action: 'Login', module: 'Authentication', description: 'Rosa Mendoza logged in from 192.168.1.18', ip: '192.168.1.18', severity: 'info' },
  { id: 17, timestamp: '2026-03-23 09:15:41', user: 'Maria Santos', action: 'Create', module: 'Projects', description: 'Created infrastructure project PRJ-2026-0028 — Barangay Road Repair', ip: '192.168.1.45', severity: 'info' },
];

const actionTypes = ['All Actions', 'Login', 'Logout', 'Create', 'Update', 'Delete', 'Approve', 'Reject', 'Export', 'View', 'Backup', 'Alert'];
const modules = ['All Modules', 'Authentication', 'Business Permits', 'Treasury', 'Reports', 'User Management', 'System', 'Emergency', 'Projects', 'Settings'];
const users = ['All Users', 'Admin', 'Maria Santos', 'Juan Reyes', 'Ana Cruz', 'Pedro Garcia', 'Rosa Mendoza', 'Elena Villanueva', 'System'];

const actionIcon: Record<string, typeof LogIn> = {
  Login: LogIn, Logout: LogOut, Create: FileText, Update: Pencil, Delete: Trash2,
  Approve: CheckCircle2, Reject: XCircle, Export: Download, View: Eye, Backup: RefreshCw,
  Alert: AlertTriangle,
};

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                           */
/* ------------------------------------------------------------------ */
export default function AuditTrailPage() {
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('All Actions');
  const [filterModule, setFilterModule] = useState('All Modules');
  const [filterUser, setFilterUser] = useState('All Users');

  const filtered = auditLogs.filter((log) => {
    if (filterAction !== 'All Actions' && log.action !== filterAction) return false;
    if (filterModule !== 'All Modules' && log.module !== filterModule) return false;
    if (filterUser !== 'All Users' && log.user !== filterUser) return false;
    if (search) {
      const q = search.toLowerCase();
      return log.description.toLowerCase().includes(q) || log.user.toLowerCase().includes(q) || log.module.toLowerCase().includes(q);
    }
    return true;
  });

  const todayCount = auditLogs.filter((l) => l.timestamp.startsWith('2026-03-24')).length;
  const activeUsers = new Set(auditLogs.filter((l) => l.timestamp.startsWith('2026-03-24')).map((l) => l.user)).size;
  const criticalCount = auditLogs.filter((l) => l.severity === 'critical').length;

  const selectClass =
    'px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all';

  return (
    <div className="p-6">
      <PageHeader
        title="Audit Trail"
        subtitle="Track all system activities and user actions"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Audit Trail' },
        ]}
        actions={
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
            <Download className="w-4 h-4" />
            Export Logs
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Actions Today" value={todayCount} icon={Activity} color="blue" />
        <StatCard title="Active Users Today" value={activeUsers} icon={Users} color="green" />
        <StatCard title="Critical Events" value={criticalCount} icon={AlertTriangle} color="red" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
          </div>
          <select className={selectClass} value={filterUser} onChange={(e) => setFilterUser(e.target.value)}>
            {users.map((u) => <option key={u}>{u}</option>)}
          </select>
          <select className={selectClass} value={filterAction} onChange={(e) => setFilterAction(e.target.value)}>
            {actionTypes.map((a) => <option key={a}>{a}</option>)}
          </select>
          <select className={selectClass} value={filterModule} onChange={(e) => setFilterModule(e.target.value)}>
            {modules.map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['Timestamp', 'User', 'Action', 'Module', 'Description', 'IP Address'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 bg-gray-50/50">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((log) => {
                const Icon = actionIcon[log.action] || Activity;
                const severityVariant = log.severity === 'critical' ? 'danger' : log.severity === 'warning' ? 'warning' : 'info';
                return (
                  <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {log.timestamp}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{log.user}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 text-sm text-gray-700">
                        <Icon className="w-4 h-4 text-gray-400" />
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={severityVariant}>{log.module}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{log.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono whitespace-nowrap">{log.ip}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">No audit logs found matching the filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/30 text-sm text-gray-500">
          Showing {filtered.length} of {auditLogs.length} entries
        </div>
      </div>
    </div>
  );
}
