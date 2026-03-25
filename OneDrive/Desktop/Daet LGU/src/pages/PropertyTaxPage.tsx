import { useState, useMemo } from 'react';
import {
  Landmark,
  Building2,
  Home,
  Factory,
  Wheat,
  Plus,
  Download,
  Bell,
  Search,
  Eye,
  ChevronRight,
  AlertTriangle,
  FileText,
  Send,
  Printer,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Calendar,
  MapPin,
  User,
  CreditCard,
  Receipt,
  BarChart3,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import Modal from '../components/ui/Modal';
import Badge from '../components/ui/Badge';
import StatCard from '../components/ui/StatCard';
import { formatCurrency, formatNumber, classNames } from '../lib/utils';

/* ─────────────────────────── Types ─────────────────────────── */

interface PropertyRecord {
  id: number;
  tdNumber: string;
  owner: string;
  location: string;
  barangay: string;
  classification: 'Residential' | 'Commercial' | 'Agricultural' | 'Industrial';
  area: number;
  marketValue: number;
  assessedValue: number;
  taxDue: number;
  status: 'Paid' | 'Unpaid' | 'Delinquent';
  paymentHistory: { year: number; amount: number; date: string; or: string }[];
  currentBalance: number;
}

interface DelinquentAccount {
  id: number;
  tdNumber: string;
  owner: string;
  barangay: string;
  yearsDelinquent: number;
  totalArrears: number;
}

interface Notice {
  id: number;
  type: string;
  date: string;
  count: number;
  status: 'Sent' | 'Pending' | 'Draft';
}

/* ─────────────────────────── Data ─────────────────────────── */

const BARANGAYS = [
  'Alawihao', 'Awitan', 'Bagasbas', 'Bibirao', 'Borabod',
  'Calasgasan', 'Camambugan', 'Cobangbang', 'Daet Proper', 'Dogongan',
  'Gahonon', 'Lag-on', 'Mancruz', 'Mambalite', 'Pamorangon',
  'San Isidro', 'Gahonon', 'Mercedes',
];

const propertyRecords: PropertyRecord[] = [
  {
    id: 1, tdNumber: 'TD-2024-00142', owner: 'Juan dela Cruz', location: 'Lot 12, Blk 5, Vinzons Ave.',
    barangay: 'Daet Proper', classification: 'Commercial', area: 450,
    marketValue: 4500000, assessedValue: 1800000, taxDue: 18000, status: 'Paid',
    paymentHistory: [
      { year: 2024, amount: 18000, date: '2024-01-15', or: 'OR-2024-0341' },
      { year: 2023, amount: 17500, date: '2023-02-10', or: 'OR-2023-0198' },
      { year: 2022, amount: 17000, date: '2022-01-20', or: 'OR-2022-0412' },
    ],
    currentBalance: 0,
  },
  {
    id: 2, tdNumber: 'TD-2024-00287', owner: 'Maria Santos', location: 'Lot 3, Blk 2, Maharlika Highway',
    barangay: 'Alawihao', classification: 'Residential', area: 200,
    marketValue: 1800000, assessedValue: 360000, taxDue: 3600, status: 'Paid',
    paymentHistory: [
      { year: 2024, amount: 3600, date: '2024-03-05', or: 'OR-2024-0789' },
      { year: 2023, amount: 3500, date: '2023-01-28', or: 'OR-2023-0456' },
      { year: 2022, amount: 3400, date: '2022-03-14', or: 'OR-2022-0623' },
    ],
    currentBalance: 0,
  },
  {
    id: 3, tdNumber: 'TD-2024-00395', owner: 'Roberto Reyes', location: 'Lot 8, Fernandez Subd.',
    barangay: 'Bagasbas', classification: 'Residential', area: 350,
    marketValue: 3200000, assessedValue: 640000, taxDue: 6400, status: 'Unpaid',
    paymentHistory: [
      { year: 2023, amount: 6200, date: '2023-04-12', or: 'OR-2023-1024' },
      { year: 2022, amount: 6000, date: '2022-02-08', or: 'OR-2022-0891' },
      { year: 2021, amount: 5800, date: '2021-03-22', or: 'OR-2021-0534' },
    ],
    currentBalance: 6400,
  },
  {
    id: 4, tdNumber: 'TD-2024-00518', owner: 'Elena Villanueva', location: 'Lot 22, Irrigation Road',
    barangay: 'Calasgasan', classification: 'Agricultural', area: 12000,
    marketValue: 2400000, assessedValue: 960000, taxDue: 9600, status: 'Delinquent',
    paymentHistory: [
      { year: 2022, amount: 9000, date: '2022-06-30', or: 'OR-2022-1456' },
      { year: 2021, amount: 8800, date: '2021-05-15', or: 'OR-2021-0987' },
      { year: 2020, amount: 8500, date: '2020-04-10', or: 'OR-2020-0678' },
    ],
    currentBalance: 28200,
  },
  {
    id: 5, tdNumber: 'TD-2024-00623', owner: 'Ricardo Bautista', location: 'Lot 1, Industrial Zone',
    barangay: 'Borabod', classification: 'Industrial', area: 5000,
    marketValue: 15000000, assessedValue: 7500000, taxDue: 75000, status: 'Paid',
    paymentHistory: [
      { year: 2024, amount: 75000, date: '2024-01-10', or: 'OR-2024-0042' },
      { year: 2023, amount: 72000, date: '2023-01-05', or: 'OR-2023-0015' },
      { year: 2022, amount: 70000, date: '2022-01-12', or: 'OR-2022-0089' },
    ],
    currentBalance: 0,
  },
  {
    id: 6, tdNumber: 'TD-2024-00741', owner: 'Carmen Lim', location: 'Lot 5, J.P. Rizal St.',
    barangay: 'Daet Proper', classification: 'Commercial', area: 320,
    marketValue: 6400000, assessedValue: 2560000, taxDue: 25600, status: 'Unpaid',
    paymentHistory: [
      { year: 2023, amount: 24800, date: '2023-03-18', or: 'OR-2023-0678' },
      { year: 2022, amount: 24000, date: '2022-02-25', or: 'OR-2022-0345' },
      { year: 2021, amount: 23200, date: '2021-01-30', or: 'OR-2021-0213' },
    ],
    currentBalance: 25600,
  },
  {
    id: 7, tdNumber: 'TD-2024-00856', owner: 'Antonio Gonzales', location: 'Lot 17, Pimentel Ave.',
    barangay: 'Cobangbang', classification: 'Residential', area: 180,
    marketValue: 1200000, assessedValue: 240000, taxDue: 2400, status: 'Paid',
    paymentHistory: [
      { year: 2024, amount: 2400, date: '2024-02-14', or: 'OR-2024-0556' },
      { year: 2023, amount: 2300, date: '2023-02-20', or: 'OR-2023-0389' },
      { year: 2022, amount: 2200, date: '2022-01-18', or: 'OR-2022-0156' },
    ],
    currentBalance: 0,
  },
  {
    id: 8, tdNumber: 'TD-2024-00934', owner: 'Lourdes Aquino', location: 'Lot 9, Brgy. Road',
    barangay: 'Gahonon', classification: 'Agricultural', area: 8500,
    marketValue: 1700000, assessedValue: 680000, taxDue: 6800, status: 'Delinquent',
    paymentHistory: [
      { year: 2021, amount: 6200, date: '2021-06-15', or: 'OR-2021-1234' },
      { year: 2020, amount: 6000, date: '2020-05-20', or: 'OR-2020-0912' },
      { year: 2019, amount: 5800, date: '2019-04-10', or: 'OR-2019-0567' },
    ],
    currentBalance: 39800,
  },
  {
    id: 9, tdNumber: 'TD-2024-01048', owner: 'Fernando Tan', location: 'Lot 2, Blk 8, National Highway',
    barangay: 'Awitan', classification: 'Commercial', area: 600,
    marketValue: 9000000, assessedValue: 3600000, taxDue: 36000, status: 'Paid',
    paymentHistory: [
      { year: 2024, amount: 36000, date: '2024-01-08', or: 'OR-2024-0023' },
      { year: 2023, amount: 35000, date: '2023-01-12', or: 'OR-2023-0067' },
      { year: 2022, amount: 34000, date: '2022-01-15', or: 'OR-2022-0045' },
    ],
    currentBalance: 0,
  },
  {
    id: 10, tdNumber: 'TD-2024-01167', owner: 'Patricia Mendoza', location: 'Lot 14, Sampaguita St.',
    barangay: 'Bibirao', classification: 'Residential', area: 250,
    marketValue: 2000000, assessedValue: 400000, taxDue: 4000, status: 'Unpaid',
    paymentHistory: [
      { year: 2023, amount: 3800, date: '2023-04-02', or: 'OR-2023-0912' },
      { year: 2022, amount: 3600, date: '2022-03-28', or: 'OR-2022-0789' },
      { year: 2021, amount: 3500, date: '2021-02-14', or: 'OR-2021-0456' },
    ],
    currentBalance: 4000,
  },
  {
    id: 11, tdNumber: 'TD-2024-01283', owner: 'Gregorio Ramos', location: 'Lot 6, Fishpond Area',
    barangay: 'Camambugan', classification: 'Agricultural', area: 15000,
    marketValue: 3000000, assessedValue: 1200000, taxDue: 12000, status: 'Delinquent',
    paymentHistory: [
      { year: 2021, amount: 11000, date: '2021-07-22', or: 'OR-2021-1567' },
      { year: 2020, amount: 10500, date: '2020-06-30', or: 'OR-2020-1234' },
      { year: 2019, amount: 10000, date: '2019-05-18', or: 'OR-2019-0890' },
    ],
    currentBalance: 57000,
  },
  {
    id: 12, tdNumber: 'TD-2024-01399', owner: 'Rosario Pangilinan', location: 'Lot 3, Warehouse Compound',
    barangay: 'Borabod', classification: 'Industrial', area: 3000,
    marketValue: 8000000, assessedValue: 4000000, taxDue: 40000, status: 'Unpaid',
    paymentHistory: [
      { year: 2023, amount: 38000, date: '2023-02-28', or: 'OR-2023-0534' },
      { year: 2022, amount: 36000, date: '2022-01-22', or: 'OR-2022-0267' },
      { year: 2021, amount: 35000, date: '2021-03-10', or: 'OR-2021-0345' },
    ],
    currentBalance: 40000,
  },
  {
    id: 13, tdNumber: 'TD-2024-01512', owner: 'Jose Villareal', location: 'Lot 11, Blk 3, F. Pimentel St.',
    barangay: 'Lag-on', classification: 'Residential', area: 160,
    marketValue: 960000, assessedValue: 192000, taxDue: 1920, status: 'Paid',
    paymentHistory: [
      { year: 2024, amount: 1920, date: '2024-01-25', or: 'OR-2024-0412' },
      { year: 2023, amount: 1850, date: '2023-01-30', or: 'OR-2023-0234' },
      { year: 2022, amount: 1800, date: '2022-02-12', or: 'OR-2022-0178' },
    ],
    currentBalance: 0,
  },
  {
    id: 14, tdNumber: 'TD-2024-01628', owner: 'Angela Soriano', location: 'Lot 7, Pamorangon Road',
    barangay: 'Pamorangon', classification: 'Residential', area: 280,
    marketValue: 1680000, assessedValue: 336000, taxDue: 3360, status: 'Delinquent',
    paymentHistory: [
      { year: 2022, amount: 3100, date: '2022-05-14', or: 'OR-2022-1089' },
      { year: 2021, amount: 3000, date: '2021-04-20', or: 'OR-2021-0789' },
      { year: 2020, amount: 2900, date: '2020-03-18', or: 'OR-2020-0456' },
    ],
    currentBalance: 9820,
  },
  {
    id: 15, tdNumber: 'TD-2024-01745', owner: 'Manuel Ocampo', location: 'Lot 20, San Isidro Farms',
    barangay: 'San Isidro', classification: 'Agricultural', area: 20000,
    marketValue: 4000000, assessedValue: 1600000, taxDue: 16000, status: 'Paid',
    paymentHistory: [
      { year: 2024, amount: 16000, date: '2024-02-28', or: 'OR-2024-0678' },
      { year: 2023, amount: 15500, date: '2023-03-05', or: 'OR-2023-0567' },
      { year: 2022, amount: 15000, date: '2022-02-20', or: 'OR-2022-0534' },
    ],
    currentBalance: 0,
  },
];

const delinquentAccounts: DelinquentAccount[] = [
  { id: 1, tdNumber: 'TD-2024-01283', owner: 'Gregorio Ramos', barangay: 'Camambugan', yearsDelinquent: 3, totalArrears: 57000 },
  { id: 2, tdNumber: 'TD-2024-00934', owner: 'Lourdes Aquino', barangay: 'Gahonon', yearsDelinquent: 3, totalArrears: 39800 },
  { id: 3, tdNumber: 'TD-2024-00518', owner: 'Elena Villanueva', barangay: 'Calasgasan', yearsDelinquent: 2, totalArrears: 28200 },
  { id: 4, tdNumber: 'TD-2024-01628', owner: 'Angela Soriano', barangay: 'Pamorangon', yearsDelinquent: 2, totalArrears: 9820 },
  { id: 5, tdNumber: 'TD-2023-00845', owner: 'Danilo Estrella', barangay: 'Dogongan', yearsDelinquent: 4, totalArrears: 84500 },
  { id: 6, tdNumber: 'TD-2023-01102', owner: 'Consuelo Navarro', barangay: 'Mancruz', yearsDelinquent: 3, totalArrears: 42300 },
  { id: 7, tdNumber: 'TD-2022-00398', owner: 'Ernesto Salazar', barangay: 'Mambalite', yearsDelinquent: 5, totalArrears: 112000 },
  { id: 8, tdNumber: 'TD-2023-00672', owner: 'Teresita Castillo', barangay: 'Alawihao', yearsDelinquent: 2, totalArrears: 18400 },
];

const monthlyCollection = [
  { month: 'Jan', collected: 3200000, target: 3500000 },
  { month: 'Feb', collected: 2800000, target: 3500000 },
  { month: 'Mar', collected: 2100000, target: 3500000 },
  { month: 'Apr', collected: 1600000, target: 3500000 },
  { month: 'May', collected: 1400000, target: 3500000 },
  { month: 'Jun', collected: 1200000, target: 3500000 },
  { month: 'Jul', collected: 1100000, target: 3500000 },
  { month: 'Aug', collected: 1050000, target: 3500000 },
  { month: 'Sep', collected: 980000, target: 3500000 },
  { month: 'Oct', collected: 1150000, target: 3500000 },
  { month: 'Nov', collected: 1000000, target: 3500000 },
  { month: 'Dec', collected: 900000, target: 3500000 },
];

const classificationData = [
  { name: 'Residential', value: 8200000, count: 2451 },
  { name: 'Commercial', value: 5800000, count: 628 },
  { name: 'Agricultural', value: 3100000, count: 589 },
  { name: 'Industrial', value: 1400000, count: 174 },
];

const PIE_COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];

