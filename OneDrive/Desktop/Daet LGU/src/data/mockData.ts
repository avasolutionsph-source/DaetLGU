// =============================================================================
// SMART LGU ERP System – Municipality of Daet, Camarines Norte
// Comprehensive Mock Data
// =============================================================================

// -----------------------------------------------------------------------------
// TYPES & INTERFACES
// -----------------------------------------------------------------------------

export interface RevenueMonth {
  month: string;
  amount: number;
  target: number;
  year: number;
}

export interface DailyCollection {
  id: string;
  date: string;
  cashier: string;
  source: string;
  amount: number;
  receiptNumber: string;
  payorName: string;
  department: string;
}

export interface CollectionSource {
  source: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface RevenueByDepartment {
  department: string;
  revenue: number;
  target: number;
  percentage: number;
}

export interface BusinessPermit {
  id: string;
  businessName: string;
  owner: string;
  type: string;
  address: string;
  barangay: string;
  status: 'pending' | 'under-review' | 'approved' | 'released' | 'rejected';
  applicationDate: string;
  expiryDate: string;
  amount: number;
  capitalInvestment: number;
  contactNumber: string;
  requirements: { name: string; completed: boolean }[];
}

export interface PermitCategory {
  id: string;
  name: string;
  count: number;
  icon: string;
}

export interface PermitStats {
  totalApplications: number;
  pending: number;
  approved: number;
  released: number;
  rejected: number;
  totalRevenue: number;
}

export interface PropertyRecord {
  id: string;
  owner: string;
  tdNumber: string;
  location: string;
  barangay: string;
  classification: 'residential' | 'commercial' | 'agricultural' | 'industrial';
  assessedValue: number;
  marketValue: number;
  taxDue: number;
  status: 'paid' | 'unpaid' | 'delinquent';
  lastPayment: string;
  area: string;
  lotNumber: string;
}

export interface PropertyTaxStats {
  totalCollected: number;
  totalAssessed: number;
  collectionRate: number;
  totalProperties: number;
  paidCount: number;
  unpaidCount: number;
  delinquentCount: number;
}

export interface DelinquentAccount {
  id: string;
  owner: string;
  tdNumber: string;
  barangay: string;
  totalDue: number;
  yearsDelinquent: number;
  lastPayment: string;
  penalties: number;
}

export interface DocumentRecord {
  id: string;
  referenceNumber: string;
  subject: string;
  type: 'incoming' | 'outgoing';
  origin: string;
  destination: string;
  currentOffice: string;
  status: 'received' | 'in-transit' | 'pending-action' | 'completed' | 'delayed';
  priority: 'high' | 'medium' | 'low';
  dateReceived: string;
  remarks: string;
  routingHistory: { office: string; action: string; date: string; handler: string }[];
}

export interface DocumentStats {
  totalDocuments: number;
  incoming: number;
  outgoing: number;
  pending: number;
  completed: number;
  delayed: number;
}

export interface CitizenRequest {
  id: string;
  referenceNumber: string;
  type: 'complaint' | 'request' | 'inquiry';
  subject: string;
  description: string;
  citizenName: string;
  contact: string;
  barangay: string;
  status: 'submitted' | 'processing' | 'resolved' | 'closed';
  dateSubmitted: string;
  assignedTo: string;
  timeline: { date: string; status: string; note: string }[];
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  department: string;
  averageProcessingDays: number;
}

export interface EmergencyIncident {
  id: string;
  type: 'accident' | 'flooding' | 'fire' | 'crime' | 'medical';
  location: string;
  barangay: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'reported' | 'verified' | 'dispatched' | 'resolved';
  reportedAt: string;
  respondedAt: string;
  description: string;
  responders: string[];
  reporter: string;
  contactNumber: string;
}

export interface EmergencyStats {
  totalIncidents: number;
  active: number;
  resolved: number;
  averageResponseMinutes: number;
  bySeverity: { critical: number; high: number; medium: number; low: number };
  byType: { accident: number; flooding: number; fire: number; crime: number; medical: number };
}

export interface AgencyContact {
  id: string;
  agency: string;
  contactPerson: string;
  position: string;
  phone: string;
  email: string;
  address: string;
}

export interface InfrastructureProject {
  id: string;
  name: string;
  type: 'road' | 'drainage' | 'building' | 'bridge';
  contractor: string;
  location: string;
  barangay: string;
  budget: number;
  spent: number;
  progress: number;
  status: 'planning' | 'ongoing' | 'delayed' | 'completed';
  startDate: string;
  endDate: string;
  description: string;
  fundSource: string;
  photos: string[];
}

export interface ProjectStats {
  totalProjects: number;
  ongoing: number;
  completed: number;
  delayed: number;
  totalBudget: number;
  totalSpent: number;
}

export interface DashboardStat {
  label: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: string;
}

export interface RecentActivity {
  id: string;
  action: string;
  description: string;
  user: string;
  department: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  priority: 'critical' | 'high' | 'medium' | 'low';
  read: boolean;
  timestamp: string;
  time: string;
  link?: string;
}

export interface DepartmentPerformance {
  department: string;
  name: string;
  tasksCompleted: number;
  completed: number;
  tasksTotal: number;
  pending: number;
  efficiency: number;
  satisfaction: number;
  color: string;
}

export interface BarangaySnapshot {
  barangay: string;
  name: string;
  population: number;
  activeCases: number;
  incidents: number;
  permits: number;
  collections: number;
  projects: number;
  revenue: number;
}

export interface Alert {
  type: string;
  severity: 'red' | 'amber';
  title: string;
  description: string;
  count: number;
  link: string;
}

export interface QuickNavItem {
  title: string;
  description: string;
  link: string;
  iconName: string;
  color: string;
}

export interface ChartDataPoint {
  [key: string]: string | number;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  status: 'active' | 'on-leave' | 'resigned' | 'retired';
  dateHired: string;
  contactNumber: string;
  email: string;
  employeeNumber: string;
}

export interface Department {
  id: string;
  name: string;
  head: string;
  employeeCount: number;
  budget: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author: string;
  department: string;
  date: string;
  priority: 'high' | 'medium' | 'low';
  pinned: boolean;
}

export interface GISLayer {
  id: string;
  name: string;
  category: string;
  visible: boolean;
  color: string;
  description: string;
}

export interface RiskZone {
  id: string;
  name: string;
  type: 'flood' | 'landslide' | 'storm-surge' | 'fire';
  riskLevel: 'high' | 'medium' | 'low';
  affectedBarangays: string[];
  population: number;
  description: string;
}

export interface AnalyticsInsight {
  id: string;
  title: string;
  description: string;
  metric: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  severity: 'positive' | 'negative' | 'neutral';
  department: string;
}

export interface ForecastDataPoint {
  month: string;
  actual: number | null;
  forecast: number;
  lowerBound: number;
  upperBound: number;
}

export interface RecommendedAction {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  department: string;
  impact: string;
  deadline: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface SystemUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: 'admin' | 'department-head' | 'staff' | 'viewer';
  department: string;
  lastLogin: string;
  status: 'active' | 'inactive' | 'locked';
  avatar?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  module: string;
  user: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export interface SystemSetting {
  key: string;
  label: string;
  value: string | boolean | number;
  category: string;
  description: string;
}

// -----------------------------------------------------------------------------
// BARANGAYS OF DAET
// -----------------------------------------------------------------------------

export const barangays: string[] = [
  'Alawihao',
  'Awitan',
  'Bagasbas',
  'Bibirao',
  'Borabod',
  'Calasgasan',
  'Camambugan',
  'Cobangbang',
  'Daet Proper',
  'Fabrica',
  'Gahonon',
  'Lag-on',
  'Mancruz',
  'Pamorangon',
  'San Isidro',
  'Mantagbac',
];

export const nearbyMunicipalities: string[] = [
  'Mercedes',
  'Basud',
  'Talisay',
  'Vinzons',
];

// -----------------------------------------------------------------------------
// REVENUE / TREASURY
// -----------------------------------------------------------------------------

export const revenueData: RevenueMonth[] = [
  { month: 'Jan', amount: 12_450_000, target: 13_000_000, year: 2026 },
  { month: 'Feb', amount: 10_870_000, target: 11_500_000, year: 2026 },
  { month: 'Mar', amount: 14_320_000, target: 13_500_000, year: 2026 },
  { month: 'Apr', amount: 11_200_000, target: 12_000_000, year: 2026 },
  { month: 'May', amount: 13_680_000, target: 13_000_000, year: 2026 },
  { month: 'Jun', amount: 15_100_000, target: 14_000_000, year: 2026 },
  { month: 'Jul', amount: 14_750_000, target: 14_500_000, year: 2026 },
  { month: 'Aug', amount: 12_900_000, target: 13_000_000, year: 2026 },
  { month: 'Sep', amount: 11_600_000, target: 12_000_000, year: 2026 },
  { month: 'Oct', amount: 13_400_000, target: 13_500_000, year: 2026 },
  { month: 'Nov', amount: 14_200_000, target: 14_000_000, year: 2026 },
  { month: 'Dec', amount: 16_800_000, target: 15_000_000, year: 2026 },
];

export const dailyCollections: DailyCollection[] = [
  {
    id: 'DC-001',
    date: '2026-03-24',
    cashier: 'Maria Santos',
    source: 'Business Tax',
    amount: 45_000,
    receiptNumber: 'OR-2026-0451',
    payorName: 'Daet Trading Corp.',
    department: 'Treasury',
  },
  {
    id: 'DC-002',
    date: '2026-03-24',
    cashier: 'Maria Santos',
    source: 'Real Property Tax',
    amount: 12_500,
    receiptNumber: 'OR-2026-0452',
    payorName: 'Roberto Cruz',
    department: 'Treasury',
  },
  {
    id: 'DC-003',
    date: '2026-03-24',
    cashier: 'Elena Reyes',
    source: 'Community Tax Certificate',
    amount: 500,
    receiptNumber: 'OR-2026-0453',
    payorName: 'Ana Villanueva',
    department: 'Treasury',
  },
  {
    id: 'DC-004',
    date: '2026-03-24',
    cashier: 'Elena Reyes',
    source: 'Building Permit Fees',
    amount: 8_750,
    receiptNumber: 'OR-2026-0454',
    payorName: 'JM Construction',
    department: 'Engineering',
  },
  {
    id: 'DC-005',
    date: '2026-03-24',
    cashier: 'Maria Santos',
    source: 'Market Stall Rental',
    amount: 3_200,
    receiptNumber: 'OR-2026-0455',
    payorName: 'Lorna Dy',
    department: 'Treasury',
  },
  {
    id: 'DC-006',
    date: '2026-03-23',
    cashier: 'Elena Reyes',
    source: 'Business Tax',
    amount: 28_000,
    receiptNumber: 'OR-2026-0446',
    payorName: 'Bagasbas Resort Inn',
    department: 'Treasury',
  },
  {
    id: 'DC-007',
    date: '2026-03-23',
    cashier: 'Maria Santos',
    source: 'Real Property Tax',
    amount: 18_350,
    receiptNumber: 'OR-2026-0447',
    payorName: 'Heirs of Alejandro Tan',
    department: 'Treasury',
  },
  {
    id: 'DC-008',
    date: '2026-03-23',
    cashier: 'Maria Santos',
    source: 'Fees & Charges',
    amount: 2_100,
    receiptNumber: 'OR-2026-0448',
    payorName: 'Pedro Ramirez',
    department: 'Civil Registry',
  },
  {
    id: 'DC-009',
    date: '2026-03-23',
    cashier: 'Elena Reyes',
    source: 'Occupation Permit',
    amount: 5_000,
    receiptNumber: 'OR-2026-0449',
    payorName: 'Camarines Norte Electric Coop.',
    department: 'Engineering',
  },
  {
    id: 'DC-010',
    date: '2026-03-22',
    cashier: 'Maria Santos',
    source: 'Business Tax',
    amount: 35_600,
    receiptNumber: 'OR-2026-0441',
    payorName: 'Metro Daet Pharmacy',
    department: 'Treasury',
  },
  {
    id: 'DC-011',
    date: '2026-03-22',
    cashier: 'Elena Reyes',
    source: 'Real Property Tax',
    amount: 9_800,
    receiptNumber: 'OR-2026-0442',
    payorName: 'Spouses Bautista',
    department: 'Treasury',
  },
  {
    id: 'DC-012',
    date: '2026-03-22',
    cashier: 'Elena Reyes',
    source: 'Zoning Clearance',
    amount: 1_500,
    receiptNumber: 'OR-2026-0443',
    payorName: 'Carla Mendoza',
    department: 'Planning & Development',
  },
];

export const collectionSources: CollectionSource[] = [
  { source: 'Business Tax', amount: 48_500_000, percentage: 31.2, count: 1_245 },
  { source: 'Real Property Tax', amount: 38_200_000, percentage: 24.6, count: 3_890 },
  { source: 'Fees & Charges', amount: 22_100_000, percentage: 14.2, count: 8_520 },
  { source: 'Community Tax Certificate', amount: 8_900_000, percentage: 5.7, count: 15_200 },
  { source: 'Building Permit Fees', amount: 12_300_000, percentage: 7.9, count: 620 },
  { source: 'Market Stall Rental', amount: 9_400_000, percentage: 6.1, count: 480 },
  { source: 'Occupation Permit', amount: 5_200_000, percentage: 3.3, count: 310 },
  { source: 'Zoning Clearance', amount: 4_100_000, percentage: 2.6, count: 540 },
  { source: 'Other Income', amount: 6_800_000, percentage: 4.4, count: 2_100 },
];

export const revenueByDepartment: RevenueByDepartment[] = [
  { department: 'Treasury', revenue: 98_500_000, target: 105_000_000, percentage: 93.8 },
  { department: 'Engineering', revenue: 17_500_000, target: 18_000_000, percentage: 97.2 },
  { department: 'Planning & Development', revenue: 4_100_000, target: 4_500_000, percentage: 91.1 },
  { department: 'Civil Registry', revenue: 6_200_000, target: 6_000_000, percentage: 103.3 },
  { department: 'Health Office', revenue: 3_800_000, target: 4_000_000, percentage: 95.0 },
  { department: 'Market Operations', revenue: 9_400_000, target: 10_000_000, percentage: 94.0 },
  { department: 'Social Welfare', revenue: 1_200_000, target: 1_500_000, percentage: 80.0 },
  { department: 'Agriculture', revenue: 2_300_000, target: 2_500_000, percentage: 92.0 },
];

// -----------------------------------------------------------------------------
// BUSINESS PERMITS
// -----------------------------------------------------------------------------

export const businessPermits: BusinessPermit[] = [
  {
    id: 'BP-2026-001',
    businessName: 'Daet Trading Corporation',
    owner: 'Ricardo Tan',
    type: 'Retail',
    address: 'J. Lukban St., Daet Proper',
    barangay: 'Daet Proper',
    status: 'released',
    applicationDate: '2026-01-05',
    expiryDate: '2026-12-31',
    amount: 45_000,
    capitalInvestment: 5_000_000,
    contactNumber: '09171234567',
    requirements: [
      { name: 'Barangay Clearance', completed: true },
      { name: 'DTI Registration', completed: true },
      { name: 'Fire Safety Inspection', completed: true },
      { name: 'Sanitary Permit', completed: true },
      { name: 'Zoning Clearance', completed: true },
    ],
  },
  {
    id: 'BP-2026-002',
    businessName: 'Bagasbas Surf & Resort Inn',
    owner: 'Jennifer Alvarez',
    type: 'Hospitality',
    address: 'Bagasbas Beach Rd.',
    barangay: 'Bagasbas',
    status: 'released',
    applicationDate: '2026-01-08',
    expiryDate: '2026-12-31',
    amount: 28_000,
    capitalInvestment: 3_200_000,
    contactNumber: '09189876543',
    requirements: [
      { name: 'Barangay Clearance', completed: true },
      { name: 'DTI Registration', completed: true },
      { name: 'Fire Safety Inspection', completed: true },
      { name: 'Sanitary Permit', completed: true },
      { name: 'DOT Accreditation', completed: true },
      { name: 'Zoning Clearance', completed: true },
    ],
  },
  {
    id: 'BP-2026-003',
    businessName: 'Metro Daet Pharmacy',
    owner: 'Dr. Ernesto Villanueva',
    type: 'Pharmaceutical',
    address: 'Vinzons Ave., Borabod',
    barangay: 'Borabod',
    status: 'approved',
    applicationDate: '2026-01-12',
    expiryDate: '2026-12-31',
    amount: 35_600,
    capitalInvestment: 4_500_000,
    contactNumber: '09201234567',
    requirements: [
      { name: 'Barangay Clearance', completed: true },
      { name: 'DTI Registration', completed: true },
      { name: 'Fire Safety Inspection', completed: true },
      { name: 'Sanitary Permit', completed: true },
      { name: 'FDA License to Operate', completed: true },
      { name: 'Pharmacist License', completed: true },
    ],
  },
  {
    id: 'BP-2026-004',
    businessName: 'Kusina ni Maria Restaurant',
    owner: 'Maria Luisa Gomez',
    type: 'Food & Beverage',
    address: 'Maharlika Highway, Alawihao',
    barangay: 'Alawihao',
    status: 'released',
    applicationDate: '2026-01-15',
    expiryDate: '2026-12-31',
    amount: 15_000,
    capitalInvestment: 1_500_000,
    contactNumber: '09331234567',
    requirements: [
      { name: 'Barangay Clearance', completed: true },
      { name: 'DTI Registration', completed: true },
      { name: 'Fire Safety Inspection', completed: true },
      { name: 'Sanitary Permit', completed: true },
      { name: 'Health Certificate', completed: true },
    ],
  },
  {
    id: 'BP-2026-005',
    businessName: 'CamNorte Hardware & Construction Supply',
    owner: 'Antonio Lim',
    type: 'Retail',
    address: 'F. Pimentel Ave., Calasgasan',
    barangay: 'Calasgasan',
    status: 'under-review',
    applicationDate: '2026-03-10',
    expiryDate: '',
    amount: 52_000,
    capitalInvestment: 8_000_000,
    contactNumber: '09451234567',
    requirements: [
      { name: 'Barangay Clearance', completed: true },
      { name: 'DTI Registration', completed: true },
      { name: 'Fire Safety Inspection', completed: false },
      { name: 'Sanitary Permit', completed: true },
      { name: 'Zoning Clearance', completed: true },
    ],
  },
  {
    id: 'BP-2026-006',
    businessName: 'Daet Internet Cafe & Gaming Hub',
    owner: 'Mark Angelo Reyes',
    type: 'Services',
    address: 'Gov. Pimentel St., Cobangbang',
    barangay: 'Cobangbang',
    status: 'pending',
    applicationDate: '2026-03-18',
    expiryDate: '',
    amount: 8_500,
    capitalInvestment: 800_000,
    contactNumber: '09561234567',
    requirements: [
      { name: 'Barangay Clearance', completed: true },
      { name: 'DTI Registration', completed: true },
      { name: 'Fire Safety Inspection', completed: false },
      { name: 'Sanitary Permit', completed: false },
      { name: 'Zoning Clearance', completed: false },
    ],
  },
  {
    id: 'BP-2026-007',
    businessName: 'Golden Harvest Rice Mill',
    owner: 'Spouses Roberto & Elena Dela Cruz',
    type: 'Manufacturing',
    address: 'Purok 3, Pamorangon',
    barangay: 'Pamorangon',
    status: 'released',
    applicationDate: '2026-01-20',
    expiryDate: '2026-12-31',
    amount: 22_000,
    capitalInvestment: 6_500_000,
    contactNumber: '09171239876',
    requirements: [
      { name: 'Barangay Clearance', completed: true },
      { name: 'DTI Registration', completed: true },
      { name: 'Fire Safety Inspection', completed: true },
      { name: 'Sanitary Permit', completed: true },
      { name: 'Environmental Clearance', completed: true },
    ],
  },
  {
    id: 'BP-2026-008',
    businessName: 'Bicol Express Logistics',
    owner: 'Fernando Santos',
    type: 'Transportation',
    address: 'National Highway, Mancruz',
    barangay: 'Mancruz',
    status: 'released',
    applicationDate: '2026-01-25',
    expiryDate: '2026-12-31',
    amount: 18_000,
    capitalInvestment: 3_000_000,
    contactNumber: '09185551234',
    requirements: [
      { name: 'Barangay Clearance', completed: true },
      { name: 'DTI Registration', completed: true },
      { name: 'Fire Safety Inspection', completed: true },
      { name: 'LTO Franchise', completed: true },
    ],
  },
  {
    id: 'BP-2026-009',
    businessName: 'Sunrise Bakery & Pastry Shop',
    owner: 'Rosalinda Perez',
    type: 'Food & Beverage',
    address: 'Market Area, Lag-on',
    barangay: 'Lag-on',
    status: 'approved',
    applicationDate: '2026-02-14',
    expiryDate: '2026-12-31',
    amount: 10_000,
    capitalInvestment: 900_000,
    contactNumber: '09271234567',
    requirements: [
      { name: 'Barangay Clearance', completed: true },
      { name: 'DTI Registration', completed: true },
      { name: 'Fire Safety Inspection', completed: true },
      { name: 'Sanitary Permit', completed: true },
      { name: 'Health Certificate', completed: true },
    ],
  },
  {
    id: 'BP-2026-010',
    businessName: 'TechZone Computer Sales & Services',
    owner: 'Kevin Christopher Ong',
    type: 'Retail',
    address: 'CM Recto St., Daet Proper',
    barangay: 'Daet Proper',
    status: 'released',
    applicationDate: '2026-01-03',
    expiryDate: '2026-12-31',
    amount: 25_000,
    capitalInvestment: 2_800_000,
    contactNumber: '09181234567',
    requirements: [
      { name: 'Barangay Clearance', completed: true },
      { name: 'DTI Registration', completed: true },
      { name: 'Fire Safety Inspection', completed: true },
      { name: 'Sanitary Permit', completed: true },
      { name: 'BIR Registration', completed: true },
    ],
  },
  {
    id: 'BP-2026-011',
    businessName: 'Daet Memorial Garden & Chapel',
    owner: 'Heirs of Gregorio Panganiban',
    type: 'Services',
    address: 'Brgy. Gahonon',
    barangay: 'Gahonon',
    status: 'released',
    applicationDate: '2026-01-10',
    expiryDate: '2026-12-31',
    amount: 20_000,
    capitalInvestment: 12_000_000,
    contactNumber: '09171112233',
    requirements: [
      { name: 'Barangay Clearance', completed: true },
      { name: 'DTI Registration', completed: true },
      { name: 'Fire Safety Inspection', completed: true },
      { name: 'Sanitary Permit', completed: true },
      { name: 'Environmental Clearance', completed: true },
    ],
  },
  {
    id: 'BP-2026-012',
    businessName: 'CamNorte Agri-Products Trading',
    owner: 'Eduardo Fuentebella',
    type: 'Wholesale',
    address: 'Purok 5, Bibirao',
    barangay: 'Bibirao',
    status: 'pending',
    applicationDate: '2026-03-20',
    expiryDate: '',
    amount: 30_000,
    capitalInvestment: 4_200_000,
    contactNumber: '09209876543',
    requirements: [
      { name: 'Barangay Clearance', completed: true },
      { name: 'DTI Registration', completed: false },
      { name: 'Fire Safety Inspection', completed: false },
      { name: 'Sanitary Permit', completed: false },
      { name: 'Zoning Clearance', completed: false },
    ],
  },
  {
    id: 'BP-2026-013',
    businessName: 'Lola Inday Pili Nut Products',
    owner: 'Concordia Abogado',
    type: 'Manufacturing',
    address: 'San Isidro Rd.',
    barangay: 'San Isidro',
    status: 'under-review',
    applicationDate: '2026-03-05',
    expiryDate: '',
    amount: 12_000,
    capitalInvestment: 1_200_000,
    contactNumber: '09175551234',
    requirements: [
      { name: 'Barangay Clearance', completed: true },
      { name: 'DTI Registration', completed: true },
      { name: 'Fire Safety Inspection', completed: true },
      { name: 'Sanitary Permit', completed: false },
      { name: 'FDA Registration', completed: true },
    ],
  },
  {
    id: 'BP-2026-014',
    businessName: "Surfer's Den Beach Hostel",
    owner: 'Patrick James Vargas',
    type: 'Hospitality',
    address: 'Bagasbas Beach Rd.',
    barangay: 'Bagasbas',
    status: 'rejected',
    applicationDate: '2026-02-20',
    expiryDate: '',
    amount: 0,
    capitalInvestment: 2_000_000,
    contactNumber: '09191234567',
    requirements: [
      { name: 'Barangay Clearance', completed: true },
      { name: 'DTI Registration', completed: true },
      { name: 'Fire Safety Inspection', completed: false },
      { name: 'Sanitary Permit', completed: false },
      { name: 'DOT Accreditation', completed: false },
      { name: 'Zoning Clearance', completed: false },
    ],
  },
  {
    id: 'BP-2026-015',
    businessName: 'Daet Public Market Vendors Association Store',
    owner: 'Cynthia Maravilla',
    type: 'Retail',
    address: 'Municipal Public Market, Awitan',
    barangay: 'Awitan',
    status: 'released',
    applicationDate: '2026-01-02',
    expiryDate: '2026-12-31',
    amount: 6_500,
    capitalInvestment: 500_000,
    contactNumber: '09281234567',
    requirements: [
      { name: 'Barangay Clearance', completed: true },
      { name: 'DTI Registration', completed: true },
      { name: 'Fire Safety Inspection', completed: true },
      { name: 'Sanitary Permit', completed: true },
    ],
  },
  {
    id: 'BP-2026-016',
    businessName: 'Mantagbac Poultry Farm',
    owner: 'Danilo Reyes Jr.',
    type: 'Agriculture',
    address: 'Sitio Malabog, Mantagbac',
    barangay: 'Mantagbac',
    status: 'approved',
    applicationDate: '2026-02-28',
    expiryDate: '2026-12-31',
    amount: 14_000,
    capitalInvestment: 2_500_000,
    contactNumber: '09351234567',
    requirements: [
      { name: 'Barangay Clearance', completed: true },
      { name: 'DTI Registration', completed: true },
      { name: 'Environmental Clearance', completed: true },
      { name: 'DA Registration', completed: true },
    ],
  },
];

export const permitCategories: PermitCategory[] = [
  { id: 'cat-1', name: 'Retail', count: 4, icon: 'ShoppingBag' },
  { id: 'cat-2', name: 'Food & Beverage', count: 2, icon: 'UtensilsCrossed' },
  { id: 'cat-3', name: 'Services', count: 2, icon: 'Briefcase' },
  { id: 'cat-4', name: 'Manufacturing', count: 2, icon: 'Factory' },
  { id: 'cat-5', name: 'Hospitality', count: 2, icon: 'Hotel' },
  { id: 'cat-6', name: 'Transportation', count: 1, icon: 'Truck' },
  { id: 'cat-7', name: 'Wholesale', count: 1, icon: 'Warehouse' },
  { id: 'cat-8', name: 'Pharmaceutical', count: 1, icon: 'Pill' },
  { id: 'cat-9', name: 'Agriculture', count: 1, icon: 'Sprout' },
];

export const permitStats: PermitStats = {
  totalApplications: 16,
  pending: 2,
  approved: 3,
  released: 9,
  rejected: 1,
  totalRevenue: 341_600,
};

// -----------------------------------------------------------------------------
// REAL PROPERTY TAX
// -----------------------------------------------------------------------------

export const propertyRecords: PropertyRecord[] = [
  {
    id: 'RPT-001',
    owner: 'Roberto Cruz',
    tdNumber: 'TD-2024-001234',
    location: 'Lot 12, Blk 3, Vinzons Ave.',
    barangay: 'Borabod',
    classification: 'residential',
    assessedValue: 850_000,
    marketValue: 2_500_000,
    taxDue: 8_500,
    status: 'paid',
    lastPayment: '2026-01-15',
    area: '250 sqm',
    lotNumber: 'Lot 12-B',
  },
  {
    id: 'RPT-002',
    owner: 'Heirs of Alejandro Tan',
    tdNumber: 'TD-2023-005678',
    location: 'J. Lukban St.',
    barangay: 'Daet Proper',
    classification: 'commercial',
    assessedValue: 3_200_000,
    marketValue: 8_000_000,
    taxDue: 48_000,
    status: 'paid',
    lastPayment: '2026-03-23',
    area: '450 sqm',
    lotNumber: 'Lot 8-A',
  },
  {
    id: 'RPT-003',
    owner: 'Spouses Bautista',
    tdNumber: 'TD-2022-003456',
    location: 'Purok 2, Brgy. Calasgasan',
    barangay: 'Calasgasan',
    classification: 'residential',
    assessedValue: 420_000,
    marketValue: 1_200_000,
    taxDue: 4_200,
    status: 'paid',
    lastPayment: '2026-03-22',
    area: '180 sqm',
    lotNumber: 'Lot 45',
  },
  {
    id: 'RPT-004',
    owner: 'Golden Harvest Rice Mill Inc.',
    tdNumber: 'TD-2021-009876',
    location: 'National Highway, Pamorangon',
    barangay: 'Pamorangon',
    classification: 'industrial',
    assessedValue: 5_600_000,
    marketValue: 14_000_000,
    taxDue: 84_000,
    status: 'unpaid',
    lastPayment: '2025-03-10',
    area: '2,500 sqm',
    lotNumber: 'Lot 102',
  },
  {
    id: 'RPT-005',
    owner: 'Concordia Abogado',
    tdNumber: 'TD-2024-002345',
    location: 'San Isidro Rd.',
    barangay: 'San Isidro',
    classification: 'agricultural',
    assessedValue: 180_000,
    marketValue: 600_000,
    taxDue: 1_800,
    status: 'paid',
    lastPayment: '2026-02-28',
    area: '10,000 sqm',
    lotNumber: 'Lot 78-C',
  },
  {
    id: 'RPT-006',
    owner: 'Jennifer Alvarez',
    tdNumber: 'TD-2023-004567',
    location: 'Bagasbas Beach Rd.',
    barangay: 'Bagasbas',
    classification: 'commercial',
    assessedValue: 4_800_000,
    marketValue: 12_000_000,
    taxDue: 72_000,
    status: 'paid',
    lastPayment: '2026-01-08',
    area: '800 sqm',
    lotNumber: 'Lot 5-A',
  },
  {
    id: 'RPT-007',
    owner: 'Danilo Reyes Jr.',
    tdNumber: 'TD-2020-007890',
    location: 'Sitio Malabog',
    barangay: 'Mantagbac',
    classification: 'agricultural',
    assessedValue: 350_000,
    marketValue: 1_200_000,
    taxDue: 3_500,
    status: 'delinquent',
    lastPayment: '2023-06-15',
    area: '20,000 sqm',
    lotNumber: 'Lot 201',
  },
  {
    id: 'RPT-008',
    owner: 'Heirs of Gregorio Panganiban',
    tdNumber: 'TD-2019-006543',
    location: 'Brgy. Gahonon Main Rd.',
    barangay: 'Gahonon',
    classification: 'commercial',
    assessedValue: 6_200_000,
    marketValue: 15_500_000,
    taxDue: 93_000,
    status: 'delinquent',
    lastPayment: '2024-01-20',
    area: '3,000 sqm',
    lotNumber: 'Lot 15',
  },
  {
    id: 'RPT-009',
    owner: 'Antonio Lim',
    tdNumber: 'TD-2024-008765',
    location: 'F. Pimentel Ave.',
    barangay: 'Calasgasan',
    classification: 'commercial',
    assessedValue: 2_800_000,
    marketValue: 7_000_000,
    taxDue: 42_000,
    status: 'unpaid',
    lastPayment: '2025-12-28',
    area: '600 sqm',
    lotNumber: 'Lot 33',
  },
  {
    id: 'RPT-010',
    owner: 'Fernando Santos',
    tdNumber: 'TD-2022-001122',
    location: 'National Highway',
    barangay: 'Mancruz',
    classification: 'commercial',
    assessedValue: 1_500_000,
    marketValue: 3_800_000,
    taxDue: 22_500,
    status: 'paid',
    lastPayment: '2026-01-25',
    area: '400 sqm',
    lotNumber: 'Lot 67',
  },
  {
    id: 'RPT-011',
    owner: 'Maricel Garcia',
    tdNumber: 'TD-2023-003344',
    location: 'Purok 4, Fabrica',
    barangay: 'Fabrica',
    classification: 'residential',
    assessedValue: 320_000,
    marketValue: 950_000,
    taxDue: 3_200,
    status: 'paid',
    lastPayment: '2026-02-10',
    area: '150 sqm',
    lotNumber: 'Lot 89',
  },
  {
    id: 'RPT-012',
    owner: 'Eduardo Fuentebella',
    tdNumber: 'TD-2021-005566',
    location: 'Purok 5, Bibirao',
    barangay: 'Bibirao',
    classification: 'agricultural',
    assessedValue: 480_000,
    marketValue: 1_600_000,
    taxDue: 4_800,
    status: 'delinquent',
    lastPayment: '2022-08-30',
    area: '30,000 sqm',
    lotNumber: 'Lot 150',
  },
  {
    id: 'RPT-013',
    owner: 'Rosa Maria Dizon',
    tdNumber: 'TD-2024-009988',
    location: 'Purok 1, Cobangbang',
    barangay: 'Cobangbang',
    classification: 'residential',
    assessedValue: 550_000,
    marketValue: 1_600_000,
    taxDue: 5_500,
    status: 'unpaid',
    lastPayment: '2025-04-15',
    area: '200 sqm',
    lotNumber: 'Lot 22-A',
  },
  {
    id: 'RPT-014',
    owner: 'Lorna Dy',
    tdNumber: 'TD-2023-007700',
    location: 'Awitan Market Area',
    barangay: 'Awitan',
    classification: 'commercial',
    assessedValue: 1_100_000,
    marketValue: 2_750_000,
    taxDue: 16_500,
    status: 'paid',
    lastPayment: '2026-01-20',
    area: '120 sqm',
    lotNumber: 'Lot 11',
  },
  {
    id: 'RPT-015',
    owner: 'Camambugan Farmers Cooperative',
    tdNumber: 'TD-2020-004400',
    location: 'Brgy. Camambugan',
    barangay: 'Camambugan',
    classification: 'agricultural',
    assessedValue: 750_000,
    marketValue: 2_500_000,
    taxDue: 7_500,
    status: 'paid',
    lastPayment: '2026-03-01',
    area: '50,000 sqm',
    lotNumber: 'Lot 300',
  },
  {
    id: 'RPT-016',
    owner: 'Pedro Ramirez',
    tdNumber: 'TD-2022-006677',
    location: 'Lag-on Interior',
    barangay: 'Lag-on',
    classification: 'residential',
    assessedValue: 280_000,
    marketValue: 800_000,
    taxDue: 2_800,
    status: 'unpaid',
    lastPayment: '2025-06-30',
    area: '120 sqm',
    lotNumber: 'Lot 55',
  },
];

export const propertyTaxStats: PropertyTaxStats = {
  totalCollected: 38_200_000,
  totalAssessed: 52_800_000,
  collectionRate: 72.3,
  totalProperties: 4_250,
  paidCount: 2_890,
  unpaidCount: 850,
  delinquentCount: 510,
};

export const delinquentAccounts: DelinquentAccount[] = [
  {
    id: 'DEL-001',
    owner: 'Danilo Reyes Jr.',
    tdNumber: 'TD-2020-007890',
    barangay: 'Mantagbac',
    totalDue: 14_000,
    yearsDelinquent: 3,
    lastPayment: '2023-06-15',
    penalties: 4_200,
  },
  {
    id: 'DEL-002',
    owner: 'Heirs of Gregorio Panganiban',
    tdNumber: 'TD-2019-006543',
    barangay: 'Gahonon',
    totalDue: 186_000,
    yearsDelinquent: 2,
    lastPayment: '2024-01-20',
    penalties: 37_200,
  },
  {
    id: 'DEL-003',
    owner: 'Eduardo Fuentebella',
    tdNumber: 'TD-2021-005566',
    barangay: 'Bibirao',
    totalDue: 19_200,
    yearsDelinquent: 4,
    lastPayment: '2022-08-30',
    penalties: 7_680,
  },
  {
    id: 'DEL-004',
    owner: 'Heirs of Simplicio Aguilar',
    tdNumber: 'TD-2018-002211',
    barangay: 'Alawihao',
    totalDue: 45_000,
    yearsDelinquent: 5,
    lastPayment: '2021-03-15',
    penalties: 22_500,
  },
  {
    id: 'DEL-005',
    owner: 'Carmen Montoya',
    tdNumber: 'TD-2019-008899',
    barangay: 'Lag-on',
    totalDue: 8_400,
    yearsDelinquent: 3,
    lastPayment: '2023-01-10',
    penalties: 2_520,
  },
];

// -----------------------------------------------------------------------------
// DOCUMENT TRACKING
// -----------------------------------------------------------------------------

export const documents: DocumentRecord[] = [
  {
    id: 'DOC-2026-001',
    referenceNumber: 'DOC-INC-2026-0145',
    subject: 'Request for Additional DRRM Equipment from MDRRMO',
    type: 'incoming',
    origin: 'MDRRMO',
    destination: "Mayor's Office",
    currentOffice: 'Budget Office',
    status: 'in-transit',
    priority: 'high',
    dateReceived: '2026-03-20',
    remarks: 'Urgent request for typhoon season preparedness',
    routingHistory: [
      { office: 'Records Section', action: 'Received & Logged', date: '2026-03-20', handler: 'Juan Dela Cruz' },
      { office: "Mayor's Office", action: 'Reviewed & Endorsed', date: '2026-03-21', handler: 'Mayor Jonatan Rosales' },
      { office: 'Budget Office', action: 'For fund availability check', date: '2026-03-22', handler: 'Alma Pascual' },
    ],
  },
  {
    id: 'DOC-2026-002',
    referenceNumber: 'DOC-OUT-2026-0078',
    subject: 'Municipal Resolution No. 2026-015 - Supplemental Budget',
    type: 'outgoing',
    origin: 'Sangguniang Bayan',
    destination: 'Provincial Government - Camarines Norte',
    currentOffice: 'Provincial Capitol',
    status: 'completed',
    priority: 'high',
    dateReceived: '2026-03-10',
    remarks: 'For review and approval by the Sangguniang Panlalawigan',
    routingHistory: [
      { office: 'SB Secretary', action: 'Prepared & Signed', date: '2026-03-10', handler: 'Atty. Marco Villafuerte' },
      { office: "Mayor's Office", action: 'Co-signed', date: '2026-03-11', handler: 'Mayor Jonatan Rosales' },
      { office: 'Records Section', action: 'Transmitted', date: '2026-03-12', handler: 'Juan Dela Cruz' },
      { office: 'Provincial Capitol', action: 'Received', date: '2026-03-13', handler: 'Provincial Records' },
    ],
  },
  {
    id: 'DOC-2026-003',
    referenceNumber: 'DOC-INC-2026-0146',
    subject: 'DILG Memorandum Circular No. 2026-021 - LGU Compliance',
    type: 'incoming',
    origin: 'DILG Regional Office V',
    destination: "Mayor's Office",
    currentOffice: "Mayor's Office",
    status: 'pending-action',
    priority: 'high',
    dateReceived: '2026-03-22',
    remarks: 'Requires LGU compliance report within 30 days',
    routingHistory: [
      { office: 'Records Section', action: 'Received & Logged', date: '2026-03-22', handler: 'Juan Dela Cruz' },
      { office: "Mayor's Office", action: 'Pending review', date: '2026-03-22', handler: 'Mayor Jonatan Rosales' },
    ],
  },
  {
    id: 'DOC-2026-004',
    referenceNumber: 'DOC-INC-2026-0147',
    subject: 'Barangay Bagasbas - Request for Beach Clean-up Assistance',
    type: 'incoming',
    origin: 'Barangay Bagasbas',
    destination: 'MENRO',
    currentOffice: 'MENRO',
    status: 'pending-action',
    priority: 'medium',
    dateReceived: '2026-03-23',
    remarks: 'Coastal clean-up drive scheduled for April',
    routingHistory: [
      { office: 'Records Section', action: 'Received & Logged', date: '2026-03-23', handler: 'Juan Dela Cruz' },
      { office: "Mayor's Office", action: 'Referred to MENRO', date: '2026-03-23', handler: 'Exec. Asst. Liza Ramos' },
      { office: 'MENRO', action: 'Pending action plan', date: '2026-03-24', handler: 'Engr. Carlos Buena' },
    ],
  },
  {
    id: 'DOC-2026-005',
    referenceNumber: 'DOC-OUT-2026-0079',
    subject: 'Letter of Intent - Sister City Partnership with Naga City',
    type: 'outgoing',
    origin: "Mayor's Office",
    destination: 'Naga City LGU',
    currentOffice: 'Naga City LGU',
    status: 'completed',
    priority: 'medium',
    dateReceived: '2026-03-15',
    remarks: 'Economic and tourism cooperation initiative',
    routingHistory: [
      { office: "Mayor's Office", action: 'Drafted & Signed', date: '2026-03-15', handler: 'Mayor Jonatan Rosales' },
      { office: 'Records Section', action: 'Transmitted', date: '2026-03-16', handler: 'Juan Dela Cruz' },
      { office: 'Naga City LGU', action: 'Received', date: '2026-03-18', handler: 'Naga City Records' },
    ],
  },
  {
    id: 'DOC-2026-006',
    referenceNumber: 'DOC-INC-2026-0148',
    subject: 'DBM Allotment Release - Q1 IRA',
    type: 'incoming',
    origin: 'Department of Budget and Management',
    destination: 'Treasury Office',
    currentOffice: 'Accounting Office',
    status: 'in-transit',
    priority: 'high',
    dateReceived: '2026-03-18',
    remarks: 'First quarter Internal Revenue Allotment release notice',
    routingHistory: [
      { office: 'Records Section', action: 'Received & Logged', date: '2026-03-18', handler: 'Juan Dela Cruz' },
      { office: "Mayor's Office", action: 'Noted', date: '2026-03-18', handler: 'Mayor Jonatan Rosales' },
      { office: 'Accounting Office', action: 'For recording', date: '2026-03-19', handler: 'CPA Remedios Tan' },
    ],
  },
  {
    id: 'DOC-2026-007',
    referenceNumber: 'DOC-INC-2026-0149',
    subject: 'COA Audit Observation Memorandum - CY 2025',
    type: 'incoming',
    origin: 'Commission on Audit',
    destination: 'Accounting Office',
    currentOffice: 'Accounting Office',
    status: 'pending-action',
    priority: 'high',
    dateReceived: '2026-03-19',
    remarks: 'Response required within 15 days',
    routingHistory: [
      { office: 'Records Section', action: 'Received & Logged', date: '2026-03-19', handler: 'Juan Dela Cruz' },
      { office: "Mayor's Office", action: 'Reviewed', date: '2026-03-19', handler: 'Mayor Jonatan Rosales' },
      { office: 'Accounting Office', action: 'Preparing response', date: '2026-03-20', handler: 'CPA Remedios Tan' },
    ],
  },
  {
    id: 'DOC-2026-008',
    referenceNumber: 'DOC-OUT-2026-0080',
    subject: 'Request for Road Repair Equipment from DPWH',
    type: 'outgoing',
    origin: 'Engineering Office',
    destination: 'DPWH District Office - Camarines Norte',
    currentOffice: 'DPWH District Office',
    status: 'received',
    priority: 'medium',
    dateReceived: '2026-03-14',
    remarks: 'Heavy equipment needed for Alawihao road repair',
    routingHistory: [
      { office: 'Engineering Office', action: 'Prepared', date: '2026-03-14', handler: 'Engr. Manuel Rivera' },
      { office: "Mayor's Office", action: 'Signed', date: '2026-03-14', handler: 'Mayor Jonatan Rosales' },
      { office: 'Records Section', action: 'Transmitted', date: '2026-03-15', handler: 'Juan Dela Cruz' },
      { office: 'DPWH District Office', action: 'Received', date: '2026-03-17', handler: 'DPWH Records' },
    ],
  },
  {
    id: 'DOC-2026-009',
    referenceNumber: 'DOC-INC-2026-0150',
    subject: 'TESDA Training Program Proposal for Out-of-School Youth',
    type: 'incoming',
    origin: 'TESDA Provincial Office',
    destination: 'PESO',
    currentOffice: 'PESO',
    status: 'pending-action',
    priority: 'medium',
    dateReceived: '2026-03-21',
    remarks: 'Skills training program for Q2 2026',
    routingHistory: [
      { office: 'Records Section', action: 'Received & Logged', date: '2026-03-21', handler: 'Juan Dela Cruz' },
      { office: "Mayor's Office", action: 'Endorsed to PESO', date: '2026-03-21', handler: 'Exec. Asst. Liza Ramos' },
      { office: 'PESO', action: 'Under evaluation', date: '2026-03-22', handler: 'Gloria Mendez' },
    ],
  },
  {
    id: 'DOC-2026-010',
    referenceNumber: 'DOC-INC-2026-0151',
    subject: 'PhilHealth Coverage Report - Daet Enrollees Q4 2025',
    type: 'incoming',
    origin: 'PhilHealth Regional Office V',
    destination: 'Municipal Health Office',
    currentOffice: 'Municipal Health Office',
    status: 'received',
    priority: 'low',
    dateReceived: '2026-03-20',
    remarks: 'For information and compliance',
    routingHistory: [
      { office: 'Records Section', action: 'Received & Logged', date: '2026-03-20', handler: 'Juan Dela Cruz' },
      { office: 'Municipal Health Office', action: 'Received for filing', date: '2026-03-20', handler: 'Dr. Patricia Reyes' },
    ],
  },
  {
    id: 'DOC-2026-011',
    referenceNumber: 'DOC-INC-2026-0152',
    subject: 'Request for Fire Truck Maintenance Fund',
    type: 'incoming',
    origin: 'BFP Daet',
    destination: 'Budget Office',
    currentOffice: "Mayor's Office",
    status: 'delayed',
    priority: 'high',
    dateReceived: '2026-03-05',
    remarks: 'Pending mayor approval for 19 days',
    routingHistory: [
      { office: 'Records Section', action: 'Received & Logged', date: '2026-03-05', handler: 'Juan Dela Cruz' },
      { office: "Mayor's Office", action: 'Pending approval', date: '2026-03-06', handler: 'Exec. Asst. Liza Ramos' },
    ],
  },
  {
    id: 'DOC-2026-012',
    referenceNumber: 'DOC-OUT-2026-0081',
    subject: 'Invitation to Pili Festival 2026 - Municipal Delegates',
    type: 'outgoing',
    origin: "Mayor's Office",
    destination: 'Various Municipal LGUs',
    currentOffice: 'Records Section',
    status: 'completed',
    priority: 'low',
    dateReceived: '2026-03-01',
    remarks: 'Annual Pili Festival invitations distributed',
    routingHistory: [
      { office: "Mayor's Office", action: 'Signed', date: '2026-03-01', handler: 'Mayor Jonatan Rosales' },
      { office: 'Records Section', action: 'Distributed to all recipients', date: '2026-03-03', handler: 'Juan Dela Cruz' },
    ],
  },
  {
    id: 'DOC-2026-013',
    referenceNumber: 'DOC-INC-2026-0153',
    subject: 'DepEd Request for School Building Repairs - Daet NHS',
    type: 'incoming',
    origin: 'DepEd Division of Camarines Norte',
    destination: 'Engineering Office',
    currentOffice: 'Engineering Office',
    status: 'pending-action',
    priority: 'medium',
    dateReceived: '2026-03-24',
    remarks: 'Minor repairs needed before rainy season',
    routingHistory: [
      { office: 'Records Section', action: 'Received & Logged', date: '2026-03-24', handler: 'Juan Dela Cruz' },
      { office: "Mayor's Office", action: 'Endorsed to Engineering', date: '2026-03-24', handler: 'Mayor Jonatan Rosales' },
      { office: 'Engineering Office', action: 'For inspection', date: '2026-03-24', handler: 'Engr. Manuel Rivera' },
    ],
  },
];

export const documentStats: DocumentStats = {
  totalDocuments: 13,
  incoming: 9,
  outgoing: 4,
  pending: 5,
  completed: 4,
  delayed: 1,
};

// -----------------------------------------------------------------------------
// CITIZEN REQUESTS
// -----------------------------------------------------------------------------

export const citizenRequests: CitizenRequest[] = [
  {
    id: 'CR-2026-001',
    referenceNumber: 'CITZ-2026-0201',
    type: 'complaint',
    subject: 'Clogged Drainage Canal Causing Flooding',
    description: 'The drainage canal along Vinzons Ave. near the public market is severely clogged with garbage and debris, causing flooding every time it rains. This has been affecting businesses and pedestrians in the area for the past two weeks.',
    citizenName: 'Ricardo Mendoza',
    contact: '09171234567',
    barangay: 'Borabod',
    status: 'processing',
    dateSubmitted: '2026-03-15',
    assignedTo: 'Engineering Office',
    timeline: [
      { date: '2026-03-15', status: 'Submitted', note: 'Complaint received via online portal' },
      { date: '2026-03-16', status: 'Acknowledged', note: 'Assigned to Engineering Office for inspection' },
      { date: '2026-03-18', status: 'Under Inspection', note: 'Engr. Rivera conducted site inspection' },
      { date: '2026-03-20', status: 'In Progress', note: 'Declogging operations scheduled for March 25' },
    ],
  },
  {
    id: 'CR-2026-002',
    referenceNumber: 'CITZ-2026-0202',
    type: 'request',
    subject: 'Street Light Installation - Purok 3, Alawihao',
    description: 'Requesting installation of street lights along the main road of Purok 3, Brgy. Alawihao. The area is very dark at night, posing safety risks for residents and commuters.',
    citizenName: 'Barangay Captain Jose Flores',
    contact: '09189876543',
    barangay: 'Alawihao',
    status: 'processing',
    dateSubmitted: '2026-03-10',
    assignedTo: 'General Services Office',
    timeline: [
      { date: '2026-03-10', status: 'Submitted', note: 'Request from Barangay Captain' },
      { date: '2026-03-11', status: 'Acknowledged', note: 'Forwarded to GSO for assessment' },
      { date: '2026-03-14', status: 'Assessment', note: 'Site survey completed; 8 light poles needed' },
      { date: '2026-03-18', status: 'In Progress', note: 'Purchase request submitted to Budget Office' },
    ],
  },
  {
    id: 'CR-2026-003',
    referenceNumber: 'CITZ-2026-0203',
    type: 'complaint',
    subject: 'Illegal Dumping Near Daet River',
    description: 'Several individuals have been observed dumping construction waste and household garbage near the Daet River bank in Brgy. Camambugan. This is causing pollution and foul odor in the area.',
    citizenName: 'Elena Garcia',
    contact: '09201234567',
    barangay: 'Camambugan',
    status: 'resolved',
    dateSubmitted: '2026-03-01',
    assignedTo: 'MENRO',
    timeline: [
      { date: '2026-03-01', status: 'Submitted', note: 'Complaint filed with photo evidence' },
      { date: '2026-03-02', status: 'Acknowledged', note: 'Assigned to MENRO for investigation' },
      { date: '2026-03-05', status: 'Investigation', note: 'MENRO team conducted site inspection and identified violators' },
      { date: '2026-03-08', status: 'Enforcement', note: 'Notice of violation issued to offenders' },
      { date: '2026-03-15', status: 'Resolved', note: 'Area cleaned up; violators complied with clean-up order' },
    ],
  },
  {
    id: 'CR-2026-004',
    referenceNumber: 'CITZ-2026-0204',
    type: 'inquiry',
    subject: 'Requirements for Senior Citizen ID Renewal',
    description: 'I would like to know the requirements and process for renewing my Senior Citizen ID. My current ID expires next month.',
    citizenName: 'Lourdes Santos',
    contact: '09331234567',
    barangay: 'Daet Proper',
    status: 'closed',
    dateSubmitted: '2026-03-18',
    assignedTo: 'OSCA',
    timeline: [
      { date: '2026-03-18', status: 'Submitted', note: 'Inquiry received via hotline' },
      { date: '2026-03-18', status: 'Responded', note: 'OSCA provided list of requirements and process via SMS' },
      { date: '2026-03-19', status: 'Closed', note: 'Citizen confirmed satisfaction with response' },
    ],
  },
  {
    id: 'CR-2026-005',
    referenceNumber: 'CITZ-2026-0205',
    type: 'complaint',
    subject: 'Noise Complaint - Videoke Bar Operating Past Curfew',
    description: "A videoke bar in Brgy. Cobangbang has been operating past the 10 PM noise curfew every weekend. Residents in the area are losing sleep and it is affecting children's school performance.",
    citizenName: 'Rosario Villamor',
    contact: '09451234567',
    barangay: 'Cobangbang',
    status: 'processing',
    dateSubmitted: '2026-03-19',
    assignedTo: 'BPLO / PNP Daet',
    timeline: [
      { date: '2026-03-19', status: 'Submitted', note: 'Complaint received from multiple residents' },
      { date: '2026-03-20', status: 'Acknowledged', note: 'Coordinated with PNP Daet and BPLO' },
      { date: '2026-03-22', status: 'Investigation', note: 'PNP conducted monitoring; violation confirmed' },
    ],
  },
  {
    id: 'CR-2026-006',
    referenceNumber: 'CITZ-2026-0206',
    type: 'request',
    subject: 'Medical Assistance for Indigent Family',
    description: 'Requesting medical assistance for my mother who needs emergency surgery. We are an indigent family and cannot afford the hospital bills at the Camarines Norte Provincial Hospital.',
    citizenName: 'Mario Dela Paz',
    contact: '09561234567',
    barangay: 'Fabrica',
    status: 'resolved',
    dateSubmitted: '2026-03-12',
    assignedTo: 'MSWDO',
    timeline: [
      { date: '2026-03-12', status: 'Submitted', note: 'Urgent request for medical assistance' },
      { date: '2026-03-12', status: 'Acknowledged', note: 'Fast-tracked to MSWDO' },
      { date: '2026-03-13', status: 'Assessment', note: 'Social worker conducted case study' },
      { date: '2026-03-14', status: 'Approved', note: 'PHP 25,000 medical assistance approved' },
      { date: '2026-03-15', status: 'Resolved', note: 'Check released to hospital' },
    ],
  },
  {
    id: 'CR-2026-007',
    referenceNumber: 'CITZ-2026-0207',
    type: 'request',
    subject: 'Road Repair Request - Potholed Road in Mancruz',
    description: 'The road leading to the national highway from Brgy. Mancruz has several large potholes that have caused multiple motorcycle accidents. Immediate repair is requested.',
    citizenName: 'Barangay Captain Ernesto Torres',
    contact: '09171239876',
    barangay: 'Mancruz',
    status: 'submitted',
    dateSubmitted: '2026-03-22',
    assignedTo: '',
    timeline: [
      { date: '2026-03-22', status: 'Submitted', note: 'Request submitted with photos of road damage' },
    ],
  },
  {
    id: 'CR-2026-008',
    referenceNumber: 'CITZ-2026-0208',
    type: 'inquiry',
    subject: 'Availability of Livelihood Training Programs',
    description: 'I am a displaced worker due to the pandemic. I would like to inquire about any livelihood or skills training programs available from the municipality.',
    citizenName: 'Anna Marie Bautista',
    contact: '09181234567',
    barangay: 'San Isidro',
    status: 'closed',
    dateSubmitted: '2026-03-08',
    assignedTo: 'PESO',
    timeline: [
      { date: '2026-03-08', status: 'Submitted', note: 'Inquiry via citizen portal' },
      { date: '2026-03-09', status: 'Responded', note: 'PESO provided list of upcoming TESDA training programs' },
      { date: '2026-03-10', status: 'Follow-up', note: 'Citizen enrolled in welding NCII training' },
      { date: '2026-03-10', status: 'Closed', note: 'Inquiry resolved; citizen enrolled in program' },
    ],
  },
  {
    id: 'CR-2026-009',
    referenceNumber: 'CITZ-2026-0209',
    type: 'complaint',
    subject: 'Water Supply Interruption - 3 Days No Water',
    description: 'Our area in Brgy. Pamorangon has had no water supply for 3 consecutive days. The local water district has not provided any notice or explanation.',
    citizenName: 'Gloria Dela Vega',
    contact: '09271234567',
    barangay: 'Pamorangon',
    status: 'processing',
    dateSubmitted: '2026-03-21',
    assignedTo: "Mayor's Office / Water District Liaison",
    timeline: [
      { date: '2026-03-21', status: 'Submitted', note: 'Urgent complaint from multiple households' },
      { date: '2026-03-21', status: 'Acknowledged', note: 'Coordinated with Daet Water District' },
      { date: '2026-03-22', status: 'In Progress', note: 'Water district identified broken main pipe; repair underway' },
    ],
  },
  {
    id: 'CR-2026-010',
    referenceNumber: 'CITZ-2026-0210',
    type: 'request',
    subject: 'Request for Barangay Road Concreting',
    description: 'Requesting concreting of the 500-meter interior road in Purok 2, Brgy. Gahonon. The road becomes impassable during rainy season, affecting farmers who need to transport their produce.',
    citizenName: 'Barangay Captain Roberto Magnaye',
    contact: '09351234567',
    barangay: 'Gahonon',
    status: 'submitted',
    dateSubmitted: '2026-03-23',
    assignedTo: '',
    timeline: [
      { date: '2026-03-23', status: 'Submitted', note: 'Request with supporting barangay resolution attached' },
    ],
  },
  {
    id: 'CR-2026-011',
    referenceNumber: 'CITZ-2026-0211',
    type: 'complaint',
    subject: 'Stray Dogs Roaming in Bagasbas Beach Area',
    description: 'There is an increasing number of stray dogs roaming the Bagasbas beach area, posing risk to tourists and residents. Some dogs appear to be sick.',
    citizenName: 'Patrick Vargas',
    contact: '09191234567',
    barangay: 'Bagasbas',
    status: 'processing',
    dateSubmitted: '2026-03-20',
    assignedTo: 'Municipal Veterinary Office',
    timeline: [
      { date: '2026-03-20', status: 'Submitted', note: 'Complaint from beach resort owner' },
      { date: '2026-03-21', status: 'Acknowledged', note: 'Forwarded to Municipal Veterinary Office' },
      { date: '2026-03-23', status: 'In Progress', note: 'Catch and neuter program scheduled for March 28' },
    ],
  },
];

export const serviceCategories: ServiceCategory[] = [
  { id: 'SC-01', name: 'Business Permit Application', description: 'New and renewal business permit applications', department: 'BPLO', averageProcessingDays: 5 },
  { id: 'SC-02', name: 'Building Permit', description: 'Building and construction permits', department: 'Engineering Office', averageProcessingDays: 10 },
  { id: 'SC-03', name: 'Civil Registry Services', description: 'Birth, marriage, death certificates', department: 'Civil Registry', averageProcessingDays: 3 },
  { id: 'SC-04', name: 'Real Property Tax Payment', description: 'Property tax assessment and payment', department: 'Treasury', averageProcessingDays: 1 },
  { id: 'SC-05', name: 'Community Tax Certificate', description: 'Cedula issuance', department: 'Treasury', averageProcessingDays: 1 },
  { id: 'SC-06', name: 'Social Welfare Assistance', description: 'Medical, burial, educational assistance', department: 'MSWDO', averageProcessingDays: 3 },
  { id: 'SC-07', name: 'Zoning Clearance', description: 'Land use and zoning certifications', department: 'Planning & Development', averageProcessingDays: 5 },
  { id: 'SC-08', name: 'Environmental Clearance', description: 'Environmental compliance certificate', department: 'MENRO', averageProcessingDays: 7 },
];

// -----------------------------------------------------------------------------
// EMERGENCY
// -----------------------------------------------------------------------------

export const emergencyIncidents: EmergencyIncident[] = [
  {
    id: 'EMG-2026-001',
    type: 'flooding',
    location: 'Vinzons Ave. near Public Market',
    barangay: 'Borabod',
    severity: 'high',
    status: 'resolved',
    reportedAt: '2026-03-15T14:30:00',
    respondedAt: '2026-03-15T14:45:00',
    description: 'Flash flooding due to clogged drainage and heavy rainfall. Water level reached knee-deep in some areas. Several market stalls were affected.',
    responders: ['MDRRMO Team Alpha', 'PNP Daet', 'Brgy. Borabod Response Team'],
    reporter: 'Brgy. Captain Borabod',
    contactNumber: '09171234567',
  },
  {
    id: 'EMG-2026-002',
    type: 'fire',
    location: 'Purok 5, near Daet Public Market',
    barangay: 'Awitan',
    severity: 'critical',
    status: 'resolved',
    reportedAt: '2026-03-10T02:15:00',
    respondedAt: '2026-03-10T02:25:00',
    description: 'Residential fire affecting 3 houses. Caused by faulty electrical wiring. 4 families displaced, no casualties reported.',
    responders: ['BFP Daet', 'MDRRMO', 'PNP Daet', 'Red Cross Camarines Norte'],
    reporter: 'Kagawad Pedro Basa',
    contactNumber: '09189876543',
  },
  {
    id: 'EMG-2026-003',
    type: 'accident',
    location: 'Maharlika Highway, km. 432',
    barangay: 'Alawihao',
    severity: 'high',
    status: 'resolved',
    reportedAt: '2026-03-18T08:45:00',
    respondedAt: '2026-03-18T08:55:00',
    description: 'Multi-vehicle collision involving a bus and two motorcycles. 3 persons injured, transported to Camarines Norte Provincial Hospital.',
    responders: ['PNP Daet Traffic Unit', 'MDRRMO Rescue Team', 'Municipal Health Office Ambulance'],
    reporter: 'Passing motorist',
    contactNumber: '09201234567',
  },
  {
    id: 'EMG-2026-004',
    type: 'medical',
    location: 'Purok 2, Interior Road',
    barangay: 'Fabrica',
    severity: 'critical',
    status: 'resolved',
    reportedAt: '2026-03-20T16:20:00',
    respondedAt: '2026-03-20T16:30:00',
    description: 'Elderly woman experienced cardiac arrest. MDRRMO ambulance dispatched. Patient was stabilized and transported to provincial hospital.',
    responders: ['MDRRMO Ambulance Team', 'Municipal Health Office'],
    reporter: 'Family member - Mario Dela Paz',
    contactNumber: '09561234567',
  },
  {
    id: 'EMG-2026-005',
    type: 'flooding',
    location: 'Low-lying areas near Daet River',
    barangay: 'Camambugan',
    severity: 'medium',
    status: 'dispatched',
    reportedAt: '2026-03-24T06:00:00',
    respondedAt: '2026-03-24T06:20:00',
    description: 'Rising water level in Daet River due to continuous rainfall. Preemptive evacuation advisory issued for 50 families in low-lying areas.',
    responders: ['MDRRMO Team Bravo', 'Brgy. Camambugan Tanods', 'MSWDO Evacuation Team'],
    reporter: 'MDRRMO Monitoring Station',
    contactNumber: '09171112233',
  },
  {
    id: 'EMG-2026-006',
    type: 'crime',
    location: 'CM Recto St., near Provincial Capitol',
    barangay: 'Daet Proper',
    severity: 'medium',
    status: 'verified',
    reportedAt: '2026-03-23T21:30:00',
    respondedAt: '2026-03-23T21:40:00',
    description: 'Reported snatching incident. Victim had phone and bag snatched by two suspects on a motorcycle. PNP investigating.',
    responders: ['PNP Daet Patrol Unit'],
    reporter: 'Victim - Maria Clara Santos',
    contactNumber: '09331234567',
  },
  {
    id: 'EMG-2026-007',
    type: 'accident',
    location: 'Bagasbas Beach Swimming Area',
    barangay: 'Bagasbas',
    severity: 'high',
    status: 'resolved',
    reportedAt: '2026-03-16T15:00:00',
    respondedAt: '2026-03-16T15:08:00',
    description: 'Near-drowning incident involving a tourist. Lifeguard and MDRRMO water rescue team responded. Victim recovered after first aid.',
    responders: ['Bagasbas Beach Lifeguard', 'MDRRMO Water Rescue', 'Municipal Health Office'],
    reporter: 'Beach Lifeguard',
    contactNumber: '09451234567',
  },
  {
    id: 'EMG-2026-008',
    type: 'fire',
    location: 'Grassland area near residential zone',
    barangay: 'Mantagbac',
    severity: 'low',
    status: 'resolved',
    reportedAt: '2026-03-12T13:00:00',
    respondedAt: '2026-03-12T13:20:00',
    description: 'Grass fire caused by kaingin (slash-and-burn) activity. Fire spread to approximately 500 sqm before being contained. No structures damaged.',
    responders: ['BFP Daet', 'Brgy. Mantagbac Volunteers'],
    reporter: 'Barangay Tanod',
    contactNumber: '09181112233',
  },
  {
    id: 'EMG-2026-009',
    type: 'medical',
    location: 'Daet National High School',
    barangay: 'Lag-on',
    severity: 'medium',
    status: 'resolved',
    reportedAt: '2026-03-19T10:30:00',
    respondedAt: '2026-03-19T10:38:00',
    description: 'Student collapsed during flag ceremony due to heat exhaustion. School nurse and MDRRMO medical team provided first aid. Student recovered.',
    responders: ['School Nurse', 'MDRRMO Medical Team'],
    reporter: 'School Principal',
    contactNumber: '09271234567',
  },
  {
    id: 'EMG-2026-010',
    type: 'flooding',
    location: 'Coastal area and fishpond vicinity',
    barangay: 'Bibirao',
    severity: 'medium',
    status: 'reported',
    reportedAt: '2026-03-24T07:30:00',
    respondedAt: '',
    description: 'Tidal flooding affecting fishpond areas and coastal residences due to high tide combined with Southwest monsoon. Monitoring situation.',
    responders: [],
    reporter: 'Brgy. Captain Bibirao',
    contactNumber: '09351234567',
  },
  {
    id: 'EMG-2026-011',
    type: 'crime',
    location: 'Near Municipal Hall parking area',
    barangay: 'Calasgasan',
    severity: 'low',
    status: 'resolved',
    reportedAt: '2026-03-22T12:15:00',
    respondedAt: '2026-03-22T12:20:00',
    description: 'Petty theft reported - motorcycle side mirror stolen from parked vehicle. CCTV footage being reviewed by PNP.',
    responders: ['PNP Daet', 'Municipal Security'],
    reporter: 'Vehicle owner',
    contactNumber: '09191239876',
  },
];

export const emergencyStats: EmergencyStats = {
  totalIncidents: 11,
  active: 3,
  resolved: 8,
  averageResponseMinutes: 12,
  bySeverity: { critical: 2, high: 3, medium: 4, low: 2 },
  byType: { accident: 2, flooding: 3, fire: 2, crime: 2, medical: 2 },
};

export const agencyContacts: AgencyContact[] = [
  {
    id: 'AGC-001',
    agency: 'MDRRMO - Municipal Disaster Risk Reduction & Management Office',
    contactPerson: 'Engr. Ramon Bautista',
    position: 'MDRRMO Head',
    phone: '(054) 721-0001 / 09171234567',
    email: 'mdrrmo@daet.gov.ph',
    address: 'Municipal Compound, Daet, Camarines Norte',
  },
  {
    id: 'AGC-002',
    agency: 'PNP Daet Municipal Police Station',
    contactPerson: 'PLTCOL. Eduardo Fernandez',
    position: 'Chief of Police',
    phone: '(054) 721-0002 / 09189876543',
    email: 'pnp.daet@pnp.gov.ph',
    address: 'F. Pimentel Ave., Daet, Camarines Norte',
  },
  {
    id: 'AGC-003',
    agency: 'BFP Daet - Bureau of Fire Protection',
    contactPerson: 'SINSP. Marcos Dela Rosa',
    position: 'Fire Marshal',
    phone: '(054) 721-0003 / 09201234567',
    email: 'bfp.daet@bfp.gov.ph',
    address: 'National Highway, Daet, Camarines Norte',
  },
  {
    id: 'AGC-004',
    agency: 'Municipal Health Office',
    contactPerson: 'Dr. Patricia Reyes',
    position: 'Municipal Health Officer',
    phone: '(054) 721-0004 / 09331234567',
    email: 'mho@daet.gov.ph',
    address: 'Municipal Compound, Daet, Camarines Norte',
  },
  {
    id: 'AGC-005',
    agency: 'Philippine Red Cross - Camarines Norte Chapter',
    contactPerson: 'Atty. Lucia Gonzales',
    position: 'Chapter Administrator',
    phone: '(054) 721-0005 / 09451234567',
    email: 'camnorte@redcross.org.ph',
    address: 'Gov. Pimentel St., Daet, Camarines Norte',
  },
];

// -----------------------------------------------------------------------------
// INFRASTRUCTURE PROJECTS
// -----------------------------------------------------------------------------

export const infrastructureProjects: InfrastructureProject[] = [
  {
    id: 'INFRA-2026-001',
    name: 'Concreting of Alawihao-Mancruz Farm-to-Market Road',
    type: 'road',
    contractor: 'JM Construction & Development Corp.',
    location: 'Brgy. Alawihao to Brgy. Mancruz',
    barangay: 'Alawihao',
    budget: 12_500_000,
    spent: 8_750_000,
    progress: 70,
    status: 'ongoing',
    startDate: '2025-11-15',
    endDate: '2026-05-30',
    description: 'Construction of 2.5 km concrete road connecting Brgy. Alawihao to Brgy. Mancruz, improving access for agricultural transport.',
    fundSource: 'LDRRMF / Municipal Development Fund',
    photos: ['/images/projects/alawihao-road-1.jpg', '/images/projects/alawihao-road-2.jpg'],
  },
  {
    id: 'INFRA-2026-002',
    name: 'Rehabilitation of Daet Public Market Drainage System',
    type: 'drainage',
    contractor: 'CamNorte Builders Inc.',
    location: 'Daet Public Market Complex',
    barangay: 'Awitan',
    budget: 8_200_000,
    spent: 7_380_000,
    progress: 90,
    status: 'ongoing',
    startDate: '2025-10-01',
    endDate: '2026-04-15',
    description: 'Comprehensive rehabilitation of the drainage system surrounding the Daet Public Market to address recurring flooding issues.',
    fundSource: '20% Development Fund',
    photos: ['/images/projects/market-drainage-1.jpg'],
  },
  {
    id: 'INFRA-2026-003',
    name: 'Construction of Bagasbas Beach Tourism Facility',
    type: 'building',
    contractor: 'Bicol Prime Construction',
    location: 'Bagasbas Beach Front',
    barangay: 'Bagasbas',
    budget: 25_000_000,
    spent: 5_000_000,
    progress: 20,
    status: 'ongoing',
    startDate: '2026-01-15',
    endDate: '2026-12-30',
    description: 'Multi-purpose tourism center with visitor information, comfort rooms, shower facilities, and lifeguard station at Bagasbas Beach.',
    fundSource: 'DOT / Municipal Tourism Fund',
    photos: ['/images/projects/bagasbas-facility-1.jpg'],
  },
  {
    id: 'INFRA-2026-004',
    name: 'Camambugan Bridge Widening Project',
    type: 'bridge',
    contractor: 'DPWH / SG Engineering',
    location: 'Daet River Bridge, Brgy. Camambugan',
    barangay: 'Camambugan',
    budget: 18_000_000,
    spent: 2_700_000,
    progress: 15,
    status: 'delayed',
    startDate: '2026-02-01',
    endDate: '2026-08-31',
    description: 'Widening of the existing single-lane bridge over Daet River to accommodate two-way traffic and reduce congestion.',
    fundSource: 'DPWH National Budget',
    photos: [],
  },
  {
    id: 'INFRA-2026-005',
    name: 'Solar-Powered Street Lighting - Cobangbang Main Road',
    type: 'road',
    contractor: 'GreenTech Solar Solutions',
    location: 'Brgy. Cobangbang Main Road (1.2 km)',
    barangay: 'Cobangbang',
    budget: 4_500_000,
    spent: 4_500_000,
    progress: 100,
    status: 'completed',
    startDate: '2025-09-01',
    endDate: '2026-01-31',
    description: 'Installation of 40 solar-powered LED street lights along Brgy. Cobangbang main road for improved safety and reduced energy costs.',
    fundSource: '20% Development Fund',
    photos: ['/images/projects/cobangbang-lights-1.jpg', '/images/projects/cobangbang-lights-2.jpg'],
  },
  {
    id: 'INFRA-2026-006',
    name: 'Construction of Daet Proper Evacuation Center',
    type: 'building',
    contractor: 'Solidbuild Construction Corp.',
    location: 'Municipal Compound Extension',
    barangay: 'Daet Proper',
    budget: 35_000_000,
    spent: 0,
    progress: 0,
    status: 'planning',
    startDate: '2026-06-01',
    endDate: '2027-06-01',
    description: 'Two-storey evacuation center with 500-person capacity, equipped with emergency supplies storage, medical bay, and kitchen facilities.',
    fundSource: 'NDRRMC / LDRRMF',
    photos: [],
  },
  {
    id: 'INFRA-2026-007',
    name: 'Pamorangon Flood Control Drainage Channel',
    type: 'drainage',
    contractor: 'Aqua Engineering Services',
    location: 'Brgy. Pamorangon lowland area',
    barangay: 'Pamorangon',
    budget: 15_000_000,
    spent: 10_500_000,
    progress: 65,
    status: 'delayed',
    startDate: '2025-08-01',
    endDate: '2026-03-31',
    description: 'Construction of 1.8 km drainage channel to mitigate annual flooding in Brgy. Pamorangon lowland residential area.',
    fundSource: 'DPWH / Municipal Fund',
    photos: ['/images/projects/pamorangon-drainage-1.jpg'],
  },
  {
    id: 'INFRA-2026-008',
    name: 'Rehabilitation of Municipal Health Center',
    type: 'building',
    contractor: 'Build Right Construction',
    location: 'Municipal Compound',
    barangay: 'Calasgasan',
    budget: 9_800_000,
    spent: 9_800_000,
    progress: 100,
    status: 'completed',
    startDate: '2025-07-01',
    endDate: '2025-12-31',
    description: 'Complete renovation of the Municipal Health Center including new consultation rooms, laboratory, pharmacy, and birthing facility.',
    fundSource: 'DOH / Municipal Health Fund',
    photos: ['/images/projects/health-center-1.jpg', '/images/projects/health-center-2.jpg'],
  },
  {
    id: 'INFRA-2026-009',
    name: 'Gahonon Barangay Road Concreting Phase 2',
    type: 'road',
    contractor: 'Provincial Road Builders Co.',
    location: 'Interior Road, Purok 2-4',
    barangay: 'Gahonon',
    budget: 6_000_000,
    spent: 1_200_000,
    progress: 20,
    status: 'ongoing',
    startDate: '2026-03-01',
    endDate: '2026-07-31',
    description: 'Phase 2 concreting of 800-meter interior road connecting Purok 2 to Purok 4 in Brgy. Gahonon.',
    fundSource: '20% Development Fund',
    photos: [],
  },
];

export const projectStats: ProjectStats = {
  totalProjects: 9,
  ongoing: 4,
  completed: 2,
  delayed: 2,
  totalBudget: 134_000_000,
  totalSpent: 49_830_000,
};

// -----------------------------------------------------------------------------
// DASHBOARD
// -----------------------------------------------------------------------------

export const dashboardStats: DashboardStat[] = [
  {
    label: 'Total Revenue (YTD)',
    value: '₱155.5M',
    change: 8.5,
    changeLabel: 'vs last year',
    icon: 'TrendingUp',
  },
  {
    label: 'Active Business Permits',
    value: 1_245,
    change: 12.3,
    changeLabel: 'vs last year',
    icon: 'FileText',
  },
  {
    label: 'Infrastructure Projects',
    value: 9,
    change: 0,
    changeLabel: '4 ongoing',
    icon: 'Building2',
  },
  {
    label: 'Citizen Requests',
    value: 342,
    change: -5.2,
    changeLabel: 'vs last month',
    icon: 'Users',
  },
  {
    label: 'RPT Collection Rate',
    value: '72.3%',
    change: 3.1,
    changeLabel: 'vs Q4 2025',
    icon: 'Landmark',
  },
  {
    label: 'Emergency Response Time',
    value: '12 min',
    change: -15.0,
    changeLabel: 'improvement',
    icon: 'Siren',
  },
];

export const recentActivities: RecentActivity[] = [
  {
    id: 'RA-001',
    action: 'Business Permit Released',
    description: 'Daet Trading Corporation - Business Permit 2026 released',
    user: 'Elena Reyes',
    department: 'BPLO',
    timestamp: '2026-03-24T09:30:00',
    type: 'success',
  },
  {
    id: 'RA-002',
    action: 'Emergency Dispatched',
    description: 'MDRRMO Team Bravo dispatched to Camambugan flooding',
    user: 'Engr. Ramon Bautista',
    department: 'MDRRMO',
    timestamp: '2026-03-24T06:20:00',
    type: 'warning',
  },
  {
    id: 'RA-003',
    action: 'Document Received',
    description: 'DepEd school repair request received and logged',
    user: 'Juan Dela Cruz',
    department: 'Records Section',
    timestamp: '2026-03-24T08:15:00',
    type: 'info',
  },
  {
    id: 'RA-004',
    action: 'Revenue Collected',
    description: '₱45,000 business tax collected from Daet Trading Corp.',
    user: 'Maria Santos',
    department: 'Treasury',
    timestamp: '2026-03-24T10:00:00',
    type: 'success',
  },
  {
    id: 'RA-005',
    action: 'Project Milestone',
    description: 'Market drainage rehabilitation reached 90% completion',
    user: 'Engr. Manuel Rivera',
    department: 'Engineering',
    timestamp: '2026-03-23T16:00:00',
    type: 'info',
  },
  {
    id: 'RA-006',
    action: 'Citizen Complaint Resolved',
    description: 'Illegal dumping near Daet River - cleanup completed',
    user: 'Engr. Carlos Buena',
    department: 'MENRO',
    timestamp: '2026-03-23T14:30:00',
    type: 'success',
  },
  {
    id: 'RA-007',
    action: 'Document Delayed',
    description: 'Fire truck maintenance fund request pending for 19 days',
    user: 'System',
    department: "Mayor's Office",
    timestamp: '2026-03-24T00:00:00',
    type: 'error',
  },
  {
    id: 'RA-008',
    action: 'New Citizen Request',
    description: 'Road concreting request submitted by Brgy. Gahonon',
    user: 'System',
    department: 'Citizen Portal',
    timestamp: '2026-03-23T11:00:00',
    type: 'info',
  },
];

export const notifications: Notification[] = [
  {
    id: 'NTF-001',
    title: 'Flood Alert - Camambugan',
    message: 'Rising water levels detected in Daet River. Preemptive evacuation advisory issued for Brgy. Camambugan.',
    type: 'warning',
    priority: 'critical',
    read: false,
    timestamp: '2026-03-24T06:00:00',
    time: '6:00 AM',
    link: '/emergency',
  },
  {
    id: 'NTF-002',
    title: 'Document Overdue',
    message: 'BFP fire truck maintenance fund request has been pending for 19 days without action.',
    type: 'error',
    priority: 'high',
    read: false,
    timestamp: '2026-03-24T08:00:00',
    time: '8:00 AM',
    link: '/documents',
  },
  {
    id: 'NTF-003',
    title: 'COA Response Deadline',
    message: 'COA Audit Observation response due in 10 days. Accounting Office preparing documentation.',
    type: 'warning',
    priority: 'high',
    read: false,
    timestamp: '2026-03-24T07:00:00',
    time: '7:00 AM',
    link: '/documents',
  },
  {
    id: 'NTF-004',
    title: 'Revenue Target Exceeded',
    message: 'March revenue collection has exceeded target by ₱820,000. Treasury reports strong business tax compliance.',
    type: 'success',
    priority: 'medium',
    read: true,
    timestamp: '2026-03-23T17:00:00',
    time: 'Yesterday 5:00 PM',
    link: '/treasury',
  },
  {
    id: 'NTF-005',
    title: 'Project Delay Alert',
    message: 'Camambugan Bridge Widening and Pamorangon Drainage projects are behind schedule.',
    type: 'error',
    priority: 'high',
    read: true,
    timestamp: '2026-03-22T09:00:00',
    time: 'Mar 22, 9:00 AM',
    link: '/infrastructure',
  },
  {
    id: 'NTF-006',
    title: 'Permit Application Surge',
    message: '5 new business permit applications received this week. BPLO may need additional personnel.',
    type: 'info',
    priority: 'low',
    read: true,
    timestamp: '2026-03-21T15:00:00',
    time: 'Mar 21, 3:00 PM',
    link: '/business-permits',
  },
  {
    id: 'NTF-007',
    title: 'DILG Compliance Due',
    message: 'DILG MC 2026-021 compliance report due within 30 days of receipt (by April 22, 2026).',
    type: 'warning',
    priority: 'medium',
    read: false,
    timestamp: '2026-03-22T10:00:00',
    time: 'Mar 22, 10:00 AM',
    link: '/documents',
  },
  {
    id: 'NTF-008',
    title: 'System Maintenance',
    message: 'Scheduled system maintenance on March 29, 2026, from 10 PM to 2 AM. Please save all work.',
    type: 'info',
    priority: 'low',
    read: true,
    timestamp: '2026-03-20T09:00:00',
    time: 'Mar 20, 9:00 AM',
  },
];

export const departmentPerformance: DepartmentPerformance[] = [
  { department: 'Treasury', name: 'Treasury', tasksCompleted: 145, completed: 145, tasksTotal: 158, pending: 13, efficiency: 91.8, satisfaction: 88, color: 'emerald' },
  { department: 'BPLO', name: 'BPLO', tasksCompleted: 42, completed: 42, tasksTotal: 50, pending: 8, efficiency: 84.0, satisfaction: 82, color: 'blue' },
  { department: 'Engineering', name: 'Engineering', tasksCompleted: 28, completed: 28, tasksTotal: 35, pending: 7, efficiency: 80.0, satisfaction: 75, color: 'amber' },
  { department: 'MDRRMO', name: 'MDRRMO', tasksCompleted: 38, completed: 38, tasksTotal: 40, pending: 2, efficiency: 95.0, satisfaction: 94, color: 'red' },
  { department: 'Health Office', name: 'Health Office', tasksCompleted: 120, completed: 120, tasksTotal: 130, pending: 10, efficiency: 92.3, satisfaction: 90, color: 'purple' },
];

export const barangaySnapshot: BarangaySnapshot[] = [
  { barangay: 'Alawihao', name: 'Alawihao', population: 8_520, activeCases: 3, incidents: 3, permits: 45, collections: 4_200_000, projects: 1, revenue: 4_200_000 },
  { barangay: 'Bagasbas', name: 'Bagasbas', population: 4_210, activeCases: 2, incidents: 2, permits: 89, collections: 8_500_000, projects: 1, revenue: 8_500_000 },
  { barangay: 'Borabod', name: 'Borabod', population: 12_450, activeCases: 2, incidents: 5, permits: 156, collections: 15_200_000, projects: 0, revenue: 15_200_000 },
  { barangay: 'Calasgasan', name: 'Calasgasan', population: 9_680, activeCases: 1, incidents: 1, permits: 78, collections: 11_400_000, projects: 1, revenue: 11_400_000 },
  { barangay: 'Camambugan', name: 'Camambugan', population: 6_120, activeCases: 2, incidents: 4, permits: 34, collections: 2_900_000, projects: 1, revenue: 2_900_000 },
  { barangay: 'Cobangbang', name: 'Cobangbang', population: 7_350, activeCases: 1, incidents: 2, permits: 52, collections: 4_800_000, projects: 1, revenue: 4_800_000 },
  { barangay: 'Daet Proper', name: 'Daet Proper', population: 15_200, activeCases: 2, incidents: 6, permits: 312, collections: 28_500_000, projects: 1, revenue: 28_500_000 },
  { barangay: 'Pamorangon', name: 'Pamorangon', population: 7_890, activeCases: 1, incidents: 3, permits: 41, collections: 3_500_000, projects: 1, revenue: 3_500_000 },
];

// -----------------------------------------------------------------------------
// HR / EMPLOYEES
// -----------------------------------------------------------------------------

export const employees: Employee[] = [
  {
    id: 'EMP-001',
    name: 'Alma Pascual',
    position: 'Municipal Budget Officer',
    department: 'Budget Office',
    status: 'active',
    dateHired: '2010-06-15',
    contactNumber: '09171001001',
    email: 'a.pascual@daet.gov.ph',
    employeeNumber: 'LGU-2010-045',
  },
  {
    id: 'EMP-002',
    name: 'Engr. Manuel Rivera',
    position: 'Municipal Engineer',
    department: 'Engineering Office',
    status: 'active',
    dateHired: '2012-03-01',
    contactNumber: '09171001002',
    email: 'm.rivera@daet.gov.ph',
    employeeNumber: 'LGU-2012-012',
  },
  {
    id: 'EMP-003',
    name: 'Maria Santos',
    position: 'Revenue Collection Clerk III',
    department: 'Treasury',
    status: 'active',
    dateHired: '2015-08-20',
    contactNumber: '09171001003',
    email: 'm.santos@daet.gov.ph',
    employeeNumber: 'LGU-2015-067',
  },
  {
    id: 'EMP-004',
    name: 'Elena Reyes',
    position: 'Revenue Collection Clerk II',
    department: 'Treasury',
    status: 'active',
    dateHired: '2018-01-10',
    contactNumber: '09171001004',
    email: 'e.reyes@daet.gov.ph',
    employeeNumber: 'LGU-2018-023',
  },
  {
    id: 'EMP-005',
    name: 'Engr. Ramon Bautista',
    position: 'MDRRMO Head',
    department: 'MDRRMO',
    status: 'active',
    dateHired: '2014-07-01',
    contactNumber: '09171001005',
    email: 'r.bautista@daet.gov.ph',
    employeeNumber: 'LGU-2014-031',
  },
  {
    id: 'EMP-006',
    name: 'Dr. Patricia Reyes',
    position: 'Municipal Health Officer',
    department: 'Health Office',
    status: 'active',
    dateHired: '2016-04-15',
    contactNumber: '09171001006',
    email: 'p.reyes@daet.gov.ph',
    employeeNumber: 'LGU-2016-009',
  },
  {
    id: 'EMP-007',
    name: 'Juan Dela Cruz',
    position: 'Records Officer II',
    department: 'Records Section',
    status: 'active',
    dateHired: '2008-11-03',
    contactNumber: '09171001007',
    email: 'j.delacruz@daet.gov.ph',
    employeeNumber: 'LGU-2008-088',
  },
  {
    id: 'EMP-008',
    name: 'CPA Remedios Tan',
    position: 'Municipal Accountant',
    department: 'Accounting Office',
    status: 'active',
    dateHired: '2011-09-01',
    contactNumber: '09171001008',
    email: 'r.tan@daet.gov.ph',
    employeeNumber: 'LGU-2011-055',
  },
  {
    id: 'EMP-009',
    name: 'Engr. Carlos Buena',
    position: 'MENRO Head',
    department: 'MENRO',
    status: 'active',
    dateHired: '2017-02-15',
    contactNumber: '09171001009',
    email: 'c.buena@daet.gov.ph',
    employeeNumber: 'LGU-2017-018',
  },
  {
    id: 'EMP-010',
    name: 'Gloria Mendez',
    position: 'PESO Manager',
    department: 'PESO',
    status: 'active',
    dateHired: '2019-06-01',
    contactNumber: '09171001010',
    email: 'g.mendez@daet.gov.ph',
    employeeNumber: 'LGU-2019-041',
  },
  {
    id: 'EMP-011',
    name: 'Liza Ramos',
    position: 'Executive Assistant V',
    department: "Mayor's Office",
    status: 'active',
    dateHired: '2013-01-15',
    contactNumber: '09171001011',
    email: 'l.ramos@daet.gov.ph',
    employeeNumber: 'LGU-2013-003',
  },
  {
    id: 'EMP-012',
    name: 'Atty. Marco Villafuerte',
    position: 'SB Secretary',
    department: 'Sangguniang Bayan',
    status: 'active',
    dateHired: '2019-07-01',
    contactNumber: '09171001012',
    email: 'm.villafuerte@daet.gov.ph',
    employeeNumber: 'LGU-2019-050',
  },
  {
    id: 'EMP-013',
    name: 'Rosita Aguilar',
    position: 'Municipal Social Welfare Officer',
    department: 'MSWDO',
    status: 'on-leave',
    dateHired: '2009-05-20',
    contactNumber: '09171001013',
    email: 'r.aguilar@daet.gov.ph',
    employeeNumber: 'LGU-2009-072',
  },
  {
    id: 'EMP-014',
    name: 'Roberto Magnaye',
    position: 'Municipal Assessor',
    department: 'Assessor Office',
    status: 'active',
    dateHired: '2012-10-01',
    contactNumber: '09171001014',
    email: 'r.magnaye@daet.gov.ph',
    employeeNumber: 'LGU-2012-039',
  },
];

export const departments: Department[] = [
  { id: 'DEPT-01', name: "Mayor's Office", head: 'Mayor Jonatan Rosales', employeeCount: 15, budget: 18_500_000 },
  { id: 'DEPT-02', name: 'Sangguniang Bayan', head: 'Vice Mayor Carmen Dela Torre', employeeCount: 12, budget: 14_200_000 },
  { id: 'DEPT-03', name: 'Treasury', head: 'Municipal Treasurer', employeeCount: 18, budget: 8_500_000 },
  { id: 'DEPT-04', name: 'Accounting Office', head: 'CPA Remedios Tan', employeeCount: 10, budget: 6_200_000 },
  { id: 'DEPT-05', name: 'Budget Office', head: 'Alma Pascual', employeeCount: 8, budget: 5_800_000 },
  { id: 'DEPT-06', name: 'Engineering Office', head: 'Engr. Manuel Rivera', employeeCount: 22, budget: 12_000_000 },
  { id: 'DEPT-07', name: 'Planning & Development', head: 'Planning Officer', employeeCount: 8, budget: 5_500_000 },
  { id: 'DEPT-08', name: 'Health Office', head: 'Dr. Patricia Reyes', employeeCount: 35, budget: 22_000_000 },
  { id: 'DEPT-09', name: 'MSWDO', head: 'Rosita Aguilar', employeeCount: 14, budget: 15_000_000 },
  { id: 'DEPT-10', name: 'MDRRMO', head: 'Engr. Ramon Bautista', employeeCount: 20, budget: 10_000_000 },
  { id: 'DEPT-11', name: 'Civil Registry', head: 'Civil Registrar', employeeCount: 8, budget: 4_500_000 },
  { id: 'DEPT-12', name: 'BPLO', head: 'Licensing Officer', employeeCount: 10, budget: 5_000_000 },
  { id: 'DEPT-13', name: 'Assessor Office', head: 'Roberto Magnaye', employeeCount: 12, budget: 5_200_000 },
  { id: 'DEPT-14', name: 'MENRO', head: 'Engr. Carlos Buena', employeeCount: 8, budget: 4_800_000 },
  { id: 'DEPT-15', name: 'PESO', head: 'Gloria Mendez', employeeCount: 5, budget: 3_500_000 },
  { id: 'DEPT-16', name: 'Records Section', head: 'Juan Dela Cruz', employeeCount: 6, budget: 3_200_000 },
  { id: 'DEPT-17', name: 'Agriculture', head: 'Municipal Agriculturist', employeeCount: 10, budget: 8_000_000 },
  { id: 'DEPT-18', name: 'General Services', head: 'GSO Head', employeeCount: 25, budget: 9_500_000 },
];

export const announcements: Announcement[] = [
  {
    id: 'ANN-001',
    title: 'Pili Festival 2026 - April 15-20',
    content: 'The Municipality of Daet will celebrate the annual Pili Festival from April 15-20, 2026. All departments are requested to prepare their respective programs and activities. Department heads must submit event proposals by March 31.',
    author: 'Mayor Jonatan Rosales',
    department: "Mayor's Office",
    date: '2026-03-15',
    priority: 'high',
    pinned: true,
  },
  {
    id: 'ANN-002',
    title: 'System Maintenance Notice - March 29',
    content: 'The SMART LGU ERP System will undergo scheduled maintenance on March 29, 2026, from 10 PM to 2 AM. Please ensure all pending transactions are completed before the maintenance window.',
    author: 'IT Division',
    department: 'General Services',
    date: '2026-03-20',
    priority: 'medium',
    pinned: true,
  },
  {
    id: 'ANN-003',
    title: 'Q1 2026 Performance Review Schedule',
    content: 'The Q1 2026 performance review for all department heads will be conducted from April 1-5, 2026. Please prepare your quarterly accomplishment reports and submit to HRMO by March 28.',
    author: 'HRMO',
    department: "Mayor's Office",
    date: '2026-03-18',
    priority: 'medium',
    pinned: false,
  },
  {
    id: 'ANN-004',
    title: 'Typhoon Season Preparedness Briefing',
    content: 'MDRRMO will conduct a typhoon season preparedness briefing for all department heads on April 8, 2026, at 2 PM in the Municipal Conference Room. Attendance is mandatory.',
    author: 'Engr. Ramon Bautista',
    department: 'MDRRMO',
    date: '2026-03-22',
    priority: 'high',
    pinned: false,
  },
  {
    id: 'ANN-005',
    title: 'Flag Ceremony and Uniform Policy Reminder',
    content: 'All LGU employees are reminded to attend the Monday flag ceremony at 7:30 AM and to wear the prescribed Monday uniform (barong/Filipiniana). Non-compliance will be noted in attendance records.',
    author: 'HRMO',
    department: "Mayor's Office",
    date: '2026-03-10',
    priority: 'low',
    pinned: false,
  },
];

// -----------------------------------------------------------------------------
// GIS
// -----------------------------------------------------------------------------

export const gisLayers: GISLayer[] = [
  { id: 'GL-01', name: 'Barangay Boundaries', category: 'Administrative', visible: true, color: '#3B82F6', description: 'Official barangay boundary lines' },
  { id: 'GL-02', name: 'Road Network', category: 'Infrastructure', visible: true, color: '#6B7280', description: 'National, provincial, and municipal roads' },
  { id: 'GL-03', name: 'Flood Hazard Zones', category: 'Hazard', visible: true, color: '#EF4444', description: 'Areas susceptible to flooding based on DRRM assessment' },
  { id: 'GL-04', name: 'Landslide Prone Areas', category: 'Hazard', visible: false, color: '#F59E0B', description: 'Areas with landslide susceptibility' },
  { id: 'GL-05', name: 'Storm Surge Areas', category: 'Hazard', visible: false, color: '#8B5CF6', description: 'Coastal areas vulnerable to storm surge' },
  { id: 'GL-06', name: 'Land Use Zoning', category: 'Planning', visible: false, color: '#10B981', description: 'Residential, commercial, agricultural, industrial zones' },
  { id: 'GL-07', name: 'Government Facilities', category: 'Infrastructure', visible: true, color: '#F97316', description: 'Schools, health centers, government buildings' },
  { id: 'GL-08', name: 'Water Bodies', category: 'Natural', visible: true, color: '#06B6D4', description: 'Rivers, creeks, and coastal areas' },
  { id: 'GL-09', name: 'Infrastructure Projects', category: 'Projects', visible: false, color: '#EC4899', description: 'Ongoing and planned infrastructure project locations' },
  { id: 'GL-10', name: 'Evacuation Centers', category: 'Emergency', visible: false, color: '#14B8A6', description: 'Designated evacuation centers and routes' },
  { id: 'GL-11', name: 'Property Parcels', category: 'Cadastral', visible: false, color: '#A855F7', description: 'Lot boundaries and property information' },
  { id: 'GL-12', name: 'Population Density', category: 'Demographics', visible: false, color: '#F43F5E', description: 'Population density heat map by purok/sitio' },
];

export const riskZones: RiskZone[] = [
  {
    id: 'RZ-01',
    name: 'Daet River Floodplain',
    type: 'flood',
    riskLevel: 'high',
    affectedBarangays: ['Camambugan', 'Borabod', 'Daet Proper'],
    population: 12_500,
    description: 'Low-lying areas along Daet River prone to seasonal flooding during typhoons and heavy monsoon rains. Average flood depth: 0.5-2 meters.',
  },
  {
    id: 'RZ-02',
    name: 'Bagasbas Coastal Zone',
    type: 'storm-surge',
    riskLevel: 'high',
    affectedBarangays: ['Bagasbas', 'Bibirao'],
    population: 4_800,
    description: 'Coastal areas vulnerable to storm surge during super typhoons. Maximum surge height estimated at 3-5 meters for Category 5 typhoons.',
  },
  {
    id: 'RZ-03',
    name: 'Pamorangon Lowlands',
    type: 'flood',
    riskLevel: 'medium',
    affectedBarangays: ['Pamorangon', 'Mantagbac'],
    population: 6_200,
    description: 'Agricultural lowland area with poor drainage infrastructure. Flooding occurs 3-5 times annually during rainy season.',
  },
  {
    id: 'RZ-04',
    name: 'Mantagbac Hillside',
    type: 'landslide',
    riskLevel: 'medium',
    affectedBarangays: ['Mantagbac', 'Gahonon'],
    population: 2_100,
    description: 'Hilly terrain with moderate soil erosion risk. Landslide incidents recorded during prolonged rainfall events.',
  },
  {
    id: 'RZ-05',
    name: 'Awitan Market Area',
    type: 'fire',
    riskLevel: 'high',
    affectedBarangays: ['Awitan', 'Daet Proper'],
    population: 8_500,
    description: 'Densely built commercial area with old structures, narrow alleys, and high fire load. Fire risk elevated due to aged electrical systems.',
  },
  {
    id: 'RZ-06',
    name: 'Alawihao Riverside',
    type: 'flood',
    riskLevel: 'low',
    affectedBarangays: ['Alawihao'],
    population: 1_800,
    description: 'Moderate flood risk during exceptionally heavy rainfall. Mostly agricultural land with scattered residences.',
  },
];

// -----------------------------------------------------------------------------
// ANALYTICS
// -----------------------------------------------------------------------------

export const analyticsInsights: AnalyticsInsight[] = [
  {
    id: 'AI-001',
    title: 'Revenue Collection Above Target',
    description: 'Q1 2026 revenue collection is tracking 6.5% above the annual target. Business tax compliance has improved significantly after the new online payment system launch.',
    metric: 'Revenue',
    value: '₱37.6M',
    trend: 'up',
    severity: 'positive',
    department: 'Treasury',
  },
  {
    id: 'AI-002',
    title: 'Property Tax Delinquency Rising',
    description: 'Delinquent property tax accounts have increased by 8% compared to the same period last year. Agricultural properties account for 60% of delinquent accounts.',
    metric: 'Delinquent Accounts',
    value: '510',
    trend: 'up',
    severity: 'negative',
    department: 'Assessor Office',
  },
  {
    id: 'AI-003',
    title: 'Infrastructure Project Delays',
    description: 'Two out of nine infrastructure projects are currently delayed. The Camambugan Bridge project delay is attributed to permit issues with DPWH.',
    metric: 'Delayed Projects',
    value: '2 of 9',
    trend: 'stable',
    severity: 'negative',
    department: 'Engineering',
  },
  {
    id: 'AI-004',
    title: 'Emergency Response Time Improved',
    description: 'Average emergency response time has decreased from 15 minutes to 12 minutes, a 20% improvement attributed to new dispatch coordination system.',
    metric: 'Response Time',
    value: '12 min',
    trend: 'down',
    severity: 'positive',
    department: 'MDRRMO',
  },
  {
    id: 'AI-005',
    title: 'Citizen Satisfaction Trending Up',
    description: 'Citizen satisfaction surveys show an improvement from 78% to 85% overall satisfaction. MSWDO and MDRRMO received the highest ratings.',
    metric: 'Satisfaction',
    value: '85%',
    trend: 'up',
    severity: 'positive',
    department: 'All Departments',
  },
  {
    id: 'AI-006',
    title: 'Business Permit Processing Bottleneck',
    description: 'Fire Safety Inspection is the most common incomplete requirement, causing delays in 40% of pending applications. BFP coordination needs improvement.',
    metric: 'Pending Permits',
    value: '5 apps',
    trend: 'up',
    severity: 'negative',
    department: 'BPLO',
  },
  {
    id: 'AI-007',
    title: 'Document Routing Efficiency',
    description: 'Average document processing time has decreased from 8 days to 5 days. However, 1 document has been delayed for over 19 days.',
    metric: 'Avg. Processing',
    value: '5 days',
    trend: 'down',
    severity: 'positive',
    department: 'Records Section',
  },
];

export const forecastData: ForecastDataPoint[] = [
  { month: 'Jan 2026', actual: 12_450_000, forecast: 12_200_000, lowerBound: 11_000_000, upperBound: 13_400_000 },
  { month: 'Feb 2026', actual: 10_870_000, forecast: 11_000_000, lowerBound: 9_800_000, upperBound: 12_200_000 },
  { month: 'Mar 2026', actual: 14_320_000, forecast: 13_200_000, lowerBound: 11_800_000, upperBound: 14_600_000 },
  { month: 'Apr 2026', actual: null, forecast: 12_500_000, lowerBound: 11_000_000, upperBound: 14_000_000 },
  { month: 'May 2026', actual: null, forecast: 13_100_000, lowerBound: 11_500_000, upperBound: 14_700_000 },
  { month: 'Jun 2026', actual: null, forecast: 14_200_000, lowerBound: 12_500_000, upperBound: 15_900_000 },
  { month: 'Jul 2026', actual: null, forecast: 14_000_000, lowerBound: 12_300_000, upperBound: 15_700_000 },
  { month: 'Aug 2026', actual: null, forecast: 12_800_000, lowerBound: 11_200_000, upperBound: 14_400_000 },
  { month: 'Sep 2026', actual: null, forecast: 11_900_000, lowerBound: 10_400_000, upperBound: 13_400_000 },
  { month: 'Oct 2026', actual: null, forecast: 13_300_000, lowerBound: 11_700_000, upperBound: 14_900_000 },
  { month: 'Nov 2026', actual: null, forecast: 13_800_000, lowerBound: 12_100_000, upperBound: 15_500_000 },
  { month: 'Dec 2026', actual: null, forecast: 15_500_000, lowerBound: 13_600_000, upperBound: 17_400_000 },
];

export const recommendedActions: RecommendedAction[] = [
  {
    id: 'RA-001',
    title: 'Intensify RPT Delinquency Collection Drive',
    description: 'Launch a focused collection campaign targeting the 510 delinquent property tax accounts. Consider offering amnesty on penalties for full payment within 60 days.',
    priority: 'high',
    department: 'Treasury / Assessor Office',
    impact: 'Potential recovery of ₱5.2M in delinquent taxes',
    deadline: '2026-05-31',
    status: 'pending',
  },
  {
    id: 'RA-002',
    title: 'Resolve Camambugan Bridge Project Delay',
    description: 'Escalate the DPWH permit issue for the bridge widening project. Schedule a coordination meeting with DPWH District Engineer within the week.',
    priority: 'high',
    department: "Engineering / Mayor's Office",
    impact: 'Get project back on schedule; affects 6,120 residents',
    deadline: '2026-04-07',
    status: 'in-progress',
  },
  {
    id: 'RA-003',
    title: 'Coordinate with BFP on Fire Safety Inspections',
    description: 'Establish a fast-track process for fire safety inspections of business permit applicants. Current backlog is causing 40% of permit processing delays.',
    priority: 'medium',
    department: 'BPLO',
    impact: 'Reduce permit processing time by 2-3 days',
    deadline: '2026-04-15',
    status: 'pending',
  },
  {
    id: 'RA-004',
    title: 'Prepare Typhoon Season Contingency Fund',
    description: 'Allocate supplemental DRRM fund for the upcoming typhoon season (June-November). Current MDRRMO equipment request pending since March 20.',
    priority: 'high',
    department: 'Budget Office / MDRRMO',
    impact: 'Ensure readiness for 109,000+ municipal population',
    deadline: '2026-05-15',
    status: 'pending',
  },
  {
    id: 'RA-005',
    title: 'Action Overdue BFP Document',
    description: 'The BFP fire truck maintenance fund request has been pending for 19 days. Immediate action needed to prevent further delays in emergency response capability.',
    priority: 'high',
    department: "Mayor's Office",
    impact: 'Restore full fire truck operational capability',
    deadline: '2026-03-28',
    status: 'pending',
  },
  {
    id: 'RA-006',
    title: 'Expand Online Payment Channels',
    description: 'Based on positive revenue trends, expand online payment options to include GCash, Maya, and bank transfers for real property tax and other fees.',
    priority: 'medium',
    department: 'Treasury / IT',
    impact: 'Projected 15% increase in voluntary compliance',
    deadline: '2026-06-30',
    status: 'pending',
  },
  {
    id: 'RA-007',
    title: 'Submit DILG Compliance Report',
    description: 'DILG MC 2026-021 requires LGU compliance report submission by April 22, 2026. Assign responsible officer and begin data gathering.',
    priority: 'medium',
    department: "Mayor's Office / Planning",
    impact: 'Maintain good standing with DILG; avoid sanctions',
    deadline: '2026-04-22',
    status: 'in-progress',
  },
];

// -----------------------------------------------------------------------------
// USERS & SYSTEM
// -----------------------------------------------------------------------------

export const users: SystemUser[] = [
  {
    id: 'USR-001',
    username: 'admin',
    fullName: 'System Administrator',
    email: 'admin@daet.gov.ph',
    role: 'admin',
    department: 'IT Division',
    lastLogin: '2026-03-24T08:00:00',
    status: 'active',
  },
  {
    id: 'USR-002',
    username: 'mayor.rosales',
    fullName: 'Mayor Jonatan Rosales',
    email: 'mayor@daet.gov.ph',
    role: 'admin',
    department: "Mayor's Office",
    lastLogin: '2026-03-24T07:45:00',
    status: 'active',
  },
  {
    id: 'USR-003',
    username: 'a.pascual',
    fullName: 'Alma Pascual',
    email: 'a.pascual@daet.gov.ph',
    role: 'department-head',
    department: 'Budget Office',
    lastLogin: '2026-03-24T08:15:00',
    status: 'active',
  },
  {
    id: 'USR-004',
    username: 'm.rivera',
    fullName: 'Engr. Manuel Rivera',
    email: 'm.rivera@daet.gov.ph',
    role: 'department-head',
    department: 'Engineering Office',
    lastLogin: '2026-03-23T17:30:00',
    status: 'active',
  },
  {
    id: 'USR-005',
    username: 'm.santos',
    fullName: 'Maria Santos',
    email: 'm.santos@daet.gov.ph',
    role: 'staff',
    department: 'Treasury',
    lastLogin: '2026-03-24T08:05:00',
    status: 'active',
  },
  {
    id: 'USR-006',
    username: 'e.reyes',
    fullName: 'Elena Reyes',
    email: 'e.reyes@daet.gov.ph',
    role: 'staff',
    department: 'Treasury',
    lastLogin: '2026-03-24T08:10:00',
    status: 'active',
  },
  {
    id: 'USR-007',
    username: 'r.bautista',
    fullName: 'Engr. Ramon Bautista',
    email: 'r.bautista@daet.gov.ph',
    role: 'department-head',
    department: 'MDRRMO',
    lastLogin: '2026-03-24T06:00:00',
    status: 'active',
  },
  {
    id: 'USR-008',
    username: 'p.reyes',
    fullName: 'Dr. Patricia Reyes',
    email: 'p.reyes@daet.gov.ph',
    role: 'department-head',
    department: 'Health Office',
    lastLogin: '2026-03-23T16:45:00',
    status: 'active',
  },
  {
    id: 'USR-009',
    username: 'j.delacruz',
    fullName: 'Juan Dela Cruz',
    email: 'j.delacruz@daet.gov.ph',
    role: 'staff',
    department: 'Records Section',
    lastLogin: '2026-03-24T07:50:00',
    status: 'active',
  },
  {
    id: 'USR-010',
    username: 'viewer.demo',
    fullName: 'Demo Viewer',
    email: 'demo@daet.gov.ph',
    role: 'viewer',
    department: 'External',
    lastLogin: '2026-03-20T10:00:00',
    status: 'active',
  },
  {
    id: 'USR-011',
    username: 'r.aguilar',
    fullName: 'Rosita Aguilar',
    email: 'r.aguilar@daet.gov.ph',
    role: 'department-head',
    department: 'MSWDO',
    lastLogin: '2026-03-15T08:00:00',
    status: 'inactive',
  },
];

export const auditLogs: AuditLog[] = [
  {
    id: 'LOG-001',
    action: 'LOGIN',
    module: 'Authentication',
    user: 'Mayor Jonatan Rosales',
    details: "Successful login from Mayor's Office workstation",
    timestamp: '2026-03-24T07:45:00',
    ipAddress: '192.168.1.10',
  },
  {
    id: 'LOG-002',
    action: 'CREATE',
    module: 'Revenue Collection',
    user: 'Maria Santos',
    details: 'Created collection receipt OR-2026-0451 for Daet Trading Corp. (₱45,000)',
    timestamp: '2026-03-24T10:00:00',
    ipAddress: '192.168.1.25',
  },
  {
    id: 'LOG-003',
    action: 'UPDATE',
    module: 'Business Permits',
    user: 'Elena Reyes',
    details: 'Updated permit BP-2026-001 status from "approved" to "released"',
    timestamp: '2026-03-24T09:30:00',
    ipAddress: '192.168.1.26',
  },
  {
    id: 'LOG-004',
    action: 'CREATE',
    module: 'Document Tracking',
    user: 'Juan Dela Cruz',
    details: 'Logged incoming document DOC-INC-2026-0153 from DepEd Division',
    timestamp: '2026-03-24T08:15:00',
    ipAddress: '192.168.1.30',
  },
  {
    id: 'LOG-005',
    action: 'DISPATCH',
    module: 'Emergency Management',
    user: 'Engr. Ramon Bautista',
    details: 'Dispatched MDRRMO Team Bravo to Camambugan flooding incident EMG-2026-005',
    timestamp: '2026-03-24T06:20:00',
    ipAddress: '192.168.1.40',
  },
  {
    id: 'LOG-006',
    action: 'UPDATE',
    module: 'Infrastructure',
    user: 'Engr. Manuel Rivera',
    details: 'Updated project INFRA-2026-002 progress to 90%',
    timestamp: '2026-03-23T16:00:00',
    ipAddress: '192.168.1.35',
  },
  {
    id: 'LOG-007',
    action: 'RESOLVE',
    module: 'Citizen Requests',
    user: 'Engr. Carlos Buena',
    details: 'Resolved citizen complaint CR-2026-003 (Illegal dumping near Daet River)',
    timestamp: '2026-03-23T14:30:00',
    ipAddress: '192.168.1.42',
  },
  {
    id: 'LOG-008',
    action: 'EXPORT',
    module: 'Reports',
    user: 'CPA Remedios Tan',
    details: 'Exported Q1 2026 Financial Summary Report to PDF',
    timestamp: '2026-03-23T15:45:00',
    ipAddress: '192.168.1.28',
  },
  {
    id: 'LOG-009',
    action: 'LOGIN_FAILED',
    module: 'Authentication',
    user: 'Unknown',
    details: 'Failed login attempt with username "admin" - incorrect password (3rd attempt)',
    timestamp: '2026-03-23T22:15:00',
    ipAddress: '203.177.45.12',
  },
  {
    id: 'LOG-010',
    action: 'SETTINGS_CHANGE',
    module: 'System Settings',
    user: 'System Administrator',
    details: 'Updated system maintenance schedule to March 29, 2026',
    timestamp: '2026-03-20T09:00:00',
    ipAddress: '192.168.1.5',
  },
];

export const systemSettings: SystemSetting[] = [
  { key: 'municipality_name', label: 'Municipality Name', value: 'Municipality of Daet', category: 'General', description: 'Official name of the LGU' },
  { key: 'province', label: 'Province', value: 'Camarines Norte', category: 'General', description: 'Province where the municipality is located' },
  { key: 'region', label: 'Region', value: 'Region V - Bicol', category: 'General', description: 'Administrative region' },
  { key: 'fiscal_year', label: 'Current Fiscal Year', value: 2026, category: 'Finance', description: 'Active fiscal year for budgeting and reporting' },
  { key: 'tax_discount_early', label: 'Early Payment Discount (%)', value: 10, category: 'Finance', description: 'Discount percentage for early annual tax payment (Jan-Mar)' },
  { key: 'penalty_rate', label: 'Late Payment Penalty (%)', value: 2, category: 'Finance', description: 'Monthly penalty rate for late tax payments' },
  { key: 'business_permit_deadline', label: 'Business Permit Renewal Deadline', value: '2026-01-20', category: 'Permits', description: 'Annual deadline for business permit renewal without penalty' },
  { key: 'session_timeout', label: 'Session Timeout (minutes)', value: 30, category: 'Security', description: 'Auto-logout after minutes of inactivity' },
  { key: 'max_login_attempts', label: 'Max Login Attempts', value: 5, category: 'Security', description: 'Maximum failed login attempts before account lockout' },
  { key: 'enable_2fa', label: 'Two-Factor Authentication', value: true, category: 'Security', description: 'Require 2FA for admin and department-head roles' },
  { key: 'backup_frequency', label: 'Backup Frequency', value: 'daily', category: 'System', description: 'Automatic database backup schedule' },
  { key: 'maintenance_mode', label: 'Maintenance Mode', value: false, category: 'System', description: 'Enable to put system in read-only maintenance mode' },
  { key: 'email_notifications', label: 'Email Notifications', value: true, category: 'Notifications', description: 'Enable email notifications for critical events' },
  { key: 'sms_notifications', label: 'SMS Notifications', value: true, category: 'Notifications', description: 'Enable SMS notifications for emergency alerts' },
  { key: 'citizen_portal_enabled', label: 'Citizen Portal', value: true, category: 'Services', description: 'Enable public-facing citizen request portal' },
  { key: 'online_payment_enabled', label: 'Online Payment', value: true, category: 'Services', description: 'Enable online payment processing for taxes and fees' },
];

// -----------------------------------------------------------------------------
// DASHBOARD-SPECIFIC DATA
// -----------------------------------------------------------------------------

export const monthlyRevenue: ChartDataPoint[] = [
  { month: 'Jan', revenue: 18_500_000, target: 20_000_000 },
  { month: 'Feb', revenue: 22_300_000, target: 20_000_000 },
  { month: 'Mar', revenue: 25_100_000, target: 22_000_000 },
  { month: 'Apr', revenue: 19_800_000, target: 22_000_000 },
  { month: 'May', revenue: 21_400_000, target: 22_000_000 },
  { month: 'Jun', revenue: 24_600_000, target: 24_000_000 },
  { month: 'Jul', revenue: 26_200_000, target: 24_000_000 },
  { month: 'Aug', revenue: 23_800_000, target: 24_000_000 },
  { month: 'Sep', revenue: 27_500_000, target: 26_000_000 },
  { month: 'Oct', revenue: 29_100_000, target: 26_000_000 },
  { month: 'Nov', revenue: 25_700_000, target: 26_000_000 },
  { month: 'Dec', revenue: 31_000_000, target: 28_000_000 },
];

export const permitApprovalTrend: ChartDataPoint[] = [
  { month: 'Jan', approved: 85, rejected: 12 },
  { month: 'Feb', approved: 92, rejected: 8 },
  { month: 'Mar', approved: 78, rejected: 15 },
  { month: 'Apr', approved: 95, rejected: 10 },
  { month: 'May', approved: 88, rejected: 7 },
  { month: 'Jun', approved: 102, rejected: 11 },
  { month: 'Jul', approved: 97, rejected: 9 },
  { month: 'Aug', approved: 110, rejected: 13 },
  { month: 'Sep', approved: 105, rejected: 6 },
  { month: 'Oct', approved: 115, rejected: 8 },
  { month: 'Nov', approved: 98, rejected: 14 },
  { month: 'Dec', approved: 120, rejected: 5 },
];

export const taxCollectionStatus = [
  { name: 'Paid', value: 2450, color: '#10b981' },
  { name: 'Partial', value: 580, color: '#f59e0b' },
  { name: 'Unpaid', value: 470, color: '#ef4444' },
  { name: 'Delinquent', value: 342, color: '#6b7280' },
];

export const incidentsByCategory = [
  { category: 'Accident', count: 12, color: '#ef4444' },
  { category: 'Flooding', count: 8, color: '#3b82f6' },
  { category: 'Fire', count: 5, color: '#f97316' },
  { category: 'Crime', count: 7, color: '#8b5cf6' },
  { category: 'Medical', count: 15, color: '#10b981' },
];

export const alerts: Alert[] = [
  {
    type: 'overdue_tax',
    severity: 'red',
    title: 'Overdue Tax Accounts',
    description: '342 property owners with overdue tax payments exceeding 1 year.',
    count: 342,
    link: '/property-tax',
  },
  {
    type: 'delayed_projects',
    severity: 'amber',
    title: 'Delayed Projects',
    description: '2 infrastructure projects behind schedule by more than 30 days.',
    count: 2,
    link: '/infrastructure',
  },
  {
    type: 'urgent_incidents',
    severity: 'red',
    title: 'Urgent Incidents',
    description: '3 active emergency incidents requiring immediate response.',
    count: 3,
    link: '/emergency',
  },
];

export const quickNavItems: QuickNavItem[] = [
  { title: 'Business Permits', description: 'Process and monitor business permits', link: '/business-permits', iconName: 'Briefcase', color: 'blue' },
  { title: 'Property Tax', description: 'Manage property tax records', link: '/property-tax', iconName: 'Landmark', color: 'green' },
  { title: 'Treasury', description: 'Monitor revenue collections', link: '/treasury', iconName: 'Wallet', color: 'amber' },
  { title: 'Documents', description: 'Track document routing', link: '/documents', iconName: 'FileText', color: 'purple' },
  { title: 'Citizen Services', description: 'Handle citizen requests', link: '/citizen-services', iconName: 'Users', color: 'cyan' },
  { title: 'Emergency', description: 'Emergency response center', link: '/emergency', iconName: 'Siren', color: 'red' },
  { title: 'Infrastructure', description: 'Monitor project progress', link: '/infrastructure', iconName: 'HardHat', color: 'orange' },
  { title: 'GIS Map', description: 'Geospatial data explorer', link: '/gis', iconName: 'Map', color: 'teal' },
];
