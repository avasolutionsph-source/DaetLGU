import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Camera,
  X,
  Send,
  AlertTriangle,
  Flame,
  Droplets,
  Car,
  HeartPulse,
  ShieldAlert,
  MapPin,
  Clock,
  CheckCircle2,
  RotateCcw,
  SwitchCamera,
  ImageIcon,
  ChevronRight,
  FileText,
  Phone,
  Megaphone,
  History,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

// ─── Types ────────────────────────────────────────────────────────────────────

type EmergencyType = 'fire' | 'flood' | 'accident' | 'medical' | 'crime' | 'other';

interface Report {
  id: string;
  type: EmergencyType;
  description: string;
  location: string;
  photo: string | null;
  timestamp: string;
  status: 'submitted' | 'received' | 'responding' | 'resolved';
  barangay: string;
}

const EMERGENCY_TYPES: { type: EmergencyType; label: string; icon: typeof Flame; color: string; bg: string }[] = [
  { type: 'fire', label: 'Fire', icon: Flame, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200 hover:bg-orange-100' },
  { type: 'flood', label: 'Flood', icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200 hover:bg-blue-100' },
  { type: 'accident', label: 'Accident', icon: Car, color: 'text-red-600', bg: 'bg-red-50 border-red-200 hover:bg-red-100' },
  { type: 'medical', label: 'Medical', icon: HeartPulse, color: 'text-pink-600', bg: 'bg-pink-50 border-pink-200 hover:bg-pink-100' },
  { type: 'crime', label: 'Crime', icon: ShieldAlert, color: 'text-violet-600', bg: 'bg-violet-50 border-violet-200 hover:bg-violet-100' },
  { type: 'other', label: 'Other', icon: AlertTriangle, color: 'text-gray-600', bg: 'bg-gray-50 border-gray-200 hover:bg-gray-100' },
];

const BARANGAYS = [
  'Alawihao', 'Awitan', 'Bagasbas', 'Bibirao', 'Borabod',
  'Calasgasan', 'Camambugan', 'Cobangbang', 'Dogongan', 'Gahonon',
  'Lag-on', 'Mancruz', 'Pamorangon', 'San Isidro',
];

const STATUS_STYLES: Record<string, { color: string; bg: string; label: string }> = {
  submitted: { color: 'text-blue-700', bg: 'bg-blue-50', label: 'Submitted' },
  received: { color: 'text-amber-700', bg: 'bg-amber-50', label: 'Received' },
  responding: { color: 'text-orange-700', bg: 'bg-orange-50', label: 'Responding' },
  resolved: { color: 'text-green-700', bg: 'bg-green-50', label: 'Resolved' },
};

// ─── Mock past reports ────────────────────────────────────────────────────────

const MOCK_REPORTS: Report[] = [
  {
    id: 'RPT-001',
    type: 'flood',
    description: 'Heavy flooding on main road near the public market. Water level knee-deep.',
    location: 'Vinzons Ave., near Public Market',
    photo: null,
    timestamp: '2026-03-25T14:30:00',
    status: 'responding',
    barangay: 'Alawihao',
  },
  {
    id: 'RPT-002',
    type: 'accident',
    description: 'Two motorcycles collided at the intersection. One rider injured.',
    location: 'J.P. Rizal St. corner Burgos St.',
    photo: null,
    timestamp: '2026-03-24T09:15:00',
    status: 'resolved',
    barangay: 'Lag-on',
  },
  {
    id: 'RPT-003',
    type: 'fire',
    description: 'Small fire in a residential area. Smoke visible from the street.',
    location: 'Purok 3, near Barangay Hall',
    photo: null,
    timestamp: '2026-03-23T18:45:00',
    status: 'resolved',
    barangay: 'Bagasbas',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function CitizenReportPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [tab, setTab] = useState<'report' | 'history' | 'hotlines'>('report');
  const [step, setStep] = useState<'type' | 'camera' | 'details' | 'success'>('type');
  const [selectedType, setSelectedType] = useState<EmergencyType | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [barangay, setBarangay] = useState('');
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [submitting, setSubmitting] = useState(false);

  // ─── Camera functions ───────────────────────────────────────────────────────

  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch {
      alert('Camera access denied. Please allow camera permissions to capture photos.');
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedPhoto(dataUrl);
      stopCamera();
    }
  }, [stopCamera]);

  const switchCamera = useCallback(() => {
    setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  }, []);

  useEffect(() => {
    if (step === 'camera' && !capturedPhoto) {
      startCamera();
    }
    return () => {
      if (step !== 'camera') stopCamera();
    };
  }, [step, facingMode]);

  // ─── Form handlers ─────────────────────────────────────────────────────────

  const handleSelectType = (type: EmergencyType) => {
    setSelectedType(type);
    setStep('camera');
  };

  const handleSkipPhoto = () => {
    stopCamera();
    setStep('details');
  };

  const handleRetakePhoto = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  const handleUsePhoto = () => {
    setStep('details');
  };

  const handleSubmit = () => {
    if (!description.trim() || !location.trim() || !barangay) return;
    setSubmitting(true);

    setTimeout(() => {
      const newReport: Report = {
        id: `RPT-${String(reports.length + 1).padStart(3, '0')}`,
        type: selectedType!,
        description: description.trim(),
        location: location.trim(),
        photo: capturedPhoto,
        timestamp: new Date().toISOString(),
        status: 'submitted',
        barangay,
      };
      setReports(prev => [newReport, ...prev]);
      setSubmitting(false);
      setStep('success');
    }, 1500);
  };

  const handleNewReport = () => {
    setStep('type');
    setSelectedType(null);
    setCapturedPhoto(null);
    setDescription('');
    setLocation('');
    setBarangay('');
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  const typeInfo = selectedType ? EMERGENCY_TYPES.find(e => e.type === selectedType) : null;

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-rose-700 px-4 py-5 text-white sm:px-6">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Megaphone className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Citizen Emergency Report</h1>
                <p className="text-xs text-red-100">Municipality of Daet - Maogmang Daet Smart System</p>
              </div>
            </div>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="rounded-lg bg-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-white/25"
            >
              Sign out
            </button>
          </div>
          {currentUser && (
            <p className="mt-2 text-sm text-red-100">
              Welcome, <span className="font-medium text-white">{currentUser.name}</span>
            </p>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-2xl">
          {[
            { id: 'report' as const, label: 'Report Emergency', icon: AlertTriangle },
            { id: 'history' as const, label: 'My Reports', icon: History },
            { id: 'hotlines' as const, label: 'Hotlines', icon: Phone },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex flex-1 items-center justify-center gap-2 border-b-2 px-3 py-3 text-xs font-medium transition-colors sm:text-sm ${
                tab === t.id
                  ? 'border-red-600 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">

        {/* ═══ REPORT TAB ═══ */}
        {tab === 'report' && (
          <>
            {/* Step 1: Select Emergency Type */}
            {step === 'type' && (
              <div>
                <h2 className="mb-1 text-lg font-bold text-gray-900">What's the emergency?</h2>
                <p className="mb-5 text-sm text-gray-500">Select the type of incident you want to report</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {EMERGENCY_TYPES.map(e => (
                    <button
                      key={e.type}
                      onClick={() => handleSelectType(e.type)}
                      className={`flex flex-col items-center gap-2 rounded-xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 ${e.bg}`}
                    >
                      <e.icon className={`h-8 w-8 ${e.color}`} />
                      <span className={`text-sm font-semibold ${e.color}`}>{e.label}</span>
                    </button>
                  ))}
                </div>

                {/* Quick emergency call */}
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
                  <div className="flex items-start gap-3">
                    <Phone className="mt-0.5 h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-sm font-semibold text-red-800">Need immediate help?</p>
                      <p className="mt-0.5 text-xs text-red-600">
                        For life-threatening emergencies, call <span className="font-bold">911</span> or MDRRMO at <span className="font-bold">(054) 721-XXXX</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Camera Capture */}
            {step === 'camera' && (
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <button onClick={() => setStep('type')} className="text-sm text-gray-500 hover:text-gray-700">
                    Report
                  </button>
                  <ChevronRight className="h-3 w-3 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">Capture Photo</span>
                </div>

                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-black">
                  {!capturedPhoto ? (
                    <div className="relative">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="aspect-[4/3] w-full object-cover"
                      />
                      {/* Camera overlay */}
                      <div className="pointer-events-none absolute inset-0 border-[3px] border-white/20 rounded-2xl" />
                      <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs font-medium text-white/80 drop-shadow">
                          {typeInfo?.label} Report
                        </span>
                      </div>
                      {/* Camera controls */}
                      <div className="absolute bottom-0 inset-x-0 flex items-center justify-center gap-6 bg-gradient-to-t from-black/70 to-transparent px-4 pb-5 pt-10">
                        <button
                          onClick={switchCamera}
                          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30"
                        >
                          <SwitchCamera className="h-5 w-5" />
                        </button>
                        <button
                          onClick={capturePhoto}
                          className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-red-600 shadow-lg transition hover:bg-red-700 active:scale-95"
                        >
                          <Camera className="h-7 w-7 text-white" />
                        </button>
                        <button
                          onClick={handleSkipPhoto}
                          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <img src={capturedPhoto} alt="Captured" className="aspect-[4/3] w-full object-cover" />
                      <div className="absolute bottom-0 inset-x-0 flex items-center justify-center gap-4 bg-gradient-to-t from-black/70 to-transparent px-4 pb-5 pt-10">
                        <button
                          onClick={handleRetakePhoto}
                          className="flex items-center gap-2 rounded-full bg-white/20 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-white/30"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Retake
                        </button>
                        <button
                          onClick={handleUsePhoto}
                          className="flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg transition hover:bg-red-700"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Use Photo
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <canvas ref={canvasRef} className="hidden" />

                <button
                  onClick={handleSkipPhoto}
                  className="mt-4 w-full rounded-lg border border-gray-200 bg-white py-2.5 text-center text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                >
                  Skip photo — continue without image
                </button>
              </div>
            )}

            {/* Step 3: Report Details */}
            {step === 'details' && (
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <button onClick={() => setStep('type')} className="text-sm text-gray-500 hover:text-gray-700">
                    Report
                  </button>
                  <ChevronRight className="h-3 w-3 text-gray-400" />
                  <button onClick={() => setStep('camera')} className="text-sm text-gray-500 hover:text-gray-700">
                    Photo
                  </button>
                  <ChevronRight className="h-3 w-3 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">Details</span>
                </div>

                {/* Type badge + photo preview */}
                <div className="mb-5 flex items-center gap-3">
                  {typeInfo && (
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${typeInfo.bg} ${typeInfo.color}`}>
                      <typeInfo.icon className="h-3.5 w-3.5" />
                      {typeInfo.label}
                    </span>
                  )}
                  {capturedPhoto && (
                    <div className="flex items-center gap-1.5 text-xs text-green-600">
                      <ImageIcon className="h-3.5 w-3.5" />
                      Photo attached
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      What happened? <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the emergency situation in detail..."
                      rows={4}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none transition-colors focus:border-red-400 focus:ring-2 focus:ring-red-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      <MapPin className="mr-1 inline h-4 w-4 text-gray-400" />
                      Location / Landmark <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Near Daet Public Market, Vinzons Ave."
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 placeholder-gray-400 outline-none transition-colors focus:border-red-400 focus:ring-2 focus:ring-red-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">
                      Barangay <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={barangay}
                      onChange={(e) => setBarangay(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 outline-none transition-colors focus:border-red-400 focus:ring-2 focus:ring-red-100"
                    >
                      <option value="">Select barangay...</option>
                      {BARANGAYS.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  {capturedPhoto && (
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-gray-700">Attached Photo</label>
                      <div className="relative w-32">
                        <img src={capturedPhoto} alt="Report" className="h-24 w-32 rounded-lg border border-gray-200 object-cover" />
                        <button
                          onClick={() => setCapturedPhoto(null)}
                          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-sm hover:bg-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={!description.trim() || !location.trim() || !barangay || submitting}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 active:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Submitting Report...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit Emergency Report
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Success */}
            {step === 'success' && (
              <div className="py-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Report Submitted!</h2>
                <p className="mt-2 text-sm text-gray-500">
                  Your emergency report has been sent to MDRRMO and the relevant authorities.
                  You will be notified once responders are dispatched.
                </p>
                <p className="mt-3 text-xs text-gray-400">
                  Report ID: <span className="font-mono font-medium text-gray-600">{reports[0]?.id}</span>
                </p>

                <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-left">
                  <h3 className="text-sm font-semibold text-green-800">What happens next?</h3>
                  <ul className="mt-2 space-y-1.5 text-xs text-green-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0" />
                      MDRRMO will review your report immediately
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0" />
                      Emergency responders will be dispatched if needed
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0" />
                      You can track your report status in "My Reports"
                    </li>
                  </ul>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={handleNewReport}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    New Report
                  </button>
                  <button
                    onClick={() => { setTab('history'); handleNewReport(); }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gray-900 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                  >
                    <FileText className="h-4 w-4" />
                    View My Reports
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ═══ HISTORY TAB ═══ */}
        {tab === 'history' && (
          <div>
            <h2 className="mb-1 text-lg font-bold text-gray-900">My Reports</h2>
            <p className="mb-5 text-sm text-gray-500">Track the status of your submitted reports</p>

            {reports.length === 0 ? (
              <div className="py-12 text-center">
                <FileText className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                <p className="text-sm text-gray-500">No reports submitted yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {reports.map(report => {
                  const eType = EMERGENCY_TYPES.find(e => e.type === report.type);
                  const sts = STATUS_STYLES[report.status];
                  return (
                    <div key={report.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          {eType && <eType.icon className={`h-5 w-5 ${eType.color}`} />}
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{eType?.label} Report</p>
                            <p className="text-[11px] text-gray-400 font-mono">{report.id}</p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${sts.bg} ${sts.color}`}>
                          {sts.label}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{report.description}</p>
                      <div className="mt-3 flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {report.barangay}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(report.timestamp).toLocaleString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {report.photo && (
                          <span className="flex items-center gap-1 text-green-500">
                            <ImageIcon className="h-3 w-3" />
                            Photo
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ═══ HOTLINES TAB ═══ */}
        {tab === 'hotlines' && (
          <div>
            <h2 className="mb-1 text-lg font-bold text-gray-900">Emergency Hotlines</h2>
            <p className="mb-5 text-sm text-gray-500">Contact these numbers for immediate assistance</p>

            <div className="space-y-3">
              {[
                { name: 'National Emergency', number: '911', desc: 'Police, Fire, Medical', color: 'bg-red-600' },
                { name: 'MDRRMO Daet', number: '(054) 721-XXXX', desc: 'Disaster Risk Reduction', color: 'bg-orange-600' },
                { name: 'PNP Daet Station', number: '(054) 440-XXXX', desc: 'Philippine National Police', color: 'bg-blue-700' },
                { name: 'BFP Daet', number: '(054) 721-XXXX', desc: 'Bureau of Fire Protection', color: 'bg-red-700' },
                { name: 'Daet Municipal Hospital', number: '(054) 721-XXXX', desc: 'Medical Emergency', color: 'bg-emerald-600' },
                { name: 'Red Cross Camarines Norte', number: '(054) 440-XXXX', desc: 'Philippine Red Cross', color: 'bg-rose-700' },
                { name: 'Barangay Operations', number: '(054) 721-XXXX', desc: 'Barangay Emergency Line', color: 'bg-cyan-700' },
              ].map((h, i) => (
                <div key={i} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${h.color} text-white`}>
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{h.name}</p>
                    <p className="text-xs text-gray-500">{h.desc}</p>
                  </div>
                  <a
                    href={`tel:${h.number.replace(/[^0-9+]/g, '')}`}
                    className="shrink-0 rounded-lg bg-green-50 px-3 py-2 text-xs font-bold text-green-700 transition hover:bg-green-100"
                  >
                    {h.number}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
