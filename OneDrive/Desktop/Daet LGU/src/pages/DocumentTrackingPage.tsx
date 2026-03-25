import { useState, useMemo } from 'react';
import {
  FileText,
  Send,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  Eye,
  MapPin,
  ChevronRight,
  CheckCircle2,
  ArrowRight,
  Upload,
  X,
  Building2,
  Calendar,
  Tag,
  Paperclip,
  Filter,
} from 'lucide-react';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';

/* ------------------------------------------------------------------ */
/*  TYPES                                                              */
/* ------------------------------------------------------------------ */

interface RoutingStep {
  office: string;
  action: string;
  date: string;
  time: string;
  handler: string;
  remarks?: string;
  status: 'completed' | 'current' | 'pending';
}

interface AttachedFile {
  name: string;
  size: string;
  type: string;
}

interface Document {
  id: string;
  refNo: string;
  subject: string;
  type: 'Incoming' | 'Outgoing' | 'Internal';
  origin: string;
  currentOffice: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Received' | 'In Transit' | 'Pending Action' | 'Completed' | 'Delayed';
  dateReceived: string;
  daysInCurrent: number;
  routing: RoutingStep[];
  attachments: AttachedFile[];
  remarks: string;
}

/* ------------------------------------------------------------------ */
/*  HARDCODED DATA                                                     */
/* ------------------------------------------------------------------ */

const offices = [
  'Records Office',
  "Mayor's Office",
  "Vice Mayor's Office",
  'Sangguniang Bayan',
  'Municipal Engineering Office',
  'Municipal Planning Office',
  'Municipal Budget Office',
  'Municipal Accounting Office',
  'Municipal Treasurer\'s Office',
  'Municipal Assessor\'s Office',
  'Municipal Health Office',
  'Municipal Social Welfare Office',
  'Municipal Agriculture Office',
  'Municipal Civil Registrar',
  'Human Resource Office',
];

