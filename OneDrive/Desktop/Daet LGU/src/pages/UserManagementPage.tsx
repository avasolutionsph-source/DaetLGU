import { useState } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  UserCheck,
  UserX,
  Search,
  MoreVertical,
  Mail,
  Phone,
  Building2,
  Eye,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Key,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';

/* ------------------------------------------------------------------ */
/*  TYPES & DATA                                                        */
/* ------------------------------------------------------------------ */
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
  avatar: string;
}

const usersData: User[] = [
  { id: 1, name: 'Maria Santos', email: 'maria.santos@daet.gov.ph', role: 'Admin', department: 'IT Division', status: 'Active', lastLogin: '2026-03-24 09:15', avatar: 'MS' },
  { id: 2, name: 'Juan Reyes', email: 'juan.reyes@daet.gov.ph', role: 'Department Head', department: 'Treasury', status: 'Active', lastLogin: '2026-03-24 08:58', avatar: 'JR' },
  { id: 3, name: 'Ana Cruz', email: 'ana.cruz@daet.gov.ph', role: 'Clerk', department: 'Treasury', status: 'Active', lastLogin: '2026-03-24 08:45', avatar: 'AC' },
  { id: 4, name: 'Pedro Garcia', email: 'pedro.garcia@daet.gov.ph', role: 'Officer', department: 'Business Permits', status: 'Active', lastLogin: '2026-03-24 08:30', avatar: 'PG' },
  { id: 5, name: 'Rosa Mendoza', email: 'rosa.mendoza@daet.gov.ph', role: 'Clerk', department: 'Reports', status: 'Active', lastLogin: '2026-03-24 07:55', avatar: 'RM' },
  { id: 6, name: 'Elena Villanueva', email: 'elena.v@daet.gov.ph', role: 'Officer', department: 'Emergency', status: 'Active', lastLogin: '2026-03-23 17:45', avatar: 'EV' },
  { id: 7, name: 'Carlos Tan', email: 'carlos.tan@daet.gov.ph', role: 'Clerk', department: 'HR', status: 'Inactive', lastLogin: '2026-03-01 10:20', avatar: 'CT' },
  { id: 8, name: 'Luisa Ramos', email: 'luisa.ramos@daet.gov.ph', role: 'Senior Clerk', department: 'Treasury', status: 'Active', lastLogin: '2026-03-23 16:10', avatar: 'LR' },
  { id: 9, name: 'Roberto Lim', email: 'roberto.lim@daet.gov.ph', role: 'Department Head', department: 'Engineering', status: 'Active', lastLogin: '2026-03-23 14:30', avatar: 'RL' },
  { id: 10, name: 'Gloria Reyes', email: 'gloria.reyes@daet.gov.ph', role: 'Admin', department: 'IT Division', status: 'Active', lastLogin: '2026-03-24 08:00', avatar: 'GR' },
  { id: 11, name: 'Mark Villanueva', email: 'mark.v@daet.gov.ph', role: 'Clerk', department: 'Business Permits', status: 'Inactive', lastLogin: '2026-02-15 09:30', avatar: 'MV' },
  { id: 12, name: 'Teresa Aquino', email: 'teresa.a@daet.gov.ph', role: 'Officer', department: 'Planning', status: 'Active', lastLogin: '2026-03-23 11:45', avatar: 'TA' },
];

const roles = ['Admin', 'Department Head', 'Officer', 'Senior Clerk', 'Clerk'];
const departments = ['IT Division', 'Treasury', 'Business Permits', 'Reports', 'Emergency', 'HR', 'Engineering', 'Planning'];

const permissionMatrix = [
  { module: 'Dashboard', admin: true, head: true, officer: true, clerk: true },
  { module: 'Business Permits', admin: true, head: true, officer: true, clerk: false },
  { module: 'Treasury', admin: true, head: true, officer: false, clerk: false },
  { module: 'Reports', admin: true, head: true, officer: true, clerk: true },
  { module: 'User Management', admin: true, head: false, officer: false, clerk: false },
  { module: 'System Settings', admin: true, head: false, officer: false, clerk: false },
  { module: 'Audit Trail', admin: true, head: true, officer: false, clerk: false },
  { module: 'Emergency', admin: true, head: true, officer: true, clerk: true },
];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                           */
/* ------------------------------------------------------------------ */
export default function UserManagementPage() {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionMenu, setActionMenu] = useState<number | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState('Clerk');
  const [formDept, setFormDept] = useState('IT Division');
  const [formPhone, setFormPhone] = useState('');

  const filtered = usersData.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.department.toLowerCase().includes(q);
  });

  const totalActive = usersData.filter((u) => u.status === 'Active').length;
  const totalInactive = usersData.filter((u) => u.status === 'Inactive').length;
  const totalAdmins = usersData.filter((u) => u.role === 'Admin').length;

  const inputClass =
    'w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all';

  return (
    <div className="p-6">
      <PageHeader
        title="User Management"
        subtitle="Manage system users, roles, and permissions"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'User Management' },
        ]}
        actions={
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Users" value={usersData.length} icon={Users} color="blue" />
        <StatCard title="Active Users" value={totalActive} icon={UserCheck} color="green" />
        <StatCard title="Inactive Users" value={totalInactive} icon={UserX} color="red" />
        <StatCard title="Administrators" value={totalAdmins} icon={Shield} color="purple" />
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name, email, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['User', 'Email', 'Role', 'Department', 'Status', 'Last Login', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 bg-gray-50/50">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                        {user.avatar}
                      </div>
                      <span className="text-sm font-medium text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4">
                    <Badge variant={user.role === 'Admin' ? 'danger' : user.role === 'Department Head' ? 'warning' : 'info'}>
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{user.department}</td>
                  <td className="px-6 py-4">
                    <Badge variant={user.status === 'Active' ? 'success' : 'neutral'}>{user.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {user.lastLogin}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <button
                        onClick={() => setActionMenu(actionMenu === user.id ? null : user.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {actionMenu === user.id && (
                        <div className="absolute right-0 top-8 z-10 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1">
                          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <Eye className="w-4 h-4" /> View
                          </button>
                          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <Pencil className="w-4 h-4" /> Edit
                          </button>
                          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" /> Deactivate
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/30 text-sm text-gray-500">
          Showing {filtered.length} of {usersData.length} users
        </div>
      </div>

      {/* Permission Matrix */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-600" /> Role Permission Matrix
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 bg-gray-50/50">Module</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 bg-gray-50/50">Admin</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 bg-gray-50/50">Dept. Head</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 bg-gray-50/50">Officer</th>
                <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 bg-gray-50/50">Clerk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {permissionMatrix.map((row) => (
                <tr key={row.module} className="hover:bg-gray-50/80">
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">{row.module}</td>
                  {[row.admin, row.head, row.officer, row.clerk].map((allowed, i) => (
                    <td key={i} className="px-6 py-3 text-center">
                      {allowed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-200 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add New User" size="lg">
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input className={inputClass} placeholder="e.g. Juan Dela Cruz" value={formName} onChange={(e) => setFormName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input className={`${inputClass} pl-10`} placeholder="email@daet.gov.ph" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input className={`${inputClass} pl-10`} placeholder="(054) 721-XXXX" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
              <select className={inputClass} value={formRole} onChange={(e) => setFormRole(e.target.value)}>
                {roles.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select className={`${inputClass} pl-10`} value={formDept} onChange={(e) => setFormDept(e.target.value)}>
                  {departments.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
              <UserPlus className="w-4 h-4" />
              Create User
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
