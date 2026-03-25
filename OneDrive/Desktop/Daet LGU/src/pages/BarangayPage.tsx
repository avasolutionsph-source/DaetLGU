import { useState } from 'react';
import {
  Users, Home, Store, AlertTriangle, FileText, Banknote,
  ChevronRight, MapPin, Clock, CheckCircle2, Circle,
  XCircle, Bell, Activity, Shield, Eye,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';

/* ------------------------------------------------------------------ */
/*  STATIC DATA                                                        */
/* ------------------------------------------------------------------ */
const BARANGAYS = [
  'Alawihao', 'Awitan', 'Bagasbas', 'Bibirao', 'Borabod',
  'Calasgasan', 'Camambugan', 'Cobangbang', 'Dogongan', 'Gahonon',
  'Lag-on', 'Mancruz', 'Pamorangon', 'San Isidro',
];

const barangayData: Record<string, { population: number; households: number; businesses: number; incidents: number }> = {
  Alawihao:    { population: 4562, households: 892, businesses: 45, incidents: 2 },
  Awitan:      { population: 3218, households: 643, businesses: 32, incidents: 1 },
  Bagasbas:    { population: 5840, households: 1168, businesses: 78, incidents: 3 },
  Bibirao:     { population: 2105, households: 421, businesses: 14, incidents: 0 },
  Borabod:     { population: 6720, households: 1344, businesses: 95, incidents: 4 },
  Calasgasan:  { population: 3450, households: 690, businesses: 27, incidents: 1 },
  Camambugan:  { population: 2890, households: 578, businesses: 18, incidents: 0 },
  Cobangbang:  { population: 4100, households: 820, businesses: 38, incidents: 2 },
  Dogongan:    { population: 1876, households: 375, businesses: 11, incidents: 0 },
  Gahonon:     { population: 2340, households: 468, businesses: 16, incidents: 1 },
  'Lag-on':    { population: 3920, households: 784, businesses: 42, incidents: 2 },
  Mancruz:     { population: 2780, households: 556, businesses: 21, incidents: 1 },
  Pamorangon:  { population: 3150, households: 630, businesses: 25, incidents: 0 },
  'San Isidro':{ population: 4010, households: 802, businesses: 35, incidents: 1 },
};

const incidentReports = [
  { id: 'IR-2026-041', type: 'Noise Complaint', location: 'Purok 3', date: '2026-03-24', status: 'Open', reporter: 'Juan P. Mendoza' },
  { id: 'IR-2026-040', type: 'Road Obstruction', location: 'Purok 1', date: '2026-03-23', status: 'Investigating', reporter: 'Maria C. Santos' },
  { id: 'IR-2026-038', type: 'Stray Animals', location: 'Purok 5', date: '2026-03-22', status: 'Resolved', reporter: 'Pedro A. Reyes' },
  { id: 'IR-2026-035', type: 'Flooding', location: 'Purok 2', date: '2026-03-21', status: 'Open', reporter: 'Ana L. Dela Cruz' },
  { id: 'IR-2026-033', type: 'Illegal Dumping', location: 'Purok 4', date: '2026-03-20', status: 'Resolved', reporter: 'Roberto M. Tan' },
  { id: 'IR-2026-030', type: 'Disturbance', location: 'Purok 6', date: '2026-03-19', status: 'Resolved', reporter: 'Elena B. Garcia' },
];

const localBusinesses = [
  { name: 'Alawihao Sari-Sari Store', owner: 'Rosa M. Bautista', type: 'Retail', status: 'Active', permit: 'Valid' },
  { name: 'JM Auto Repair', owner: 'Jose M. Perez', type: 'Services', status: 'Active', permit: 'Valid' },
  { name: 'Aling Nena Carinderia', owner: 'Nena P. Reyes', type: 'Food', status: 'Active', permit: 'Expiring' },
  { name: 'DG Hardware Supply', owner: 'Danny G. Lim', type: 'Retail', status: 'Active', permit: 'Valid' },
  { name: 'Bagasbas Surf Shop', owner: 'Mark A. Santos', type: 'Tourism', status: 'Active', permit: 'Valid' },
];

const citizenConcerns = [
  { id: 'CC-085', subject: 'Water supply interruption in Purok 3', date: '2026-03-24', priority: 'High', status: 'Open' },
  { id: 'CC-084', subject: 'Street light replacement request', date: '2026-03-23', priority: 'Medium', status: 'In Progress' },
  { id: 'CC-083', subject: 'Drainage clogging near market area', date: '2026-03-22', priority: 'High', status: 'In Progress' },
  { id: 'CC-082', subject: 'Request for speed bumps on main road', date: '2026-03-21', priority: 'Low', status: 'Pending' },
  { id: 'CC-081', subject: 'Barangay hall restroom maintenance', date: '2026-03-20', priority: 'Medium', status: 'Resolved' },
];

const documentTracking = [
  { type: 'Barangay Clearance', issued: 145, pending: 8 },
  { type: 'Certificate of Indigency', issued: 89, pending: 3 },
  { type: 'Business Clearance', issued: 42, pending: 5 },
  { type: 'Certificate of Residency', issued: 112, pending: 2 },
];

const recentActivities = [
  { time: '10:30 AM', action: 'Barangay clearance issued to Maria L. Santos', icon: FileText },
  { time: '09:45 AM', action: 'Incident report IR-2026-041 filed by Juan P. Mendoza', icon: AlertTriangle },
  { time: '09:15 AM', action: 'Business permit clearance approved for JM Auto Repair', icon: Store },
  { time: '08:30 AM', action: 'Citizen concern CC-084 updated to In Progress', icon: Bell },
  { time: '08:00 AM', action: 'Barangay session scheduled for March 28, 2026', icon: Clock },
  { time: 'Yesterday', action: 'Monthly report submitted to Municipal Hall', icon: FileText },
];

const statusColor = (s: string) => {
  if (s === 'Open') return 'danger';
  if (s === 'Investigating' || s === 'In Progress' || s === 'Pending') return 'warning';
  return 'success';
};

const priorityVariant = (p: string) => {
  if (p === 'High') return 'danger';
  if (p === 'Medium') return 'warning';
  return 'info';
};

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */
export default function BarangayPage() {
  const [selectedBarangay, setSelectedBarangay] = useState('Alawihao');
  const data = barangayData[selectedBarangay];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Barangay Office Dashboard"
        subtitle={`Viewing data for Barangay ${selectedBarangay}, Daet, Camarines Norte`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Barangay Office' },
        ]}
        actions={
          <select
            value={selectedBarangay}
            onChange={e => setSelectedBarangay(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {BARANGAYS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Population" value={data.population.toLocaleString()} icon={Users} color="blue" />
        <StatCard title="Households" value={data.households.toLocaleString()} icon={Home} color="green" />
        <StatCard title="Registered Businesses" value={data.businesses} icon={Store} color="amber" />
        <StatCard title="Active Incidents" value={data.incidents} icon={AlertTriangle} color="red" />
      </div>

      {/* Incident Reports + Local Business Monitoring */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Incident Reports */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-500" /> Local Incident Reports
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Location</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
              </tr></thead>
              <tbody>
                {incidentReports.map(r => (
                  <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-3 font-mono text-xs text-blue-600">{r.id}</td>
                    <td className="py-3">{r.type}</td>
                    <td className="py-3 text-gray-500">{r.location}</td>
                    <td className="py-3 text-gray-500">{r.date}</td>
                    <td className="py-3"><Badge variant={statusColor(r.status)}>{r.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Local Business Monitoring */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Store className="w-5 h-5 text-amber-500" /> Local Business Monitoring
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="pb-3 font-medium">Business Name</th>
                <th className="pb-3 font-medium">Owner</th>
                <th className="pb-3 font-medium">Type</th>
                <th className="pb-3 font-medium">Permit</th>
              </tr></thead>
              <tbody>
                {localBusinesses.map((b, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-3 font-medium text-gray-900">{b.name}</td>
                    <td className="py-3 text-gray-600">{b.owner}</td>
                    <td className="py-3 text-gray-500">{b.type}</td>
                    <td className="py-3">
                      <Badge variant={b.permit === 'Valid' ? 'success' : 'warning'}>{b.permit}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Citizen Concerns + Document Tracking */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Citizen Concerns */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-500" /> Citizen Concerns
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Subject</th>
                <th className="pb-3 font-medium">Priority</th>
                <th className="pb-3 font-medium">Status</th>
              </tr></thead>
              <tbody>
                {citizenConcerns.map(c => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-3 font-mono text-xs text-blue-600">{c.id}</td>
                    <td className="py-3 text-gray-900">{c.subject}</td>
                    <td className="py-3"><Badge variant={priorityVariant(c.priority)}>{c.priority}</Badge></td>
                    <td className="py-3"><Badge variant={statusColor(c.status)}>{c.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Document Tracking + Revenue */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-500" /> Document Tracking
            </h2>
            <div className="space-y-3">
              {documentTracking.map((d, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-700">{d.type}</span>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-emerald-600 font-medium">{d.issued} issued</span>
                    <span className="text-amber-600 font-medium">{d.pending} pending</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-sm p-6 text-white">
            <h2 className="text-sm font-medium text-blue-100 mb-1">Revenue Snapshot (YTD)</h2>
            <p className="text-3xl font-bold tracking-tight">P 1,245,800</p>
            <p className="text-sm text-blue-200 mt-2">Barangay {selectedBarangay}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white/10 rounded-lg p-2">
                <p className="text-blue-200">Clearance Fees</p>
                <p className="font-semibold">P 485,200</p>
              </div>
              <div className="bg-white/10 rounded-lg p-2">
                <p className="text-blue-200">Permit Fees</p>
                <p className="font-semibold">P 320,600</p>
              </div>
              <div className="bg-white/10 rounded-lg p-2">
                <p className="text-blue-200">Rental Income</p>
                <p className="font-semibold">P 240,000</p>
              </div>
              <div className="bg-white/10 rounded-lg p-2">
                <p className="text-blue-200">Other Income</p>
                <p className="font-semibold">P 200,000</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-500" /> Recent Activity
        </h2>
        <div className="space-y-4">
          {recentActivities.map((a, i) => {
            const Icon = a.icon;
            return (
              <div key={i} className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 shrink-0">
                  <Icon className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{a.action}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Barangay Status Summary Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-indigo-500" /> All Barangay Status Summary
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {BARANGAYS.map(b => {
            const d = barangayData[b];
            const isSelected = b === selectedBarangay;
            const hasIncidents = d.incidents > 0;
            return (
              <button
                key={b}
                onClick={() => setSelectedBarangay(b)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-blue-300 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-gray-100 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <div className={`w-2 h-2 rounded-full ${hasIncidents ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                  <span className="text-xs font-semibold text-gray-800 truncate">{b}</span>
                </div>
                <p className="text-xs text-gray-500">{d.population.toLocaleString()} pop.</p>
                {hasIncidents && (
                  <p className="text-xs text-amber-600 font-medium mt-0.5">{d.incidents} incident{d.incidents > 1 ? 's' : ''}</p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
