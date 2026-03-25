import { useState } from 'react';
import {
  Building2, HardHat, CheckCircle2, AlertTriangle, Banknote,
  Search, Filter, Plus, FileText, MapPin, Calendar, Phone,
  Star, Camera, Clock, ChevronRight, X, TrendingUp, Users,
  ArrowUpRight, ArrowDownRight, Activity, Eye, Home
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';

// ─── Types ───────────────────────────────────────────────────────────
interface Milestone {
  label: string;
  date: string;
  done: boolean;
}

interface StatusUpdate {
  date: string;
  text: string;
  author: string;
}

interface Project {
  id: number;
  name: string;
  type: 'Road' | 'Drainage' | 'Building' | 'Bridge' | 'Infrastructure';
  status: 'Planning' | 'Ongoing' | 'Delayed' | 'Completed';
  progress: number;
  budget: number;
  spent: number;
  contractor: string;
  contractorContact: string;
  contractorRating: number;
  barangay: string;
  startDate: string;
  endDate: string;
  description: string;
  milestones: Milestone[];
  statusUpdates: StatusUpdate[];
  daysDelayed?: number;
  delayReason?: string;
}

// ─── Hardcoded Data ──────────────────────────────────────────────────
const PROJECTS: Project[] = [
  {
    id: 1,
    name: 'Daet-Paracale Road Improvement',
    type: 'Road',
    status: 'Ongoing',
    progress: 65,
    budget: 45_000_000,
    spent: 29_250_000,
    contractor: 'JMV Construction Corp.',
    contractorContact: '+63 917 234 5678',
    contractorRating: 4.5,
    barangay: 'Lag-on',
    startDate: '2025-06-01',
    endDate: '2026-06-30',
    description:
      'Rehabilitation and widening of the Daet-Paracale provincial road spanning 4.2 km. Includes drainage, sidewalks, and road markings.',
    milestones: [
      { label: 'Groundbreaking', date: '2025-06-15', done: true },
      { label: 'Subgrade complete', date: '2025-09-30', done: true },
      { label: 'Base course laid', date: '2025-12-31', done: true },
      { label: 'Asphalt overlay', date: '2026-03-31', done: false },
      { label: 'Final inspection', date: '2026-06-30', done: false },
    ],
    statusUpdates: [
      { date: '2026-03-10', text: 'Asphalt delivery on schedule for April.', author: 'Engr. Reyes' },
      { date: '2026-02-18', text: 'Base course completed ahead of schedule on sections 1-3.', author: 'Engr. Santos' },
    ],
  },
  {
    id: 2,
    name: 'Bagasbas Seawall Construction',
    type: 'Infrastructure',
    status: 'Ongoing',
    progress: 40,
    budget: 28_000_000,
    spent: 11_200_000,
    contractor: 'Pacific Builders Inc.',
    contractorContact: '+63 918 345 6789',
    contractorRating: 4.2,
    barangay: 'Bagasbas',
    startDate: '2025-08-01',
    endDate: '2026-08-31',
    description:
      'Construction of a 1.2 km seawall along the Bagasbas coastline to protect against storm surges and coastal erosion.',
    milestones: [
      { label: 'Foundation piling', date: '2025-10-15', done: true },
      { label: '50% wall erected', date: '2026-02-28', done: false },
      { label: 'Completion', date: '2026-08-31', done: false },
    ],
    statusUpdates: [
      { date: '2026-03-05', text: 'Piling works at 85%. Minor weather delays last week.', author: 'Engr. Villanueva' },
    ],
  },
  {
    id: 3,
    name: 'Municipal Hall Renovation Phase 2',
    type: 'Building',
    status: 'Delayed',
    progress: 30,
    budget: 15_000_000,
    spent: 6_000_000,
    contractor: 'Camarines Builders Co.',
    contractorContact: '+63 920 456 7890',
    contractorRating: 3.1,
    barangay: 'Poblacion',
    startDate: '2025-04-01',
    endDate: '2026-01-31',
    description:
      'Phase 2 renovation of the Municipal Hall including structural reinforcement, elevator installation, and facade improvement.',
    milestones: [
      { label: 'Demolition phase', date: '2025-06-30', done: true },
      { label: 'Structural work', date: '2025-10-31', done: false },
      { label: 'Interior finishing', date: '2025-12-31', done: false },
      { label: 'Turnover', date: '2026-01-31', done: false },
    ],
    statusUpdates: [
      { date: '2026-03-15', text: 'Structural steel delivery delayed due to supplier issues.', author: 'Engr. Cruz' },
      { date: '2026-02-20', text: 'Requesting timeline extension of 90 days.', author: 'Engr. Cruz' },
    ],
    daysDelayed: 52,
    delayReason: 'Structural steel supply chain disruption; contractor workforce shortage.',
  },
  {
    id: 4,
    name: 'Borabod Drainage System',
    type: 'Drainage',
    status: 'Ongoing',
    progress: 80,
    budget: 8_000_000,
    spent: 6_400_000,
    contractor: 'Greenfield Infra Corp.',
    contractorContact: '+63 921 567 8901',
    contractorRating: 4.7,
    barangay: 'Borabod',
    startDate: '2025-05-15',
    endDate: '2026-04-15',
    description:
      'Installation of a comprehensive drainage network in Borabod to mitigate recurring flooding during typhoon season.',
    milestones: [
      { label: 'Excavation', date: '2025-07-30', done: true },
      { label: 'Pipe laying', date: '2025-11-30', done: true },
      { label: 'Backfill & grading', date: '2026-02-28', done: true },
      { label: 'Final testing', date: '2026-04-15', done: false },
    ],
    statusUpdates: [
      { date: '2026-03-12', text: 'Backfill complete. Scheduling final flow test for April.', author: 'Engr. Dizon' },
    ],
  },
  {
    id: 5,
    name: 'Calasgasan Bridge Rehabilitation',
    type: 'Bridge',
    status: 'Planning',
    progress: 0,
    budget: 12_000_000,
    spent: 0,
    contractor: 'Bicol Bridge Works Inc.',
    contractorContact: '+63 922 678 9012',
    contractorRating: 4.0,
    barangay: 'Calasgasan',
    startDate: '2026-05-01',
    endDate: '2027-02-28',
    description:
      'Full rehabilitation of the aging Calasgasan bridge including deck replacement, abutment reinforcement, and approach road improvement.',
    milestones: [
      { label: 'Design finalization', date: '2026-04-15', done: false },
      { label: 'Mobilization', date: '2026-05-01', done: false },
      { label: 'Completion', date: '2027-02-28', done: false },
    ],
    statusUpdates: [
      { date: '2026-03-18', text: 'Detailed engineering design under review by DPWH.', author: 'Engr. Mendoza' },
    ],
  },
  {
    id: 6,
    name: 'Alawihao Barangay Hall',
    type: 'Building',
    status: 'Completed',
    progress: 100,
    budget: 5_000_000,
    spent: 4_850_000,
    contractor: 'DNG Construction',
    contractorContact: '+63 923 789 0123',
    contractorRating: 4.3,
    barangay: 'Alawihao',
    startDate: '2025-01-15',
    endDate: '2025-11-30',
    description:
      'Construction of a new two-storey barangay hall with multi-purpose function room, offices, and public service area.',
    milestones: [
      { label: 'Foundation', date: '2025-03-15', done: true },
      { label: 'Structure', date: '2025-06-30', done: true },
      { label: 'Finishing', date: '2025-10-15', done: true },
      { label: 'Turnover', date: '2025-11-30', done: true },
    ],
    statusUpdates: [
      { date: '2025-11-30', text: 'Project completed and turned over to Barangay Alawihao.', author: 'Engr. Reyes' },
    ],
  },
  {
    id: 7,
    name: 'Market Road Concreting',
    type: 'Road',
    status: 'Ongoing',
    progress: 55,
    budget: 18_000_000,
    spent: 9_900_000,
    contractor: 'R.S. Dela Cruz Const.',
    contractorContact: '+63 924 890 1234',
    contractorRating: 3.8,
    barangay: 'Poblacion',
    startDate: '2025-09-01',
    endDate: '2026-07-31',
    description:
      'Concreting of 2.8 km of roads surrounding the Daet public market including pedestrian-friendly sidewalks and loading bays.',
    milestones: [
      { label: 'Earthworks', date: '2025-11-15', done: true },
      { label: '50% concreting', date: '2026-03-15', done: true },
      { label: 'Full concreting', date: '2026-06-15', done: false },
      { label: 'Markings & signage', date: '2026-07-31', done: false },
    ],
    statusUpdates: [
      { date: '2026-03-20', text: 'Section B concreting ongoing. Traffic rerouting in place.', author: 'Engr. Santos' },
    ],
  },
  {
    id: 8,
    name: 'Flood Control - Daet River',
    type: 'Drainage',
    status: 'Ongoing',
    progress: 45,
    budget: 35_000_000,
    spent: 15_750_000,
    contractor: 'Metro Flood Solutions Inc.',
    contractorContact: '+63 925 901 2345',
    contractorRating: 4.4,
    barangay: 'Gahonon',
    startDate: '2025-07-01',
    endDate: '2026-09-30',
    description:
      'Major flood control project along the Daet River involving dredging, embankment construction, and installation of floodgates.',
    milestones: [
      { label: 'Dredging phase 1', date: '2025-10-31', done: true },
      { label: 'Embankment north', date: '2026-02-28', done: true },
      { label: 'Embankment south', date: '2026-06-30', done: false },
      { label: 'Floodgate installation', date: '2026-09-30', done: false },
    ],
    statusUpdates: [
      { date: '2026-03-14', text: 'North embankment 100% done. South embankment mobilization starting.', author: 'Engr. Garcia' },
    ],
  },
  {
    id: 9,
    name: 'San Isidro Farm-to-Market Road',
    type: 'Road',
    status: 'Ongoing',
    progress: 35,
    budget: 22_000_000,
    spent: 7_700_000,
    contractor: 'JMV Construction Corp.',
    contractorContact: '+63 917 234 5678',
    contractorRating: 4.5,
    barangay: 'San Isidro',
    startDate: '2025-10-01',
    endDate: '2026-10-31',
    description:
      'Construction of a 3.5 km farm-to-market road connecting San Isidro agricultural zone to the national highway.',
    milestones: [
      { label: 'Clearing & grubbing', date: '2025-11-30', done: true },
      { label: 'Subgrade', date: '2026-03-31', done: false },
      { label: 'Paving', date: '2026-08-31', done: false },
      { label: 'Completion', date: '2026-10-31', done: false },
    ],
    statusUpdates: [
      { date: '2026-03-08', text: 'Subgrade work ongoing on first 1.2 km stretch.', author: 'Engr. Reyes' },
    ],
  },
  {
    id: 10,
    name: 'Pamorangon Covered Court',
    type: 'Building',
    status: 'Delayed',
    progress: 60,
    budget: 7_000_000,
    spent: 4_900_000,
    contractor: 'Camarines Builders Co.',
    contractorContact: '+63 920 456 7890',
    contractorRating: 3.1,
    barangay: 'Pamorangon',
    startDate: '2025-03-01',
    endDate: '2025-12-31',
    description:
      'Construction of a covered multi-purpose court with seating for 500 and stage facilities for community events.',
    milestones: [
      { label: 'Foundation', date: '2025-05-15', done: true },
      { label: 'Steel structure', date: '2025-08-31', done: true },
      { label: 'Roofing', date: '2025-10-31', done: true },
      { label: 'Finishing & turnover', date: '2025-12-31', done: false },
    ],
    statusUpdates: [
      { date: '2026-03-10', text: 'Flooring material procurement delayed. Contractor citing cash flow issues.', author: 'Engr. Cruz' },
    ],
    daysDelayed: 83,
    delayReason: 'Contractor cash flow issues and material procurement delays.',
  },
  {
    id: 11,
    name: 'Mancruz Streetlight Installation',
    type: 'Infrastructure',
    status: 'Completed',
    progress: 100,
    budget: 3_500_000,
    spent: 3_420_000,
    contractor: 'Greenfield Infra Corp.',
    contractorContact: '+63 921 567 8901',
    contractorRating: 4.7,
    barangay: 'Mancruz',
    startDate: '2025-06-01',
    endDate: '2025-12-15',
    description: 'Installation of 120 solar-powered LED streetlights along the main road of Barangay Mancruz.',
    milestones: [
      { label: 'Pole installation', date: '2025-09-30', done: true },
      { label: 'Wiring & panels', date: '2025-11-15', done: true },
      { label: 'Commissioning', date: '2025-12-15', done: true },
    ],
    statusUpdates: [
      { date: '2025-12-15', text: 'All 120 streetlights operational. Project closed.', author: 'Engr. Dizon' },
    ],
  },
  {
    id: 12,
    name: 'Calaburnay Water System Upgrade',
    type: 'Infrastructure',
    status: 'Completed',
    progress: 100,
    budget: 6_500_000,
    spent: 6_380_000,
    contractor: 'Metro Flood Solutions Inc.',
    contractorContact: '+63 925 901 2345',
    contractorRating: 4.4,
    barangay: 'Calaburnay',
    startDate: '2025-02-01',
    endDate: '2025-10-31',
    description: 'Upgrade of the barangay water distribution system including new storage tank and pipe replacement.',
    milestones: [
      { label: 'Tank construction', date: '2025-05-31', done: true },
      { label: 'Pipe replacement', date: '2025-08-31', done: true },
      { label: 'Testing & turnover', date: '2025-10-31', done: true },
    ],
    statusUpdates: [
      { date: '2025-10-31', text: 'Water system fully operational. Serving 450 households.', author: 'Engr. Garcia' },
    ],
  },
];

const CONTRACTORS = [
  { name: 'JMV Construction Corp.', activeProjects: 2, onTimePercent: 92, qualityRating: 4.5, totalValue: 67_000_000 },
  { name: 'Pacific Builders Inc.', activeProjects: 1, onTimePercent: 85, qualityRating: 4.2, totalValue: 28_000_000 },
  { name: 'Greenfield Infra Corp.', activeProjects: 1, onTimePercent: 98, qualityRating: 4.7, totalValue: 11_500_000 },
  { name: 'Metro Flood Solutions Inc.', activeProjects: 1, onTimePercent: 90, qualityRating: 4.4, totalValue: 41_500_000 },
  { name: 'Camarines Builders Co.', activeProjects: 2, onTimePercent: 58, qualityRating: 3.1, totalValue: 22_000_000 },
  { name: 'DNG Construction', activeProjects: 0, onTimePercent: 95, qualityRating: 4.3, totalValue: 5_000_000 },
  { name: 'R.S. Dela Cruz Const.', activeProjects: 1, onTimePercent: 78, qualityRating: 3.8, totalValue: 18_000_000 },
  { name: 'Bicol Bridge Works Inc.', activeProjects: 1, onTimePercent: 88, qualityRating: 4.0, totalValue: 12_000_000 },
];

const BARANGAYS = [
  'All', 'Alawihao', 'Bagasbas', 'Borabod', 'Calaburnay', 'Calasgasan',
  'Gahonon', 'Lag-on', 'Mancruz', 'Pamorangon', 'Poblacion', 'San Isidro',
];

const TYPE_COLORS: Record<string, string> = {
  Road: 'bg-amber-100 text-amber-800',
  Drainage: 'bg-cyan-100 text-cyan-800',
  Building: 'bg-violet-100 text-violet-800',
  Bridge: 'bg-emerald-100 text-emerald-800',
  Infrastructure: 'bg-blue-100 text-blue-800',
};

const STATUS_COLORS: Record<string, string> = {
  Planning: 'bg-gray-100 text-gray-700',
  Ongoing: 'bg-blue-100 text-blue-700',
  Delayed: 'bg-red-100 text-red-700',
  Completed: 'bg-green-100 text-green-700',
};

const PROGRESS_COLORS: Record<string, string> = {
  Planning: 'bg-gray-400',
  Ongoing: 'bg-blue-500',
  Delayed: 'bg-red-500',
  Completed: 'bg-green-500',
};

const PIE_COLORS = ['#f59e0b', '#06b6d4', '#8b5cf6', '#10b981', '#3b82f6'];

// ─── Helpers ─────────────────────────────────────────────────────────
const fmt = (n: number) =>
  n >= 1_000_000
    ? `₱${(n / 1_000_000).toFixed(1)}M`
    : `₱${(n / 1_000).toFixed(0)}K`;

const fmtFull = (n: number) =>
  '₱' + n.toLocaleString('en-PH');

const stars = (r: number) => {
  const full = Math.floor(r);
  const half = r - full >= 0.3;
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < full
              ? 'fill-amber-400 text-amber-400'
              : i === full && half
                ? 'fill-amber-400/50 text-amber-400'
                : 'text-gray-300'
          }
        />
      ))}
      <span className="ml-1 text-xs text-gray-500">{r.toFixed(1)}</span>
    </span>
  );
};

