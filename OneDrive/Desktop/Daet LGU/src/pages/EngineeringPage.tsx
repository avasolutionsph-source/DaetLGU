import { useState } from 'react';
import {
  HardHat, ClipboardCheck, FileCheck, TrendingUp,
  ChevronRight, Eye, MapPin, Calendar, Clock,
  Ruler, AlertTriangle, CheckCircle2, Search,
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
const monthlyOutput = [
  { month: 'Oct', permits: 18, inspections: 24, projects: 3 },
  { month: 'Nov', permits: 22, inspections: 19, projects: 4 },
  { month: 'Dec', permits: 15, inspections: 16, projects: 2 },
  { month: 'Jan', permits: 25, inspections: 28, projects: 5 },
  { month: 'Feb', permits: 20, inspections: 22, projects: 3 },
  { month: 'Mar', permits: 17, inspections: 20, projects: 4 },
];

const currentProjects = [
  { id: 'PROJ-2026-012', name: 'Borabod-Calasgasan Road Improvement', location: 'Brgy. Borabod', contractor: 'ABC Construction Co.', budget: 15_200_000, progress: 72, status: 'On Track', startDate: '2025-11-15', endDate: '2026-06-30' },
  { id: 'PROJ-2026-011', name: 'Bagasbas Seawall Repair Phase 2', location: 'Brgy. Bagasbas', contractor: 'Pacific Builders Inc.', budget: 8_500_000, progress: 45, status: 'On Track', startDate: '2026-01-10', endDate: '2026-07-15' },
  { id: 'PROJ-2026-010', name: 'Municipal Hall Annex Construction', location: 'Poblacion', contractor: 'DEF Engineering', budget: 22_000_000, progress: 28, status: 'Delayed', startDate: '2026-02-01', endDate: '2026-12-31' },
  { id: 'PROJ-2026-009', name: 'Calasgasan Drainage System', location: 'Brgy. Calasgasan', contractor: 'GHI Contractors', budget: 5_800_000, progress: 90, status: 'On Track', startDate: '2025-09-01', endDate: '2026-04-15' },
  { id: 'PROJ-2026-008', name: 'Alawihao Covered Court Renovation', location: 'Brgy. Alawihao', contractor: 'JKL Builders', budget: 3_200_000, progress: 60, status: 'On Track', startDate: '2026-01-20', endDate: '2026-05-30' },
  { id: 'PROJ-2026-007', name: 'Lag-on Water System Extension', location: 'Brgy. Lag-on', contractor: 'MNO Utilities Corp.', budget: 4_500_000, progress: 15, status: 'Just Started', startDate: '2026-03-10', endDate: '2026-09-30' },
];

const pendingInspections = [
  { id: 'INS-2026-088', type: 'Building Inspection', applicant: 'Engr. Ricardo B. Santos', location: 'Brgy. Borabod, Lot 15-A', requested: '2026-03-23', priority: 'High' },
  { id: 'INS-2026-087', type: 'Occupancy Permit', applicant: 'Maria C. Dela Cruz', location: 'Brgy. Cobangbang, Block 3', requested: '2026-03-22', priority: 'Medium' },
  { id: 'INS-2026-086', type: 'Electrical Inspection', applicant: 'Pedro A. Reyes', location: 'Brgy. Awitan, Zone 2', requested: '2026-03-22', priority: 'Low' },
  { id: 'INS-2026-085', type: 'Building Inspection', applicant: 'Anna L. Garcia', location: 'Brgy. Bagasbas, Lot 8-B', requested: '2026-03-21', priority: 'High' },
  { id: 'INS-2026-084', type: 'Plumbing Inspection', applicant: 'Jose M. Villanueva', location: 'Brgy. Mancruz, Zone 1', requested: '2026-03-20', priority: 'Medium' },
];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */
export default function EngineeringPage() {
  const [projectSearch, setProjectSearch] = useState('');

  const filteredProjects = currentProjects.filter(p =>
    p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
    p.location.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const statusVariant = (s: string) => {
    if (s === 'On Track') return 'success';
    if (s === 'Delayed') return 'danger';
    return 'info';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Engineering Office"
        subtitle="Infrastructure projects, permits, and inspections"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Engineering Office' },
        ]}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Projects" value={6} icon={HardHat} color="blue" change="+2" changeType="up" />
        <StatCard title="Pending Inspections" value={5} icon={ClipboardCheck} color="amber" />
        <StatCard title="Permits Issued (YTD)" value={117} icon={FileCheck} color="green" change="+12%" changeType="up" />
        <StatCard title="Completion Rate" value="85%" icon={TrendingUp} color="purple" change="+4%" changeType="up" />
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <HardHat className="w-5 h-5 text-blue-500" /> Current Projects
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={projectSearch}
              onChange={e => setProjectSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="pb-3 font-medium">Project</th>
                <th className="pb-3 font-medium">Location</th>
                <th className="pb-3 font-medium">Contractor</th>
                <th className="pb-3 font-medium text-right">Budget</th>
                <th className="pb-3 font-medium">Progress</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Timeline</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map(p => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-3">
                    <p className="font-medium text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-400 font-mono">{p.id}</p>
                  </td>
                  <td className="py-3 text-gray-600">{p.location}</td>
                  <td className="py-3 text-gray-600">{p.contractor}</td>
                  <td className="py-3 text-right font-medium text-gray-900">{peso(p.budget)}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${p.status === 'Delayed' ? 'bg-red-500' : 'bg-blue-500'}`}
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-600">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3"><Badge variant={statusVariant(p.status)}>{p.status}</Badge></td>
                  <td className="py-3 text-xs text-gray-500">
                    {p.startDate} to {p.endDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pending Inspections + Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Pending Inspections */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-amber-500" /> Pending Inspection Requests
          </h2>
          <div className="space-y-3">
            {pendingInspections.map(ins => (
              <div key={ins.id} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                  <ClipboardCheck className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-semibold text-gray-900">{ins.type}</span>
                    <Badge variant={ins.priority === 'High' ? 'danger' : ins.priority === 'Medium' ? 'warning' : 'info'}>
                      {ins.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{ins.applicant}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" /> {ins.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{ins.requested}</p>
                  <button className="mt-1 px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors">
                    Schedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Output Chart */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" /> Monthly Output Summary
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyOutput} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="permits" name="Permits" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="inspections" name="Inspections" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="projects" name="Projects" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'New Inspection', desc: 'Schedule a new building or site inspection', icon: ClipboardCheck, color: 'bg-amber-50 text-amber-600' },
            { label: 'Project Review', desc: 'Review active project progress reports', icon: Eye, color: 'bg-blue-50 text-blue-600' },
            { label: 'Issue Permit', desc: 'Process and release building permits', icon: FileCheck, color: 'bg-emerald-50 text-emerald-600' },
          ].map(action => (
            <button
              key={action.label}
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors text-left"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color}`}>
                <action.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{action.label}</p>
                <p className="text-xs text-gray-500">{action.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
