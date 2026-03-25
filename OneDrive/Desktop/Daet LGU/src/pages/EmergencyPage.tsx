import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  Flame,
  Car,
  Droplets,
  Shield,
  Heart,
  Phone,
  Siren,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  XCircle,
  ChevronRight,
  Upload,
  Send,
  Activity,
  Radio,
  Truck,
  Building2,
  Bell,
  Eye,
  FileText,
  X,
  ChevronDown,
  Zap,
  BarChart3,
  Map,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';

// ─── Types ──────────────────────────────────────────────────────────────────
type Severity = 'Critical' | 'High' | 'Medium' | 'Low';
type IncidentStatus = 'Reported' | 'Verified' | 'Dispatched' | 'Responding' | 'Resolved';
type IncidentCategory = 'All' | 'Accident' | 'Flooding' | 'Fire' | 'Crime' | 'Medical';

interface Incident {
  id: number;
  title: string;
  category: IncidentCategory;
  location: string;
  barangay: string;
  severity: Severity;
  status: IncidentStatus;
  timeReported: string;
  description: string;
  respondingUnits: string[];
  coordinates: string;
  timeline: { time: string; event: string }[];
}

// ─── Inline Data ────────────────────────────────────────────────────────────
const incidents: Incident[] = [
  {
    id: 1,
    title: 'Vehicular Accident - National Highway Alawihao',
    category: 'Accident',
    location: 'National Highway, near Alawihao Bridge',
    barangay: 'Alawihao',
    severity: 'Critical',
    status: 'Responding',
    timeReported: '10:23 AM',
    description: 'Multi-vehicle collision involving a truck and two motorcycles. At least 3 persons injured. Road partially blocked.',
    respondingUnits: ['MDRRMO Rescue Team 1', 'PNP Mobile Patrol 3', 'BFP Emergency Unit'],
    coordinates: '14.1121° N, 122.9553° E',
    timeline: [
      { time: '10:23 AM', event: 'Incident reported via hotline' },
      { time: '10:25 AM', event: 'Verified by Brgy. Alawihao officials' },
      { time: '10:28 AM', event: 'MDRRMO and PNP dispatched' },
      { time: '10:35 AM', event: 'Units arriving on scene' },
    ],
  },
  {
    id: 2,
    title: 'Fire Alarm - Commercial Area Daet Proper',
    category: 'Fire',
    location: 'J. Lukban St., Commercial District',
    barangay: 'Lag-on',
    severity: 'Critical',
    status: 'Dispatched',
    timeReported: '10:15 AM',
    description: 'Smoke detected from a two-storey commercial building. Fire origin suspected at ground floor storage area.',
    respondingUnits: ['BFP Truck 1', 'BFP Truck 2', 'MDRRMO Support Team'],
    coordinates: '14.1142° N, 122.9568° E',
    timeline: [
      { time: '10:15 AM', event: 'Smoke reported by nearby vendor' },
      { time: '10:17 AM', event: 'BFP notified and dispatched' },
      { time: '10:20 AM', event: 'MDRRMO backup requested' },
    ],
  },
  {
    id: 3,
    title: 'Flooding Report - Calasgasan Riverside',
    category: 'Flooding',
    location: 'Riverside Area, near Calasgasan Bridge',
    barangay: 'Calasgasan',
    severity: 'High',
    status: 'Dispatched',
    timeReported: '09:45 AM',
    description: 'Water level rising rapidly due to continuous rain. Several households in low-lying areas at risk. Preemptive evacuation recommended.',
    respondingUnits: ['MDRRMO Flood Response Team', 'Brgy. Calasgasan Tanod'],
    coordinates: '14.1098° N, 122.9601° E',
    timeline: [
      { time: '09:45 AM', event: 'Barangay officials reported rising water' },
      { time: '09:50 AM', event: 'MDRRMO dispatched flood response team' },
      { time: '10:00 AM', event: 'Evacuation advisory issued' },
    ],
  },
  {
    id: 4,
    title: 'Medical Emergency - Brgy. Health Center Borabod',
    category: 'Medical',
    location: 'Borabod Health Center',
    barangay: 'Borabod',
    severity: 'High',
    status: 'Resolved',
    timeReported: '09:12 AM',
    description: 'Elderly patient (72 y/o) experiencing chest pains and difficulty breathing. Required immediate ambulance transport to hospital.',
    respondingUnits: ['MHO Ambulance 1', 'Brgy. Health Worker'],
    coordinates: '14.1155° N, 122.9530° E',
    timeline: [
      { time: '09:12 AM', event: 'Emergency call received' },
      { time: '09:15 AM', event: 'Ambulance dispatched' },
      { time: '09:22 AM', event: 'Patient stabilized on site' },
      { time: '09:35 AM', event: 'Patient transported to hospital' },
      { time: '09:40 AM', event: 'Incident resolved' },
    ],
  },
  {
    id: 5,
    title: 'Crime Report - Theft at Bagasbas Area',
    category: 'Crime',
    location: 'Bagasbas Beach Road, near resort area',
    barangay: 'Bagasbas',
    severity: 'Medium',
    status: 'Verified',
    timeReported: '08:55 AM',
    description: 'Tourist reported stolen personal belongings from parked vehicle. Suspect seen fleeing on motorcycle heading toward town proper.',
    respondingUnits: ['PNP Mobile Patrol 1'],
    coordinates: '14.1280° N, 122.9475° E',
    timeline: [
      { time: '08:55 AM', event: 'Victim reported to Brgy. Bagasbas' },
      { time: '09:00 AM', event: 'PNP notified and verified report' },
    ],
  },
  {
    id: 6,
    title: 'Flooding - Low-lying Area Gahonon',
    category: 'Flooding',
    location: 'Gahonon Creek overflow zone',
    barangay: 'Gahonon',
    severity: 'Medium',
    status: 'Verified',
    timeReported: '08:30 AM',
    description: 'Minor flooding reported in rice paddies and adjacent residential area. Water level at 0.5m and steady.',
    respondingUnits: ['MDRRMO Monitoring Team'],
    coordinates: '14.1050° N, 122.9620° E',
    timeline: [
      { time: '08:30 AM', event: 'Reported by Brgy. Gahonon captain' },
      { time: '08:45 AM', event: 'MDRRMO verified via field team' },
    ],
  },
  {
    id: 7,
    title: 'Medical - Motorcycle Injury Pamorangon',
    category: 'Medical',
    location: 'Pamorangon interior road',
    barangay: 'Pamorangon',
    severity: 'Low',
    status: 'Resolved',
    timeReported: '07:48 AM',
    description: 'Minor motorcycle fall. Rider sustained abrasions on arms and legs. Treated at barangay health station.',
    respondingUnits: ['Brgy. Health Worker'],
    coordinates: '14.0985° N, 122.9510° E',
    timeline: [
      { time: '07:48 AM', event: 'Reported by bystander' },
      { time: '07:55 AM', event: 'Brgy. health worker responded' },
      { time: '08:10 AM', event: 'Patient treated and released' },
    ],
  },
  {
    id: 8,
    title: 'Accident - Fallen Tree Mancruz Road',
    category: 'Accident',
    location: 'Mancruz-Basud Road, KM 3',
    barangay: 'Mancruz',
    severity: 'Low',
    status: 'Dispatched',
    timeReported: '07:15 AM',
    description: 'Large tree fell across road due to strong winds. No injuries reported. Road impassable for vehicles.',
    respondingUnits: ['MDRRMO Clearing Team', 'Brgy. Mancruz Volunteers'],
    coordinates: '14.0920° N, 122.9480° E',
    timeline: [
      { time: '07:15 AM', event: 'Motorist reported blocked road' },
      { time: '07:25 AM', event: 'MDRRMO clearing team dispatched' },
    ],
  },
  {
    id: 9,
    title: 'Fire - Grass Fire Near Residences San Isidro',
    category: 'Fire',
    location: 'San Isidro vacant lot, near subdivision',
    barangay: 'San Isidro',
    severity: 'Medium',
    status: 'Responding',
    timeReported: '10:40 AM',
    description: 'Grass fire spreading toward residential area. Wind pushing flames eastward. BFP en route.',
    respondingUnits: ['BFP Truck 3', 'Brgy. San Isidro Volunteers'],
    coordinates: '14.1200° N, 122.9490° E',
    timeline: [
      { time: '10:40 AM', event: 'Resident called emergency hotline' },
      { time: '10:42 AM', event: 'BFP dispatched' },
    ],
  },
];

