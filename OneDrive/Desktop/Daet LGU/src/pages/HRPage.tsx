import { useState } from 'react';
import {
  Users, UserPlus, UserCheck, UserX, Clock, Briefcase,
  Building2, Search, Download, Bell, FileText, CalendarDays,
  Eye, Pencil, ChevronRight, Plus, AlertCircle, CheckCircle2,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';

/* ------------------------------------------------------------------ */
/*  STATIC DATA                                                        */
/* ------------------------------------------------------------------ */
const departments = [
  { name: "Mayor's Office", count: 15, color: 'bg-blue-500' },
  { name: 'Treasury', count: 12, color: 'bg-emerald-500' },
  { name: 'BPLO', count: 8, color: 'bg-amber-500' },
  { name: 'Engineering', count: 10, color: 'bg-purple-500' },
  { name: 'MDRRMO', count: 15, color: 'bg-red-500' },
  { name: 'Health Office', count: 20, color: 'bg-teal-500' },
  { name: 'Agriculture', count: 9, color: 'bg-lime-500' },
  { name: 'Social Welfare', count: 14, color: 'bg-pink-500' },
  { name: "Assessor's Office", count: 7, color: 'bg-indigo-500' },
  { name: 'Accounting', count: 11, color: 'bg-cyan-500' },
  { name: 'Budget Office', count: 6, color: 'bg-orange-500' },
  { name: 'Civil Registry', count: 8, color: 'bg-violet-500' },
];

const employees = [
  { id: 1, name: 'Maria Luisa C. Santos', position: 'Municipal Treasurer', department: 'Treasury', status: 'Active', dateHired: '2018-06-15' },
  { id: 2, name: 'Jose Roberto P. Dela Cruz', position: 'Municipal Engineer', department: 'Engineering', status: 'Active', dateHired: '2016-03-01' },
  { id: 3, name: 'Anna Beatriz R. Reyes', position: 'BPLO Head', department: 'BPLO', status: 'Active', dateHired: '2019-09-12' },
  { id: 4, name: 'Roberto Miguel T. Tan', position: 'MDRRMO Officer', department: 'MDRRMO', status: 'On Leave', dateHired: '2020-01-08' },
  { id: 5, name: 'Elena Grace B. Garcia', position: 'Municipal Health Officer', department: 'Health Office', status: 'Active', dateHired: '2017-07-20' },
  { id: 6, name: 'Fernando Antonio M. Lim', position: 'Admin Aide IV', department: "Mayor's Office", status: 'Active', dateHired: '2021-04-05' },
  { id: 7, name: 'Carmela Patricia D. Villanueva', position: 'Revenue Collection Clerk', department: 'Treasury', status: 'Active', dateHired: '2022-01-10' },
  { id: 8, name: 'Ricardo James S. Bautista', position: 'Building Inspector', department: 'Engineering', status: 'Active', dateHired: '2019-11-18' },
  { id: 9, name: 'Rosario Angela N. Mendoza', position: 'Social Welfare Officer', department: 'Social Welfare', status: 'Active', dateHired: '2018-02-14' },
  { id: 10, name: 'Antonio Carlos F. Ramos', position: 'Municipal Accountant', department: 'Accounting', status: 'Active', dateHired: '2015-08-22' },
  { id: 11, name: 'Patricia Mae L. Gonzales', position: 'Agricultural Technologist', department: 'Agriculture', status: 'On Leave', dateHired: '2020-06-30' },
  { id: 12, name: 'Miguel Angelo J. Cruz', position: 'Civil Registrar', department: 'Civil Registry', status: 'Active', dateHired: '2017-12-01' },
  { id: 13, name: 'Diana Rose A. Pascual', position: 'Budget Officer', department: 'Budget Office', status: 'Active', dateHired: '2019-05-15' },
  { id: 14, name: 'Marco Paulo V. Hernandez', position: 'Municipal Assessor', department: "Assessor's Office", status: 'Active', dateHired: '2016-10-03' },
];

const announcements = [
  { id: 1, title: 'Annual Performance Evaluation Schedule', date: '2026-03-24', priority: 'High', content: 'All department heads are required to submit IPCR ratings by April 15, 2026.' },
  { id: 2, title: 'Flag Ceremony Reminder - March 31', date: '2026-03-23', priority: 'Medium', content: 'Mandatory attendance for all employees. Assembly at 7:30 AM.' },
  { id: 3, title: 'CSC Career Service Exam Results', date: '2026-03-22', priority: 'Info', content: 'Results for the March 2026 CS Professional exam are now available.' },
  { id: 4, title: 'Updated Leave Policy Effective April 2026', date: '2026-03-21', priority: 'High', content: 'New guidelines on special leave privileges have been approved.' },
  { id: 5, title: 'Employee Wellness Program', date: '2026-03-20', priority: 'Low', content: 'Free health screening available at the Municipal Health Office every Friday.' },
  { id: 6, title: 'GSIS Loan Application Window', date: '2026-03-19', priority: 'Medium', content: 'Applications for GSIS Consolidated Loans are accepted until April 30.' },
];

const internalNotices = [
  { title: 'Office renovation - Engineering wing closed March 28-30', type: 'Facility' },
  { title: 'IT System maintenance scheduled for March 29, 10PM-6AM', type: 'IT' },
  { title: 'New biometric fingerprint enrollment required for all staff', type: 'HR' },
  { title: 'Reminder: Submit DTR corrections before month-end', type: 'HR' },
];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */
export default function HRPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [search, setSearch] = useState('');

  const filteredEmployees = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase()) ||
    e.position.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="HR & Personnel Management"
        subtitle="Municipality of Daet - Human Resource Information System"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'HR & Personnel' },
        ]}
        actions={
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4" /> Add Employee
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Employees" value={287} icon={Users} color="blue" change="+5" changeType="up" />
        <StatCard title="Active" value={275} icon={UserCheck} color="green" />
        <StatCard title="On Leave" value={8} icon={Clock} color="amber" />
        <StatCard title="Vacant Positions" value={12} icon={Briefcase} color="red" />
      </div>

      {/* Attendance Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-blue-500" /> Today's Attendance Summary
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Present', count: 248, color: 'bg-emerald-500', textColor: 'text-emerald-700', bg: 'bg-emerald-50' },
            { label: 'Late', count: 12, color: 'bg-amber-500', textColor: 'text-amber-700', bg: 'bg-amber-50' },
            { label: 'Absent', count: 7, color: 'bg-red-500', textColor: 'text-red-700', bg: 'bg-red-50' },
            { label: 'On Leave', count: 8, color: 'bg-blue-500', textColor: 'text-blue-700', bg: 'bg-blue-50' },
          ].map(a => (
            <div key={a.label} className={`${a.bg} rounded-xl p-4`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2.5 h-2.5 rounded-full ${a.color}`} />
                <span className="text-sm font-medium text-gray-600">{a.label}</span>
              </div>
              <p className={`text-2xl font-bold ${a.textColor}`}>{a.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Department Staffing Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-purple-500" /> Department Staffing
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {departments.map(d => (
            <div key={d.name} className="p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2.5 h-2.5 rounded-full ${d.color}`} />
                <span className="text-xs font-medium text-gray-500 truncate">{d.name}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{d.count}</p>
              <p className="text-xs text-gray-400">employees</p>
            </div>
          ))}
        </div>
      </div>

      {/* Employee Directory */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" /> Employee Directory
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Position</th>
                <th className="pb-3 font-medium">Department</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Date Hired</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(emp => (
                <tr key={emp.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                        {emp.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <span className="font-medium text-gray-900">{emp.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-gray-600">{emp.position}</td>
                  <td className="py-3 text-gray-600">{emp.department}</td>
                  <td className="py-3">
                    <Badge variant={emp.status === 'Active' ? 'success' : 'warning'}>{emp.status}</Badge>
                  </td>
                  <td className="py-3 text-gray-500">{emp.dateHired}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Announcements + Internal Notices */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Announcements */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" /> Announcements
          </h2>
          <div className="space-y-4">
            {announcements.map(a => (
              <div key={a.id} className="p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900">{a.title}</h3>
                      <Badge variant={a.priority === 'High' ? 'danger' : a.priority === 'Medium' ? 'warning' : 'info'}>
                        {a.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{a.content}</p>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{a.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Internal Notices */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" /> Internal Notices
          </h2>
          <div className="space-y-3">
            {internalNotices.map((n, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-sm text-gray-700">{n.title}</p>
                  <Badge variant="neutral">{n.type}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Employee" size="lg">
        <form className="space-y-4" onSubmit={e => { e.preventDefault(); setShowAddModal(false); }}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input type="text" placeholder="Juan" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input type="text" placeholder="Dela Cruz" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
              <input type="text" placeholder="P." className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <input type="text" placeholder="Admin Aide IV" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Department</option>
                {departments.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
              <select className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Regular">Regular</option>
                <option value="Casual">Casual</option>
                <option value="Job Order">Job Order</option>
                <option value="Contract of Service">Contract of Service</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Hired</label>
              <input type="date" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input type="tel" placeholder="09XX-XXX-XXXX" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input type="text" placeholder="Barangay, Municipality, Province" className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
              Save Employee
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