const yearOverYear = [
  { month: 'Jan', yr2025: 3200000, yr2024: 2900000 },
  { month: 'Feb', yr2025: 2800000, yr2024: 2600000 },
  { month: 'Mar', yr2025: 2100000, yr2024: 2300000 },
  { month: 'Apr', yr2025: 1600000, yr2024: 1800000 },
  { month: 'May', yr2025: 1400000, yr2024: 1500000 },
  { month: 'Jun', yr2025: 1200000, yr2024: 1300000 },
  { month: 'Jul', yr2025: 1100000, yr2024: 1200000 },
  { month: 'Aug', yr2025: 1050000, yr2024: 1100000 },
  { month: 'Sep', yr2025: 980000, yr2024: 1050000 },
  { month: 'Oct', yr2025: 1150000, yr2024: 1000000 },
  { month: 'Nov', yr2025: 1000000, yr2024: 950000 },
  { month: 'Dec', yr2025: 900000, yr2024: 880000 },
];

const recentNotices: Notice[] = [
  { id: 1, type: 'Delinquency Notice', date: '2025-03-15', count: 342, status: 'Sent' },
  { id: 2, type: 'Payment Reminder (Q1)', date: '2025-03-01', count: 1205, status: 'Sent' },
  { id: 3, type: 'Assessment Update', date: '2025-02-20', count: 89, status: 'Sent' },
  { id: 4, type: 'Delinquency Warning (Final)', date: '2025-02-10', count: 156, status: 'Sent' },
  { id: 5, type: 'Annual Tax Statement', date: '2025-01-05', count: 3842, status: 'Sent' },
  { id: 6, type: 'Delinquency Notice (Q2)', date: '2025-04-01', count: 310, status: 'Draft' },
];

