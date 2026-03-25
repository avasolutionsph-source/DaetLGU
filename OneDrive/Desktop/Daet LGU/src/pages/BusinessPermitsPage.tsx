import { useState, useMemo } from 'react';
import {
  Building2,
  Clock,
  AlertTriangle,
  PhilippinePeso,
  Plus,
  Download,
  Search,
  ChevronRight,
  Eye,
  Pencil,
  CheckCircle2,
  Circle,
  XCircle,
  FileText,
  ArrowRight,
  Store,
  UtensilsCrossed,
  Wrench,
  Factory,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */
type PermitStatus = 'Pending' | 'Under Review' | 'Approved' | 'Released' | 'Rejected';
type BusinessCategory = 'Retail' | 'Food & Beverage' | 'Services' | 'Manufacturing';

interface Business {
  id: number;
  name: string;
  owner: string;
  type: BusinessCategory;
  barangay: string;
  status: PermitStatus;
  applicationDate: string;
  amount: number;
  address: string;
  contact: string;
  permitNo: string;
}

/* ------------------------------------------------------------------ */
/*  STATIC DATA                                                        */
/* ------------------------------------------------------------------ */
const BARANGAYS = [
  'Alawihao',
  'Awitan',
  'Bagasbas',
  'Bibirao',
  'Borabod',
  'Calasgasan',
  'Camambugan',
  'Cobangbang',
  'Dogongan',
  'Gahonon',
  'Lag-on',
  'Mancruz',
  'Pamorangon',
  'San Isidro',
];

const businesses: Business[] = [
  { id: 1, name: 'Daet Fresh Market', owner: 'Maria Santos', type: 'Retail', barangay: 'Alawihao', status: 'Approved', applicationDate: '2026-01-15', amount: 12500, address: 'J.P. Rizal St., Alawihao', contact: '0917-123-4567', permitNo: 'BP-2026-0001' },
  { id: 2, name: 'Bagasbas Beach Resort', owner: 'Ricardo dela Cruz', type: 'Services', barangay: 'Bagasbas', status: 'Released', applicationDate: '2026-01-08', amount: 35000, address: 'Bagasbas Beach Road', contact: '0918-234-5678', permitNo: 'BP-2026-0002' },
  { id: 3, name: 'CamNorte Hardware', owner: 'Jose Villanueva', type: 'Retail', barangay: 'Borabod', status: 'Pending', applicationDate: '2026-03-10', amount: 18000, address: 'Vinzons Ave., Borabod', contact: '0919-345-6789', permitNo: 'BP-2026-0045' },
  { id: 4, name: "Juan's Carenderia", owner: 'Juan Reyes', type: 'Food & Beverage', barangay: 'Camambugan', status: 'Approved', applicationDate: '2026-02-20', amount: 5500, address: 'Maharlika Highway, Camambugan', contact: '0920-456-7890', permitNo: 'BP-2026-0033' },
  { id: 5, name: 'Pacific Pharmacy', owner: 'Dr. Elena Garcia', type: 'Retail', barangay: 'Cobangbang', status: 'Under Review', applicationDate: '2026-03-05', amount: 22000, address: 'F. Pimentel Ave., Cobangbang', contact: '0921-567-8901', permitNo: 'BP-2026-0048' },
  { id: 6, name: 'Vinzons Auto Parts', owner: 'Roberto Vinzons', type: 'Retail', barangay: 'Mancruz', status: 'Approved', applicationDate: '2026-01-22', amount: 15000, address: 'Vinzons Ave., Mancruz', contact: '0922-678-9012', permitNo: 'BP-2026-0012' },
  { id: 7, name: 'Daet Lechon House', owner: 'Gloria Mendoza', type: 'Food & Beverage', barangay: 'Lag-on', status: 'Released', applicationDate: '2025-12-18', amount: 8500, address: 'Gov. Panotes Ave., Lag-on', contact: '0923-789-0123', permitNo: 'BP-2026-0008' },
  { id: 8, name: 'CamSur Welding Shop', owner: 'Pedro Ramirez', type: 'Manufacturing', barangay: 'Gahonon', status: 'Pending', applicationDate: '2026-03-18', amount: 9000, address: 'National Highway, Gahonon', contact: '0924-890-1234', permitNo: 'BP-2026-0051' },
  { id: 9, name: 'Sunshine Bakery', owner: 'Ana Bautista', type: 'Food & Beverage', barangay: 'Awitan', status: 'Approved', applicationDate: '2026-02-14', amount: 7500, address: 'Awitan Proper', contact: '0925-901-2345', permitNo: 'BP-2026-0029' },
  { id: 10, name: 'TechZone Computer Shop', owner: 'Mark Aquino', type: 'Services', barangay: 'Borabod', status: 'Under Review', applicationDate: '2026-03-12', amount: 10000, address: 'J. Lukban St., Borabod', contact: '0926-012-3456', permitNo: 'BP-2026-0049' },
  { id: 11, name: 'Daet Hollowblocks Mfg.', owner: 'Fernando Castillo', type: 'Manufacturing', barangay: 'Bibirao', status: 'Rejected', applicationDate: '2026-02-28', amount: 20000, address: 'Bibirao Road', contact: '0927-123-4567', permitNo: 'BP-2026-0041' },
  { id: 12, name: 'Golden Dragon Restaurant', owner: 'Li Wei Chen', type: 'Food & Beverage', barangay: 'Cobangbang', status: 'Approved', applicationDate: '2026-01-30', amount: 28000, address: 'F. Pimentel Ave., Cobangbang', contact: '0928-234-5678', permitNo: 'BP-2026-0018' },
  { id: 13, name: 'Pili Nut Traders', owner: 'Carmen Flores', type: 'Retail', barangay: 'San Isidro', status: 'Pending', applicationDate: '2026-03-20', amount: 6000, address: 'San Isidro Proper', contact: '0929-345-6789', permitNo: 'BP-2026-0053' },
  { id: 14, name: 'QuickFix Aircon Services', owner: 'Dennis Tan', type: 'Services', barangay: 'Alawihao', status: 'Released', applicationDate: '2026-01-05', amount: 11000, address: 'Alawihao Proper', contact: '0930-456-7890', permitNo: 'BP-2026-0004' },
];

const statusVariant: Record<PermitStatus, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  Approved: 'success',
  Pending: 'warning',
  'Under Review': 'info',
  Released: 'success',
  Rejected: 'danger',
};

