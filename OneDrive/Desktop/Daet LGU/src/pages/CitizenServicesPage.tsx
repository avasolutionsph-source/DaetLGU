import { useState } from 'react';
import {
  FileText,
  AlertTriangle,
  Construction,
  HeartPulse,
  Users,
  Briefcase,
  Siren,
  HelpCircle,
  Plus,
  MessageSquareWarning,
  ChevronRight,
  Home,
  ClipboardList,
  CheckCircle2,
  Clock,
  Star,
  Paperclip,
  Upload,
  ChevronDown,
  ChevronUp,
  Eye,
  UserCheck,
  XCircle,
  ArrowUpRight,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import DataTable from '../components/ui/DataTable';
import Modal from '../components/ui/Modal';

/* ------------------------------------------------------------------ */
/*  HARDCODED DATA                                                     */
/* ------------------------------------------------------------------ */

const serviceCategories = [
  { key: 'document', label: 'Document Request', icon: FileText, active: 24, color: 'bg-blue-500' },
  { key: 'complaint', label: 'Complaint', icon: MessageSquareWarning, active: 18, color: 'bg-red-500' },
  { key: 'infrastructure', label: 'Infrastructure Issue', icon: Construction, active: 12, color: 'bg-amber-500' },
  { key: 'health', label: 'Health Services', icon: HeartPulse, active: 9, color: 'bg-emerald-500' },
  { key: 'social', label: 'Social Welfare', icon: Users, active: 11, color: 'bg-purple-500' },
  { key: 'business', label: 'Business Inquiry', icon: Briefcase, active: 7, color: 'bg-cyan-500' },
  { key: 'emergency', label: 'Emergency Report', icon: Siren, active: 3, color: 'bg-rose-500' },
  { key: 'general', label: 'General Inquiry', icon: HelpCircle, active: 5, color: 'bg-gray-500' },
];

type RequestStatus = 'Submitted' | 'Processing' | 'Resolved' | 'Closed';

interface CitizenRequest {
  refNo: string;
  citizenName: string;
  type: string;
  subject: string;
  barangay: string;
  status: RequestStatus;
  dateSubmitted: string;
  contact: string;
  email: string;
  description: string;
}

const statusVariant: Record<RequestStatus, 'neutral' | 'info' | 'success' | 'warning'> = {
  Submitted: 'neutral',
  Processing: 'info',
  Resolved: 'success',
  Closed: 'neutral',
};

const requests: CitizenRequest[] = [
  {
    refNo: 'CSP-2026-0001',
    citizenName: 'Maria Santos',
    type: 'Infrastructure Issue',
    subject: 'Road pothole repair request - Purok 3 Alawihao',
    barangay: 'Alawihao',
    status: 'Processing',
    dateSubmitted: '2026-03-18',
    contact: '0917-123-4567',
    email: 'maria.santos@email.com',
    description:
      'There is a large pothole on the main road near Purok 3, Alawihao that has caused multiple motorcycle accidents. Requesting urgent repair.',
  },
  {
    refNo: 'CSP-2026-0002',
    citizenName: 'Jose Reyes',
    type: 'Complaint',
    subject: 'Noise complaint - Barangay Borabod',
    barangay: 'Borabod',
    status: 'Submitted',
    dateSubmitted: '2026-03-19',
    contact: '0918-234-5678',
    email: 'jose.reyes@email.com',
    description:
      'Excessive noise coming from a videoke bar on Rizal Street every night past 10 PM. Disturbing nearby residents, especially children who have classes.',
  },
  {
    refNo: 'CSP-2026-0003',
    citizenName: 'Ana Dela Cruz',
    type: 'Document Request',
    subject: 'Request for barangay clearance',
    barangay: 'Gahonon',
    status: 'Resolved',
    dateSubmitted: '2026-03-14',
    contact: '0919-345-6789',
    email: 'ana.delacruz@email.com',
    description:
      'Requesting barangay clearance for employment purposes. Need the document within the week as my job application deadline is approaching.',
  },
  {
    refNo: 'CSP-2026-0004',
    citizenName: 'Roberto Gonzales',
    type: 'Emergency Report',
    subject: 'Flooding report - Calasgasan area',
    barangay: 'Calasgasan',
    status: 'Processing',
    dateSubmitted: '2026-03-20',
    contact: '0920-456-7890',
    email: 'roberto.gonzales@email.com',
    description:
      'Severe flooding in Calasgasan due to clogged drainage canal. Water level has reached knee-high in several homes. Immediate action needed.',
  },
  {
    refNo: 'CSP-2026-0005',
    citizenName: 'Lorna Villanueva',
    type: 'Health Services',
    subject: 'Request for free medical check-up schedule',
    barangay: 'Pamorangon',
    status: 'Resolved',
    dateSubmitted: '2026-03-12',
    contact: '0921-567-8901',
    email: 'lorna.villa@email.com',
    description:
      'Inquiring about the schedule for the free medical check-up program. Several senior citizens in our area would like to participate.',
  },
  {
    refNo: 'CSP-2026-0006',
    citizenName: 'Eduardo Ramos',
    type: 'Business Inquiry',
    subject: 'Business permit renewal process inquiry',
    barangay: 'Lag-on',
    status: 'Closed',
    dateSubmitted: '2026-03-10',
    contact: '0922-678-9012',
    email: 'eduardo.ramos@email.com',
    description:
      'Need guidance on the renewal process for my sari-sari store business permit. What documents are needed and where do I submit them?',
  },
  {
    refNo: 'CSP-2026-0007',
    citizenName: 'Rosalinda Aquino',
    type: 'Social Welfare',
    subject: 'Request for senior citizen benefits assistance',
    barangay: 'Bagasbas',
    status: 'Processing',
    dateSubmitted: '2026-03-17',
    contact: '0923-789-0123',
    email: 'rosalinda.aquino@email.com',
    description:
      'My mother, 72 years old, has not yet received her senior citizen ID and benefits. She has been a resident of Bagasbas for over 30 years.',
  },
  {
    refNo: 'CSP-2026-0008',
    citizenName: 'Fernando Bautista',
    type: 'Infrastructure Issue',
    subject: 'Streetlight not working - Purok 1 Mancruz',
    barangay: 'Mancruz',
    status: 'Submitted',
    dateSubmitted: '2026-03-21',
    contact: '0924-890-1234',
    email: 'fernando.bautista@email.com',
    description:
      'Three streetlights along the national highway near Purok 1 have been non-functional for two weeks. Area becomes very dark at night, creating safety concerns.',
  },
  {
    refNo: 'CSP-2026-0009',
    citizenName: 'Gloria Mendoza',
    type: 'Complaint',
    subject: 'Illegal garbage dumping near river - Bibirao',
    barangay: 'Bibirao',
    status: 'Processing',
    dateSubmitted: '2026-03-16',
    contact: '0925-901-2345',
    email: 'gloria.mendoza@email.com',
    description:
      'Someone has been illegally dumping garbage near the river in Bibirao. This is polluting the water source used by several families for washing and bathing.',
  },
  {
    refNo: 'CSP-2026-0010',
    citizenName: 'Ricardo Torres',
    type: 'General Inquiry',
    subject: 'Schedule for real property tax payment',
    barangay: 'Poblacion',
    status: 'Resolved',
    dateSubmitted: '2026-03-11',
    contact: '0926-012-3456',
    email: 'ricardo.torres@email.com',
    description:
      'When is the deadline for real property tax payment this year? Are there any discounts for early payment?',
  },
  {
    refNo: 'CSP-2026-0011',
    citizenName: 'Corazon Pangilinan',
    type: 'Document Request',
    subject: 'Community tax certificate (cedula) issuance',
    barangay: 'San Isidro',
    status: 'Submitted',
    dateSubmitted: '2026-03-22',
    contact: '0927-123-4567',
    email: 'corazon.p@email.com',
    description:
      'Requesting issuance of community tax certificate for use in various government transactions. Will visit the municipal hall this week.',
  },
  {
    refNo: 'CSP-2026-0012',
    citizenName: 'Danilo Esperanza',
    type: 'Health Services',
    subject: 'Dengue fogging request - Purok 5 Dogongan',
    barangay: 'Dogongan',
    status: 'Processing',
    dateSubmitted: '2026-03-19',
    contact: '0928-234-5678',
    email: 'danilo.e@email.com',
    description:
      'There have been three dengue cases reported in our area in the past week. We are requesting immediate fogging operation in Purok 5, Dogongan.',
  },
];

const timelineSteps = [
  { label: 'Request Submitted', date: '2026-03-18 09:15 AM', done: true },
  { label: 'Received by Office', date: '2026-03-18 10:30 AM', done: true },
  { label: 'Under Review', date: '2026-03-19 02:00 PM', done: true },
  { label: 'Assigned to Engineering Office', date: '2026-03-20 08:45 AM', done: true },
  { label: 'Resolution Pending', date: '—', done: false },
];

const mockAttachments = [
  { name: 'pothole_photo_1.jpg', size: '1.2 MB' },
  { name: 'pothole_photo_2.jpg', size: '0.9 MB' },
  { name: 'location_map.pdf', size: '256 KB' },
];

const ratingDistribution = [
  { stars: '5 Stars', count: 312 },
  { stars: '4 Stars', count: 245 },
  { stars: '3 Stars', count: 98 },
  { stars: '2 Stars', count: 42 },
  { stars: '1 Star', count: 18 },
];

const recentFeedback = [
  {
    name: 'Lorna Villanueva',
    rating: 5,
    comment: 'Very fast processing! Got my request resolved in just 2 days. Salamat po!',
    date: '2026-03-20',
  },
  {
    name: 'Ricardo Torres',
    rating: 4,
    comment: 'Helpful response. The staff were courteous and informative.',
    date: '2026-03-18',
  },
  {
    name: 'Ana Dela Cruz',
    rating: 5,
    comment: 'Smooth and easy process. Appreciate the online system!',
    date: '2026-03-15',
  },
  {
    name: 'Eduardo Ramos',
    rating: 3,
    comment: 'Got my answer eventually but took a while. Could be faster.',
    date: '2026-03-12',
  },
];

const faqItems = [
  {
    question: 'How to track my request?',
    answer:
      'You can track your request using the reference number provided when you submitted it. Visit the Citizen Service Portal and enter your reference number in the search bar, or contact the Municipal Hall front desk at (054) 721-XXXX.',
  },
  {
    question: 'How long does processing take?',
    answer:
      'Processing times vary by request type. Document requests typically take 1-3 business days. Complaints are reviewed within 5 business days. Infrastructure issues are assessed within 7 business days. Emergency reports are prioritized and acted upon within 24 hours.',
  },
  {
    question: 'What documents do I need?',
    answer:
      'Required documents depend on the service requested. Generally, you will need a valid government ID and proof of residency. For business-related inquiries, bring your previous permits and DTI registration. For social welfare services, bring your barangay certificate and any relevant certifications.',
  },
  {
    question: 'Where is the municipal hall?',
    answer:
      'The Daet Municipal Hall is located at F. Pimentel Avenue, Poblacion, Daet, Camarines Norte 4600. Office hours are Monday to Friday, 8:00 AM to 5:00 PM. The Citizen Service Counter is on the ground floor.',
  },
  {
    question: 'Contact information',
    answer:
      'Phone: (054) 721-XXXX | Mobile: 0917-XXX-XXXX | Email: citizenservices@daet.gov.ph | Facebook: Municipality of Daet - Official. For emergencies, call the MDRRMO hotline at (054) 440-XXXX.',
  },
];

const barangayList = [
  'Alawihao',
  'Bagasbas',
  'Bibirao',
  'Borabod',
  'Calasgasan',
  'Dogongan',
  'Gahonon',
  'Lag-on',
  'Mancruz',
  'Pamorangon',
  'Poblacion',
  'San Isidro',
];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function CitizenServicesPage() {
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<CitizenRequest | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formType, setFormType] = useState<'request' | 'complaint'>('request');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const openDetail = (req: CitizenRequest) => {
    setSelectedRequest(req);
    setDetailOpen(true);
  };

  const openForm = (type: 'request' | 'complaint') => {
    setFormType(type);
    setFormOpen(true);
  };

  /* ---- Table columns ---- */
  const columns = [
    { key: 'refNo', label: 'Reference No.' },
    { key: 'citizenName', label: 'Citizen Name' },
    { key: 'type', label: 'Type' },
    {
      key: 'subject',
      label: 'Subject',
      render: (val: string) => (
        <span className="max-w-xs truncate block" title={val}>
          {val}
        </span>
      ),
    },
    { key: 'barangay', label: 'Barangay' },
    {
      key: 'status',
      label: 'Status',
      render: (val: RequestStatus) => (
        <Badge variant={statusVariant[val]}>{val}</Badge>
      ),
    },
    { key: 'dateSubmitted', label: 'Date Submitted' },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, row: CitizenRequest) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            openDetail(row);
          }}
          className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
      ),
    },
  ];

  /* ---- Stars helper ---- */
  const renderStars = (count: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < count ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
      />
    ));

  /* ================================================================ */
  /*  RENDER                                                           */
  /* ================================================================ */

  return (
    <div className="space-y-8">
      {/* ---------- Header ---------- */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-900 font-medium">Citizen Service Portal</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Citizen Service Portal</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage citizen requests, complaints, and inquiries for the Municipality of Daet
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => openForm('request')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Request
          </button>
          <button
            onClick={() => openForm('complaint')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-700 bg-red-50 rounded-xl hover:bg-red-100 ring-1 ring-red-200 transition-colors"
          >
            <MessageSquareWarning className="w-4 h-4" />
            New Complaint
          </button>
        </div>
      </div>

      {/* ---------- Stats ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Requests"
          value="1,456"
          change="+12.3%"
          changeType="up"
          icon={ClipboardList}
          color="blue"
        />
        <StatCard
          title="Open / Active"
          value="89"
          change="-4.2%"
          changeType="down"
          icon={Clock}
          color="amber"
        />
        <StatCard
          title="Resolved This Month"
          value="234"
          change="+18.7%"
          changeType="up"
          icon={CheckCircle2}
          color="green"
        />
        <StatCard
          title="Avg Resolution Time"
          value="3.2 days"
          change="-0.5 days"
          changeType="down"
          icon={ArrowUpRight}
          color="purple"
        />
      </div>

      {/* ---------- Service Categories ---------- */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {serviceCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.key}
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${cat.color} flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-sm font-semibold text-gray-900">{cat.label}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {cat.active} active request{cat.active !== 1 ? 's' : ''}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------- Requests Table ---------- */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Citizen Requests</h2>
        <DataTable
          columns={columns}
          data={requests}
          searchable
          pageSize={10}
          onRowClick={(row) => openDetail(row)}
          emptyMessage="No citizen requests found."
        />
      </div>

      {/* ---------- FAQ / Help Panel ---------- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-2">
            {faqItems.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-gray-100 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors"
                  >
                    {faq.question}
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ---------- Feedback Summary ---------- */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            Feedback Summary
          </h2>

          {/* Average rating */}
          <div className="flex items-center gap-4 mb-5">
            <div className="text-4xl font-bold text-gray-900">4.2</div>
            <div>
              <div className="flex items-center gap-0.5">{renderStars(4)}</div>
              <p className="text-xs text-gray-500 mt-1">Based on 715 ratings</p>
            </div>
          </div>

          {/* Distribution chart */}
          <div className="h-40 mb-5">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingDistribution} layout="vertical" barCategoryGap={6}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="stars" tick={{ fontSize: 12 }} width={60} />
                <Tooltip />
                <Bar dataKey="count" fill="#f59e0b" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Recent feedback */}
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Recent Feedback</h3>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {recentFeedback.map((fb, idx) => (
              <div key={idx} className="border border-gray-100 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{fb.name}</span>
                  <span className="text-xs text-gray-400">{fb.date}</span>
                </div>
                <div className="flex items-center gap-0.5 mb-1.5">{renderStars(fb.rating)}</div>
                <p className="text-xs text-gray-600 leading-relaxed">{fb.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/*  REQUEST DETAIL MODAL                                             */}
      {/* ================================================================ */}
      <Modal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title={`Request ${selectedRequest?.refNo ?? ''}`}
        size="xl"
      >
        {selectedRequest && (
          <div className="space-y-6">
            {/* Citizen info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Citizen</p>
                  <p className="font-medium text-gray-900">{selectedRequest.citizenName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Contact</p>
                  <p className="font-medium text-gray-900">{selectedRequest.contact}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Barangay</p>
                  <p className="font-medium text-gray-900">{selectedRequest.barangay}</p>
                </div>
              </div>
            </div>

            {/* Request details */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Request Details</h3>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 w-24">Type:</span>
                  <span className="font-medium text-gray-900">{selectedRequest.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 w-24">Subject:</span>
                  <span className="font-medium text-gray-900">{selectedRequest.subject}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500 w-24">Status:</span>
                  <Badge variant={statusVariant[selectedRequest.status]}>
                    {selectedRequest.status}
                  </Badge>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-gray-500 w-24 flex-shrink-0">Description:</span>
                  <span className="text-gray-700">{selectedRequest.description}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Progress Timeline</h3>
              <div className="relative pl-6">
                <div className="absolute left-2.5 top-1 bottom-1 w-0.5 bg-gray-200" />
                {timelineSteps.map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-4 pb-5 last:pb-0">
                    <div
                      className={`absolute -left-3.5 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        step.done
                          ? 'bg-emerald-500 border-emerald-500'
                          : 'bg-white border-gray-300'
                      }`}
                    >
                      {step.done && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <div className="ml-4">
                      <p
                        className={`text-sm font-medium ${
                          step.done ? 'text-gray-900' : 'text-gray-400'
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-xs text-gray-400">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attachments */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Attachments</h3>
              <div className="space-y-2">
                {mockAttachments.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5 text-sm"
                  >
                    <Paperclip className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 flex-1">{file.name}</span>
                    <span className="text-xs text-gray-400">{file.size}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback / Rating */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Citizen Feedback</h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-500">Rating:</span>
                  <div className="flex items-center gap-0.5">{renderStars(4)}</div>
                  <span className="text-sm font-medium text-gray-700 ml-1">4 / 5</span>
                </div>
                <p className="text-sm text-gray-600 italic">
                  "Action was taken quickly. Thank you for the prompt response."
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors">
                <ArrowUpRight className="w-4 h-4" />
                Update Status
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
                <UserCheck className="w-4 h-4" />
                Assign
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-700 bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
                <XCircle className="w-4 h-4" />
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ================================================================ */}
      {/*  SUBMIT REQUEST FORM MODAL                                        */}
      {/* ================================================================ */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={formType === 'complaint' ? 'Submit a Complaint' : 'Submit a Request'}
        size="lg"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setFormOpen(false);
          }}
          className="space-y-5"
        >
          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Request Type
            </label>
            <select
              defaultValue={formType === 'complaint' ? 'Complaint' : ''}
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            >
              <option value="" disabled>
                Select a category...
              </option>
              {serviceCategories.map((cat) => (
                <option key={cat.key} value={cat.label}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              placeholder="Brief description of your request"
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={4}
              placeholder="Provide detailed information about your request or concern..."
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all resize-none"
            />
          </div>

          {/* Name & Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Citizen Name
              </label>
              <input
                type="text"
                placeholder="Juan Dela Cruz"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number
              </label>
              <input
                type="tel"
                placeholder="09XX-XXX-XXXX"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
            </div>
          </div>

          {/* Email & Barangay */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Barangay</label>
              <select className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all">
                <option value="" disabled selected>
                  Select barangay...
                </option>
                {barangayList.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Attachments</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-300 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">
                Drag & drop files here, or{' '}
                <span className="text-blue-600 font-medium">browse</span>
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Supports JPG, PNG, PDF up to 5 MB each
              </p>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-sm transition-colors"
            >
              Submit {formType === 'complaint' ? 'Complaint' : 'Request'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