const documents: Document[] = [
  {
    id: '1',
    refNo: 'DOC-2024-0015',
    subject: 'Executive Order No. 2024-015 - Creation of Task Force Kalinisan',
    type: 'Internal',
    origin: "Mayor's Office",
    currentOffice: 'Sangguniang Bayan',
    priority: 'High',
    status: 'In Transit',
    dateReceived: '2024-11-18',
    daysInCurrent: 2,
    routing: [
      { office: "Mayor's Office", action: 'Document created and signed', date: '2024-11-15', time: '09:00 AM', handler: 'Mayor Elmer E. Balbin', status: 'completed' },
      { office: 'Records Office', action: 'Received and logged', date: '2024-11-15', time: '10:30 AM', handler: 'Maria Santos', status: 'completed' },
      { office: 'Sangguniang Bayan', action: 'Forwarded for notation', date: '2024-11-18', time: '08:15 AM', handler: 'Pedro Reyes', remarks: 'For notation and implementation', status: 'current' },
    ],
    attachments: [
      { name: 'EO-2024-015-signed.pdf', size: '2.4 MB', type: 'PDF' },
      { name: 'Task-Force-Composition.docx', size: '156 KB', type: 'DOCX' },
    ],
    remarks: 'For immediate implementation across all barangays',
  },
  {
    id: '2',
    refNo: 'DOC-2024-0287',
    subject: 'Request for Road Repair - Brgy. Borabod, Purok 3',
    type: 'Incoming',
    origin: 'Barangay Borabod',
    currentOffice: 'Municipal Engineering Office',
    priority: 'High',
    status: 'Pending Action',
    dateReceived: '2024-11-10',
    daysInCurrent: 8,
    routing: [
      { office: 'Records Office', action: 'Received from Barangay Borabod', date: '2024-11-10', time: '09:30 AM', handler: 'Maria Santos', status: 'completed' },
      { office: "Mayor's Office", action: 'Endorsed for action', date: '2024-11-11', time: '02:00 PM', handler: 'Juan dela Cruz', remarks: 'Priority action requested', status: 'completed' },
      { office: 'Municipal Engineering Office', action: 'Pending site inspection and cost estimate', date: '2024-11-12', time: '10:00 AM', handler: 'Eng. Roberto Lim', status: 'current' },
    ],
    attachments: [
      { name: 'Road-Repair-Request-Letter.pdf', size: '890 KB', type: 'PDF' },
      { name: 'Site-Photos-Borabod.zip', size: '15.3 MB', type: 'ZIP' },
    ],
    remarks: 'Road severely damaged after Typhoon Kristine, impassable to vehicles',
  },
  {
    id: '3',
    refNo: 'DOC-2024-0312',
    subject: 'Budget Allocation for Q2 - Infrastructure Development Fund',
    type: 'Internal',
    origin: 'Municipal Budget Office',
    currentOffice: 'Municipal Accounting Office',
    priority: 'High',
    status: 'In Transit',
    dateReceived: '2024-11-14',
    daysInCurrent: 3,
    routing: [
      { office: 'Municipal Budget Office', action: 'Budget proposal prepared', date: '2024-11-12', time: '08:00 AM', handler: 'Ana Villanueva', status: 'completed' },
      { office: "Mayor's Office", action: 'Approved', date: '2024-11-13', time: '04:00 PM', handler: 'Mayor Elmer E. Balbin', status: 'completed' },
      { office: 'Municipal Accounting Office', action: 'For recording and fund allocation', date: '2024-11-14', time: '09:00 AM', handler: 'Grace Tan', status: 'current' },
    ],
    attachments: [
      { name: 'Q2-Budget-Proposal.xlsx', size: '1.2 MB', type: 'XLSX' },
      { name: 'Infrastructure-Projects-List.pdf', size: '3.1 MB', type: 'PDF' },
    ],
    remarks: 'Total allocation: PHP 25,000,000.00 for 12 infrastructure projects',
  },
  {
    id: '4',
    refNo: 'DOC-2024-0298',
    subject: 'Barangay Resolution No. 2024-003 - Anti-Illegal Gambling Drive',
    type: 'Incoming',
    origin: 'Barangay Lag-on',
    currentOffice: 'Sangguniang Bayan',
    priority: 'Medium',
    status: 'Received',
    dateReceived: '2024-11-17',
    daysInCurrent: 1,
    routing: [
      { office: 'Records Office', action: 'Received and logged', date: '2024-11-17', time: '10:00 AM', handler: 'Maria Santos', status: 'completed' },
      { office: 'Sangguniang Bayan', action: 'For committee review', date: '2024-11-18', time: '08:30 AM', handler: 'SB Secretary Rosa Aquino', status: 'current' },
    ],
    attachments: [
      { name: 'Brgy-Resolution-2024-003.pdf', size: '450 KB', type: 'PDF' },
    ],
    remarks: 'Requesting municipal support for anti-illegal gambling operations',
  },
  {
    id: '5',
    refNo: 'DOC-2024-0305',
    subject: 'DTI Business Registration Endorsement - JMR Trading',
    type: 'Outgoing',
    origin: 'Municipal Planning Office',
    currentOffice: "Municipal Treasurer's Office",
    priority: 'Low',
    status: 'In Transit',
    dateReceived: '2024-11-16',
    daysInCurrent: 2,
    routing: [
      { office: 'Municipal Planning Office', action: 'Business permit reviewed', date: '2024-11-14', time: '01:00 PM', handler: 'Engr. Luis Ramos', status: 'completed' },
      { office: "Municipal Treasurer's Office", action: 'For tax clearance issuance', date: '2024-11-16', time: '09:30 AM', handler: 'Teresita Gomez', status: 'current' },
    ],
    attachments: [
      { name: 'DTI-Endorsement-JMR.pdf', size: '320 KB', type: 'PDF' },
      { name: 'Business-Permit-Application.pdf', size: '1.8 MB', type: 'PDF' },
    ],
    remarks: 'New business registration for JMR Trading along Vinzons Avenue',
  },
  {
    id: '6',
    refNo: 'DOC-2024-0250',
    subject: 'Request for Medical Mission Assistance - Brgy. Gahonon',
    type: 'Incoming',
    origin: 'Barangay Gahonon',
    currentOffice: 'Municipal Health Office',
    priority: 'Medium',
    status: 'Delayed',
    dateReceived: '2024-10-28',
    daysInCurrent: 22,
    routing: [
      { office: 'Records Office', action: 'Received and logged', date: '2024-10-28', time: '08:00 AM', handler: 'Maria Santos', status: 'completed' },
      { office: "Mayor's Office", action: 'Endorsed to MHO', date: '2024-10-29', time: '03:00 PM', handler: 'Juan dela Cruz', status: 'completed' },
      { office: 'Municipal Health Office', action: 'Pending scheduling and resource allocation', date: '2024-10-30', time: '10:00 AM', handler: 'Dr. Elena Pascual', remarks: 'Awaiting available medical supplies', status: 'current' },
    ],
    attachments: [
      { name: 'Medical-Mission-Request.pdf', size: '670 KB', type: 'PDF' },
    ],
    remarks: 'Request for medical and dental mission for 500+ residents',
  },
  {
    id: '7',
    refNo: 'DOC-2024-0278',
    subject: 'DILG Compliance Report - SGLG Requirements',
    type: 'Outgoing',
    origin: 'Municipal Planning Office',
    currentOffice: "Mayor's Office",
    priority: 'High',
    status: 'Pending Action',
    dateReceived: '2024-11-08',
    daysInCurrent: 5,
    routing: [
      { office: 'Municipal Planning Office', action: 'Report compiled from all departments', date: '2024-11-05', time: '09:00 AM', handler: 'Engr. Luis Ramos', status: 'completed' },
      { office: 'Municipal Budget Office', action: 'Financial data verified', date: '2024-11-07', time: '02:00 PM', handler: 'Ana Villanueva', status: 'completed' },
      { office: "Mayor's Office", action: 'For review and signature', date: '2024-11-08', time: '10:00 AM', handler: 'Mayor Elmer E. Balbin', remarks: 'Deadline: November 30, 2024', status: 'current' },
    ],
    attachments: [
      { name: 'SGLG-Compliance-Report-2024.pdf', size: '8.5 MB', type: 'PDF' },
      { name: 'Financial-Statements.xlsx', size: '2.3 MB', type: 'XLSX' },
      { name: 'Supporting-Documents.zip', size: '45.2 MB', type: 'ZIP' },
    ],
    remarks: 'Strict deadline compliance required for SGLG award consideration',
  },
  {
    id: '8',
    refNo: 'DOC-2024-0320',
    subject: 'Request for CCTV Installation - Daet Public Market',
    type: 'Internal',
    origin: 'Municipal Engineering Office',
    currentOffice: 'Municipal Budget Office',
    priority: 'Medium',
    status: 'In Transit',
    dateReceived: '2024-11-17',
    daysInCurrent: 1,
    routing: [
      { office: 'Municipal Engineering Office', action: 'Technical specifications prepared', date: '2024-11-15', time: '11:00 AM', handler: 'Eng. Roberto Lim', status: 'completed' },
      { office: "Mayor's Office", action: 'Approved in principle', date: '2024-11-16', time: '04:30 PM', handler: 'Juan dela Cruz', status: 'completed' },
      { office: 'Municipal Budget Office', action: 'For fund availability certification', date: '2024-11-17', time: '09:00 AM', handler: 'Ana Villanueva', status: 'current' },
    ],
    attachments: [
      { name: 'CCTV-Technical-Specs.pdf', size: '1.5 MB', type: 'PDF' },
      { name: 'Cost-Estimate.xlsx', size: '320 KB', type: 'XLSX' },
    ],
    remarks: 'Estimated cost: PHP 1,200,000.00 for 24 CCTV cameras',
  },
  {
    id: '9',
    refNo: 'DOC-2024-0230',
    subject: 'Request for Senior Citizen Benefits Release - Q4 2024',
    type: 'Incoming',
    origin: 'Federation of Senior Citizens - Daet Chapter',
    currentOffice: 'Municipal Social Welfare Office',
    priority: 'High',
    status: 'Delayed',
    dateReceived: '2024-10-20',
    daysInCurrent: 30,
    routing: [
      { office: 'Records Office', action: 'Received and logged', date: '2024-10-20', time: '08:30 AM', handler: 'Maria Santos', status: 'completed' },
      { office: "Mayor's Office", action: 'Endorsed to MSWO', date: '2024-10-21', time: '01:00 PM', handler: 'Juan dela Cruz', status: 'completed' },
      { office: 'Municipal Social Welfare Office', action: 'Pending beneficiary validation and fund release', date: '2024-10-22', time: '10:00 AM', handler: 'Lorna Magpayo', remarks: 'Awaiting updated masterlist from barangays', status: 'current' },
    ],
    attachments: [
      { name: 'Senior-Citizen-Request-Letter.pdf', size: '410 KB', type: 'PDF' },
      { name: 'Q4-Beneficiary-Masterlist.xlsx', size: '5.6 MB', type: 'XLSX' },
    ],
    remarks: 'Affects 3,200+ senior citizen beneficiaries across 25 barangays',
  },
  {
    id: '10',
    refNo: 'DOC-2024-0315',
    subject: 'Municipal Ordinance No. 2024-011 - Plastic Bag Ban Implementation',
    type: 'Internal',
    origin: 'Sangguniang Bayan',
    currentOffice: "Mayor's Office",
    priority: 'Medium',
    status: 'Completed',
    dateReceived: '2024-11-12',
    daysInCurrent: 0,
    routing: [
      { office: 'Sangguniang Bayan', action: 'Ordinance approved on 3rd reading', date: '2024-11-10', time: '02:00 PM', handler: 'Vice Mayor Carlos Padua', status: 'completed' },
      { office: 'Records Office', action: 'Received and logged', date: '2024-11-11', time: '09:00 AM', handler: 'Maria Santos', status: 'completed' },
      { office: "Mayor's Office", action: 'Signed into law', date: '2024-11-12', time: '03:00 PM', handler: 'Mayor Elmer E. Balbin', status: 'completed' },
    ],
    attachments: [
      { name: 'Ordinance-2024-011-Signed.pdf', size: '1.9 MB', type: 'PDF' },
    ],
    remarks: 'Effectivity: 15 days after publication',
  },
  {
    id: '11',
    refNo: 'DOC-2024-0322',
    subject: 'Request for Agricultural Subsidy - Palay Farmers Association',
    type: 'Incoming',
    origin: 'Daet Palay Farmers Association',
    currentOffice: 'Municipal Agriculture Office',
    priority: 'Medium',
    status: 'Received',
    dateReceived: '2024-11-18',
    daysInCurrent: 0,
    routing: [
      { office: 'Records Office', action: 'Received and logged', date: '2024-11-18', time: '10:30 AM', handler: 'Maria Santos', status: 'completed' },
      { office: 'Municipal Agriculture Office', action: 'For initial review', date: '2024-11-18', time: '02:00 PM', handler: 'Alfredo Bautista', status: 'current' },
    ],
    attachments: [
      { name: 'Subsidy-Request-Letter.pdf', size: '520 KB', type: 'PDF' },
      { name: 'Farmers-Registry.xlsx', size: '3.8 MB', type: 'XLSX' },
    ],
    remarks: 'Request covers 450 registered palay farmers for next planting season',
  },
  {
    id: '12',
    refNo: 'DOC-2024-0260',
    subject: 'Birth Certificate Late Registration - Batch Filing November 2024',
    type: 'Internal',
    origin: 'Municipal Civil Registrar',
    currentOffice: 'Municipal Civil Registrar',
    priority: 'Low',
    status: 'Pending Action',
    dateReceived: '2024-11-01',
    daysInCurrent: 17,
    routing: [
      { office: 'Municipal Civil Registrar', action: 'Batch applications compiled', date: '2024-11-01', time: '08:00 AM', handler: 'Elena Cruz', status: 'completed' },
      { office: 'Municipal Civil Registrar', action: 'Pending verification and PSA submission', date: '2024-11-05', time: '09:00 AM', handler: 'Elena Cruz', remarks: '35 applications for processing', status: 'current' },
    ],
    attachments: [
      { name: 'Late-Registration-Batch-Nov2024.xlsx', size: '2.1 MB', type: 'XLSX' },
    ],
    remarks: '35 late registration applications awaiting PSA submission',
  },
  {
    id: '13',
    refNo: 'DOC-2024-0195',
    subject: 'Request for Disaster Risk Reduction Equipment - MDRRMO',
    type: 'Incoming',
    origin: 'MDRRMO',
    currentOffice: 'Municipal Budget Office',
    priority: 'High',
    status: 'Delayed',
    dateReceived: '2024-10-05',
    daysInCurrent: 35,
    routing: [
      { office: 'MDRRMO', action: 'Equipment requisition submitted', date: '2024-10-05', time: '08:00 AM', handler: 'Cmdr. Danilo Reyes', status: 'completed' },
      { office: "Mayor's Office", action: 'Approved', date: '2024-10-07', time: '11:00 AM', handler: 'Mayor Elmer E. Balbin', status: 'completed' },
      { office: 'Municipal Budget Office', action: 'Pending fund availability and procurement process', date: '2024-10-10', time: '09:00 AM', handler: 'Ana Villanueva', remarks: 'Awaiting supplemental budget approval', status: 'current' },
    ],
    attachments: [
      { name: 'DRR-Equipment-Request.pdf', size: '1.1 MB', type: 'PDF' },
      { name: 'Equipment-Specifications.pdf', size: '4.7 MB', type: 'PDF' },
    ],
    remarks: 'Critical need for rescue boats and emergency communication equipment',
  },
  {
    id: '14',
    refNo: 'DOC-2024-0318',
    subject: 'Real Property Tax Delinquency Report - CY 2024',
    type: 'Internal',
    origin: "Municipal Treasurer's Office",
    currentOffice: "Municipal Assessor's Office",
    priority: 'Low',
    status: 'Completed',
    dateReceived: '2024-11-15',
    daysInCurrent: 0,
    routing: [
      { office: "Municipal Treasurer's Office", action: 'Delinquency report generated', date: '2024-11-13', time: '02:00 PM', handler: 'Teresita Gomez', status: 'completed' },
      { office: "Municipal Assessor's Office", action: 'Cross-referenced with assessment records', date: '2024-11-15', time: '04:00 PM', handler: 'Atty. Ramon Garcia', status: 'completed' },
    ],
    attachments: [
      { name: 'RPT-Delinquency-Report-2024.pdf', size: '6.2 MB', type: 'PDF' },
    ],
    remarks: 'Total delinquent accounts: 1,245 with PHP 12.5M collectibles',
  },
];