const categoryPieData = [
  { name: 'Retail', value: 412, color: '#3b82f6' },
  { name: 'Food & Beverage', value: 328, color: '#f59e0b' },
  { name: 'Services', value: 301, color: '#10b981' },
  { name: 'Manufacturing', value: 206, color: '#8b5cf6' },
];

const monthlyBarData = [
  { month: 'Oct', applications: 78, approved: 62 },
  { month: 'Nov', applications: 92, approved: 74 },
  { month: 'Dec', applications: 65, approved: 58 },
  { month: 'Jan', applications: 110, approved: 89 },
  { month: 'Feb', applications: 98, approved: 80 },
  { month: 'Mar', applications: 85, approved: 52 },
];

const workflowSteps = [
  { label: 'Application', count: 48, color: 'bg-amber-500' },
  { label: 'Requirements', count: 32, color: 'bg-blue-500' },
  { label: 'Assessment', count: 18, color: 'bg-purple-500' },
  { label: 'Approval', count: 12, color: 'bg-emerald-500' },
  { label: 'Release', count: 8, color: 'bg-teal-500' },
];

const requirementsChecklist = [
  { label: 'Barangay Clearance', done: true },
  { label: 'DTI / SEC Registration', done: true },
  { label: 'Community Tax Certificate', done: true },
  { label: 'Fire Safety Inspection Certificate', done: false },
  { label: 'Sanitary Permit', done: false },
  { label: 'Zoning Clearance', done: true },
  { label: 'Environmental Compliance', done: false },
];

