import { useState } from 'react';
import {
  ClipboardList, CalendarDays, ScrollText, Users,
  ChevronRight, Clock, CheckCircle2, FileText,
  Eye, Pencil, AlertCircle, Star, MessageSquare,
  Video, MapPin, Phone,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';

/* ------------------------------------------------------------------ */
/*  STATIC DATA                                                        */
/* ------------------------------------------------------------------ */
const todaySchedule = [
  { time: '8:00 AM', event: 'Flag Ceremony & Morning Assembly', type: 'Ceremony', location: 'Municipal Hall Grounds' },
  { time: '9:00 AM', event: 'Meeting with Department Heads - Q1 Review', type: 'Meeting', location: "Mayor's Conference Room" },
  { time: '10:30 AM', event: 'Courtesy Call - Provincial Governor', type: 'Appointment', location: "Mayor's Office" },
  { time: '1:00 PM', event: 'Citizen Consultation Hours', type: 'Public', location: "Mayor's Office Lobby" },
  { time: '2:30 PM', event: 'MDRRMO Disaster Preparedness Briefing', type: 'Briefing', location: 'Session Hall' },
  { time: '3:30 PM', event: 'Signing of Executive Order No. 2026-018', type: 'Executive', location: "Mayor's Office" },
  { time: '4:00 PM', event: 'Video Conference - DILG Regional Director', type: 'Virtual', location: 'Virtual / Zoom' },
];

const pendingApprovals = [
  { id: 'APR-2026-045', subject: 'Supplemental Budget No. 2 for CY 2026', from: 'Budget Office', date: '2026-03-24', priority: 'High', type: 'Budget' },
  { id: 'APR-2026-044', subject: 'Appointment of 3 Job Order Employees - Health Office', from: 'HR Office', date: '2026-03-23', priority: 'Medium', type: 'Appointment' },
  { id: 'APR-2026-043', subject: 'MOA with TESDA for Skills Training Program', from: 'Social Welfare', date: '2026-03-23', priority: 'Medium', type: 'Agreement' },
  { id: 'APR-2026-042', subject: 'Travel Authority - Provincial Budget Hearing', from: "Mayor's Office", date: '2026-03-22', priority: 'Low', type: 'Travel' },
  { id: 'APR-2026-041', subject: 'Emergency Procurement - MDRRMO Rescue Equipment', from: 'MDRRMO', date: '2026-03-22', priority: 'High', type: 'Procurement' },
  { id: 'APR-2026-040', subject: 'Renewal of Lease - Municipal Parking Area', from: 'GSO', date: '2026-03-21', priority: 'Medium', type: 'Contract' },
];

const executiveOrders = [
  { no: 'EO 2026-017', title: 'Declaring March 25-28 as Daet Clean-Up Week', date: '2026-03-20', status: 'Effective' },
  { no: 'EO 2026-016', title: 'Reconstitution of Municipal Disaster Risk Reduction Council', date: '2026-03-15', status: 'Effective' },
  { no: 'EO 2026-015', title: 'Implementing Guidelines on Business Permit Renewal Deadline Extension', date: '2026-03-10', status: 'Effective' },
  { no: 'EO 2026-014', title: 'Creation of Task Force on Flood Mitigation - Bagasbas Area', date: '2026-03-05', status: 'Effective' },
  { no: 'EO 2026-013', title: 'Designation of OIC Municipal Administrator', date: '2026-02-28', status: 'Superseded' },
  { no: 'EO 2026-012', title: 'Regulation of Tricycle Fares within Municipality of Daet', date: '2026-02-20', status: 'Effective' },
];

const typeColor = (t: string) => {
  const map: Record<string, string> = {
    Ceremony: 'bg-purple-50 text-purple-600',
    Meeting: 'bg-blue-50 text-blue-600',
    Appointment: 'bg-emerald-50 text-emerald-600',
    Public: 'bg-amber-50 text-amber-600',
    Briefing: 'bg-red-50 text-red-600',
    Executive: 'bg-indigo-50 text-indigo-600',
    Virtual: 'bg-cyan-50 text-cyan-600',
  };
  return map[t] || 'bg-gray-50 text-gray-600';
};

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */
export default function MayorsOfficePage() {
  const [scheduleView, setScheduleView] = useState<'today' | 'week'>('today');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mayor's Office"
        subtitle="Office of the Municipal Mayor - Daet, Camarines Norte"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: "Mayor's Office" },
        ]}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Pending Approvals" value={6} icon={ClipboardList} color="amber" />
        <StatCard title="Appointments Today" value={7} icon={CalendarDays} color="blue" />
        <StatCard title="Executive Orders (YTD)" value={17} icon={ScrollText} color="purple" change="+3" changeType="up" />
        <StatCard title="Citizen Meetings (MTD)" value={42} icon={Users} color="green" change="+8" changeType="up" />
      </div>

      {/* Schedule + Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-500" /> Today's Schedule
            </h2>
            <div className="flex gap-1">
              {(['today', 'week'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setScheduleView(v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                    scheduleView === v ? 'bg-blue-100 text-blue-700' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            {todaySchedule.map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="text-center shrink-0 w-16">
                  <p className="text-sm font-bold text-gray-900">{item.time.split(' ')[0]}</p>
                  <p className="text-xs text-gray-400">{item.time.split(' ')[1]}</p>
                </div>
                <div className="w-px h-12 bg-gray-200 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-semibold text-gray-900">{item.event}</p>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeColor(item.type)}`}>
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {item.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { label: 'Draft Executive Order', desc: 'Create a new EO or memorandum', icon: ScrollText, color: 'bg-indigo-50 text-indigo-600' },
              { label: 'Schedule Meeting', desc: 'Set up appointments or consultations', icon: CalendarDays, color: 'bg-blue-50 text-blue-600' },
              { label: 'Review Documents', desc: 'Pending documents requiring action', icon: FileText, color: 'bg-amber-50 text-amber-600' },
              { label: 'Citizen Request Log', desc: 'View and manage citizen requests', icon: MessageSquare, color: 'bg-emerald-50 text-emerald-600' },
              { label: 'Video Conference', desc: 'Join or start a virtual meeting', icon: Video, color: 'bg-purple-50 text-purple-600' },
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

      {/* Pending Approvals Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-500" /> Pending Approval Items
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="pb-3 font-medium">Ref No.</th>
                <th className="pb-3 font-medium">Subject</th>
                <th className="pb-3 font-medium">From</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Priority</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingApprovals.map(item => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-3 font-mono text-xs text-blue-600">{item.id}</td>
                  <td className="py-3 font-medium text-gray-900 max-w-xs truncate">{item.subject}</td>
                  <td className="py-3 text-gray-600">{item.from}</td>
                  <td className="py-3"><Badge variant="info">{item.type}</Badge></td>
                  <td className="py-3">
                    <Badge variant={item.priority === 'High' ? 'danger' : item.priority === 'Medium' ? 'warning' : 'neutral'}>
                      {item.priority}
                    </Badge>
                  </td>
                  <td className="py-3 text-gray-500">{item.date}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <button className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors">
                        Review
                      </button>
                      <button className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition-colors">
                        Approve
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Executive Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ScrollText className="w-5 h-5 text-purple-500" /> Recent Executive Orders
        </h2>
        <div className="space-y-3">
          {executiveOrders.map((eo, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                  <ScrollText className="w-5 h-5 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-bold text-gray-900">{eo.no}</span>
                    <Badge variant={eo.status === 'Effective' ? 'success' : 'neutral'}>{eo.status}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{eo.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-4 shrink-0">
                <span className="text-xs text-gray-400">{eo.date}</span>
                <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