/* ------------------------------------------------------------------ */
/*  HELPERS                                                            */
/* ------------------------------------------------------------------ */

const priorityBadge = (p: Document['priority']) => {
  const map = { High: 'danger', Medium: 'warning', Low: 'success' } as const;
  return <Badge variant={map[p]}>{p}</Badge>;
};

const statusBadge = (s: Document['status']) => {
  const map = {
    Received: 'info',
    'In Transit': 'info',
    'Pending Action': 'warning',
    Completed: 'success',
    Delayed: 'danger',
  } as const;
  return <Badge variant={map[s]}>{s}</Badge>;
};

const typeBadge = (t: Document['type']) => {
  const map = { Incoming: 'info', Outgoing: 'success', Internal: 'neutral' } as const;
  return <Badge variant={map[t]}>{t}</Badge>;
};

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function DocumentTrackingPage() {
  // Filters
  const [searchRef, setSearchRef] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterOffice, setFilterOffice] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Modals
  const [viewDoc, setViewDoc] = useState<Document | null>(null);
  const [showNewDoc, setShowNewDoc] = useState(false);
  const [showTracker, setShowTracker] = useState(false);

  // Tracker
  const [trackRef, setTrackRef] = useState('');
  const [trackResult, setTrackResult] = useState<Document | null>(null);
  const [trackError, setTrackError] = useState('');

  // New document form
  const [newDoc, setNewDoc] = useState({
    subject: '',
    type: 'Incoming' as 'Incoming' | 'Outgoing' | 'Internal',
    origin: '',
    destination: '',
    priority: 'Medium' as 'High' | 'Medium' | 'Low',
    remarks: '',
  });

  // Active tab
  const [activeTab, setActiveTab] = useState<'registry' | 'delayed' | 'pending'>('registry');

  /* Filtering logic */
  const filtered = useMemo(() => {
    return documents.filter((d) => {
      if (searchRef && !d.refNo.toLowerCase().includes(searchRef.toLowerCase()) && !d.subject.toLowerCase().includes(searchRef.toLowerCase())) return false;
      if (filterType !== 'All' && d.type !== filterType) return false;
      if (filterOffice !== 'All' && d.currentOffice !== filterOffice) return false;
      if (filterPriority !== 'All' && d.priority !== filterPriority) return false;
      if (filterStatus !== 'All' && d.status !== filterStatus) return false;
      if (dateFrom && d.dateReceived < dateFrom) return false;
      if (dateTo && d.dateReceived > dateTo) return false;
      return true;
    });
  }, [searchRef, filterType, filterOffice, filterPriority, filterStatus, dateFrom, dateTo]);

  const delayedDocs = documents.filter((d) => d.status === 'Delayed');
  const pendingDocs = documents.filter((d) => d.status === 'Pending Action');

  /* Pending grouped by office */
  const pendingByOffice = useMemo(() => {
    const grouped: Record<string, { count: number; oldest: number; docs: Document[] }> = {};
    pendingDocs.forEach((d) => {
      if (!grouped[d.currentOffice]) grouped[d.currentOffice] = { count: 0, oldest: 0, docs: [] };
      grouped[d.currentOffice].count++;
      grouped[d.currentOffice].oldest = Math.max(grouped[d.currentOffice].oldest, d.daysInCurrent);
      grouped[d.currentOffice].docs.push(d);
    });
    return grouped;
  }, []);

  /* Track document handler */
  const handleTrack = () => {
    setTrackError('');
    setTrackResult(null);
    const found = documents.find((d) => d.refNo.toLowerCase() === trackRef.trim().toLowerCase());
    if (found) {
      setTrackResult(found);
    } else {
      setTrackError('No document found with that reference number. Please check and try again.');
    }
  };

  /* New document submit */
  const handleNewDocSubmit = () => {
    alert(`Document created successfully!\n\nRef: DOC-2024-${String(Math.floor(Math.random() * 9000) + 1000)}\nSubject: ${newDoc.subject}`);
    setShowNewDoc(false);
    setNewDoc({ subject: '', type: 'Incoming', origin: '', destination: '', priority: 'Medium', remarks: '' });
  };

  /* Render routing timeline */
  const renderTimeline = (routing: RoutingStep[]) => (
    <div className="relative pl-8">
      <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gray-200" />
      {routing.map((step, i) => (
        <div key={i} className="relative pb-6 last:pb-0">
          <div className={`absolute left-[-20px] top-1 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white ${
            step.status === 'completed' ? 'bg-emerald-500' : step.status === 'current' ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'
          }`}>
            {step.status === 'completed' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            ) : step.status === 'current' ? (
              <Clock className="w-3.5 h-3.5 text-white" />
            ) : (
              <div className="w-2 h-2 bg-white rounded-full" />
            )}
          </div>
          <div className={`ml-4 p-3 rounded-xl ${step.status === 'current' ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="font-semibold text-sm text-gray-900">{step.office}</span>
              <span className="text-xs text-gray-500">{step.date} at {step.time}</span>
            </div>
            <p className="text-sm text-gray-700 mt-1">{step.action}</p>
            <p className="text-xs text-gray-500 mt-1">Handled by: {step.handler}</p>
            {step.remarks && (
              <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-2 py-1 mt-2 inline-block">
                {step.remarks}
              </p>
            )}
            {step.status === 'current' && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 mt-2">
                <MapPin className="w-3 h-3" /> Currently here
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  RENDER                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ---- BREADCRUMBS & HEADER ---- */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span className="hover:text-blue-600 cursor-pointer">Dashboard</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-gray-900 font-medium">Document Tracking</span>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Document Tracking System</h1>
            <p className="text-sm text-gray-500 mt-1">Municipality of Daet, Camarines Norte</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowTracker(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              <Search className="w-4 h-4" />
              Track Document
            </button>
            <button
              onClick={() => setShowNewDoc(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              New Document
            </button>
          </div>
        </div>

        {/* ---- STATS CARDS ---- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Documents" value="2,847" change="+12.3%" changeType="up" icon={FileText} color="blue" />
          <StatCard title="In Transit" value="124" change="+4.2%" changeType="up" icon={Send} color="purple" />
          <StatCard title="Pending Action" value="67" change="-8.1%" changeType="down" icon={Clock} color="amber" />
          <StatCard title="Delayed" value="12" change="+2" changeType="up" icon={AlertTriangle} color="red" />
        </div>

        {/* ---- TABS ---- */}
        <div className="flex items-center gap-1 bg-white rounded-xl p-1 border border-gray-200 shadow-sm mb-6 w-fit">
          {[
            { key: 'registry' as const, label: 'Document Registry', icon: FileText },
            { key: 'delayed' as const, label: `Delayed (${delayedDocs.length})`, icon: AlertTriangle },
            { key: 'pending' as const, label: `Pending Action (${pendingDocs.length})`, icon: Clock },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ============================================================ */}
        {/*  TAB: Document Registry                                       */}
        {/* ============================================================ */}
        {activeTab === 'registry' && (
          <>
            {/* Filter bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Filters</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
                <div className="xl:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchRef}
                      onChange={(e) => setSearchRef(e.target.value)}
                      placeholder="Search ref. no. or subject..."
                      className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    />
                  </div>
                </div>
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all">
                  <option value="All">All Types</option>
                  <option value="Incoming">Incoming</option>
                  <option value="Outgoing">Outgoing</option>
                  <option value="Internal">Internal</option>
                </select>
                <select value={filterOffice} onChange={(e) => setFilterOffice(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all">
                  <option value="All">All Offices</option>
                  {offices.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
                <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all">
                  <option value="All">All Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all">
                  <option value="All">All Status</option>
                  <option value="Received">Received</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Pending Action">Pending Action</option>
                  <option value="Completed">Completed</option>
                  <option value="Delayed">Delayed</option>
                </select>
                <div className="flex items-center gap-2">
                  <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all" />
                </div>
              </div>
            </div>

            {/* Document table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['Reference No.', 'Subject', 'Type', 'Origin / From', 'Current Office', 'Priority', 'Status', 'Date Received', 'Actions'].map((h) => (
                        <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 bg-gray-50/50 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-6 py-12 text-center text-sm text-gray-400">
                          No documents match your filters.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((doc) => (
                        <tr key={doc.id} className="hover:bg-gray-50/80 transition-colors">
                          <td className="px-5 py-3.5 text-sm font-mono font-medium text-blue-600 whitespace-nowrap">{doc.refNo}</td>
                          <td className="px-5 py-3.5 text-sm text-gray-800 max-w-[280px] truncate" title={doc.subject}>{doc.subject}</td>
                          <td className="px-5 py-3.5">{typeBadge(doc.type)}</td>
                          <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">{doc.origin}</td>
                          <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">{doc.currentOffice}</td>
                          <td className="px-5 py-3.5">{priorityBadge(doc.priority)}</td>
                          <td className="px-5 py-3.5">{statusBadge(doc.status)}</td>
                          <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">{doc.dateReceived}</td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setViewDoc(doc)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" /> View
                              </button>
                              <button
                                onClick={() => { setTrackRef(doc.refNo); setShowTracker(true); }}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
                              >
                                <MapPin className="w-3.5 h-3.5" /> Track
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/30 text-sm text-gray-500">
                Showing {filtered.length} of {documents.length} documents
              </div>
            </div>
          </>
        )}

        {/* ============================================================ */}
        {/*  TAB: Delayed Documents                                       */}
        {/* ============================================================ */}
        {activeTab === 'delayed' && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-red-800">Delayed Documents Alert</h3>
                <p className="text-sm text-red-700 mt-1">
                  {delayedDocs.length} document(s) have exceeded their expected processing time and require immediate attention.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['Reference No.', 'Subject', 'Current Office', 'Days Delayed', 'Priority', 'Date Received', 'Remarks', 'Actions'].map((h) => (
                        <th key={h} className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 bg-gray-50/50 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {delayedDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-red-50/30 transition-colors">
                        <td className="px-5 py-3.5 text-sm font-mono font-medium text-blue-600 whitespace-nowrap">{doc.refNo}</td>
                        <td className="px-5 py-3.5 text-sm text-gray-800 max-w-[260px] truncate" title={doc.subject}>{doc.subject}</td>
                        <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">{doc.currentOffice}</td>
                        <td className="px-5 py-3.5">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full bg-red-100 text-red-800 ring-1 ring-inset ring-red-200">
                            <AlertTriangle className="w-3 h-3" />
                            {doc.daysInCurrent} days
                          </span>
                        </td>
                        <td className="px-5 py-3.5">{priorityBadge(doc.priority)}</td>
                        <td className="px-5 py-3.5 text-sm text-gray-600 whitespace-nowrap">{doc.dateReceived}</td>
                        <td className="px-5 py-3.5 text-sm text-gray-600 max-w-[200px] truncate" title={doc.remarks}>{doc.remarks}</td>
                        <td className="px-5 py-3.5">
                          <button
                            onClick={() => setViewDoc(doc)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  TAB: Pending Action                                          */}
        {/* ============================================================ */}
        {activeTab === 'pending' && (
          <div className="space-y-6">
            {/* Office cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(pendingByOffice).map(([office, info]) => (
                <div key={office} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 ring-1 ring-amber-100">
                        <Building2 className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">{office}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{info.count} document(s) pending</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-800 text-sm font-bold">
                      {info.count}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs border-t border-gray-100 pt-3">
                    <span className="text-gray-500">Oldest pending:</span>
                    <span className={`font-semibold ${info.oldest > 14 ? 'text-red-600' : info.oldest > 7 ? 'text-amber-600' : 'text-gray-700'}`}>
                      {info.oldest} days
                    </span>
                  </div>
                  <div className="mt-3 space-y-2">
                    {info.docs.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => setViewDoc(doc)}
                        className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-blue-50 cursor-pointer transition-colors group"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-mono text-blue-600">{doc.refNo}</p>
                          <p className="text-xs text-gray-600 truncate">{doc.subject}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-500 transition-colors shrink-0 ml-2" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/*  MODAL: Document Detail                                       */}
        {/* ============================================================ */}
        <Modal open={!!viewDoc} onClose={() => setViewDoc(null)} title="Document Details" size="xl">
          {viewDoc && (
            <div className="space-y-6">
              {/* Header info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 font-mono">{viewDoc.refNo}</p>
                  <h3 className="text-lg font-semibold text-gray-900 mt-1">{viewDoc.subject}</h3>
                </div>
                <div className="flex items-center gap-2">
                  {typeBadge(viewDoc.type)}
                  {priorityBadge(viewDoc.priority)}
                  {statusBadge(viewDoc.status)}
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Origin / From</p>
                    <p className="text-sm font-medium text-gray-900">{viewDoc.origin}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-xs text-blue-600">Current Location</p>
                    <p className="text-sm font-semibold text-blue-900">{viewDoc.currentOffice}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Date Received</p>
                    <p className="text-sm font-medium text-gray-900">{viewDoc.dateReceived}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Days in Current Office</p>
                    <p className={`text-sm font-medium ${viewDoc.daysInCurrent > 14 ? 'text-red-600' : 'text-gray-900'}`}>
                      {viewDoc.daysInCurrent} day(s)
                    </p>
                  </div>
                </div>
              </div>

              {/* Remarks */}
              {viewDoc.remarks && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <Tag className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-xs font-semibold text-amber-700 uppercase">Remarks</span>
                  </div>
                  <p className="text-sm text-amber-800">{viewDoc.remarks}</p>
                </div>
              )}

              {/* Routing History Timeline */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                  Routing History
                </h4>
                {renderTimeline(viewDoc.routing)}
              </div>

              {/* Attachments */}
              {viewDoc.attachments.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-gray-400" />
                    Attached Files ({viewDoc.attachments.length})
                  </h4>
                  <div className="space-y-2">
                    {viewDoc.attachments.map((file, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-100">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{file.name}</p>
                            <p className="text-xs text-gray-500">{file.type} - {file.size}</p>
                          </div>
                        </div>
                        <span className="text-xs text-blue-600 font-medium hover:underline">Download</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* ============================================================ */}
        {/*  MODAL: Track Document                                        */}
        {/* ============================================================ */}
        <Modal open={showTracker} onClose={() => { setShowTracker(false); setTrackResult(null); setTrackError(''); }} title="Track Document" size="lg">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter Reference Number</label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={trackRef}
                    onChange={(e) => setTrackRef(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                    placeholder="e.g. DOC-2024-0015"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all font-mono"
                  />
                </div>
                <button
                  onClick={handleTrack}
                  className="px-5 py-2.5 text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm"
                >
                  Track
                </button>
              </div>
            </div>

            {trackError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-sm text-red-700">{trackError}</p>
              </div>
            )}

            {trackResult && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                    <span className="text-xs font-mono text-blue-600">{trackResult.refNo}</span>
                    <div className="flex gap-2">
                      {priorityBadge(trackResult.priority)}
                      {statusBadge(trackResult.status)}
                    </div>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-900">{trackResult.subject}</h4>
                  <p className="text-xs text-gray-500 mt-1">Currently at: <span className="font-semibold text-blue-700">{trackResult.currentOffice}</span></p>
                </div>
                {renderTimeline(trackResult.routing)}
              </div>
            )}
          </div>
        </Modal>

        {/* ============================================================ */}
        {/*  MODAL: New Document                                          */}
        {/* ============================================================ */}
        <Modal open={showNewDoc} onClose={() => setShowNewDoc(false)} title="Create New Document" size="lg">
          <div className="space-y-5">
            {/* Auto-generated ref */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Reference Number</label>
              <input
                type="text"
                value={`DOC-2024-${String(Math.floor(Math.random() * 9000) + 1000)}`}
                readOnly
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-100 text-gray-500 font-mono cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Auto-generated by the system</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={newDoc.subject}
                onChange={(e) => setNewDoc({ ...newDoc, subject: e.target.value })}
                placeholder="Enter document subject"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Document Type <span className="text-red-500">*</span></label>
                <select
                  value={newDoc.type}
                  onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value as any })}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                >
                  <option value="Incoming">Incoming</option>
                  <option value="Outgoing">Outgoing</option>
                  <option value="Internal">Internal</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority <span className="text-red-500">*</span></label>
                <select
                  value={newDoc.priority}
                  onChange={(e) => setNewDoc({ ...newDoc, priority: e.target.value as any })}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Origin / From <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={newDoc.origin}
                  onChange={(e) => setNewDoc({ ...newDoc, origin: e.target.value })}
                  placeholder="e.g. Barangay Borabod"
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Destination Office <span className="text-red-500">*</span></label>
                <select
                  value={newDoc.destination}
                  onChange={(e) => setNewDoc({ ...newDoc, destination: e.target.value })}
                  className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                >
                  <option value="">Select office...</option>
                  {offices.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Remarks</label>
              <textarea
                value={newDoc.remarks}
                onChange={(e) => setNewDoc({ ...newDoc, remarks: e.target.value })}
                rows={3}
                placeholder="Additional notes or instructions..."
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none"
              />
            </div>

            {/* File upload area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Attachments</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-300 hover:bg-blue-50/30 transition-all cursor-pointer">
                <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-400 mt-1">PDF, DOCX, XLSX, JPG up to 25MB each</p>
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={() => setShowNewDoc(false)}
                className="px-4 py-2.5 text-sm font-medium rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleNewDocSubmit}
                disabled={!newDoc.subject || !newDoc.origin || !newDoc.destination}
                className="px-5 py-2.5 text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Submit Document
                </span>
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}