/* ------------------------------------------------------------------ */
/*  HELPER: format peso                                                */
/* ------------------------------------------------------------------ */
function peso(n: number) {
  return `₱${n.toLocaleString()}`;
}

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */
export default function BusinessPermitsPage() {
  /* state */
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [barangayFilter, setBarangayFilter] = useState<string>('All');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [newAppOpen, setNewAppOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  /* filtered data */
  const filtered = useMemo(() => {
    return businesses.filter((b) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.owner.toLowerCase().includes(q) ||
        b.barangay.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
      const matchesCategory = categoryFilter === 'All' || b.type === categoryFilter;
      const matchesBarangay = barangayFilter === 'All' || b.barangay === barangayFilter;
      return matchesSearch && matchesStatus && matchesCategory && matchesBarangay;
    });
  }, [search, statusFilter, categoryFilter, barangayFilter]);

  /* handlers */
  const openDetail = (b: Business) => {
    setSelectedBusiness(b);
    setDetailOpen(true);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleNewAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setNewAppOpen(false);
    showToast('Application submitted successfully!');
  };

  /* category icon helper */
  const CategoryIcon = ({ cat }: { cat: string }) => {
    switch (cat) {
      case 'Retail':
        return <Store className="w-4 h-4" />;
      case 'Food & Beverage':
        return <UtensilsCrossed className="w-4 h-4" />;
      case 'Services':
        return <Wrench className="w-4 h-4" />;
      case 'Manufacturing':
        return <Factory className="w-4 h-4" />;
      default:
        return <Building2 className="w-4 h-4" />;
    }
  };

  /* ---------------------------------------------------------------- */
  /*  RENDER                                                           */
  /* ---------------------------------------------------------------- */
  return (
    <div className="min-h-screen bg-gray-50/60">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ---- HEADER ---- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-1">
              <span className="hover:text-gray-600 cursor-pointer">Dashboard</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-gray-700 font-medium">Business Permits</span>
            </nav>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Business Permits &amp; Licensing
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setNewAppOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              New Application
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-gray-700 text-sm font-semibold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* ---- STATS ---- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard title="Total Registered" value="1,247" change="8.2%" changeType="up" icon={Building2} color="blue" />
          <StatCard title="Pending Approvals" value="48" change="12.5%" changeType="down" icon={Clock} color="amber" />
          <StatCard title="Expiring This Month" value="23" change="3 more" changeType="up" icon={AlertTriangle} color="red" />
          <StatCard title="Total Collections" value="₱4,250,000" change="15.3%" changeType="up" icon={PhilippinePeso} color="green" />
        </div>

        {/* ---- FILTERS ---- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* search */}
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search businesses..."
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
            </div>
            {/* status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            >
              <option value="All">All Status</option>
              <option>Pending</option>
              <option>Under Review</option>
              <option>Approved</option>
              <option>Released</option>
              <option>Rejected</option>
            </select>
            {/* category */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            >
              <option value="All">All Categories</option>
              <option>Retail</option>
              <option>Food &amp; Beverage</option>
              <option>Services</option>
              <option>Manufacturing</option>
            </select>
            {/* barangay */}
            <select
              value={barangayFilter}
              onChange={(e) => setBarangayFilter(e.target.value)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            >
              <option value="All">All Barangays</option>
              {BARANGAYS.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
            {/* date range (UI only) */}
            <input
              type="date"
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
            <span className="text-gray-400 text-sm">to</span>
            <input
              type="date"
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
            />
          </div>
        </div>

        {/* ---- TABLE ---- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Business Name', 'Owner', 'Type', 'Barangay', 'Status', 'Application Date', 'Amount', 'Actions'].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 bg-gray-50/50"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-sm text-gray-400">
                      No businesses match your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((b) => (
                    <tr
                      key={b.id}
                      onClick={() => openDetail(b)}
                      className="cursor-pointer transition-colors hover:bg-gray-50/80"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <CategoryIcon cat={b.type} />
                          {b.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{b.owner}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{b.type}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{b.barangay}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={statusVariant[b.status]}>{b.status}</Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{b.applicationDate}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {peso(b.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openDetail(b);
                            }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* table footer */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/30">
            <p className="text-sm text-gray-500">
              Showing {filtered.length} of {businesses.length} businesses
            </p>
          </div>
        </div>

        {/* ---- APPROVAL WORKFLOW ---- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Approval Workflow Pipeline</h2>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            {workflowSteps.map((step, i) => (
              <div key={step.label} className="flex items-center gap-2 flex-1">
                <div className="flex-1 rounded-xl border border-gray-100 p-4 text-center bg-gray-50/50 hover:shadow-sm transition-shadow">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-white text-sm font-bold mb-2 ${step.color}`}>
                    {step.count}
                  </div>
                  <p className="text-sm font-medium text-gray-700">{step.label}</p>
                </div>
                {i < workflowSteps.length - 1 && (
                  <ArrowRight className="hidden sm:block w-5 h-5 text-gray-300 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ---- ANALYTICS ---- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* pie */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Permits by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }: any) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                >
                  {categoryPieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={((value: number) => [value, 'Permits']) as any} />
              </PieChart>
            </ResponsiveContainer>
            {/* breakdown cards */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              {categoryPieData.map((c) => (
                <div key={c.name} className="flex items-center gap-3 rounded-xl border border-gray-100 p-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: c.color }} />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.value} businesses</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Applications</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyBarData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} className="text-xs" />
                <Tooltip />
                <Legend />
                <Bar dataKey="applications" name="Applications" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="approved" name="Approved" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            {/* summary */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="rounded-xl border border-gray-100 p-3 text-center">
                <p className="text-xl font-bold text-gray-900">528</p>
                <p className="text-xs text-gray-400">Total Applications</p>
              </div>
              <div className="rounded-xl border border-gray-100 p-3 text-center">
                <p className="text-xl font-bold text-emerald-600">415</p>
                <p className="text-xs text-gray-400">Total Approved</p>
              </div>
              <div className="rounded-xl border border-gray-100 p-3 text-center">
                <p className="text-xl font-bold text-blue-600">78.6%</p>
                <p className="text-xs text-gray-400">Approval Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* ---- BUSINESS DETAIL MODAL ---- */}
        <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="Business Permit Details" size="xl">
          {selectedBusiness && (
            <div className="space-y-6">
              {/* basic info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Business Name</p>
                  <p className="text-sm font-medium text-gray-900">{selectedBusiness.name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Permit No.</p>
                  <p className="text-sm font-medium text-gray-900">{selectedBusiness.permitNo}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Owner</p>
                  <p className="text-sm text-gray-700">{selectedBusiness.owner}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Contact</p>
                  <p className="text-sm text-gray-700">{selectedBusiness.contact}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Address</p>
                  <p className="text-sm text-gray-700">{selectedBusiness.address}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Barangay</p>
                  <p className="text-sm text-gray-700">{selectedBusiness.barangay}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Business Type</p>
                  <p className="text-sm text-gray-700">{selectedBusiness.type}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase mb-1">Status</p>
                  <Badge variant={statusVariant[selectedBusiness.status]}>{selectedBusiness.status}</Badge>
                </div>
              </div>

              {/* status timeline */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Permit Status Timeline</h3>
                <div className="space-y-3">
                  {[
                    { step: 'Application Submitted', date: selectedBusiness.applicationDate, done: true },
                    { step: 'Requirements Verified', date: '2026-03-12', done: selectedBusiness.status !== 'Pending' },
                    { step: 'Assessment Completed', date: '2026-03-15', done: ['Approved', 'Released'].includes(selectedBusiness.status) },
                    { step: 'Approved by BPLO', date: '2026-03-18', done: ['Approved', 'Released'].includes(selectedBusiness.status) },
                    { step: 'Permit Released', date: '2026-03-20', done: selectedBusiness.status === 'Released' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      {item.done ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className={`text-sm font-medium ${item.done ? 'text-gray-900' : 'text-gray-400'}`}>
                          {item.step}
                        </p>
                        <p className="text-xs text-gray-400">{item.done ? item.date : 'Pending'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* requirements checklist */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Requirements Checklist</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {requirementsChecklist.map((req) => (
                    <div
                      key={req.label}
                      className={`flex items-center gap-2.5 rounded-lg p-2.5 text-sm ${
                        req.done ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-50 text-gray-500'
                      }`}
                    >
                      {req.done ? (
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 flex-shrink-0" />
                      )}
                      {req.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* payment status */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Payment Status</h3>
                <div className="rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Permit Fee</span>
                    <span className="text-sm font-medium text-gray-900">{peso(selectedBusiness.amount)}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Mayor's Permit</span>
                    <span className="text-sm font-medium text-gray-900">{peso(Math.round(selectedBusiness.amount * 0.3))}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">Sanitary Fee</span>
                    <span className="text-sm font-medium text-gray-900">{peso(500)}</span>
                  </div>
                  <div className="border-t border-gray-100 mt-3 pt-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">Total</span>
                    <span className="text-sm font-bold text-blue-600">
                      {peso(selectedBusiness.amount + Math.round(selectedBusiness.amount * 0.3) + 500)}
                    </span>
                  </div>
                  <div className="mt-3">
                    <Badge variant={selectedBusiness.status === 'Released' || selectedBusiness.status === 'Approved' ? 'success' : 'warning'}>
                      {selectedBusiness.status === 'Released' || selectedBusiness.status === 'Approved' ? 'Paid' : 'Pending Payment'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* permit history */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Permit History</h3>
                <div className="space-y-2">
                  {[
                    { year: '2026', status: 'Current', permitNo: selectedBusiness.permitNo },
                    { year: '2025', status: 'Renewed', permitNo: 'BP-2025-0198' },
                    { year: '2024', status: 'Renewed', permitNo: 'BP-2024-0145' },
                  ].map((h) => (
                    <div
                      key={h.year}
                      className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{h.permitNo}</p>
                          <p className="text-xs text-gray-400">{h.year}</p>
                        </div>
                      </div>
                      <Badge variant={h.status === 'Current' ? 'info' : 'neutral'}>{h.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Modal>

        {/* ---- NEW APPLICATION MODAL ---- */}
        <Modal open={newAppOpen} onClose={() => setNewAppOpen(false)} title="New Business Permit Application" size="lg">
          <form onSubmit={handleNewAppSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Daet Fresh Market"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Owner Name</label>
                <input
                  type="text"
                  required
                  placeholder="Full name"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                <select
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                >
                  <option value="">Select type</option>
                  <option>Retail</option>
                  <option>Food &amp; Beverage</option>
                  <option>Services</option>
                  <option>Manufacturing</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Barangay</label>
                <select
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                >
                  <option value="">Select barangay</option>
                  {BARANGAYS.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  required
                  placeholder="Street, Building, etc."
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                <input
                  type="tel"
                  required
                  placeholder="09XX-XXX-XXXX"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setNewAppOpen(false)}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm"
              >
                Submit Application
              </button>
            </div>
          </form>
        </Modal>

        {/* ---- TOAST ---- */}
        {toastMsg && (
          <div className="fixed bottom-6 right-6 z-[60] animate-[scaleIn_200ms_ease-out]">
            <div className="flex items-center gap-3 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium">
              <CheckCircle2 className="w-5 h-5" />
              {toastMsg}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