/* ─────────────────────────── Helpers ─────────────────────────── */

const statusBadge = (status: string) => {
  const variant = status === 'Paid' ? 'success' : status === 'Unpaid' ? 'warning' : 'danger';
  return <Badge variant={variant}>{status}</Badge>;
};

const classificationIcon = (c: string) => {
  if (c === 'Residential') return Home;
  if (c === 'Commercial') return Building2;
  if (c === 'Agricultural') return Wheat;
  return Factory;
};

const classificationColor = (c: string) => {
  if (c === 'Residential') return 'blue';
  if (c === 'Commercial') return 'amber';
  if (c === 'Agricultural') return 'green';
  return 'purple';
};

const formatCompact = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
};

/* ─────────────────────────── Component ─────────────────────────── */

export default function PropertyTaxPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [classFilter, setClassFilter] = useState<string>('All');
  const [barangayFilter, setBarangayFilter] = useState<string>('All');
  const [selectedProperty, setSelectedProperty] = useState<PropertyRecord | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  /* Filtered records */
  const filteredRecords = useMemo(() => {
    return propertyRecords.filter((r) => {
      const matchSearch =
        !searchTerm.trim() ||
        [r.tdNumber, r.owner, r.location, r.barangay]
          .some((f) => f.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchStatus = statusFilter === 'All' || r.status === statusFilter;
      const matchClass = classFilter === 'All' || r.classification === classFilter;
      const matchBarangay = barangayFilter === 'All' || r.barangay === barangayFilter;
      return matchSearch && matchStatus && matchClass && matchBarangay;
    });
  }, [searchTerm, statusFilter, classFilter, barangayFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pagedRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const openDetail = (record: PropertyRecord) => {
    setSelectedProperty(record);
    setDetailOpen(true);
  };

  /* Classification cards aggregate */
  const classCards: { label: string; count: number; assessedTotal: string; icon: React.ComponentType<{ className?: string }>; color: 'blue' | 'amber' | 'green' | 'purple' }[] = [
    { label: 'Residential', count: 2451, assessedTotal: '₱620M', icon: Home, color: 'blue' },
    { label: 'Commercial', count: 628, assessedTotal: '₱380M', icon: Building2, color: 'amber' },
    { label: 'Agricultural', count: 589, assessedTotal: '₱145M', icon: Wheat, color: 'green' },
    { label: 'Industrial', count: 174, assessedTotal: '₱55M', icon: Factory, color: 'purple' },
  ];

  const colorBg: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-700 ring-blue-200',
    amber: 'bg-amber-50 text-amber-700 ring-amber-200',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    purple: 'bg-purple-50 text-purple-700 ring-purple-200',
  };

  const colorIcon: Record<string, string> = {
    blue: 'text-blue-600',
    amber: 'text-amber-600',
    green: 'text-emerald-600',
    purple: 'text-purple-600',
  };

  return (
    <div className="space-y-8">
      {/* ───── 1. Page Header with Breadcrumbs ───── */}
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span className="hover:text-blue-600 cursor-pointer">Dashboard</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900 font-medium">Property Tax</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Real Property Tax Management</h1>
            <p className="text-sm text-gray-500 mt-1">Municipality of Daet, Camarines Norte</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              Add Property
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Bell className="w-4 h-4" />
              Generate Notices
            </button>
          </div>
        </div>
      </div>

      {/* ───── 2. Summary Cards ───── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Properties" value={formatNumber(3842)} icon={Landmark} color="blue" change="+124" changeType="up" />
        <StatCard title="Total Assessed Value" value="₱1.2B" icon={Building2} color="green" change="+8.2%" changeType="up" />
        <StatCard title="Tax Collected (YTD)" value="₱18.5M" icon={CreditCard} color="amber" change="+12.4%" changeType="up" />
        <StatCard title="Delinquent Accounts" value="342" icon={AlertTriangle} color="red" change="+18" changeType="down" />
        <StatCard title="Collection Rate" value="78.5%" icon={TrendingUp} color="purple" change="+3.1%" changeType="up" />
      </div>

      {/* ───── 3. Filter Bar ───── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              placeholder="Search by TD number, owner, location..."
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          >
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
            <option value="Delinquent">Delinquent</option>
          </select>
          <select
            value={classFilter}
            onChange={(e) => { setClassFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          >
            <option value="All">All Classification</option>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Agricultural">Agricultural</option>
            <option value="Industrial">Industrial</option>
          </select>
          <select
            value={barangayFilter}
            onChange={(e) => { setBarangayFilter(e.target.value); setPage(1); }}
            className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          >
            <option value="All">All Barangays</option>
            {BARANGAYS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ───── 4. Property Records Table ───── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Property Records</h2>
          <span className="text-sm text-gray-500">{filteredRecords.length} records</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {['TD Number', 'Owner', 'Location', 'Barangay', 'Classification', 'Assessed Value', 'Tax Due', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 bg-gray-50/50">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pagedRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-sm text-gray-400">
                    No property records found matching your filters.
                  </td>
                </tr>
              ) : (
                pagedRecords.map((r) => {
                  const ClassIcon = classificationIcon(r.classification);
                  return (
                    <tr key={r.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-blue-600">{r.tdNumber}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{r.owner}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-[180px] truncate">{r.location}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{r.barangay}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                          <ClassIcon className={`w-3.5 h-3.5 ${colorIcon[classificationColor(r.classification)]}`} />
                          {r.classification}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-medium">{formatCurrency(r.assessedValue)}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-medium">{formatCurrency(r.taxDue)}</td>
                      <td className="px-6 py-4">{statusBadge(r.status)}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openDetail(r)}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {filteredRecords.length > pageSize && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/30">
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredRecords.length)} of {filteredRecords.length} records
            </p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(1)} disabled={currentPage === 1} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 text-sm font-medium text-gray-700">{currentPage} / {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
              <button onClick={() => setPage(totalPages)} disabled={currentPage === totalPages} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ───── 5. Property Detail Modal ───── */}
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)} title="Property Details" size="xl">
        {selectedProperty && (
          <div className="space-y-6">
            {/* Owner & Property Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{selectedProperty.owner}</p>
                    <p className="text-sm text-gray-500">Property Owner</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">TD Number</p>
                    <p className="text-sm font-semibold text-gray-900">{selectedProperty.tdNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">Area</p>
                    <p className="text-sm font-semibold text-gray-900">{formatNumber(selectedProperty.area)} sqm</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">Location</p>
                    <p className="text-sm text-gray-700">{selectedProperty.location}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium mb-1">Barangay</p>
                    <p className="text-sm text-gray-700">{selectedProperty.barangay}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium mb-1">Classification</p>
                  <span className={`inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1 rounded-full ring-1 ring-inset ${colorBg[classificationColor(selectedProperty.classification)]}`}>
                    {(() => { const IC = classificationIcon(selectedProperty.classification); return <IC className="w-4 h-4" />; })()}
                    {selectedProperty.classification}
                  </span>
                </div>
              </div>

              {/* Tax Computation */}
              <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Tax Computation</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Market Value</span>
                    <span className="font-medium text-gray-900">{formatCurrency(selectedProperty.marketValue)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Assessment Level</span>
                    <span className="font-medium text-gray-900">{((selectedProperty.assessedValue / selectedProperty.marketValue) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Assessed Value</span>
                    <span className="font-medium text-gray-900">{formatCurrency(selectedProperty.assessedValue)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax Rate</span>
                    <span className="font-medium text-gray-900">1.0%</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700 font-semibold">Annual Tax Due</span>
                    <span className="font-bold text-gray-900">{formatCurrency(selectedProperty.taxDue)}</span>
                  </div>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Current Balance</span>
                  <span className={classNames(
                    'text-lg font-bold',
                    selectedProperty.currentBalance > 0 ? 'text-red-600' : 'text-emerald-600'
                  )}>
                    {selectedProperty.currentBalance > 0 ? formatCurrency(selectedProperty.currentBalance) : 'Fully Paid'}
                  </span>
                </div>
                <div className="pt-2">
                  {statusBadge(selectedProperty.status)}
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Payment History</h3>
              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-2.5">Year</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-2.5">Amount Paid</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-2.5">Date</th>
                      <th className="text-left text-xs font-semibold text-gray-500 uppercase px-4 py-2.5">OR Number</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {selectedProperty.paymentHistory.map((ph, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{ph.year}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{formatCurrency(ph.amount)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{ph.date}</td>
                        <td className="px-4 py-3 text-sm text-blue-600 font-medium">{ph.or}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Process Payment Button */}
            <div className="flex justify-end gap-3 pt-2">
              <button className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                <Printer className="w-4 h-4" />
                Print Statement
              </button>
              <button className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                <CreditCard className="w-4 h-4" />
                Process Payment
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ───── 6. Delinquent Accounts Section ───── */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Delinquent Accounts</h2>

        {/* Alert Card */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-4">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-100 shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-red-800">342 accounts with outstanding balances totaling ₱12.4M</p>
            <p className="text-sm text-red-600 mt-1">
              These accounts have unpaid real property taxes for 2 or more consecutive years.
              Immediate action recommended to improve collection rate.
            </p>
          </div>
        </div>

        {/* Delinquent Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Top Delinquent Accounts</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {['TD Number', 'Owner', 'Barangay', 'Years Delinquent', 'Total Arrears', 'Action'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-6 py-3 bg-gray-50/50">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {delinquentAccounts.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-blue-600">{d.tdNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{d.owner}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{d.barangay}</td>
                    <td className="px-6 py-4">
                      <Badge variant="danger">{d.yearsDelinquent} years</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-red-600">{formatCurrency(d.totalArrears)}</td>
                    <td className="px-6 py-4">
                      <button className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                        <Send className="w-3.5 h-3.5" />
                        Send Notice
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ───── 7. Collection Charts ───── */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Collection Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tax Collection by Month */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Tax Collection by Month (2025)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyCollection} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`} />
                  <Tooltip
                    formatter={((value: any) => [formatCurrency(Number(value)), '']) as any}
                    contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }}
                  />
                  <Bar dataKey="collected" name="Collected" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="target" name="Target" fill="#e2e8f0" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Collection by Classification */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Collection by Classification</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={classificationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    nameKey="name"
                  >
                    {classificationData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={((value: any) => [formatCurrency(Number(value)), '']) as any}
                    contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={10}
                    formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Year-over-Year Comparison */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Year-over-Year Collection Comparison</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yearOverYear}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`} />
                  <Tooltip
                    formatter={((value: any) => [formatCurrency(Number(value)), '']) as any}
                    contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }}
                  />
                  <Legend
                    verticalAlign="top"
                    iconType="circle"
                    iconSize={10}
                    formatter={(value) => <span className="text-sm text-gray-600">{value === 'yr2025' ? '2025' : '2024'}</span>}
                  />
                  <Line type="monotone" dataKey="yr2025" name="yr2025" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="yr2024" name="yr2024" stroke="#94a3b8" strokeWidth={2} strokeDasharray="6 3" dot={{ r: 3, fill: '#94a3b8' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ───── 8. Property Classification Cards ───── */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Property Classification Breakdown</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {classCards.map((card) => {
            const CardIcon = card.icon;
            return (
              <div key={card.label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className={classNames(
                    'flex items-center justify-center w-12 h-12 rounded-xl ring-1',
                    card.color === 'blue' && 'bg-blue-50 ring-blue-100',
                    card.color === 'amber' && 'bg-amber-50 ring-amber-100',
                    card.color === 'green' && 'bg-emerald-50 ring-emerald-100',
                    card.color === 'purple' && 'bg-purple-50 ring-purple-100',
                  )}>
                    <CardIcon className={classNames(
                      'w-6 h-6',
                      colorIcon[card.color],
                    )} />
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-500 mb-1">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(card.count)}</p>
                <p className="text-sm text-gray-500 mt-1">Assessed: {card.assessedTotal}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ───── 9. Notices/Reminders Section ───── */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Notices & Reminders</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Generate Notice Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 ring-1 ring-blue-100">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900">Generate Notice</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Notice Type</label>
                <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400">
                  <option>Delinquency Notice</option>
                  <option>Payment Reminder</option>
                  <option>Assessment Update</option>
                  <option>Annual Tax Statement</option>
                  <option>Final Warning</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Target Recipients</label>
                <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400">
                  <option>All Delinquent Accounts (342)</option>
                  <option>Unpaid Current Year (1,205)</option>
                  <option>All Property Owners (3,842)</option>
                  <option>Custom Selection</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Delivery Method</label>
                <select className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400">
                  <option>Print &amp; Mail</option>
                  <option>SMS Notification</option>
                  <option>Email</option>
                  <option>Print &amp; Mail + SMS</option>
                </select>
              </div>
              <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                <Send className="w-4 h-4" />
                Generate &amp; Send
              </button>
            </div>
          </div>

          {/* Recent Notices */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-sm font-semibold text-gray-900">Recently Generated Notices</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {recentNotices.map((n) => (
                <div key={n.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={classNames(
                      'flex items-center justify-center w-9 h-9 rounded-lg',
                      n.status === 'Sent' ? 'bg-emerald-50' : n.status === 'Pending' ? 'bg-amber-50' : 'bg-gray-50',
                    )}>
                      {n.status === 'Sent' ? (
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                      ) : n.status === 'Pending' ? (
                        <Clock className="w-4.5 h-4.5 text-amber-600" />
                      ) : (
                        <FileText className="w-4.5 h-4.5 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{n.type}</p>
                      <p className="text-xs text-gray-500">{n.date} &middot; {formatNumber(n.count)} recipients</p>
                    </div>
                  </div>
                  <Badge variant={n.status === 'Sent' ? 'success' : n.status === 'Pending' ? 'warning' : 'neutral'}>
                    {n.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
