import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  Clock,
  Send,
  ScrollText,
  Award,
  ShieldCheck,
  Stamp,
  BookOpen,
  FileCheck,
} from 'lucide-react';

interface DocType {
  id: string;
  name: string;
  description: string;
  icon: typeof FileText;
  fee: string;
  processingDays: string;
  requirements: string[];
}

const DOCUMENT_TYPES: DocType[] = [
  {
    id: 'brgy-clearance',
    name: 'Barangay Clearance',
    description: 'General purpose clearance from your barangay',
    icon: ShieldCheck,
    fee: '₱50.00',
    processingDays: '1-2 days',
    requirements: ['Valid ID', 'Proof of residency', 'Cedula'],
  },
  {
    id: 'cedula',
    name: 'Community Tax Certificate (Cedula)',
    description: 'Annual community tax certificate',
    icon: Stamp,
    fee: '₱35.00+',
    processingDays: 'Same day',
    requirements: ['Valid ID', 'Previous year cedula (if available)'],
  },
  {
    id: 'brgy-indigency',
    name: 'Certificate of Indigency',
    description: 'For medical, educational, or legal assistance',
    icon: ScrollText,
    fee: 'Free',
    processingDays: '1 day',
    requirements: ['Valid ID', 'Barangay clearance'],
  },
  {
    id: 'brgy-residency',
    name: 'Certificate of Residency',
    description: 'Proof that you reside in the barangay',
    icon: BookOpen,
    fee: '₱50.00',
    processingDays: '1-2 days',
    requirements: ['Valid ID', 'Proof of address (utility bill)'],
  },
  {
    id: 'business-clearance',
    name: 'Barangay Business Clearance',
    description: 'Required for business permit applications',
    icon: Award,
    fee: '₱200.00+',
    processingDays: '2-3 days',
    requirements: ['Valid ID', 'DTI Registration', 'Proof of business location'],
  },
  {
    id: 'good-moral',
    name: 'Certificate of Good Moral Character',
    description: 'Character reference from barangay',
    icon: FileCheck,
    fee: '₱50.00',
    processingDays: '1-2 days',
    requirements: ['Valid ID', 'Barangay clearance', '2x2 photo'],
  },
];

const BARANGAYS = [
  'Alawihao', 'Awitan', 'Bagasbas', 'Bibirao', 'Borabod',
  'Calasgasan', 'Camambugan', 'Cobangbang', 'Dogongan', 'Gahonon',
  'Lag-on', 'Mancruz', 'Pamorangon', 'San Isidro',
];

export default function CitizenDocuments() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'list' | 'form' | 'success'>('list');
  const [selected, setSelected] = useState<DocType | null>(null);
  const [fullName, setFullName] = useState('');
  const [barangay, setBarangay] = useState('');
  const [purpose, setPurpose] = useState('');
  const [contact, setContact] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [refNo, setRefNo] = useState('');

  const handleSelect = (doc: DocType) => {
    setSelected(doc);
    setStep('form');
  };

  const handleSubmit = () => {
    if (!fullName.trim() || !barangay || !purpose.trim() || !contact.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setRefNo(`DOC-${Date.now().toString(36).toUpperCase()}`);
      setSubmitting(false);
      setStep('success');
    }, 1200);
  };

  const handleNewRequest = () => {
    setStep('list');
    setSelected(null);
    setFullName('');
    setBarangay('');
    setPurpose('');
    setContact('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <button onClick={() => step === 'list' ? navigate('/citizen-hub') : setStep('list')} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-gray-900">Request Documents</h1>
            <p className="text-xs text-gray-500">
              {step === 'list' ? 'Select document type' : step === 'form' ? selected?.name : 'Request submitted'}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-5 sm:px-6">
        {step === 'list' && (
          <div className="space-y-3">
            {DOCUMENT_TYPES.map(doc => (
              <button
                key={doc.id}
                onClick={() => handleSelect(doc)}
                className="flex w-full items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <doc.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{doc.name}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{doc.description}</p>
                  <div className="mt-2 flex items-center gap-3 text-[11px]">
                    <span className="text-emerald-600 font-medium">Fee: {doc.fee}</span>
                    <span className="text-gray-400">•</span>
                    <span className="flex items-center gap-1 text-gray-500">
                      <Clock className="h-3 w-3" />
                      {doc.processingDays}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {step === 'form' && selected && (
          <div>
            <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-blue-800">
                <selected.icon className="h-4 w-4" />
                {selected.name}
              </div>
              <p className="mt-1 text-xs text-blue-600">Fee: {selected.fee} • Processing: {selected.processingDays}</p>
              <div className="mt-3">
                <p className="text-xs font-medium text-blue-700 mb-1">Requirements:</p>
                <ul className="space-y-0.5">
                  {selected.requirements.map((r, i) => (
                    <li key={i} className="flex items-center gap-1.5 text-xs text-blue-600">
                      <CheckCircle2 className="h-3 w-3 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Juan Dela Cruz"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Barangay <span className="text-red-500">*</span></label>
                <select value={barangay} onChange={e => setBarangay(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                  <option value="">Select barangay...</option>
                  {BARANGAYS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Purpose <span className="text-red-500">*</span></label>
                <input type="text" value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="e.g. Employment, School enrollment"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Contact Number <span className="text-red-500">*</span></label>
                <input type="tel" value={contact} onChange={e => setContact(e.target.value)} placeholder="09XX-XXX-XXXX"
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
              </div>
              <button onClick={handleSubmit} disabled={!fullName.trim() || !barangay || !purpose.trim() || !contact.trim() || submitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
                {submitting ? (
                  <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Submitting...</>
                ) : (
                  <><Send className="h-4 w-4" />Submit Request</>
                )}
              </button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Request Submitted!</h2>
            <p className="mt-2 text-sm text-gray-500">Your document request has been received. You will be notified when it's ready for pickup.</p>
            <p className="mt-3 font-mono text-sm font-medium text-gray-600">Ref: {refNo}</p>
            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-left text-xs text-green-700">
              <p className="font-semibold text-green-800 mb-2">Next steps:</p>
              <ul className="space-y-1.5">
                <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0" />Bring the required documents when you pick up</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0" />Prepare the exact fee amount</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0" />Track your request status in "Track My Requests"</li>
              </ul>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={handleNewRequest} className="flex-1 rounded-xl border border-gray-200 bg-white py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
                New Request
              </button>
              <button onClick={() => navigate('/citizen-track')} className="flex-1 rounded-xl bg-gray-900 py-3 text-sm font-medium text-white hover:bg-gray-800">
                Track Requests
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
