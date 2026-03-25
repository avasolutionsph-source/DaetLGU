import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  MapPin,
  Phone,
  Package,
  Loader2,
} from 'lucide-react';

interface TrackedRequest {
  id: string;
  type: string;
  document: string;
  dateSubmitted: string;
  status: 'pending' | 'processing' | 'ready' | 'completed' | 'rejected';
  barangay: string;
  lastUpdate: string;
  steps: { label: string; date: string; done: boolean }[];
}

const STATUS_MAP: Record<string, { color: string; bg: string; label: string; icon: typeof Clock }> = {
  pending: { color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', label: 'Pending', icon: Clock },
  processing: { color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', label: 'Processing', icon: Loader2 },
  ready: { color: 'text-green-700', bg: 'bg-green-50 border-green-200', label: 'Ready for Pickup', icon: Package },
  completed: { color: 'text-gray-600', bg: 'bg-gray-50 border-gray-200', label: 'Completed', icon: CheckCircle2 },
  rejected: { color: 'text-red-700', bg: 'bg-red-50 border-red-200', label: 'Rejected', icon: AlertCircle },
};

const MOCK_REQUESTS: TrackedRequest[] = [
  {
    id: 'DOC-M8KQ2X',
    type: 'document',
    document: 'Barangay Clearance',
    dateSubmitted: '2026-03-24',
    status: 'ready',
    barangay: 'Alawihao',
    lastUpdate: '2026-03-25 10:30 AM',
    steps: [
      { label: 'Request Submitted', date: 'Mar 24, 2:15 PM', done: true },
      { label: 'Under Processing', date: 'Mar 24, 3:00 PM', done: true },
      { label: 'Ready for Pickup', date: 'Mar 25, 10:30 AM', done: true },
      { label: 'Released', date: '', done: false },
    ],
  },
  {
    id: 'DOC-K9PLR3',
    type: 'document',
    document: 'Certificate of Indigency',
    dateSubmitted: '2026-03-25',
    status: 'processing',
    barangay: 'Lag-on',
    lastUpdate: '2026-03-25 11:00 AM',
    steps: [
      { label: 'Request Submitted', date: 'Mar 25, 9:00 AM', done: true },
      { label: 'Under Processing', date: 'Mar 25, 11:00 AM', done: true },
      { label: 'Ready for Pickup', date: '', done: false },
      { label: 'Released', date: '', done: false },
    ],
  },
  {
    id: 'DOC-J7NMS1',
    type: 'document',
    document: 'Community Tax Certificate',
    dateSubmitted: '2026-03-23',
    status: 'completed',
    barangay: 'Bagasbas',
    lastUpdate: '2026-03-23 4:15 PM',
    steps: [
      { label: 'Request Submitted', date: 'Mar 23, 8:30 AM', done: true },
      { label: 'Under Processing', date: 'Mar 23, 9:00 AM', done: true },
      { label: 'Ready for Pickup', date: 'Mar 23, 2:00 PM', done: true },
      { label: 'Released', date: 'Mar 23, 4:15 PM', done: true },
    ],
  },
  {
    id: 'RPT-001',
    type: 'emergency',
    document: 'Flood Report',
    dateSubmitted: '2026-03-25',
    status: 'processing',
    barangay: 'Alawihao',
    lastUpdate: '2026-03-25 2:45 PM',
    steps: [
      { label: 'Report Submitted', date: 'Mar 25, 2:30 PM', done: true },
      { label: 'Received by MDRRMO', date: 'Mar 25, 2:35 PM', done: true },
      { label: 'Responders Dispatched', date: 'Mar 25, 2:45 PM', done: true },
      { label: 'Resolved', date: '', done: false },
    ],
  },
  {
    id: 'CMP-001',
    type: 'complaint',
    document: 'Road Pothole Complaint',
    dateSubmitted: '2026-03-22',
    status: 'pending',
    barangay: 'Borabod',
    lastUpdate: '2026-03-22 1:00 PM',
    steps: [
      { label: 'Complaint Filed', date: 'Mar 22, 1:00 PM', done: true },
      { label: 'Under Review', date: '', done: false },
      { label: 'Action Taken', date: '', done: false },
      { label: 'Resolved', date: '', done: false },
    ],
  },
];

export default function CitizenTrackRequests() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filtered = MOCK_REQUESTS.filter(r => {
    const matchSearch = !search || r.id.toLowerCase().includes(search.toLowerCase()) || r.document.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || r.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <button onClick={() => navigate('/citizen-hub')} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-gray-900">Track My Requests</h1>
            <p className="text-xs text-gray-500">{filtered.length} request(s)</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-5 sm:px-6">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by reference number or document..."
            className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Filters */}
        <div className="mb-4 flex gap-2 overflow-x-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'pending', label: 'Pending' },
            { id: 'processing', label: 'Processing' },
            { id: 'ready', label: 'Ready' },
            { id: 'completed', label: 'Completed' },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                filter === f.id ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Request list */}
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <FileText className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p className="text-sm text-gray-500">No requests found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(req => {
              const sts = STATUS_MAP[req.status];
              const isExpanded = expanded === req.id;
              return (
                <div key={req.id} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                  <button onClick={() => setExpanded(isExpanded ? null : req.id)}
                    className="flex w-full items-start gap-3 p-4 text-left">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${sts.bg}`}>
                      <sts.icon className={`h-5 w-5 ${sts.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{req.document}</p>
                          <p className="text-[11px] font-mono text-gray-400">{req.id}</p>
                        </div>
                        <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${sts.bg} ${sts.color}`}>
                          {sts.label}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-[11px] text-gray-400">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{req.barangay}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{req.dateSubmitted}</span>
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50 px-4 py-4">
                      <p className="text-xs font-medium text-gray-500 mb-3">Progress Timeline</p>
                      <div className="space-y-0">
                        {req.steps.map((step, i) => (
                          <div key={i} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className={`flex h-6 w-6 items-center justify-center rounded-full ${
                                step.done ? 'bg-green-500 text-white' : 'border-2 border-gray-300 bg-white'
                              }`}>
                                {step.done && <CheckCircle2 className="h-3.5 w-3.5" />}
                              </div>
                              {i < req.steps.length - 1 && (
                                <div className={`w-0.5 flex-1 min-h-[24px] ${step.done ? 'bg-green-300' : 'bg-gray-200'}`} />
                              )}
                            </div>
                            <div className="pb-4">
                              <p className={`text-xs font-medium ${step.done ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                              {step.date && <p className="text-[11px] text-gray-400">{step.date}</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