// ─── Budget chart data ───────────────────────────────────────────────
const budgetChartData = PROJECTS.filter((p) => p.status !== 'Completed').map((p) => ({
  name: p.name.length > 20 ? p.name.slice(0, 18) + '...' : p.name,
  Budget: p.budget / 1_000_000,
  Spent: p.spent / 1_000_000,
}));

const budgetByType = Object.entries(
  PROJECTS.reduce<Record<string, number>>((acc, p) => {
    acc[p.type] = (acc[p.type] || 0) + p.budget;
    return acc;
  }, {})
).map(([name, value]) => ({ name, value: value / 1_000_000 }));

// ─── Component ───────────────────────────────────────────────────────
export default function InfrastructurePage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [barangayFilter, setBarangayFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered = PROJECTS.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.barangay.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter !== 'All' && p.status !== statusFilter) return false;
    if (typeFilter !== 'All' && p.type !== typeFilter) return false;
    if (barangayFilter !== 'All' && p.barangay !== barangayFilter) return false;
    return true;
  });

  const delayedProjects = PROJECTS.filter((p) => p.status === 'Delayed');
  const totalBudget = 285_000_000;
  const totalSpent = PROJECTS.reduce((s, p) => s + p.spent, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center text-sm text-gray-500 mb-3 gap-1">
            <Home size={14} />
            <span>Dashboard</span>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">Infrastructure Project Monitoring</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Building2 className="text-blue-600" size={28} />
                Infrastructure Project Monitoring
              </h1>
              <p className="text-sm text-gray-500 mt-1">Municipality of Daet, Camarines Norte — Real-time project tracking and transparency dashboard</p>
            </div>
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm">
                <Plus size={16} /> Add Project
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm">
                <FileText size={16} /> Generate Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* ── Stats Cards ───────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: 'Total Projects', value: '24', icon: Building2, color: 'blue', sub: '+3 this quarter' },
            { label: 'Ongoing', value: '14', icon: HardHat, color: 'amber', sub: '58% of total' },
            { label: 'Completed', value: '8', icon: CheckCircle2, color: 'green', sub: '33% completion rate' },
            { label: 'Delayed', value: '2', icon: AlertTriangle, color: 'red', sub: 'Needs attention' },
            { label: 'Total Budget', value: '₱285M', icon: Banknote, color: 'violet', sub: '₱142M utilized' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <span className={`p-2 rounded-lg bg-${s.color}-50`}>
                  <s.icon size={20} className={`text-${s.color}-600`} />
                </span>
                {s.color === 'red' ? (
                  <ArrowUpRight size={16} className="text-red-500" />
                ) : s.color === 'green' ? (
                  <ArrowUpRight size={16} className="text-green-500" />
                ) : (
                  <Activity size={16} className="text-gray-400" />
                )}
              </div>
              <p className={`text-2xl font-bold ${s.color === 'red' ? 'text-red-600' : 'text-gray-900'}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              <p className={`text-xs mt-1 ${s.color === 'red' ? 'text-red-500' : 'text-gray-400'}`}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Filter Bar ────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects or barangay..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={16} className="text-gray-400" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                {['All', 'Planning', 'Ongoing', 'Delayed', 'Completed'].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                {['All', 'Road', 'Drainage', 'Building', 'Bridge', 'Infrastructure'].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              <select value={barangayFilter} onChange={(e) => setBarangayFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                {BARANGAYS.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── Project Cards Grid ────────────────────────────────── */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Projects ({filtered.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedProject(p)}
                className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">{p.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <MapPin size={12} /> {p.barangay}
                    </div>
                  </div>
                  <Eye size={16} className="text-gray-300 group-hover:text-blue-400 transition-colors mt-1 flex-shrink-0" />
                </div>

                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${TYPE_COLORS[p.type]}`}>{p.type}</span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${STATUS_COLORS[p.status]}`}>{p.status}</span>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span className="font-medium">{p.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${PROGRESS_COLORS[p.status]}`} style={{ width: `${p.progress}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-semibold text-gray-900">{fmt(p.budget)}</span>
                  <span>{p.contractor}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400 mt-2">
                  <span className="flex items-center gap-1"><Calendar size={11} /> {p.startDate}</span>
                  <span className="flex items-center gap-1"><Calendar size={11} /> {p.endDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Budget Monitoring ─────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Budget vs Actual Spending</h2>
            <p className="text-sm text-gray-500 mb-4">Active projects (in ₱ millions)</p>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={budgetChartData} margin={{ top: 5, right: 20, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-35} textAnchor="end" />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={((v: any) => `₱${Number(v).toFixed(1)}M`) as any} />
                <Legend />
                <Bar dataKey="Budget" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Spent" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <span className="text-blue-700 font-medium">Total Budget Utilization</span>
                <span className="text-blue-900 font-bold">{fmtFull(totalSpent)} of {fmtFull(totalBudget)} (49.8%)</span>
              </div>
              <div className="w-full h-3 bg-blue-200 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '49.8%' }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Budget by Type</h2>
            <p className="text-sm text-gray-500 mb-4">Distribution in ₱ millions</p>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={budgetByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, value }: any) => `${name}: ₱${Number(value).toFixed(0)}M`}
                  labelLine={false}
                >
                  {budgetByType.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={((v: any) => `₱${Number(v).toFixed(1)}M`) as any} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {budgetByType.map((b, i) => (
                <span key={b.name} className="flex items-center gap-1 text-xs text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  {b.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Delayed Projects Alert ────────────────────────────── */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle size={20} className="text-red-500" /> Delayed Projects Alert
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {delayedProjects.map((p) => (
              <div key={p.id} className="bg-red-50 border border-red-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-red-900">{p.name}</h3>
                    <p className="text-sm text-red-700 mt-1 flex items-center gap-1"><MapPin size={13} /> {p.barangay}</p>
                  </div>
                  <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                    {p.daysDelayed} days late
                  </span>
                </div>
                <div className="mt-3 p-3 bg-white/70 rounded-lg border border-red-100">
                  <p className="text-xs text-red-800 font-medium mb-1">Delay Reason:</p>
                  <p className="text-sm text-red-700">{p.delayReason}</p>
                </div>
                <div className="flex items-center justify-between mt-3 text-xs text-red-600">
                  <span>Contractor: <span className="font-semibold">{p.contractor}</span></span>
                  <span>Progress: <span className="font-bold">{p.progress}%</span></span>
                </div>
                <div className="mt-3">
                  <div className="w-full h-2 bg-red-200 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${p.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Contractor Performance ────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users size={20} className="text-blue-500" /> Contractor Performance
            </h2>
            <p className="text-sm text-gray-500 mt-1">Performance metrics for registered contractors</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Contractor</th>
                  <th className="px-6 py-3">Active Projects</th>
                  <th className="px-6 py-3">On-Time %</th>
                  <th className="px-6 py-3">Quality Rating</th>
                  <th className="px-6 py-3 text-right">Total Contract Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {CONTRACTORS.map((c) => (
                  <tr key={c.name} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{c.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.activeProjects > 0 ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                        {c.activeProjects}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${c.onTimePercent >= 90 ? 'bg-green-500' : c.onTimePercent >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${c.onTimePercent}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${c.onTimePercent >= 90 ? 'text-green-700' : c.onTimePercent >= 75 ? 'text-amber-700' : 'text-red-700'}`}>
                          {c.onTimePercent}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{stars(c.qualityRating)}</td>
                    <td className="px-6 py-4 text-right font-medium text-gray-900">{fmtFull(c.totalValue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Completion Timeline (Gantt-like) ──────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-500" /> Project Completion Timeline
          </h2>
          <p className="text-sm text-gray-500 mb-6">Gantt view of project durations (2025-01 to 2027-03)</p>

          {/* Timeline axis */}
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Quarter labels */}
              <div className="flex mb-2 ml-[220px]">
                {['Q1 25', 'Q2 25', 'Q3 25', 'Q4 25', 'Q1 26', 'Q2 26', 'Q3 26', 'Q4 26', 'Q1 27'].map((q) => (
                  <div key={q} className="flex-1 text-xs text-gray-400 text-center border-l border-gray-100 first:border-l-0">
                    {q}
                  </div>
                ))}
              </div>

              {/* Bars */}
              <div className="space-y-2">
                {PROJECTS.map((p) => {
                  const tStart = new Date('2025-01-01').getTime();
                  const tEnd = new Date('2027-03-31').getTime();
                  const range = tEnd - tStart;
                  const pStart = new Date(p.startDate).getTime();
                  const pEnd = new Date(p.endDate).getTime();
                  const left = Math.max(0, ((pStart - tStart) / range) * 100);
                  const width = Math.min(100 - left, ((pEnd - pStart) / range) * 100);

                  const barColor =
                    p.status === 'Completed' ? 'bg-green-400' :
                    p.status === 'Delayed' ? 'bg-red-400' :
                    p.status === 'Planning' ? 'bg-gray-400' :
                    'bg-blue-400';

                  return (
                    <div key={p.id} className="flex items-center gap-2">
                      <div className="w-[220px] flex-shrink-0 text-xs text-gray-700 truncate pr-2 text-right font-medium">
                        {p.name}
                      </div>
                      <div className="flex-1 relative h-7 bg-gray-50 rounded border border-gray-100">
                        {/* Vertical quarter lines */}
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div key={i} className="absolute top-0 bottom-0 border-l border-gray-100" style={{ left: `${((i + 1) / 9) * 100}%` }} />
                        ))}
                        <div
                          className={`absolute top-1 bottom-1 rounded ${barColor} opacity-80 flex items-center justify-center`}
                          style={{ left: `${left}%`, width: `${width}%`, minWidth: '2px' }}
                          title={`${p.name}: ${p.startDate} - ${p.endDate}`}
                        >
                          <span className="text-[10px] text-white font-medium truncate px-1">
                            {p.progress}%
                          </span>
                        </div>
                        {/* Today marker */}
                        {(() => {
                          const today = new Date('2026-03-24').getTime();
                          const todayPos = ((today - tStart) / range) * 100;
                          return todayPos > 0 && todayPos < 100 ? (
                            <div className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10" style={{ left: `${todayPos}%` }} />
                          ) : null;
                        })()}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 mt-4 ml-[220px] text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-400" /> Ongoing</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-400" /> Completed</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-400" /> Delayed</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-400" /> Planning</span>
                <span className="flex items-center gap-1"><span className="w-0.5 h-3 bg-red-500" /> Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Project Detail Modal ──────────────────────────────────── */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm overflow-y-auto p-4 pt-8 pb-8">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            {/* Modal header */}
            <div className="flex items-start justify-between p-6 border-b border-gray-100">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedProject.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${TYPE_COLORS[selectedProject.type]}`}>{selectedProject.type}</span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${STATUS_COLORS[selectedProject.status]}`}>{selectedProject.status}</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={12} /> {selectedProject.barangay}</span>
                </div>
              </div>
              <button onClick={() => setSelectedProject(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Description */}
              <p className="text-sm text-gray-600 leading-relaxed">{selectedProject.description}</p>

              {/* Progress bar large */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                  <span className={`text-lg font-bold ${selectedProject.status === 'Delayed' ? 'text-red-600' : 'text-blue-600'}`}>{selectedProject.progress}%</span>
                </div>
                <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${PROGRESS_COLORS[selectedProject.status]}`} style={{ width: `${selectedProject.progress}%` }} />
                </div>
              </div>

              {/* Budget section */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-1"><Banknote size={16} /> Budget</h3>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Allocated</p>
                    <p className="text-lg font-bold text-gray-900">{fmtFull(selectedProject.budget)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Spent</p>
                    <p className="text-lg font-bold text-blue-600">{fmtFull(selectedProject.spent)}</p>
                  </div>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(selectedProject.spent / selectedProject.budget * 100).toFixed(1)}%` }} />
                </div>
                <p className="text-xs text-gray-500 mt-1">{(selectedProject.spent / selectedProject.budget * 100).toFixed(1)}% utilized</p>
              </div>

              {/* Timeline milestones */}
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-1"><Clock size={16} /> Milestones</h3>
                <div className="relative pl-6 space-y-4">
                  <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gray-200" />
                  {selectedProject.milestones.map((m, i) => (
                    <div key={i} className="relative flex items-start gap-3">
                      <div className={`absolute left-[-15px] top-1 w-3 h-3 rounded-full border-2 ${m.done ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`} />
                      <div>
                        <p className={`text-sm font-medium ${m.done ? 'text-gray-900' : 'text-gray-500'}`}>{m.label}</p>
                        <p className="text-xs text-gray-400">{m.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contractor info */}
              <div className="bg-blue-50 rounded-xl p-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-1"><HardHat size={16} /> Contractor Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedProject.contractor}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Contact</p>
                    <p className="text-sm text-gray-700 flex items-center gap-1"><Phone size={12} /> {selectedProject.contractorContact}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Rating</p>
                    {stars(selectedProject.contractorRating)}
                  </div>
                </div>
              </div>

              {/* Photo gallery placeholder */}
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-1"><Camera size={16} /> Project Photos</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="aspect-square bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-1 text-gray-400 hover:bg-gray-50 transition-colors cursor-pointer">
                      <Camera size={24} />
                      <span className="text-xs">Photo {n}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status updates */}
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-1"><Activity size={16} /> Status Updates</h3>
                <div className="space-y-3">
                  {selectedProject.statusUpdates.map((u, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-500">{u.author}</span>
                        <span className="text-xs text-gray-400">{u.date}</span>
                      </div>
                      <p className="text-sm text-gray-700">{u.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Location placeholder */}
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-1"><MapPin size={16} /> Project Location</h3>
                <div className="w-full h-48 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-400">
                  <MapPin size={32} />
                  <span className="text-sm">Map — {selectedProject.barangay}, Daet, Camarines Norte</span>
                  <span className="text-xs">Interactive map integration pending</span>
                </div>
              </div>

              {/* Dates row */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm">
                <span className="flex items-center gap-1 text-gray-600"><Calendar size={14} /> Start: <span className="font-medium text-gray-900">{selectedProject.startDate}</span></span>
                <span className="flex items-center gap-1 text-gray-600"><Calendar size={14} /> End: <span className="font-medium text-gray-900">{selectedProject.endDate}</span></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
