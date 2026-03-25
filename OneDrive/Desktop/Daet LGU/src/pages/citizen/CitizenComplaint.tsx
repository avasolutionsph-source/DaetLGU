import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Camera,
  X,
  Send,
  CheckCircle2,
  RotateCcw,
  SwitchCamera,
  ImageIcon,
  MapPin,
  Construction,
  Lightbulb,
  Trash2,
  Droplets,
  Volume2,
  TreePine,
  AlertTriangle,
} from 'lucide-react';

type ComplaintType = 'road' | 'streetlight' | 'garbage' | 'drainage' | 'noise' | 'environment' | 'other';

const COMPLAINT_TYPES: { type: ComplaintType; label: string; icon: typeof Construction; color: string; bg: string }[] = [
  { type: 'road', label: 'Road / Pothole', icon: Construction, color: 'text-orange-600', bg: 'bg-orange-50 border-orange-200' },
  { type: 'streetlight', label: 'Street Light', icon: Lightbulb, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  { type: 'garbage', label: 'Garbage / Waste', icon: Trash2, color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
  { type: 'drainage', label: 'Drainage / Canal', icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
  { type: 'noise', label: 'Noise', icon: Volume2, color: 'text-violet-600', bg: 'bg-violet-50 border-violet-200' },
  { type: 'environment', label: 'Environment', icon: TreePine, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  { type: 'other', label: 'Other', icon: AlertTriangle, color: 'text-gray-600', bg: 'bg-gray-50 border-gray-200' },
];

const BARANGAYS = [
  'Alawihao', 'Awitan', 'Bagasbas', 'Bibirao', 'Borabod',
  'Calasgasan', 'Camambugan', 'Cobangbang', 'Dogongan', 'Gahonon',
  'Lag-on', 'Mancruz', 'Pamorangon', 'San Isidro',
];

export default function CitizenComplaint() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [step, setStep] = useState<'type' | 'camera' | 'details' | 'success'>('type');
  const [selectedType, setSelectedType] = useState<ComplaintType | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [barangay, setBarangay] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [refNo, setRefNo] = useState('');

  const startCamera = useCallback(async () => {
    try {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraActive(true);
    } catch { alert('Camera access denied.'); }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) { streamRef.current.getTracks().forEach(t => t.stop()); streamRef.current = null; }
    setCameraActive(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const v = videoRef.current, c = canvasRef.current;
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext('2d')?.drawImage(v, 0, 0);
    setCapturedPhoto(c.toDataURL('image/jpeg', 0.8));
    stopCamera();
  }, [stopCamera]);

  useEffect(() => {
    if (step === 'camera' && !capturedPhoto) startCamera();
    return () => { if (step !== 'camera') stopCamera(); };
  }, [step, facingMode]);

  const handleSubmit = () => {
    if (!description.trim() || !location.trim() || !barangay) return;
    setSubmitting(true);
    setTimeout(() => {
      setRefNo(`CMP-${Date.now().toString(36).toUpperCase()}`);
      setSubmitting(false);
      setStep('success');
    }, 1200);
  };

  const typeInfo = selectedType ? COMPLAINT_TYPES.find(e => e.type === selectedType) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <button onClick={() => step === 'type' ? navigate('/citizen-hub') : setStep('type')} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-gray-900">File a Complaint</h1>
            <p className="text-xs text-gray-500">Report issues in your area</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-5 sm:px-6">
        {step === 'type' && (
          <div>
            <h2 className="mb-1 text-lg font-bold text-gray-900">What's the issue?</h2>
            <p className="mb-5 text-sm text-gray-500">Select the type of concern</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {COMPLAINT_TYPES.map(c => (
                <button key={c.type} onClick={() => { setSelectedType(c.type); setStep('camera'); }}
                  className={`flex flex-col items-center gap-2 rounded-xl border p-5 transition-all hover:-translate-y-0.5 hover:shadow-md ${c.bg}`}>
                  <c.icon className={`h-8 w-8 ${c.color}`} />
                  <span className={`text-sm font-semibold ${c.color}`}>{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'camera' && (
          <div>
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-black">
              {!capturedPhoto ? (
                <div className="relative">
                  <video ref={videoRef} autoPlay playsInline muted className="aspect-[4/3] w-full object-cover" />
                  <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-xs font-medium text-white/80 drop-shadow">{typeInfo?.label} Complaint</span>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 flex items-center justify-center gap-6 bg-gradient-to-t from-black/70 to-transparent px-4 pb-5 pt-10">
                    <button onClick={() => setFacingMode(p => p === 'environment' ? 'user' : 'environment')} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30">
                      <SwitchCamera className="h-5 w-5" />
                    </button>
                    <button onClick={capturePhoto} className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-amber-600 shadow-lg hover:bg-amber-700 active:scale-95">
                      <Camera className="h-7 w-7 text-white" />
                    </button>
                    <button onClick={() => { stopCamera(); setStep('details'); }} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <img src={capturedPhoto} alt="Captured" className="aspect-[4/3] w-full object-cover" />
                  <div className="absolute bottom-0 inset-x-0 flex items-center justify-center gap-4 bg-gradient-to-t from-black/70 to-transparent px-4 pb-5 pt-10">
                    <button onClick={() => { setCapturedPhoto(null); startCamera(); }} className="flex items-center gap-2 rounded-full bg-white/20 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/30">
                      <RotateCcw className="h-4 w-4" />Retake
                    </button>
                    <button onClick={() => setStep('details')} className="flex items-center gap-2 rounded-full bg-amber-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg hover:bg-amber-700">
                      <CheckCircle2 className="h-4 w-4" />Use Photo
                    </button>
                  </div>
                </div>
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
            <button onClick={() => { stopCamera(); setStep('details'); }} className="mt-4 w-full rounded-lg border border-gray-200 bg-white py-2.5 text-center text-sm font-medium text-gray-600 hover:bg-gray-50">
              Skip photo
            </button>
          </div>
        )}

        {step === 'details' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              {typeInfo && (
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${typeInfo.bg} ${typeInfo.color}`}>
                  <typeInfo.icon className="h-3.5 w-3.5" />{typeInfo.label}
                </span>
              )}
              {capturedPhoto && <span className="flex items-center gap-1 text-xs text-green-600"><ImageIcon className="h-3.5 w-3.5" />Photo attached</span>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Describe the issue <span className="text-red-500">*</span></label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Describe the problem in detail..."
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700"><MapPin className="mr-1 inline h-4 w-4 text-gray-400" />Location <span className="text-red-500">*</span></label>
              <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Near Daet Public Market"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Barangay <span className="text-red-500">*</span></label>
              <select value={barangay} onChange={e => setBarangay(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100">
                <option value="">Select barangay...</option>
                {BARANGAYS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            {capturedPhoto && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Photo</label>
                <div className="relative w-32">
                  <img src={capturedPhoto} alt="Issue" className="h-24 w-32 rounded-lg border border-gray-200 object-cover" />
                  <button onClick={() => setCapturedPhoto(null)} className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-sm hover:bg-red-600">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
            <button onClick={handleSubmit} disabled={!description.trim() || !location.trim() || !barangay || submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? (
                <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Submitting...</>
              ) : (
                <><Send className="h-4 w-4" />Submit Complaint</>
              )}
            </button>
          </div>
        )}

        {step === 'success' && (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Complaint Filed!</h2>
            <p className="mt-2 text-sm text-gray-500">Your complaint has been forwarded to the relevant department.</p>
            <p className="mt-3 font-mono text-sm font-medium text-gray-600">Ref: {refNo}</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => { setStep('type'); setSelectedType(null); setCapturedPhoto(null); setDescription(''); setLocation(''); setBarangay(''); }}
                className="flex-1 rounded-xl border border-gray-200 bg-white py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">New Complaint</button>
              <button onClick={() => navigate('/citizen-track')} className="flex-1 rounded-xl bg-gray-900 py-3 text-sm font-medium text-white hover:bg-gray-800">Track Status</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