const responseTimeByCategory = [
  { category: 'Accident', time: 7.2 },
  { category: 'Flooding', time: 12.5 },
  { category: 'Fire', time: 5.8 },
  { category: 'Crime', time: 15.3 },
  { category: 'Medical', time: 6.1 },
];

const responseTimeTrend = [
  { day: 'Mon', time: 9.2 },
  { day: 'Tue', time: 8.1 },
  { day: 'Wed', time: 7.5 },
  { day: 'Thu', time: 10.3 },
  { day: 'Fri', time: 8.8 },
  { day: 'Sat', time: 6.9 },
  { day: 'Sun', time: 8.5 },
];

const barangays = [
  'Alawihao', 'Awitan', 'Bagasbas', 'Bibirao', 'Borabod',
  'Calasgasan', 'Camambugan', 'Cobangbang', 'Daet Proper',
  'Gahonon', 'Lag-on', 'Mancruz', 'Pamorangon', 'San Isidro',
];

const agencies = [
  {
    name: 'MDRRMO',
    fullName: 'Municipal Disaster Risk Reduction & Management Office',
    status: 'Active' as const,
    detail: '12 personnel on duty',
    contact: '(054) 721-1234',
    icon: Siren,
  },
  {
    name: 'PNP Daet',
    fullName: 'Philippine National Police - Daet Station',
    status: 'Active' as const,
    detail: '8 officers deployed',
    contact: '(054) 721-5678',
    icon: Shield,
  },
  {
    name: 'BFP Daet',
    fullName: 'Bureau of Fire Protection - Daet Station',
    status: 'Active' as const,
    detail: '3 trucks available',
    contact: '(054) 721-9012',
    icon: Flame,
  },
  {
    name: 'Barangay Officials',
    fullName: 'Barangay Emergency Network',
    status: 'Standby' as const,
    detail: 'Alawihao, Calasgasan, Lag-on notified',
    contact: 'Radio Channel 5',
    icon: Building2,
  },
  {
    name: 'MHO',
    fullName: 'Municipal Health Office',
    status: 'Active' as const,
    detail: '2 ambulances available',
    contact: '(054) 721-3456',
    icon: Heart,
  },
];

const emergencyContacts = [
  { label: 'Emergency Hotline', number: '911', icon: Phone, color: 'bg-red-600' },
  { label: 'PNP Daet', number: '(054) 721-5678', icon: Shield, color: 'bg-blue-600' },
  { label: 'BFP Daet', number: '(054) 721-9012', icon: Flame, color: 'bg-orange-600' },
  { label: 'Medical / MHO', number: '(054) 721-3456', icon: Heart, color: 'bg-emerald-600' },
  { label: 'MDRRMO', number: '(054) 721-1234', icon: Siren, color: 'bg-amber-600' },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
const severityColor: Record<Severity, string> = {
  Critical: 'bg-red-600 text-white',
  High: 'bg-orange-500 text-white',
  Medium: 'bg-yellow-500 text-gray-900',
  Low: 'bg-blue-500 text-white',
};

const severityBorder: Record<Severity, string> = {
  Critical: 'border-l-red-600',
  High: 'border-l-orange-500',
  Medium: 'border-l-yellow-500',
  Low: 'border-l-blue-500',
};

const statusColor: Record<IncidentStatus, string> = {
  Reported: 'text-gray-400',
  Verified: 'text-blue-400',
  Dispatched: 'text-amber-400',
  Responding: 'text-orange-400',
  Resolved: 'text-emerald-400',
};

const categoryIcon: Record<string, typeof AlertTriangle> = {
  Accident: Car,
  Flooding: Droplets,
  Fire: Flame,
  Crime: Shield,
  Medical: Heart,
};

const statusSteps: IncidentStatus[] = ['Reported', 'Verified', 'Dispatched', 'Resolved'];

// ─── Component ──────────────────────────────────────────────────────────────
export default function EmergencyPage() {
  const [activeCategory, setActiveCategory] = useState<IncidentCategory>('All');
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  // Report form state
  const [formType, setFormType] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formBarangay, setFormBarangay] = useState('');
  const [formSeverity, setFormSeverity] = useState<Severity>('Medium');
  const [formDescription, setFormDescription] = useState('');
  const [formName, setFormName] = useState('');
  const [formContact, setFormContact] = useState('');

  const filteredIncidents =
    activeCategory === 'All'
      ? incidents
      : incidents.filter((i) => i.category === activeCategory);

  const categories: IncidentCategory[] = ['All', 'Accident', 'Flooding', 'Fire', 'Crime', 'Medical'];

  const handleSubmitReport = () => {
    alert('Emergency report submitted successfully! Incident ID: #INC-2026-0010');
    setShowReportModal(false);
    setFormType('');
    setFormLocation('');
    setFormBarangay('');
    setFormSeverity('Medium');
    setFormDescription('');
    setFormName('');
    setFormContact('');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-red-900/40 bg-gray-950/95 backdrop-blur">
        <div className="mx-auto max-w-[1600px] px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span>SMART LGU ERP</span>
            <ChevronRight className="w-3 h-3" />
            <span>Public Safety</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-red-400 font-medium">Emergency Response</span>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-600/20 rounded-lg">
                <Siren className="w-7 h-7 text-red-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white">
                  Emergency Response Center
                </h1>
                <p className="text-sm text-gray-400">
                  Real-time incident monitoring &amp; dispatch — Municipality of Daet
                </p>
              </div>
              <span className="ml-3 flex items-center gap-1.5 rounded-full bg-red-600/20 px-3 py-1 text-xs font-semibold text-red-400 animate-pulse">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                LIVE
              </span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowReportModal(true)}
                className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/25 transition hover:bg-red-700 active:scale-95 cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4" />
                Report Emergency
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-orange-500/50 bg-orange-500/10 px-5 py-2.5 text-sm font-semibold text-orange-400 transition hover:bg-orange-500/20 active:scale-95 cursor-pointer">
                <Bell className="w-4 h-4" />
                Alert All Units
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1600px] px-6 py-6 space-y-6">
        {/* ── Stats Cards ───────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: 'Active Incidents', value: 7, icon: AlertTriangle, accent: 'red', ring: true },
            { label: 'Resolved Today', value: 12, icon: CheckCircle, accent: 'emerald' },
            { label: 'Avg Response Time', value: '8.5 min', icon: Clock, accent: 'amber' },
            { label: 'Units Deployed', value: 5, icon: Truck, accent: 'blue' },
            { label: 'Pending Verification', value: 3, icon: Eye, accent: 'orange' },
          ].map((s) => {
            const isRed = s.accent === 'red';
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl p-5 ${
                  isRed
                    ? 'bg-red-600/20 border border-red-600/40 ring-2 ring-red-600/30'
                    : 'bg-gray-900 border border-gray-800'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <s.icon className={`w-5 h-5 ${isRed ? 'text-red-400' : `text-${s.accent}-400`}`}
                    style={{ color: isRed ? undefined : s.accent === 'emerald' ? '#34d399' : s.accent === 'amber' ? '#fbbf24' : s.accent === 'blue' ? '#60a5fa' : '#fb923c' }}
                  />
                  {isRed && (
                    <span className="h-3 w-3 rounded-full bg-red-500 animate-pulse" />
                  )}
                </div>
                <p className={`text-3xl font-extrabold ${isRed ? 'text-red-400' : 'text-white'}`}>
                  {s.value}
                </p>
                <p className="text-xs text-gray-400 mt-1">{s.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* ── Category Tabs ─────────────────────────────────────────── */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => {
            const Icon = cat === 'All' ? Activity : categoryIcon[cat];
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                    : 'bg-gray-900 text-gray-400 border border-gray-800 hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat}
              </button>
            );
          })}
          <span className="ml-auto text-xs text-gray-500">
            {filteredIncidents.length} incident{filteredIncidents.length !== 1 && 's'}
          </span>
        </div>

        {/* ── Main Grid: Incidents + Agency Panel ──────────────────── */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Live Incident Feed */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Radio className="w-5 h-5 text-red-500" />
              Live Incident Feed
            </h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 custom-scroll">
              <AnimatePresence>
                {filteredIncidents.map((inc) => {
                  const Icon = categoryIcon[inc.category] ?? AlertTriangle;
                  return (
                    <motion.div
                      key={inc.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      onClick={() => setSelectedIncident(inc)}
                      className={`rounded-xl border-l-4 ${severityBorder[inc.severity]} bg-gray-900 border border-gray-800 p-4 cursor-pointer transition hover:bg-gray-800/80 hover:shadow-lg`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 rounded-lg p-2 ${
                            inc.severity === 'Critical' ? 'bg-red-600/20' : inc.severity === 'High' ? 'bg-orange-500/20' : inc.severity === 'Medium' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              inc.severity === 'Critical' ? 'text-red-400' : inc.severity === 'High' ? 'text-orange-400' : inc.severity === 'Medium' ? 'text-yellow-400' : 'text-blue-400'
                            }`} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white text-sm leading-snug">
                              {inc.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {inc.location}
                              </span>
                              <span className="flex items-center gap-1">
                                <Building2 className="w-3 h-3" />
                                Brgy. {inc.barangay}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {inc.timeReported}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${severityColor[inc.severity]}`}>
                            {inc.severity}
                          </span>
                          <span className={`text-xs font-medium ${statusColor[inc.status]}`}>
                            ● {inc.status}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Agency Notification Panel */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-400" />
              Agency Status Panel
            </h2>
            <div className="space-y-3">
              {agencies.map((a) => (
                <div
                  key={a.name}
                  className="rounded-xl bg-gray-900 border border-gray-800 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <a.icon className="w-4 h-4 text-gray-300" />
                      <span className="font-semibold text-sm text-white">{a.name}</span>
                    </div>
                    <span
                      className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                        a.status === 'Active'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-gray-700/50 text-gray-500'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          a.status === 'Active' ? 'bg-emerald-400' : 'bg-gray-500'
                        }`}
                      />
                      {a.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">{a.fullName}</p>
                  <p className="text-xs text-gray-300">{a.detail}</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {a.contact}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Response Time Analytics ───────────────────────────────── */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
            <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-orange-400" />
              Average Response Time by Category
            </h3>
            <p className="text-xs text-gray-500 mb-4">In minutes — lower is better</p>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={responseTimeByCategory} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="category" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} unit=" min" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8, color: '#fff' }}
                  cursor={{ fill: 'rgba(239,68,68,0.08)' }}
                />
                <Bar dataKey="time" name="Avg Time (min)" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
            <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" />
              Response Time Trend (Past 7 Days)
            </h3>
            <p className="text-xs text-gray-500 mb-4">Daily average in minutes</p>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={responseTimeTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} unit=" min" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: 8, color: '#fff' }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="time"
                  name="Response Time (min)"
                  stroke="#f97316"
                  strokeWidth={3}
                  dot={{ fill: '#f97316', r: 5 }}
                  activeDot={{ r: 7, fill: '#fb923c' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Incident Heatmap Placeholder ──────────────────────────── */}
        <div className="rounded-xl bg-gray-900 border border-gray-800 p-6">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Map className="w-4 h-4 text-red-400" />
            Incident Heatmap — Daet Municipality
          </h3>
          <div className="relative rounded-xl bg-gray-950 border border-gray-800 h-72 overflow-hidden flex items-center justify-center">
            {/* Stylized heat zones */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-[20%] left-[35%] w-28 h-28 rounded-full bg-red-600 blur-3xl" />
              <div className="absolute top-[45%] left-[55%] w-24 h-24 rounded-full bg-orange-500 blur-3xl" />
              <div className="absolute top-[60%] left-[25%] w-20 h-20 rounded-full bg-yellow-500 blur-3xl" />
              <div className="absolute top-[30%] left-[70%] w-16 h-16 rounded-full bg-red-500 blur-3xl" />
              <div className="absolute top-[70%] left-[65%] w-14 h-14 rounded-full bg-blue-500 blur-3xl" />
            </div>
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />
            <div className="relative text-center z-10">
              <MapPin className="w-10 h-10 text-red-500/60 mx-auto mb-2" />
              <p className="text-gray-400 text-sm font-medium">Interactive Heatmap</p>
              <p className="text-gray-600 text-xs mt-1">14.1121° N, 122.9553° E — Daet, Camarines Norte</p>
            </div>
            {/* Legend */}
            <div className="absolute bottom-4 right-4 flex items-center gap-3 bg-gray-900/80 rounded-lg px-4 py-2 border border-gray-700">
              <span className="text-[10px] text-gray-400 font-medium mr-1">Density:</span>
              {[
                { color: 'bg-blue-500', label: 'Low' },
                { color: 'bg-yellow-500', label: 'Med' },
                { color: 'bg-orange-500', label: 'High' },
                { color: 'bg-red-600', label: 'Critical' },
              ].map((l) => (
                <span key={l.label} className="flex items-center gap-1 text-[10px] text-gray-400">
                  <span className={`h-2.5 w-2.5 rounded-sm ${l.color}`} />
                  {l.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Emergency Contacts Quick Access ───────────────────────── */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Phone className="w-4 h-4 text-red-400" />
            Emergency Contacts — Quick Access
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {emergencyContacts.map((c) => (
              <div
                key={c.label}
                className={`rounded-xl ${c.color} p-4 text-white transition hover:scale-[1.03] active:scale-95 cursor-pointer shadow-lg`}
              >
                <c.icon className="w-6 h-6 mb-3 opacity-90" />
                <p className="text-sm font-bold">{c.label}</p>
                <p className="text-lg font-extrabold mt-1">{c.number}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════════════
          REPORT EMERGENCY MODAL
         ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setShowReportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-gray-900 border border-red-800/40 shadow-2xl shadow-red-900/20"
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between bg-red-600 px-6 py-4 rounded-t-2xl">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-white" />
                  <h2 className="text-lg font-bold text-white">Report Emergency</h2>
                </div>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="rounded-lg p-1 text-white/80 hover:bg-white/20 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5">
                {/* Incident Type */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Incident Type *</label>
                  <div className="relative">
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                    >
                      <option value="">Select incident type...</option>
                      <option value="Accident">Accident</option>
                      <option value="Flooding">Flooding</option>
                      <option value="Fire">Fire</option>
                      <option value="Crime">Crime</option>
                      <option value="Medical">Medical Emergency</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Location *</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="Street, landmark, or address"
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                  />
                </div>

                {/* Barangay */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Barangay *</label>
                  <div className="relative">
                    <select
                      value={formBarangay}
                      onChange={(e) => setFormBarangay(e.target.value)}
                      className="w-full appearance-none rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                    >
                      <option value="">Select barangay...</option>
                      {barangays.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Severity */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-2">Severity Level *</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['Critical', 'High', 'Medium', 'Low'] as Severity[]).map((sev) => (
                      <button
                        key={sev}
                        type="button"
                        onClick={() => setFormSeverity(sev)}
                        className={`rounded-lg py-2 text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                          formSeverity === sev
                            ? severityColor[sev] + ' ring-2 ring-offset-2 ring-offset-gray-900 ring-white/30 scale-105'
                            : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700'
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Description</label>
                  <textarea
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    rows={3}
                    placeholder="Describe the emergency situation..."
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none resize-none"
                  />
                </div>

                {/* Photo Upload Placeholder */}
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Photo Evidence</label>
                  <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-gray-700 bg-gray-800/50 py-8 cursor-pointer hover:border-red-500/50 transition">
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Click or drag photos here</p>
                      <p className="text-[10px] text-gray-600 mt-1">JPG, PNG up to 10MB</p>
                    </div>
                  </div>
                </div>

                {/* Reporter Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Reporter Name</label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Full name"
                      className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1.5">Contact Number</label>
                    <input
                      type="text"
                      value={formContact}
                      onChange={(e) => setFormContact(e.target.value)}
                      placeholder="09XX-XXX-XXXX"
                      className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmitReport}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-bold text-white shadow-lg shadow-red-600/30 hover:bg-red-700 transition active:scale-[0.98] cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Submit Emergency Report
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════
          INCIDENT DETAIL MODAL
         ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {selectedIncident && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setSelectedIncident(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-gray-900 border border-gray-700 shadow-2xl"
            >
              {(() => {
                const inc = selectedIncident;
                const Icon = categoryIcon[inc.category] ?? AlertTriangle;
                const currentStepIdx = statusSteps.indexOf(
                  statusSteps.find((s) =>
                    inc.status === 'Responding' ? s === 'Dispatched' : s === inc.status
                  ) ?? 'Reported'
                );

                return (
                  <>
                    {/* Header */}
                    <div className={`flex items-center justify-between px-6 py-4 rounded-t-2xl ${
                      inc.severity === 'Critical' ? 'bg-red-600' : inc.severity === 'High' ? 'bg-orange-600' : inc.severity === 'Medium' ? 'bg-yellow-600' : 'bg-blue-600'
                    }`}>
                      <div className="flex items-center gap-3">
                        <Icon className="w-6 h-6 text-white" />
                        <div>
                          <h2 className="text-lg font-bold text-white leading-snug">{inc.title}</h2>
                          <p className="text-xs text-white/70">INC-2026-{String(inc.id).padStart(4, '0')}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedIncident(null)}
                        className="rounded-lg p-1 text-white/80 hover:bg-white/20 transition cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Status & Severity */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${severityColor[inc.severity]}`}>
                          {inc.severity}
                        </span>
                        <span className={`text-sm font-semibold ${statusColor[inc.status]}`}>● {inc.status}</span>
                        <span className="text-xs text-gray-500 ml-auto">Reported: {inc.timeReported}</span>
                      </div>

                      {/* Status Flow */}
                      <div>
                        <p className="text-xs font-semibold text-gray-400 mb-3">Status Flow</p>
                        <div className="flex items-center gap-0">
                          {statusSteps.map((step, idx) => {
                            const passed = idx <= currentStepIdx;
                            const isCurrent = idx === currentStepIdx;
                            return (
                              <div key={step} className="flex items-center flex-1">
                                <div className="flex flex-col items-center flex-1">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                                      passed
                                        ? isCurrent
                                          ? 'bg-red-600 text-white ring-4 ring-red-600/30'
                                          : 'bg-emerald-600 text-white'
                                        : 'bg-gray-800 text-gray-600 border border-gray-700'
                                    }`}
                                  >
                                    {passed && !isCurrent ? (
                                      <CheckCircle className="w-4 h-4" />
                                    ) : (
                                      idx + 1
                                    )}
                                  </div>
                                  <span className={`text-[10px] mt-1.5 font-medium ${passed ? 'text-gray-200' : 'text-gray-600'}`}>
                                    {step}
                                  </span>
                                </div>
                                {idx < statusSteps.length - 1 && (
                                  <div className={`h-0.5 flex-1 -mt-4 ${idx < currentStepIdx ? 'bg-emerald-600' : 'bg-gray-800'}`} />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="rounded-lg bg-gray-800/60 border border-gray-800 p-3">
                          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Location</p>
                          <p className="text-sm text-white">{inc.location}</p>
                          <p className="text-xs text-gray-400">Brgy. {inc.barangay}</p>
                        </div>
                        <div className="rounded-lg bg-gray-800/60 border border-gray-800 p-3">
                          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Category</p>
                          <p className="text-sm text-white flex items-center gap-1.5">
                            <Icon className="w-4 h-4 text-gray-400" />
                            {inc.category}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <p className="text-xs font-semibold text-gray-400 mb-1.5">Description</p>
                        <p className="text-sm text-gray-300 leading-relaxed">{inc.description}</p>
                      </div>

                      {/* Responding Units */}
                      <div>
                        <p className="text-xs font-semibold text-gray-400 mb-2">Responding Units</p>
                        <div className="flex flex-wrap gap-2">
                          {inc.respondingUnits.map((u) => (
                            <span key={u} className="inline-flex items-center gap-1.5 rounded-full bg-gray-800 border border-gray-700 px-3 py-1 text-xs text-gray-300">
                              <Truck className="w-3 h-3 text-orange-400" />
                              {u}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Response Timeline */}
                      <div>
                        <p className="text-xs font-semibold text-gray-400 mb-3">Response Timeline</p>
                        <div className="relative pl-5 space-y-3">
                          <div className="absolute left-[7px] top-1 bottom-1 w-0.5 bg-gray-800" />
                          {inc.timeline.map((t, idx) => (
                            <div key={idx} className="relative flex items-start gap-3">
                              <div className={`absolute -left-5 top-0.5 w-3.5 h-3.5 rounded-full border-2 ${
                                idx === inc.timeline.length - 1 ? 'border-red-500 bg-red-500/30' : 'border-emerald-500 bg-emerald-500/30'
                              }`} />
                              <div>
                                <span className="text-[10px] font-bold text-gray-500">{t.time}</span>
                                <p className="text-xs text-gray-300">{t.event}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Map Placeholder */}
                      <div>
                        <p className="text-xs font-semibold text-gray-400 mb-2">Location Map</p>
                        <div className="rounded-lg bg-gray-950 border border-gray-800 h-40 flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 opacity-10"
                            style={{
                              backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
                              backgroundSize: '30px 30px',
                            }}
                          />
                          <div className="relative text-center">
                            <MapPin className="w-8 h-8 text-red-500 mx-auto mb-1" />
                            <p className="text-xs text-gray-500">{inc.coordinates}</p>
                            <p className="text-[10px] text-gray-600 mt-0.5">Brgy. {inc.barangay}, Daet, Camarines Norte</p>
                          </div>
                        </div>
                      </div>

                      {/* Photos Placeholder */}
                      <div>
                        <p className="text-xs font-semibold text-gray-400 mb-2">Photos / Evidence</p>
                        <div className="grid grid-cols-3 gap-2">
                          {[1, 2, 3].map((n) => (
                            <div key={n} className="rounded-lg bg-gray-800 border border-gray-700 h-24 flex items-center justify-center">
                              <FileText className="w-6 h-6 text-gray-700" />
                            </div>
                          ))}
                        </div>
                        <p className="text-[10px] text-gray-600 mt-1.5">No photos uploaded yet</p>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
