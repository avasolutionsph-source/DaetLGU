import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit3,
  Plus,
  Save,
  Upload,
  FileText,
  Image,
  ChevronDown,
  ChevronUp,
  Calendar,
  Activity,
  FolderOpen,
  X,
  Check,
  CheckCircle2,
  Camera,
  Stethoscope,
  Users,
  PhilippinePeso,
  Receipt,
  File,
  FileImage,
  Printer,
  Trash2,
  Eye,
} from 'lucide-react';
import type {
  Patient,
  TreatmentRecord,
  Invoice,
  InvoiceItem,
  Appointment,
  DentalChart,
  MedicalHistory,
  ConsentForm,
  FileAsset,
  Dentist,
  ServiceItem,
  ToothCondition,
  ToothRecord,
  Payment,
  Prescription,
  RxItem,
  Drug,
  ClinicSettings,
} from '@/types/models';
import { TOOTH_CONDITIONS } from '@/types/models';
import {
  formatDate,
  formatDateRelative,
  computeAge,
  formatPhone,
  formatMoney,
  getFullName,
  getShortName,
  getInitials,
  todayISO,
  nowISO,
  generateId,
  cn,
  pesosToCentavos,
  getToothConditionColor,
  getStatusColor,
  ADULT_TEETH_UPPER,
  ADULT_TEETH_LOWER,
  CHILD_TEETH_UPPER,
  CHILD_TEETH_LOWER,
} from '@/lib/utils';
import * as api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { Avatar } from '@/components/ui/Avatar';
import { EmptyState } from '@/components/ui/EmptyState';
import { Tabs } from '@/components/ui/Tabs';
import { showToast } from '@/components/ui/ToastContainer';

// ─── Constants ────────────────────────────────────────────────────
const TAG_BADGE_VARIANT: Record<
  string,
  'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'
> = {
  Ortho: 'info',
  Pedia: 'purple',
  VIP: 'warning',
  Senior: 'success',
  Regular: 'default',
};

const PROFILE_TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'pda', label: 'PDA Forms' },
  { key: 'dental-chart', label: 'Dental Chart' },
  { key: 'treatments', label: 'Treatments' },
  { key: 'billing', label: 'Billing' },
  { key: 'prescriptions', label: 'Prescriptions' },
  { key: 'files', label: 'Files' },
];

const MEDICAL_CONDITIONS = [
  { key: 'heart_disease', label: 'Heart Disease' },
  { key: 'diabetes', label: 'Diabetes' },
  { key: 'hypertension', label: 'Hypertension' },
  { key: 'asthma', label: 'Asthma' },
  { key: 'bleeding_disorder', label: 'Bleeding Disorder' },
  { key: 'hepatitis', label: 'Hepatitis' },
  { key: 'hiv_aids', label: 'HIV/AIDS' },
  { key: 'kidney_disease', label: 'Kidney Disease' },
  { key: 'thyroid_disease', label: 'Thyroid Disease' },
  { key: 'epilepsy', label: 'Epilepsy' },
  { key: 'cancer', label: 'Cancer' },
  { key: 'tuberculosis', label: 'Tuberculosis' },
  { key: 'allergies_to_anesthesia', label: 'Allergies to Anesthesia' },
  { key: 'allergies_to_antibiotics', label: 'Allergies to Antibiotics' },
];

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

// ─── Auto-save status indicator ─────────────────────────────────
type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

function AutoSaveIndicator({ status }: { status: AutoSaveStatus }) {
  if (status === 'idle') return null;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-xs transition-opacity',
        status === 'saving' && 'text-gray-400',
        status === 'saved' && 'text-green-500',
        status === 'error' && 'text-red-500',
      )}
    >
      {status === 'saving' && (
        <>
          <span className="h-2 w-2 animate-spin rounded-full border border-gray-300 border-t-gray-500" />
          Saving...
        </>
      )}
      {status === 'saved' && (
        <>
          <Check className="h-3 w-3" /> Saved
        </>
      )}
      {status === 'error' && 'Save failed'}
    </span>
  );
}

// ─── useAutoSave hook ───────────────────────────────────────────
function useAutoSave(
  saveFn: () => Promise<void>,
  deps: unknown[],
  delayMs = 1200,
  enabled = true,
) {
  const [status, setStatus] = useState<AutoSaveStatus>('idle');
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const isFirstRender = useRef(true);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    // Skip auto-save on initial mount / data load
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!enabled) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      setStatus('saving');
      try {
        await saveFn();
        setStatus('saved');
        if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
        savedTimerRef.current = setTimeout(() => setStatus('idle'), 2000);
      } catch {
        setStatus('error');
      }
    }, delayMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return status;
}

const TOOTH_CONDITION_LABELS: Record<string, string> = {
  // Condition
  present: 'Present Teeth',
  caries: 'Decayed / Caries',
  missing: 'Missing (due to Caries)',
  filled: 'Filled (Pasta)',
  indicated_for_extraction: 'Indicated for Extraction',
  root_fragment: 'Root Fragment',
  missing_other: 'Missing (Other Causes)',
  impacted: 'Impacted Tooth',
  // Restoration & Prosthetics
  jacket_crown: 'Jacket Crown',
  amalgam: 'Amalgam Filling',
  abutment: 'Abutment',
  pontic: 'Pontic',
  inlay: 'Inlay',
  fixed_composite: 'Fixed Cure Composite',
  removable_denture: 'Removable Denture',
  // Surgery
  extraction_caries: 'Extraction (Bunot - Caries)',
  extraction_other: 'Extraction (Other Causes)',
  congenitally_missing: 'Congenitally Missing',
  supernumerary: 'Supernumerary',
};

// Grouped conditions for the tooth editor modal
const GROUPED_CONDITIONS: { group: string; items: { key: string; code: string; color: string }[] }[] = [
  {
    group: 'Condition',
    items: [
      { key: 'present', code: '✓', color: '#22c55e' },
      { key: 'caries', code: 'D', color: '#ef4444' },
      { key: 'missing', code: 'M', color: '#94a3b8' },
      { key: 'filled', code: 'F', color: '#3b82f6' },
      { key: 'indicated_for_extraction', code: 'I', color: '#b91c1c' },
      { key: 'root_fragment', code: 'RF', color: '#b45309' },
      { key: 'missing_other', code: 'MO', color: '#6b7280' },
      { key: 'impacted', code: 'Im', color: '#7c3aed' },
    ],
  },
  {
    group: 'Restoration & Prosthetics',
    items: [
      { key: 'jacket_crown', code: 'J', color: '#f59e0b' },
      { key: 'amalgam', code: 'A', color: '#64748b' },
      { key: 'abutment', code: 'AB', color: '#0ea5e9' },
      { key: 'pontic', code: 'P', color: '#06b6d4' },
      { key: 'inlay', code: 'In', color: '#8b5cf6' },
      { key: 'fixed_composite', code: 'Fx', color: '#10b981' },
      { key: 'removable_denture', code: 'Rm', color: '#ec4899' },
    ],
  },
  {
    group: 'Surgery',
    items: [
      { key: 'extraction_caries', code: 'X', color: '#dc2626' },
      { key: 'extraction_other', code: 'XO', color: '#b91c1c' },
      { key: 'congenitally_missing', code: 'Cm', color: '#a1a1aa' },
      { key: 'supernumerary', code: 'Sp', color: '#d946ef' },
    ],
  },
];

// ═════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════
export default function PatientProfilePage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const patientId = Number(id);

  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Shared data loaded once
  const [treatments, setTreatments] = useState<TreatmentRecord[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [dentalChart, setDentalChart] = useState<DentalChart | null>(null);

  // ─── Fetch Patient ─────────────────────────────────────────
  const fetchPatient = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getPatient(patientId);
      setPatient(data ?? null);
    } catch {
      showToast('error', 'Patient not found');
      navigate('/patients');
    } finally {
      setLoading(false);
    }
  }, [patientId, navigate]);

  const fetchRelatedData = useCallback(async () => {
    try {
      const [t, inv, appt, d, s, chart] = await Promise.all([
        api.getPatientTreatments(patientId),
        api.getPatientInvoices(patientId),
        api.getPatientAppointments(patientId),
        api.getDentists(),
        api.getServices(),
        api.getDentalChart(patientId),
      ]);
      setTreatments(t);
      setInvoices(inv);
      setAppointments(appt);
      setDentists(d);
      setServices(s);
      setDentalChart(chart ?? null);
    } catch {
      // Non-blocking errors for related data
    }
  }, [patientId]);

  useEffect(() => {
    fetchPatient();
    fetchRelatedData();
  }, [fetchPatient, fetchRelatedData]);

  // ─── Computed Stats ────────────────────────────────────────
  const totalTreatments = treatments.length;
  const totalBilled = invoices.reduce((sum, inv) => sum + inv.total_int, 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + inv.amount_paid_int, 0);
  const balance = totalBilled - totalPaid;
  const nextAppointment = appointments
    .filter((a) => a.status === 'scheduled' || a.status === 'confirmed')
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  // ─── Loading State ─────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary-600" />
        <span className="ml-3 text-sm text-gray-500">Loading patient profile...</span>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="py-20">
        <EmptyState
          icon={Users}
          title="Patient not found"
          description="The patient you are looking for does not exist or has been removed."
          action={
            <Button variant="outline" onClick={() => navigate('/patients')}>
              Back to Patients
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        to="/patients"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Patients
      </Link>

      {/* Patient Header */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-5">
            <Avatar
              src={patient.patient_photo || undefined}
              name={getShortName(patient)}
              initials={getInitials(patient.first_name, patient.last_name)}
              size="lg"
              className="!h-20 !w-20 !text-2xl"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {getFullName(patient)}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {computeAge(patient.birthdate)} yrs old &middot;{' '}
                {patient.sex === 'male' ? 'Male' : 'Female'} &middot;{' '}
                {formatPhone(patient.mobile_number)}
                {patient.email && (
                  <span> &middot; {patient.email}</span>
                )}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {patient.tags.map((tag) => (
                  <Badge key={tag} variant={TAG_BADGE_VARIANT[tag] || 'default'}>
                    {tag}
                  </Badge>
                ))}
                {patient.tags.length === 0 && (
                  <span className="text-xs text-gray-400">No tags</span>
                )}
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Edit3 className="h-3.5 w-3.5" />}
            onClick={() => {
              setActiveTab('pda');
              showToast('info', 'Edit patient info in PDA Forms tab');
            }}
          >
            Edit
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <QuickStat
            label="Total Treatments"
            value={String(totalTreatments)}
            icon={<Activity className="h-5 w-5 text-primary-500" />}
          />
          <QuickStat
            label="Total Billed"
            value={formatMoney(totalBilled)}
            icon={<FileText className="h-5 w-5 text-blue-500" />}
          />
          <QuickStat
            label="Balance"
            value={formatMoney(balance)}
            valueClass={balance > 0 ? 'text-danger-600' : 'text-success-600'}
            icon={<PhilippinePeso className="h-5 w-5 text-warning-500" />}
          />
          <QuickStat
            label="Next Appointment"
            value={nextAppointment ? formatDate(nextAppointment.date) : 'None'}
            icon={<Calendar className="h-5 w-5 text-green-500" />}
          />
        </div>
      </div>

      {/* Tab Navigation */}
      <Tabs tabs={PROFILE_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && (
          <OverviewTab
            patient={patient}
            treatments={treatments}
            appointments={appointments}
            dentists={dentists}
            dentalChart={dentalChart}
            onRefreshPatient={fetchPatient}
            onViewFullChart={() => setActiveTab('dental-chart')}
          />
        )}
        {activeTab === 'pda' && (
          <PDAFormsTab patient={patient} onRefreshPatient={fetchPatient} />
        )}
        {activeTab === 'dental-chart' && (
          <DentalChartTab patientId={patientId} onChartUpdate={fetchRelatedData} />
        )}
        {activeTab === 'treatments' && (
          <TreatmentsTab
            patientId={patientId}
            treatments={treatments}
            dentists={dentists}
            services={services}
            onRefresh={fetchRelatedData}
          />
        )}
        {activeTab === 'billing' && (
          <BillingTab
            patientId={patientId}
            invoices={invoices}
            onRefresh={fetchRelatedData}
          />
        )}
        {activeTab === 'prescriptions' && patient && (
          <PrescriptionsTab
            patientId={patientId}
            patient={patient}
            dentists={dentists}
          />
        )}
        {activeTab === 'files' && <FilesTab patientId={patientId} />}
      </div>
    </div>
  );
}

// ─── Quick Stat Card ─────────────────────────────────────────────
function QuickStat({
  label,
  value,
  valueClass,
  icon,
}: {
  label: string;
  value: string;
  valueClass?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className={cn('truncate text-sm font-semibold text-gray-900', valueClass)}>
          {value}
        </p>
      </div>
    </div>
  );
}

// ─── Info Row Helper ─────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-gray-800">{value}</dd>
    </div>
  );
}

// ─── Mini Odontogram (Overview Preview) ──────────────────────────
function MiniOdontogram({
  chart,
  onViewFullChart,
}: {
  chart: DentalChart | null;
  onViewFullChart: () => void;
}) {
  const getPrimary = (num: number): ToothCondition | null => {
    const rec = chart?.teeth.find((t) => t.tooth_number === num);
    if (!rec || rec.conditions.length === 0) return null;
    const priority: ToothCondition[] = [
      'extraction_caries', 'extraction_other', 'indicated_for_extraction',
      'caries', 'root_fragment', 'impacted',
      'jacket_crown', 'amalgam', 'abutment', 'pontic', 'inlay',
      'fixed_composite', 'removable_denture',
      'filled', 'missing', 'missing_other', 'congenitally_missing',
      'supernumerary', 'present',
    ];
    for (const c of priority) if (rec.conditions.includes(c)) return c;
    return null;
  };

  const teethWithIssues = chart?.teeth.filter(
    (t) => t.conditions.length > 0 && !t.conditions.every((c) => c === 'present'),
  ) || [];
  const cariesCount = chart?.teeth.filter((t) => t.conditions.includes('caries')).length || 0;
  const missingCount = chart?.teeth.filter((t) => t.conditions.includes('missing')).length || 0;
  const filledCount = chart?.teeth.filter((t) => t.conditions.includes('filled')).length || 0;

  return (
    <div>
      <div className="overflow-x-auto">
        <div className="mx-auto flex flex-col items-center gap-1" style={{ minWidth: 500 }}>
          {/* Upper temporary teeth */}
          <div className="flex items-center justify-center">
            <span className="w-16 shrink-0 text-right pr-2 text-[8px] font-medium text-gray-400 uppercase">
              Temporary
            </span>
            <div className="flex items-center">
              {CHILD_TEETH_UPPER.slice(0, 5).map((num) => (
                <PDAToothSVG key={num} number={num} condition={getPrimary(num)} isSelected={false} onClick={onViewFullChart} size={26} isChild />
              ))}
              <div className="w-2" />
              {CHILD_TEETH_UPPER.slice(5).map((num) => (
                <PDAToothSVG key={num} number={num} condition={getPrimary(num)} isSelected={false} onClick={onViewFullChart} size={26} isChild />
              ))}
            </div>
            <span className="w-16 shrink-0" />
          </div>

          {/* Upper permanent teeth */}
          <div className="flex items-center justify-center">
            <span className="w-16 shrink-0 text-right pr-2 text-[8px] font-medium text-gray-500 uppercase">
              Permanent
            </span>
            <div className="flex items-center">
              {ADULT_TEETH_UPPER.slice(0, 8).map((num) => (
                <PDAToothSVG key={num} number={num} condition={getPrimary(num)} isSelected={false} onClick={onViewFullChart} size={28} />
              ))}
              <div className="mx-px h-[28px] w-px bg-gray-400" />
              {ADULT_TEETH_UPPER.slice(8).map((num) => (
                <PDAToothSVG key={num} number={num} condition={getPrimary(num)} isSelected={false} onClick={onViewFullChart} size={28} />
              ))}
            </div>
            <span className="w-16 shrink-0" />
          </div>

          {/* Divider with RIGHT / LEFT labels */}
          <div className="flex items-center justify-center w-full my-1">
            <span className="w-16 shrink-0" />
            <div className="flex items-center justify-center" style={{ width: 28 * 16 + 2 }}>
              <span className="text-[8px] font-bold text-gray-400 mr-2">RIGHT</span>
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-[8px] font-bold text-gray-400 ml-2">LEFT</span>
            </div>
            <span className="w-16 shrink-0" />
          </div>

          {/* Lower permanent teeth */}
          <div className="flex items-center justify-center">
            <span className="w-16 shrink-0 text-right pr-2 text-[8px] font-medium text-gray-500 uppercase">
              Permanent
            </span>
            <div className="flex items-center">
              {ADULT_TEETH_LOWER.slice(0, 8).map((num) => (
                <PDAToothSVG key={num} number={num} condition={getPrimary(num)} isSelected={false} onClick={onViewFullChart} size={28} />
              ))}
              <div className="mx-px h-[28px] w-px bg-gray-400" />
              {ADULT_TEETH_LOWER.slice(8).map((num) => (
                <PDAToothSVG key={num} number={num} condition={getPrimary(num)} isSelected={false} onClick={onViewFullChart} size={28} />
              ))}
            </div>
            <span className="w-16 shrink-0" />
          </div>

          {/* Lower temporary teeth */}
          <div className="flex items-center justify-center">
            <span className="w-16 shrink-0 text-right pr-2 text-[8px] font-medium text-gray-400 uppercase">
              Temporary
            </span>
            <div className="flex items-center">
              {CHILD_TEETH_LOWER.slice(0, 5).map((num) => (
                <PDAToothSVG key={num} number={num} condition={getPrimary(num)} isSelected={false} onClick={onViewFullChart} size={26} isChild />
              ))}
              <div className="w-2" />
              {CHILD_TEETH_LOWER.slice(5).map((num) => (
                <PDAToothSVG key={num} number={num} condition={getPrimary(num)} isSelected={false} onClick={onViewFullChart} size={26} isChild />
              ))}
            </div>
            <span className="w-16 shrink-0" />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 pt-3">
        <div className="flex flex-wrap gap-4">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-800">{teethWithIssues.length}</p>
            <p className="text-[10px] text-gray-500">Findings</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-red-500">{cariesCount}</p>
            <p className="text-[10px] text-gray-500">Caries</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gray-400">{missingCount}</p>
            <p className="text-[10px] text-gray-500">Missing</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-blue-500">{filledCount}</p>
            <p className="text-[10px] text-gray-500">Filled</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['D-Caries', 'M-Missing', 'F-Filled', 'J-Crown', 'X-Extract'] as const).map((item) => {
            const [code, label] = item.split('-');
            const colors: Record<string, string> = { D: '#ef4444', M: '#94a3b8', F: '#3b82f6', J: '#f59e0b', X: '#dc2626' };
            return (
              <div key={item} className="flex items-center gap-1">
                <span className="text-[10px] font-bold" style={{ color: colors[code] }}>{code}</span>
                <span className="text-[10px] text-gray-500">{label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// TAB 1: OVERVIEW
// ═════════════════════════════════════════════════════════════════
function OverviewTab({
  patient,
  treatments,
  appointments,
  dentists,
  dentalChart,
  onRefreshPatient,
  onViewFullChart,
}: {
  patient: Patient;
  treatments: TreatmentRecord[];
  appointments: Appointment[];
  dentists: Dentist[];
  dentalChart: DentalChart | null;
  onRefreshPatient: () => void;
  onViewFullChart: () => void;
}) {
  const [notes, setNotes] = useState(patient.notes);

  const notesAutoSaveStatus = useAutoSave(
    async () => {
      await api.updatePatient(patient.patient_id, { notes });
    },
    [notes],
  );

  const recentTreatments = treatments.slice(0, 5);
  const recentAppointments = [...appointments]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  const getDentistName = (dentistId: number): string => {
    const d = dentists.find((doc) => doc.dentist_id === dentistId);
    return d ? `Dr. ${d.last_name}` : '--';
  };

  const address = [
    patient.address_street,
    patient.address_barangay,
    patient.address_city,
    patient.address_province,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Patient Info Card */}
      <Card title="Patient Information" className="lg:col-span-2">
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
          <InfoRow label="Full Name" value={getFullName(patient)} />
          <InfoRow
            label="Birthdate / Age"
            value={`${formatDate(patient.birthdate)} (${computeAge(patient.birthdate)} yrs old)`}
          />
          <InfoRow label="Sex" value={patient.sex === 'male' ? 'Male' : 'Female'} />
          <InfoRow label="Address" value={address || '--'} />
          <InfoRow label="Mobile" value={formatPhone(patient.mobile_number)} />
          <InfoRow label="Email" value={patient.email || '--'} />
          <InfoRow label="Occupation" value={patient.occupation || '--'} />
          <InfoRow
            label="Emergency Contact"
            value={
              patient.emergency_contact_name
                ? `${patient.emergency_contact_name} (${formatPhone(patient.emergency_contact_number)})`
                : '--'
            }
          />
          <InfoRow label="Insurance" value={patient.insurance_provider || '--'} />
          <InfoRow label="Religion" value={patient.religion || '--'} />
        </div>
      </Card>

      {/* Mini Dental Chart Preview */}
      <Card
        title="Dental Chart"
        className="lg:col-span-2"
        headerAction={
          <button
            onClick={onViewFullChart}
            className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:underline"
          >
            View Full Chart &rarr;
          </button>
        }
      >
        <MiniOdontogram chart={dentalChart} onViewFullChart={onViewFullChart} />
      </Card>

      {/* Recent Treatments */}
      <Card
        title="Recent Treatments"
        headerAction={
          treatments.length > 5 ? (
            <span className="text-xs text-primary-600 cursor-pointer hover:underline">
              View All ({treatments.length})
            </span>
          ) : undefined
        }
      >
        {recentTreatments.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-400">
            No treatments recorded yet.
          </p>
        ) : (
          <div className="space-y-3">
            {recentTreatments.map((tx) => (
              <div
                key={tx.treatment_id}
                className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {tx.procedure_type}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(tx.date)} &middot; {getDentistName(tx.dentist_id)}
                    {tx.tooth_numbers.length > 0 &&
                      ` \u00b7 Tooth ${tx.tooth_numbers.join(', ')}`}
                  </p>
                </div>
                <Badge
                  variant={
                    tx.status === 'done'
                      ? 'success'
                      : tx.status === 'in_progress'
                        ? 'warning'
                        : 'info'
                  }
                >
                  {tx.status === 'done'
                    ? 'Done'
                    : tx.status === 'in_progress'
                      ? 'In Progress'
                      : 'Planned'}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Recent Appointments */}
      <Card title="Recent Appointments">
        {recentAppointments.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-400">
            No appointments found.
          </p>
        ) : (
          <div className="space-y-3">
            {recentAppointments.map((appt) => (
              <div
                key={appt.appointment_id}
                className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {formatDate(appt.date)} at {appt.time_start}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getDentistName(appt.dentist_id)}
                    {appt.notes && ` - ${appt.notes}`}
                  </p>
                </div>
                <Badge
                  variant={
                    appt.status === 'done'
                      ? 'success'
                      : appt.status === 'cancelled' || appt.status === 'no_show'
                        ? 'danger'
                        : 'info'
                  }
                >
                  {appt.status.replace('_', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Notes */}
      <Card
        title="Notes"
        className="lg:col-span-2"
        headerAction={<AutoSaveIndicator status={notesAutoSaveStatus} />}
      >
        <textarea
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add clinical notes, reminders, or observations..."
          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <div className="mt-2 flex justify-end">
          <span className="text-[10px] text-gray-400">Auto-saves as you type</span>
        </div>
      </Card>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// TAB 2: PDA FORMS
// ═════════════════════════════════════════════════════════════════
function PDAFormsTab({
  patient,
  onRefreshPatient,
}: {
  patient: Patient;
  onRefreshPatient: () => void;
}) {
  const [editMode, setEditMode] = useState(false);

  // ─── Medical History State ─────────────────────────────────
  const [medLoading, setMedLoading] = useState(true);
  const [medReady, setMedReady] = useState(false);
  const [conditions, setConditions] = useState<Record<string, boolean>>({});
  const [medFields, setMedFields] = useState({
    allergies: '',
    current_medications: '',
    physician_name: '',
    physician_contact: '',
    other_conditions: '',
    is_pregnant: false,
    is_nursing: false,
    blood_type: '',
  });

  // ─── Consent State ────────────────────────────────────────
  const [consent, setConsent] = useState<ConsentForm | null>(null);
  const [consentLoading, setConsentLoading] = useState(true);
  const [consentReady, setConsentReady] = useState(false);
  const [consentForm, setConsentForm] = useState({
    consent_procedures: true,
    consent_risks: true,
    consent_records: true,
    signatory_name: `${patient.first_name} ${patient.last_name}`,
    relationship: 'Self',
    consent_date: todayISO(),
  });

  // Load medical history
  useEffect(() => {
    (async () => {
      setMedLoading(true);
      try {
        const data = await api.getMedicalHistory(patient.patient_id);
        if (data) {
          setConditions(data.conditions || {});
          setMedFields({
            allergies: data.allergies || '',
            current_medications: data.current_medications || '',
            physician_name: data.physician_name || '',
            physician_contact: data.physician_contact || '',
            other_conditions: data.other_conditions || '',
            is_pregnant: data.is_pregnant || false,
            is_nursing: data.is_nursing || false,
            blood_type: data.blood_type || '',
          });
        }
      } catch {
        // No medical history yet - use defaults
      } finally {
        setMedLoading(false);
        // Small delay so useAutoSave skips the initial "load" change
        setTimeout(() => setMedReady(true), 100);
      }
    })();
  }, [patient.patient_id]);

  // Load consent form
  useEffect(() => {
    (async () => {
      setConsentLoading(true);
      try {
        const data = await api.getConsentForm(patient.patient_id);
        setConsent(data ?? null);
        if (data) {
          setConsentForm({
            consent_procedures: data.consented,
            consent_risks: data.consented,
            consent_records: data.consented,
            signatory_name: data.signatory_name || `${patient.first_name} ${patient.last_name}`,
            relationship: data.relationship || 'Self',
            consent_date: data.consent_date || todayISO(),
          });
        }
      } catch {
        // No consent form yet
      } finally {
        setConsentLoading(false);
        setTimeout(() => setConsentReady(true), 100);
      }
    })();
  }, [patient.patient_id]);

  const toggleCondition = (key: string) => {
    setConditions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ─── Auto-save Medical History ─────────────────────────────
  const medAutoSave = useAutoSave(
    async () => {
      const payload: MedicalHistory = {
        patient_id: patient.patient_id,
        conditions,
        allergies: medFields.allergies,
        current_medications: medFields.current_medications,
        physician_name: medFields.physician_name,
        physician_contact: medFields.physician_contact,
        other_conditions: medFields.other_conditions,
        is_pregnant: medFields.is_pregnant,
        is_nursing: medFields.is_nursing,
        blood_type: medFields.blood_type,
        updated_at: nowISO(),
      };
      await api.saveMedicalHistory(payload);
    },
    [conditions, medFields],
    1200,
    medReady,
  );

  // ─── Auto-save Consent ───────────────────────────────────
  const consentAutoSave = useAutoSave(
    async () => {
      const payload: ConsentForm = {
        consent_id: consent?.consent_id || generateId(),
        patient_id: patient.patient_id,
        consented:
          consentForm.consent_procedures &&
          consentForm.consent_risks &&
          consentForm.consent_records,
        consent_date: consentForm.consent_date,
        signatory_name: consentForm.signatory_name.trim(),
        relationship: consentForm.relationship,
        notes: '',
      };
      await api.saveConsentForm(payload);
      setConsent(payload);
    },
    [consentForm],
    1200,
    consentReady,
  );

  const address = [
    patient.address_street,
    patient.address_barangay,
    patient.address_city,
    patient.address_province,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="space-y-6">
      {/* ── Patient Information Record ────────────────────────── */}
      <Card
        title="Patient Information Record"
        headerAction={
          <Button
            variant="ghost"
            size="sm"
            leftIcon={
              editMode ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Edit3 className="h-3.5 w-3.5" />
              )
            }
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? 'Done' : 'Edit'}
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          <InfoRow label="Full Name" value={getFullName(patient)} />
          <InfoRow label="Nickname" value={patient.first_name} />
          <InfoRow label="Birthdate" value={formatDate(patient.birthdate)} />
          <InfoRow
            label="Age"
            value={`${computeAge(patient.birthdate)} years old`}
          />
          <InfoRow
            label="Sex"
            value={patient.sex === 'male' ? 'Male' : 'Female'}
          />
          <InfoRow label="Civil Status" value="--" />
          <InfoRow label="Address" value={address || '--'} />
          <InfoRow label="Occupation" value={patient.occupation || '--'} />
          <InfoRow label="Religion" value={patient.religion || '--'} />
          <InfoRow
            label="Dental Insurance"
            value={patient.insurance_provider || '--'}
          />
          <InfoRow
            label="Mobile Number"
            value={formatPhone(patient.mobile_number)}
          />
          <InfoRow label="Email" value={patient.email || '--'} />
        </div>
      </Card>

      {/* ── Medical History ───────────────────────────────────── */}
      <Card
        title="Medical History"
        headerAction={<AutoSaveIndicator status={medAutoSave} />}
      >
        {medLoading ? (
          <LoadingSpinner text="Loading medical history..." />
        ) : (
          <div className="space-y-6">
            {/* Conditions Checklist */}
            <div>
              <h4 className="mb-3 text-sm font-semibold text-gray-700">
                Medical Conditions (check all that apply)
              </h4>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {MEDICAL_CONDITIONS.map((cond) => (
                  <label
                    key={cond.key}
                    className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-gray-200 px-3 py-2 transition-colors hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={!!conditions[cond.key]}
                      onChange={() => toggleCondition(cond.key)}
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm text-gray-700">{cond.label}</span>
                    {conditions[cond.key] && (
                      <Badge variant="danger" className="ml-auto">
                        Yes
                      </Badge>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Pregnancy / Nursing (female only) */}
            {patient.sex === 'female' && (
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={medFields.is_pregnant}
                    onChange={(e) =>
                      setMedFields((p) => ({
                        ...p,
                        is_pregnant: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Is Pregnant</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={medFields.is_nursing}
                    onChange={(e) =>
                      setMedFields((p) => ({
                        ...p,
                        is_nursing: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">Is Nursing</span>
                </label>
              </div>
            )}

            {/* Text Fields */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Allergies
                </label>
                <textarea
                  rows={2}
                  value={medFields.allergies}
                  onChange={(e) =>
                    setMedFields((p) => ({ ...p, allergies: e.target.value }))
                  }
                  placeholder="List any known allergies..."
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Current Medications
                </label>
                <textarea
                  rows={2}
                  value={medFields.current_medications}
                  onChange={(e) =>
                    setMedFields((p) => ({
                      ...p,
                      current_medications: e.target.value,
                    }))
                  }
                  placeholder="List medications currently being taken..."
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <Input
                label="Physician Name"
                placeholder="Dr. Juan Dela Cruz"
                value={medFields.physician_name}
                onChange={(e) =>
                  setMedFields((p) => ({
                    ...p,
                    physician_name: e.target.value,
                  }))
                }
              />
              <Input
                label="Physician Contact"
                placeholder="09XX XXX XXXX"
                value={medFields.physician_contact}
                onChange={(e) =>
                  setMedFields((p) => ({
                    ...p,
                    physician_contact: e.target.value,
                  }))
                }
              />
            </div>

            {/* Blood Type */}
            <div className="max-w-xs">
              <Select
                label="Blood Type"
                value={medFields.blood_type}
                onChange={(e) =>
                  setMedFields((p) => ({ ...p, blood_type: e.target.value }))
                }
                options={BLOOD_TYPES.map((bt) => ({ value: bt, label: bt }))}
                placeholder="Select blood type"
              />
            </div>

            <div className="flex justify-end border-t border-gray-100 pt-3">
              <span className="text-[10px] text-gray-400">Auto-saves when you make changes</span>
            </div>
          </div>
        )}
      </Card>

      {/* ── Informed Consent ──────────────────────────────────── */}
      <Card
        title="Informed Consent"
        headerAction={<AutoSaveIndicator status={consentAutoSave} />}
      >
        {consentLoading ? (
          <LoadingSpinner text="Loading consent form..." />
        ) : (
          <div className="space-y-5">
            {/* Consent Checkboxes */}
            <div className="space-y-3">
              {[
                {
                  key: 'consent_procedures' as const,
                  text: 'I consent to the dental procedures recommended by the dentist.',
                },
                {
                  key: 'consent_risks' as const,
                  text: 'I have been informed of the risks and benefits of the treatment.',
                },
                {
                  key: 'consent_records' as const,
                  text: 'I authorize the release of my dental records as needed.',
                },
              ].map((item) => (
                <label
                  key={item.key}
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 p-3 transition-colors hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={consentForm[item.key]}
                    onChange={(e) =>
                      setConsentForm((prev) => ({
                        ...prev,
                        [item.key]: e.target.checked,
                      }))
                    }
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{item.text}</span>
                </label>
              ))}
            </div>

            {/* Signatory */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Input
                label="Signatory Name *"
                placeholder="Full name"
                value={consentForm.signatory_name}
                onChange={(e) =>
                  setConsentForm((prev) => ({
                    ...prev,
                    signatory_name: e.target.value,
                  }))
                }
              />
              <Select
                label="Relationship to Patient"
                value={consentForm.relationship}
                onChange={(e) =>
                  setConsentForm((prev) => ({
                    ...prev,
                    relationship: e.target.value,
                  }))
                }
                options={[
                  { value: 'Self', label: 'Self' },
                  { value: 'Parent', label: 'Parent' },
                  { value: 'Guardian', label: 'Guardian' },
                ]}
              />
              <div className="w-full">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Consent Date
                </label>
                <input
                  type="date"
                  value={consentForm.consent_date}
                  onChange={(e) =>
                    setConsentForm((prev) => ({
                      ...prev,
                      consent_date: e.target.value,
                    }))
                  }
                  className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Existing consent banner */}
            {consent?.consented && (
              <div className="flex items-center gap-2 rounded-lg bg-success-50 px-4 py-2.5">
                <CheckCircle2 className="h-4 w-4 text-success-600" />
                <span className="text-sm text-success-700">
                  Consent was recorded on {formatDate(consent.consent_date)} by{' '}
                  {consent.signatory_name} ({consent.relationship})
                </span>
              </div>
            )}

            <div className="flex justify-end border-t border-gray-100 pt-3">
              <span className="text-[10px] text-gray-400">Auto-saves when you make changes</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// TAB 3: DENTAL CHART (PDA-Style)
// ═════════════════════════════════════════════════════════════════

// PDA Legend codes
const PDA_LEGEND = {
  condition: [
    { code: 'D', label: 'Decayed (Caries)', color: '#ef4444' },
    { code: 'M', label: 'Missing due to Caries', color: '#94a3b8' },
    { code: 'F', label: 'Filled', color: '#3b82f6' },
    { code: 'I', label: 'Caries Indicated for Extraction', color: '#dc2626' },
    { code: 'RF', label: 'Root Fragment', color: '#b45309' },
    { code: 'MO', label: 'Missing due to Other Causes', color: '#6b7280' },
    { code: 'Im', label: 'Impacted Tooth', color: '#7c3aed' },
  ],
  restoration: [
    { code: 'J', label: 'Jacket Crown', color: '#f59e0b' },
    { code: 'A', label: 'Amalgam Filling', color: '#64748b' },
    { code: 'AB', label: 'Abutment', color: '#0ea5e9' },
    { code: 'P', label: 'Pontic', color: '#06b6d4' },
    { code: 'In', label: 'Inlay', color: '#8b5cf6' },
    { code: 'Fx', label: 'Fixed Cure Composite', color: '#10b981' },
    { code: 'Rm', label: 'Removable Denture', color: '#ec4899' },
  ],
  surgery: [
    { code: 'X', label: 'Extraction due to Caries', color: '#dc2626' },
    { code: 'XO', label: 'Extraction (Other Causes)', color: '#b91c1c' },
    { code: '✓', label: 'Present Teeth', color: '#22c55e' },
    { code: 'Cm', label: 'Congenitally Missing', color: '#a1a1aa' },
    { code: 'Sp', label: 'Supernumerary', color: '#d946ef' },
  ],
};

// Map our internal conditions to PDA codes for display
const CONDITION_TO_PDA: Record<string, { code: string; fill: string }> = {
  // Condition
  present: { code: '✓', fill: '#22c55e' },
  caries: { code: 'D', fill: '#ef4444' },
  missing: { code: 'M', fill: '#94a3b8' },
  filled: { code: 'F', fill: '#3b82f6' },
  indicated_for_extraction: { code: 'I', fill: '#b91c1c' },
  root_fragment: { code: 'RF', fill: '#b45309' },
  missing_other: { code: 'MO', fill: '#6b7280' },
  impacted: { code: 'Im', fill: '#7c3aed' },
  // Restoration & Prosthetics
  jacket_crown: { code: 'J', fill: '#f59e0b' },
  amalgam: { code: 'A', fill: '#64748b' },
  abutment: { code: 'AB', fill: '#0ea5e9' },
  pontic: { code: 'P', fill: '#06b6d4' },
  inlay: { code: 'In', fill: '#8b5cf6' },
  fixed_composite: { code: 'Fx', fill: '#10b981' },
  removable_denture: { code: 'Rm', fill: '#ec4899' },
  // Surgery
  extraction_caries: { code: 'X', fill: '#dc2626' },
  extraction_other: { code: 'XO', fill: '#b91c1c' },
  congenitally_missing: { code: 'Cm', fill: '#a1a1aa' },
  supernumerary: { code: 'Sp', fill: '#d946ef' },
};

function DentalChartTab({ patientId, onChartUpdate }: { patientId: number; onChartUpdate?: () => void }) {
  const [chart, setChart] = useState<DentalChart | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTooth, setSelectedTooth] = useState<number | null>(null);
  const [toothConditions, setToothConditions] = useState<ToothCondition[]>([]);
  const [toothNotes, setToothNotes] = useState('');
  const [savingTooth, setSavingTooth] = useState(false);

  const fetchChart = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getDentalChart(patientId);
      setChart(data ?? null);
    } catch {
      setChart({ patient_id: patientId, teeth: [], updated_at: nowISO() });
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => { fetchChart(); }, [fetchChart]);

  const getToothRecord = (num: number): ToothRecord | undefined =>
    chart?.teeth.find((t) => t.tooth_number === num);

  const getPrimaryCondition = (num: number) => {
    const rec = getToothRecord(num);
    if (!rec || rec.conditions.length === 0) return null;
    const priority: ToothCondition[] = [
      'extraction_caries', 'extraction_other', 'indicated_for_extraction',
      'caries', 'root_fragment', 'impacted',
      'jacket_crown', 'amalgam', 'abutment', 'pontic', 'inlay',
      'fixed_composite', 'removable_denture',
      'filled', 'missing', 'missing_other', 'congenitally_missing',
      'supernumerary', 'present',
    ];
    for (const c of priority) {
      if (rec.conditions.includes(c)) return c;
    }
    return null;
  };

  const openToothEditor = (num: number) => {
    const rec = getToothRecord(num);
    setSelectedTooth(num);
    setToothConditions(rec?.conditions || []);
    setToothNotes(rec?.notes || '');
  };

  const toggleCondition = (cond: ToothCondition) => {
    setToothConditions((prev) =>
      prev.includes(cond) ? prev.filter((c) => c !== cond) : [...prev, cond],
    );
  };

  const handleSaveTooth = async () => {
    if (selectedTooth === null) return;
    setSavingTooth(true);
    try {
      await api.updateToothRecord(patientId, {
        tooth_number: selectedTooth,
        conditions: toothConditions,
        notes: toothNotes,
        updated_at: nowISO(),
      });
      showToast('success', `Tooth #${selectedTooth} updated`);
      setSelectedTooth(null);
      fetchChart();
      onChartUpdate?.();
    } catch {
      showToast('error', 'Failed to update tooth record');
    } finally {
      setSavingTooth(false);
    }
  };

  const chartHistory = useMemo(() => {
    if (!chart) return [];
    return [...chart.teeth]
      .filter((t) => t.conditions.length > 0)
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
      .slice(0, 10);
  }, [chart]);

  if (loading) return <LoadingSpinner text="Loading dental chart..." />;

  return (
    <div className="space-y-6">
      {/* ── PDA-Style Dental Record Chart ─────────────────────── */}
      <Card padding={false}>
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h3 className="text-center text-sm font-bold uppercase tracking-widest text-gray-700">
            Dental Record Chart
          </h3>
          <p className="mt-0.5 text-center text-xs uppercase tracking-wider text-gray-400">
            Intraoral Examination
          </p>
        </div>

        <div className="px-4 py-5 sm:px-6">
          {/* STATUS + TEMPORARY + PERMANENT rows (upper) */}
          <div className="overflow-x-auto">
            <div className="mx-auto" style={{ minWidth: 700, maxWidth: 900 }}>

              {/* ── Status boxes (upper) ── */}
              <div className="mb-1 flex items-center">
                <span className="w-24 shrink-0 text-right pr-2 text-[10px] font-bold uppercase text-gray-500">
                  Status<br/>Right
                </span>
                <div className="flex flex-1 justify-center">
                  <div className="flex">
                    {ADULT_TEETH_UPPER.slice(0, 8).map((num) => {
                      const pda = CONDITION_TO_PDA[getPrimaryCondition(num) || ''];
                      return (
                        <div key={num} className="flex h-5 w-[42px] items-center justify-center border border-gray-300 bg-white text-[9px] font-bold text-gray-500">
                          {pda ? <span style={{ color: pda.fill }}>{pda.code}</span> : ''}
                        </div>
                      );
                    })}
                    <div className="w-2" />
                    {ADULT_TEETH_UPPER.slice(8).map((num) => {
                      const pda = CONDITION_TO_PDA[getPrimaryCondition(num) || ''];
                      return (
                        <div key={num} className="flex h-5 w-[42px] items-center justify-center border border-gray-300 bg-white text-[9px] font-bold text-gray-500">
                          {pda ? <span style={{ color: pda.fill }}>{pda.code}</span> : ''}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <span className="w-24 shrink-0 pl-2 text-[10px] font-bold uppercase text-gray-500">
                  Left
                </span>
              </div>

              {/* ── Temporary teeth (upper) ── */}
              <div className="mb-1 flex items-center">
                <span className="w-24 shrink-0 text-right pr-2 text-[10px] font-semibold uppercase text-gray-400">
                  Temporary<br/>Teeth
                </span>
                <div className="flex flex-1 justify-center">
                  <div className="flex items-center">
                    {CHILD_TEETH_UPPER.slice(0, 5).map((num) => (
                      <PDAToothSVG
                        key={num}
                        number={num}
                        condition={getPrimaryCondition(num)}
                        isSelected={selectedTooth === num}
                        onClick={() => openToothEditor(num)}
                        size={34}
                        isChild
                      />
                    ))}
                    <div className="w-2" />
                    {CHILD_TEETH_UPPER.slice(5).map((num) => (
                      <PDAToothSVG
                        key={num}
                        number={num}
                        condition={getPrimaryCondition(num)}
                        isSelected={selectedTooth === num}
                        onClick={() => openToothEditor(num)}
                        size={34}
                        isChild
                      />
                    ))}
                  </div>
                </div>
                <span className="w-24 shrink-0" />
              </div>

              {/* ── Permanent teeth (upper) ── */}
              <div className="mb-1 flex items-center">
                <span className="w-24 shrink-0 text-right pr-2 text-[10px] font-bold uppercase text-gray-500">
                  Permanent<br/>Teeth
                </span>
                <div className="flex flex-1 justify-center">
                  <div className="flex items-center">
                    {ADULT_TEETH_UPPER.slice(0, 8).map((num) => (
                      <PDAToothSVG
                        key={num}
                        number={num}
                        condition={getPrimaryCondition(num)}
                        isSelected={selectedTooth === num}
                        onClick={() => openToothEditor(num)}
                        size={42}
                      />
                    ))}
                    <div className="mx-0.5 flex h-[42px] w-4 items-center justify-center">
                      <div className="h-full w-px bg-gray-800" />
                    </div>
                    {ADULT_TEETH_UPPER.slice(8).map((num) => (
                      <PDAToothSVG
                        key={num}
                        number={num}
                        condition={getPrimaryCondition(num)}
                        isSelected={selectedTooth === num}
                        onClick={() => openToothEditor(num)}
                        size={42}
                      />
                    ))}
                  </div>
                </div>
                <span className="w-24 shrink-0 pl-2 text-[10px] font-bold uppercase text-gray-500">
                  TMD
                </span>
              </div>

              {/* ── R / L divider labels ── */}
              <div className="mb-1 flex items-center">
                <span className="w-24 shrink-0" />
                <div className="flex flex-1 justify-center">
                  <div className="flex" style={{ width: 'fit-content' }}>
                    <span className="pr-2 text-[10px] font-bold text-gray-600">RIGHT</span>
                    <span className="flex-1" />
                    <span className="pl-2 text-[10px] font-bold text-gray-600">LEFT</span>
                  </div>
                </div>
                <span className="w-24 shrink-0" />
              </div>

              {/* ── Permanent teeth (lower) ── */}
              <div className="mb-1 flex items-center">
                <span className="w-24 shrink-0 text-right pr-2 text-[10px] font-bold uppercase text-gray-500">
                  Permanent<br/>Teeth
                </span>
                <div className="flex flex-1 justify-center">
                  <div className="flex items-center">
                    {ADULT_TEETH_LOWER.slice(0, 8).map((num) => (
                      <PDAToothSVG
                        key={num}
                        number={num}
                        condition={getPrimaryCondition(num)}
                        isSelected={selectedTooth === num}
                        onClick={() => openToothEditor(num)}
                        size={42}
                      />
                    ))}
                    <div className="mx-0.5 flex h-[42px] w-4 items-center justify-center">
                      <div className="h-full w-px bg-gray-800" />
                    </div>
                    {ADULT_TEETH_LOWER.slice(8).map((num) => (
                      <PDAToothSVG
                        key={num}
                        number={num}
                        condition={getPrimaryCondition(num)}
                        isSelected={selectedTooth === num}
                        onClick={() => openToothEditor(num)}
                        size={42}
                      />
                    ))}
                  </div>
                </div>
                <span className="w-24 shrink-0" />
              </div>

              {/* ── Temporary teeth (lower) ── */}
              <div className="mb-1 flex items-center">
                <span className="w-24 shrink-0 text-right pr-2 text-[10px] font-semibold uppercase text-gray-400">
                  Temporary<br/>Teeth
                </span>
                <div className="flex flex-1 justify-center">
                  <div className="flex items-center">
                    {CHILD_TEETH_LOWER.slice(0, 5).map((num) => (
                      <PDAToothSVG
                        key={num}
                        number={num}
                        condition={getPrimaryCondition(num)}
                        isSelected={selectedTooth === num}
                        onClick={() => openToothEditor(num)}
                        size={34}
                        isChild
                      />
                    ))}
                    <div className="w-2" />
                    {CHILD_TEETH_LOWER.slice(5).map((num) => (
                      <PDAToothSVG
                        key={num}
                        number={num}
                        condition={getPrimaryCondition(num)}
                        isSelected={selectedTooth === num}
                        onClick={() => openToothEditor(num)}
                        size={34}
                        isChild
                      />
                    ))}
                  </div>
                </div>
                <span className="w-24 shrink-0" />
              </div>

              {/* ── Status boxes (lower) ── */}
              <div className="flex items-center">
                <span className="w-24 shrink-0 text-right pr-2 text-[10px] font-bold uppercase text-gray-500">
                  Status<br/>Right
                </span>
                <div className="flex flex-1 justify-center">
                  <div className="flex">
                    {ADULT_TEETH_LOWER.slice(0, 8).map((num) => {
                      const pda = CONDITION_TO_PDA[getPrimaryCondition(num) || ''];
                      return (
                        <div key={num} className="flex h-5 w-[42px] items-center justify-center border border-gray-300 bg-white text-[9px] font-bold text-gray-500">
                          {pda ? <span style={{ color: pda.fill }}>{pda.code}</span> : ''}
                        </div>
                      );
                    })}
                    <div className="w-2" />
                    {ADULT_TEETH_LOWER.slice(8).map((num) => {
                      const pda = CONDITION_TO_PDA[getPrimaryCondition(num) || ''];
                      return (
                        <div key={num} className="flex h-5 w-[42px] items-center justify-center border border-gray-300 bg-white text-[9px] font-bold text-gray-500">
                          {pda ? <span style={{ color: pda.fill }}>{pda.code}</span> : ''}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <span className="w-24 shrink-0 pl-2 text-[10px] font-bold uppercase text-gray-500">
                  Left
                </span>
              </div>
            </div>
          </div>

          {/* ── PDA Legend ── */}
          <div className="mt-6 border-t border-gray-200 pt-4">
            <h4 className="mb-3 text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Legend
            </h4>
            <div className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-3">
              {/* Condition */}
              <div>
                <h5 className="mb-1 text-[10px] font-bold text-gray-600 underline">Condition</h5>
                {PDA_LEGEND.condition.map((item) => (
                  <div key={item.code} className="flex items-center gap-1.5 py-0.5">
                    <span className="w-5 text-center text-[10px] font-bold" style={{ color: item.color }}>{item.code}</span>
                    <span className="text-[10px] text-gray-600">- {item.label}</span>
                  </div>
                ))}
              </div>
              {/* Restoration & Prosthetics */}
              <div>
                <h5 className="mb-1 text-[10px] font-bold text-gray-600 underline">Restoration &amp; Prosthetics</h5>
                {PDA_LEGEND.restoration.map((item) => (
                  <div key={item.code} className="flex items-center gap-1.5 py-0.5">
                    <span className="w-5 text-center text-[10px] font-bold" style={{ color: item.color }}>{item.code}</span>
                    <span className="text-[10px] text-gray-600">- {item.label}</span>
                  </div>
                ))}
              </div>
              {/* Surgery */}
              <div>
                <h5 className="mb-1 text-[10px] font-bold text-gray-600 underline">Surgery</h5>
                {PDA_LEGEND.surgery.map((item) => (
                  <div key={item.code} className="flex items-center gap-1.5 py-0.5">
                    <span className="w-5 text-center text-[10px] font-bold" style={{ color: item.color }}>{item.code}</span>
                    <span className="text-[10px] text-gray-600">- {item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Periodontal / Occlusion / TMD ── */}
          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-200 pt-4 sm:grid-cols-4">
            <div>
              <h5 className="mb-1.5 text-[10px] font-bold uppercase text-gray-500">Periodontal Screening</h5>
              {['Gingivitis', 'Early Periodontitis', 'Moderate Periodontitis', 'Advanced Periodontitis'].map((item) => (
                <label key={item} className="flex items-center gap-1.5 py-0.5">
                  <input type="checkbox" className="h-3 w-3 rounded border-gray-300 text-primary-600" />
                  <span className="text-[10px] text-gray-600">{item}</span>
                </label>
              ))}
            </div>
            <div>
              <h5 className="mb-1.5 text-[10px] font-bold uppercase text-gray-500">Occlusion</h5>
              {['Class (Molar)', 'Overjet', 'Overbite', 'Midline Deviation', 'Crossbite'].map((item) => (
                <label key={item} className="flex items-center gap-1.5 py-0.5">
                  <input type="checkbox" className="h-3 w-3 rounded border-gray-300 text-primary-600" />
                  <span className="text-[10px] text-gray-600">{item}</span>
                </label>
              ))}
            </div>
            <div>
              <h5 className="mb-1.5 text-[10px] font-bold uppercase text-gray-500">Appliances</h5>
              {['Orthodontic', 'Stayplate', 'Others'].map((item) => (
                <label key={item} className="flex items-center gap-1.5 py-0.5">
                  <input type="checkbox" className="h-3 w-3 rounded border-gray-300 text-primary-600" />
                  <span className="text-[10px] text-gray-600">{item}</span>
                </label>
              ))}
            </div>
            <div>
              <h5 className="mb-1.5 text-[10px] font-bold uppercase text-gray-500">TMD</h5>
              {['Clenching', 'Clicking', 'Trismus', 'Muscle Spasm'].map((item) => (
                <label key={item} className="flex items-center gap-1.5 py-0.5">
                  <input type="checkbox" className="h-3 w-3 rounded border-gray-300 text-primary-600" />
                  <span className="text-[10px] text-gray-600">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* ── Tooth Editor Modal ── */}
      <Modal
        isOpen={selectedTooth !== null}
        onClose={() => setSelectedTooth(null)}
        title={`Tooth #${selectedTooth}`}
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setSelectedTooth(null)}>Cancel</Button>
            <Button onClick={handleSaveTooth} loading={savingTooth}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Mini preview of selected tooth */}
          <div className="flex justify-center">
            <PDAToothSVG
              number={selectedTooth || 0}
              condition={toothConditions.length > 0 ? toothConditions[0] : null}
              isSelected={false}
              onClick={() => {}}
              size={80}
            />
          </div>
          <div className="space-y-3">
            {GROUPED_CONDITIONS.map((group) => (
              <div key={group.group}>
                <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wide text-gray-500">{group.group}</h4>
                <div className="grid grid-cols-1 gap-1">
                  {group.items.map((item) => (
                    <label
                      key={item.key}
                      className={cn(
                        'flex cursor-pointer items-center gap-2.5 rounded-lg border px-3 py-1.5 transition-colors hover:bg-gray-50',
                        toothConditions.includes(item.key as ToothCondition)
                          ? 'border-primary-300 bg-primary-50'
                          : 'border-gray-200',
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={toothConditions.includes(item.key as ToothCondition)}
                        onChange={() => toggleCondition(item.key as ToothCondition)}
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-gray-700">{TOOTH_CONDITION_LABELS[item.key] || item.key}</span>
                      <span className="ml-auto text-[10px] font-bold" style={{ color: item.color }}>
                        {item.code}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              rows={2}
              value={toothNotes}
              onChange={(e) => setToothNotes(e.target.value)}
              placeholder="Additional notes..."
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </Modal>

      {/* ── Chart History ── */}
      <Card title="Chart History">
        {chartHistory.length === 0 ? (
          <p className="py-6 text-center text-sm text-gray-400">
            No chart updates yet. Click on a tooth to record its condition.
          </p>
        ) : (
          <div className="space-y-2">
            {chartHistory.map((record) => {
              const pda = CONDITION_TO_PDA[record.conditions[0]] || { code: '?', fill: '#94a3b8' };
              return (
                <div
                  key={record.tooth_number}
                  className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2"
                >
                  <div className="flex items-center gap-3">
                    <PDAToothSVG
                      number={record.tooth_number}
                      condition={record.conditions[0] || null}
                      isSelected={false}
                      onClick={() => openToothEditor(record.tooth_number)}
                      size={36}
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Tooth #{record.tooth_number}
                        <span className="ml-2 text-xs font-bold" style={{ color: pda.fill }}>
                          [{pda.code}]
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        {record.conditions.map((c) => TOOTH_CONDITION_LABELS[c] || c).join(', ')}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{formatDateRelative(record.updated_at)}</span>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── PDA 5-Surface Tooth SVG ─────────────────────────────────────
function PDAToothSVG({
  number,
  condition,
  isSelected,
  onClick,
  size = 42,
  isChild,
}: {
  number: number;
  condition: ToothCondition | null;
  isSelected: boolean;
  onClick: () => void;
  size?: number;
  isChild?: boolean;
}) {
  const fillColor = condition ? (CONDITION_TO_PDA[condition]?.fill || '#e2e8f0') : '#fff';
  const isMissing = condition === 'missing' || condition === 'missing_other' || condition === 'congenitally_missing';
  const strokeColor = isSelected ? '#3b82f6' : '#6b7280';
  const strokeWidth = isSelected ? 2.5 : 1.2;

  // 5-surface tooth: Buccal(top), Lingual(bottom), Mesial(left), Distal(right), Occlusal(center)
  // Viewbox 0 0 40 40
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative flex flex-col items-center transition-transform',
        'hover:scale-110 focus:outline-none',
        isSelected && 'scale-110',
      )}
      title={`Tooth #${number}${condition ? ` - ${TOOTH_CONDITION_LABELS[condition] || condition}` : ''}`}
      style={{ width: size, height: size + 14 }}
    >
      {/* Tooth number */}
      <span className={cn(
        'text-[9px] font-bold leading-none',
        isChild ? 'text-gray-400' : 'text-gray-600',
      )}>
        {number}
      </span>
      <svg
        viewBox="0 0 40 40"
        width={size - 6}
        height={size - 6}
        className="mt-px"
      >
        {/* Outer circle */}
        <circle cx="20" cy="20" r="18" fill="white" stroke={strokeColor} strokeWidth={strokeWidth} />

        {isMissing ? (
          /* X mark for missing tooth */
          <>
            <line x1="8" y1="8" x2="32" y2="32" stroke="#94a3b8" strokeWidth="2.5" />
            <line x1="32" y1="8" x2="8" y2="32" stroke="#94a3b8" strokeWidth="2.5" />
          </>
        ) : (
          <>
            {/* Buccal (top) */}
            <path
              d="M 20,2 L 32,12 L 28,16 L 12,16 L 8,12 Z"
              fill={condition ? fillColor : 'white'}
              stroke={strokeColor}
              strokeWidth="0.8"
              className="tooth-surface"
              opacity={condition === 'caries' || condition === 'filled' || !condition ? 1 : 0.5}
            />
            {/* Distal (right) */}
            <path
              d="M 38,20 L 28,32 L 24,28 L 24,12 L 28,8 Z"
              fill={condition ? fillColor : 'white'}
              stroke={strokeColor}
              strokeWidth="0.8"
              className="tooth-surface"
              opacity={0.7}
            />
            {/* Lingual (bottom) */}
            <path
              d="M 20,38 L 8,28 L 12,24 L 28,24 L 32,28 Z"
              fill={condition ? fillColor : 'white'}
              stroke={strokeColor}
              strokeWidth="0.8"
              className="tooth-surface"
              opacity={0.7}
            />
            {/* Mesial (left) */}
            <path
              d="M 2,20 L 12,8 L 16,12 L 16,28 L 12,32 Z"
              fill={condition ? fillColor : 'white'}
              stroke={strokeColor}
              strokeWidth="0.8"
              className="tooth-surface"
              opacity={0.7}
            />
            {/* Occlusal (center) */}
            <rect
              x="12"
              y="12"
              width="16"
              height="16"
              rx="1"
              fill={condition ? fillColor : 'white'}
              stroke={strokeColor}
              strokeWidth="0.8"
              className="tooth-surface"
            />
            {/* PDA code in center */}
            {condition && CONDITION_TO_PDA[condition] && (
              <text
                x="20"
                y="22"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="8"
                fontWeight="bold"
                fill="white"
                stroke="rgba(0,0,0,0.3)"
                strokeWidth="0.3"
              >
                {CONDITION_TO_PDA[condition].code}
              </text>
            )}
          </>
        )}
      </svg>
    </button>
  );
}

// ═════════════════════════════════════════════════════════════════
// TAB 4: TREATMENTS
// ═════════════════════════════════════════════════════════════════
function TreatmentsTab({
  patientId,
  treatments,
  dentists,
  services,
  onRefresh,
}: {
  patientId: number;
  treatments: TreatmentRecord[];
  dentists: Dentist[];
  services: ServiceItem[];
  onRefresh: () => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    date: todayISO(),
    tooth_numbers: '',
    procedure_type: '',
    dentist_id: '',
    fee_charged: '',
    notes: '',
    status: 'planned',
  });

  const getDentistName = (dentistId: number): string => {
    const d = dentists.find((doc) => doc.dentist_id === dentistId);
    return d ? `Dr. ${d.last_name}` : '--';
  };

  const resetForm = () => {
    setForm({
      date: todayISO(),
      tooth_numbers: '',
      procedure_type: '',
      dentist_id: '',
      fee_charged: '',
      notes: '',
      status: 'planned',
    });
  };

  const handleSave = async () => {
    if (!form.procedure_type) {
      showToast('warning', 'Please select a procedure');
      return;
    }
    if (!form.dentist_id) {
      showToast('warning', 'Please select a dentist');
      return;
    }
    setSaving(true);
    try {
      const toothNums = form.tooth_numbers
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !isNaN(n));
      const feePhp = parseFloat(form.fee_charged) || 0;

      const payload: TreatmentRecord = {
        treatment_id: generateId(),
        patient_id: patientId,
        date: form.date,
        tooth_numbers: toothNums,
        procedure_type: form.procedure_type,
        dentist_id: parseInt(form.dentist_id, 10),
        fee_charged_int: pesosToCentavos(feePhp),
        amount_paid_int: 0,
        notes: form.notes.trim(),
        status: form.status as 'planned' | 'in_progress' | 'done',
        next_appointment: null,
        created_at: nowISO(),
      };

      await api.createTreatment(payload);
      showToast('success', 'Treatment recorded');
      setModalOpen(false);
      resetForm();
      onRefresh();
    } catch {
      showToast('error', 'Failed to save treatment');
    } finally {
      setSaving(false);
    }
  };

  // Auto-fill fee when procedure is selected
  const handleProcedureChange = (value: string) => {
    setForm((prev) => ({ ...prev, procedure_type: value }));
    const service = services.find((s) => s.name === value);
    if (service) {
      setForm((prev) => ({
        ...prev,
        procedure_type: value,
        fee_charged: String(service.default_price_int / 100),
      }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-800">
          Treatment Records
        </h3>
        <Button
          size="sm"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setModalOpen(true)}
        >
          Add Treatment
        </Button>
      </div>

      <Card padding={false}>
        {treatments.length === 0 ? (
          <EmptyState
            icon={Stethoscope}
            title="No treatments yet"
            description="Add the patient's first treatment record."
            action={
              <Button
                size="sm"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => setModalOpen(true)}
              >
                Add Treatment
              </Button>
            }
          />
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Tooth #</Th>
                <Th>Procedure</Th>
                <Th>Dentist</Th>
                <Th className="text-right">Charged</Th>
                <Th className="text-right">Paid</Th>
                <Th className="text-right">Balance</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {treatments.map((tx) => {
                const bal = tx.fee_charged_int - tx.amount_paid_int;
                return (
                  <Tr key={tx.treatment_id}>
                    <Td className="whitespace-nowrap">
                      {formatDate(tx.date)}
                    </Td>
                    <Td>
                      {tx.tooth_numbers.length > 0
                        ? tx.tooth_numbers.join(', ')
                        : '--'}
                    </Td>
                    <Td className="font-medium text-gray-800">
                      {tx.procedure_type}
                    </Td>
                    <Td>{getDentistName(tx.dentist_id)}</Td>
                    <Td className="text-right whitespace-nowrap">
                      {formatMoney(tx.fee_charged_int)}
                    </Td>
                    <Td className="text-right whitespace-nowrap">
                      {formatMoney(tx.amount_paid_int)}
                    </Td>
                    <Td className="text-right whitespace-nowrap">
                      <span
                        className={cn(
                          bal > 0 && 'font-semibold text-danger-600',
                        )}
                      >
                        {formatMoney(bal)}
                      </span>
                    </Td>
                    <Td>
                      <Badge
                        variant={
                          tx.status === 'done'
                            ? 'success'
                            : tx.status === 'in_progress'
                              ? 'warning'
                              : 'info'
                        }
                      >
                        {tx.status === 'done'
                          ? 'Done'
                          : tx.status === 'in_progress'
                            ? 'In Progress'
                            : 'Planned'}
                      </Badge>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        )}
      </Card>

      {/* Add Treatment Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Treatment"
        size="lg"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} loading={saving}>
              Save Treatment
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="w-full">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Date *
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, date: e.target.value }))
                }
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <Input
              label="Tooth Numbers"
              placeholder="e.g. 11, 21, 36"
              value={form.tooth_numbers}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  tooth_numbers: e.target.value,
                }))
              }
              helperText="Comma-separated FDI numbers"
            />
          </div>

          <Select
            label="Procedure *"
            placeholder="Select procedure"
            value={form.procedure_type}
            onChange={(e) => handleProcedureChange(e.target.value)}
            options={services.map((s) => ({
              value: s.name,
              label: `${s.name} (${formatMoney(s.default_price_int)})`,
            }))}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Dentist *"
              placeholder="Select dentist"
              value={form.dentist_id}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, dentist_id: e.target.value }))
              }
              options={dentists.map((d) => ({
                value: String(d.dentist_id),
                label: `Dr. ${d.first_name} ${d.last_name}`,
              }))}
            />
            <Input
              label="Fee Charged (PHP)"
              type="number"
              placeholder="0.00"
              value={form.fee_charged}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, fee_charged: e.target.value }))
              }
              helperText="Enter amount in pesos"
            />
          </div>

          <Select
            label="Status"
            value={form.status}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, status: e.target.value }))
            }
            options={[
              { value: 'planned', label: 'Planned' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'done', label: 'Done' },
            ]}
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Treatment notes, observations..."
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// TAB 5: BILLING
// ═════════════════════════════════════════════════════════════════
function BillingTab({
  patientId,
  invoices,
  onRefresh,
}: {
  patientId: number;
  invoices: Invoice[];
  onRefresh: () => void;
}) {
  const [expandedInvoice, setExpandedInvoice] = useState<number | null>(null);
  const [paymentModal, setPaymentModal] = useState<Invoice | null>(null);
  const [paymentSaving, setPaymentSaving] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    method: 'cash',
    reference_no: '',
    date: todayISO(),
  });

  // Create Invoice Modal
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);
  const [invoiceSaving, setInvoiceSaving] = useState(false);
  const [invoiceItems, setInvoiceItems] = useState<{ id: number; description: string; qty: number; unitPrice: string }[]>([
    { id: 1, description: '', qty: 1, unitPrice: '' },
  ]);
  const [invoiceDiscount, setInvoiceDiscount] = useState('');
  const [invoiceDueDate, setInvoiceDueDate] = useState(todayISO());

  const invoiceSubtotal = invoiceItems.reduce((sum, item) => {
    const price = parseFloat(item.unitPrice) || 0;
    return sum + price * item.qty;
  }, 0);
  const invoiceDiscountAmt = parseFloat(invoiceDiscount) || 0;
  const invoiceTotal = Math.max(0, invoiceSubtotal - invoiceDiscountAmt);

  const resetInvoiceForm = () => {
    setInvoiceItems([{ id: 1, description: '', qty: 1, unitPrice: '' }]);
    setInvoiceDiscount('');
    setInvoiceDueDate(todayISO());
  };

  const handleCreateInvoice = async () => {
    // Validate
    const validItems = invoiceItems.filter(
      (it) => it.description.trim() && parseFloat(it.unitPrice) > 0
    );
    if (validItems.length === 0) {
      showToast('warning', 'Add at least one item with description and price');
      return;
    }
    if (invoiceTotal <= 0) {
      showToast('warning', 'Total must be greater than 0');
      return;
    }

    setInvoiceSaving(true);
    try {
      const items: InvoiceItem[] = validItems.map((it) => ({
        item_id: generateId(),
        description: it.description,
        treatment_id: null,
        qty: it.qty,
        unit_price_int: pesosToCentavos(parseFloat(it.unitPrice) || 0),
        line_total_int: pesosToCentavos((parseFloat(it.unitPrice) || 0) * it.qty),
      }));
      const subtotalInt = items.reduce((s, i) => s + i.line_total_int, 0);
      const discountInt = pesosToCentavos(invoiceDiscountAmt);
      const totalInt = subtotalInt - discountInt;

      await api.createInvoice({
        patient_id: patientId,
        items,
        subtotal_int: subtotalInt,
        discount_int: discountInt,
        total_int: totalInt,
        payment_terms: 'due_on_receipt',
        due_date: invoiceDueDate,
      });

      showToast('success', 'Invoice created', 'New invoice has been created.');
      setShowCreateInvoice(false);
      resetInvoiceForm();
      onRefresh();
    } catch {
      showToast('error', 'Failed to create invoice');
    } finally {
      setInvoiceSaving(false);
    }
  };

  const totalBilled = invoices.reduce((sum, inv) => sum + inv.total_int, 0);
  const totalPaid = invoices.reduce(
    (sum, inv) => sum + inv.amount_paid_int,
    0,
  );
  const outstanding = totalBilled - totalPaid;

  const handleRecordPayment = async () => {
    if (!paymentModal) return;
    const amountPhp = parseFloat(paymentForm.amount);
    if (!amountPhp || amountPhp <= 0) {
      showToast('warning', 'Enter a valid payment amount');
      return;
    }
    const remaining = paymentModal.total_int - paymentModal.amount_paid_int;
    if (pesosToCentavos(amountPhp) > remaining) {
      showToast('warning', 'Amount exceeds remaining balance');
      return;
    }
    setPaymentSaving(true);
    try {
      const payload: Payment = {
        payment_id: generateId(),
        invoice_id: paymentModal.invoice_id,
        patient_id: patientId,
        amount_int: pesosToCentavos(amountPhp),
        method: paymentForm.method as Payment['method'],
        reference_no: paymentForm.reference_no.trim(),
        date: paymentForm.date,
        created_at: nowISO(),
      };
      await api.createPayment(payload);
      showToast(
        'success',
        'Bayad recorded (Resibo)',
        `${formatMoney(payload.amount_int)} payment recorded.`,
      );
      setPaymentModal(null);
      setPaymentForm({
        amount: '',
        method: 'cash',
        reference_no: '',
        date: todayISO(),
      });
      onRefresh();
    } catch {
      showToast('error', 'Failed to record payment');
    } finally {
      setPaymentSaving(false);
    }
  };

  const getInvoiceStatusVariant = (
    status: string,
  ): 'default' | 'success' | 'warning' | 'danger' | 'info' => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'partial':
        return 'warning';
      case 'overdue':
        return 'danger';
      case 'sent':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-end">
        <Button onClick={() => setShowCreateInvoice(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Total Billed
          </p>
          <p className="mt-1 text-xl font-bold text-gray-900">
            {formatMoney(totalBilled)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Total Paid
          </p>
          <p className="mt-1 text-xl font-bold text-success-600">
            {formatMoney(totalPaid)}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
            Outstanding Balance
          </p>
          <p
            className={cn(
              'mt-1 text-xl font-bold',
              outstanding > 0 ? 'text-danger-600' : 'text-gray-900',
            )}
          >
            {formatMoney(outstanding)}
          </p>
        </div>
      </div>

      {/* Invoices Table */}
      <Card padding={false} title="Invoices (Resibo)">
        {invoices.length === 0 ? (
          <EmptyState
            icon={Receipt}
            title="No invoices yet"
            description="Invoices will appear here once billing records are created."
          />
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th>Invoice #</Th>
                <Th>Date</Th>
                <Th>Items</Th>
                <Th className="text-right">Total</Th>
                <Th className="text-right">Paid</Th>
                <Th className="text-right">Balance</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {invoices.map((inv) => {
                const isExpanded = expandedInvoice === inv.invoice_id;
                const invBalance = inv.total_int - inv.amount_paid_int;
                return (
                  <InvoiceRows
                    key={inv.invoice_id}
                    invoice={inv}
                    isExpanded={isExpanded}
                    invBalance={invBalance}
                    statusVariant={getInvoiceStatusVariant(inv.status)}
                    onToggleExpand={() =>
                      setExpandedInvoice(isExpanded ? null : inv.invoice_id)
                    }
                    onRecordPayment={() => setPaymentModal(inv)}
                  />
                );
              })}
            </Tbody>
          </Table>
        )}
      </Card>

      {/* Record Payment Modal */}
      <Modal
        isOpen={paymentModal !== null}
        onClose={() => setPaymentModal(null)}
        title={`Record Payment - ${paymentModal?.invoice_no || ''}`}
        size="sm"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setPaymentModal(null)}
              disabled={paymentSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleRecordPayment} loading={paymentSaving}>
              Record Bayad
            </Button>
          </>
        }
      >
        {paymentModal && (
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 px-4 py-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Invoice Total</span>
                <span className="font-medium">
                  {formatMoney(paymentModal.total_int)}
                </span>
              </div>
              <div className="mt-1 flex justify-between text-sm">
                <span className="text-gray-500">Amount Paid</span>
                <span className="font-medium text-success-600">
                  {formatMoney(paymentModal.amount_paid_int)}
                </span>
              </div>
              <div className="mt-1 flex justify-between border-t border-gray-200 pt-1 text-sm">
                <span className="font-medium text-gray-700">Remaining</span>
                <span className="font-bold text-danger-600">
                  {formatMoney(
                    paymentModal.total_int - paymentModal.amount_paid_int,
                  )}
                </span>
              </div>
            </div>

            <Input
              label="Amount (PHP) *"
              type="number"
              placeholder="0.00"
              value={paymentForm.amount}
              onChange={(e) =>
                setPaymentForm((prev) => ({
                  ...prev,
                  amount: e.target.value,
                }))
              }
              helperText={`Max: ${formatMoney(paymentModal.total_int - paymentModal.amount_paid_int)}`}
            />

            <Select
              label="Payment Method"
              value={paymentForm.method}
              onChange={(e) =>
                setPaymentForm((prev) => ({
                  ...prev,
                  method: e.target.value,
                }))
              }
              options={[
                { value: 'cash', label: 'Cash' },
                { value: 'gcash', label: 'GCash' },
                { value: 'bank_transfer', label: 'Bank Transfer' },
                { value: 'card', label: 'Credit/Debit Card' },
              ]}
            />

            <Input
              label="Reference #"
              placeholder="Transaction/reference number"
              value={paymentForm.reference_no}
              onChange={(e) =>
                setPaymentForm((prev) => ({
                  ...prev,
                  reference_no: e.target.value,
                }))
              }
            />

            <div className="w-full">
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Payment Date
              </label>
              <input
                type="date"
                value={paymentForm.date}
                onChange={(e) =>
                  setPaymentForm((prev) => ({
                    ...prev,
                    date: e.target.value,
                  }))
                }
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
        )}
      </Modal>

      {/* Create Invoice Modal */}
      <Modal
        isOpen={showCreateInvoice}
        onClose={() => {
          setShowCreateInvoice(false);
          resetInvoiceForm();
        }}
        title="Create Invoice"
        size="lg"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateInvoice(false);
                resetInvoiceForm();
              }}
              disabled={invoiceSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateInvoice} loading={invoiceSaving}>
              Create Invoice
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Line Items */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Items
            </label>
            <div className="space-y-2">
              {invoiceItems.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-2">
                  <Input
                    placeholder="Description (e.g., Tooth Extraction)"
                    value={item.description}
                    onChange={(e) => {
                      const newItems = [...invoiceItems];
                      newItems[idx].description = e.target.value;
                      setInvoiceItems(newItems);
                    }}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={item.qty}
                    onChange={(e) => {
                      const newItems = [...invoiceItems];
                      newItems[idx].qty = parseInt(e.target.value) || 1;
                      setInvoiceItems(newItems);
                    }}
                    className="w-20"
                  />
                  <Input
                    type="number"
                    placeholder="Price"
                    value={item.unitPrice}
                    onChange={(e) => {
                      const newItems = [...invoiceItems];
                      newItems[idx].unitPrice = e.target.value;
                      setInvoiceItems(newItems);
                    }}
                    className="w-28"
                  />
                  {invoiceItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        setInvoiceItems(invoiceItems.filter((_, i) => i !== idx));
                      }}
                      className="p-2 text-gray-400 hover:text-danger-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setInvoiceItems([
                  ...invoiceItems,
                  { id: Date.now(), description: '', qty: 1, unitPrice: '' },
                ]);
              }}
              className="mt-2"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Item
            </Button>
          </div>

          {/* Discount */}
          <Input
            label="Discount (PHP)"
            type="number"
            placeholder="0.00"
            value={invoiceDiscount}
            onChange={(e) => setInvoiceDiscount(e.target.value)}
          />

          {/* Due Date */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              value={invoiceDueDate}
              onChange={(e) => setInvoiceDueDate(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Summary */}
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium">{formatMoney(pesosToCentavos(invoiceSubtotal))}</span>
            </div>
            {invoiceDiscountAmt > 0 && (
              <div className="flex justify-between text-sm mt-1">
                <span className="text-gray-500">Discount</span>
                <span className="font-medium text-danger-600">
                  -{formatMoney(pesosToCentavos(invoiceDiscountAmt))}
                </span>
              </div>
            )}
            <div className="mt-2 flex justify-between border-t border-gray-200 pt-2">
              <span className="font-semibold text-gray-700">Total</span>
              <span className="font-bold text-lg">{formatMoney(pesosToCentavos(invoiceTotal))}</span>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── Invoice Expandable Row ──────────────────────────────────────
function InvoiceRows({
  invoice: inv,
  isExpanded,
  invBalance,
  statusVariant,
  onToggleExpand,
  onRecordPayment,
}: {
  invoice: Invoice;
  isExpanded: boolean;
  invBalance: number;
  statusVariant: 'default' | 'success' | 'warning' | 'danger' | 'info';
  onToggleExpand: () => void;
  onRecordPayment: () => void;
}) {
  return (
    <>
      <Tr className="cursor-pointer" onClick={onToggleExpand}>
        <Td className="font-medium text-gray-800">
          <div className="flex items-center gap-1.5">
            {isExpanded ? (
              <ChevronUp className="h-3.5 w-3.5 text-gray-400" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            )}
            {inv.invoice_no}
          </div>
        </Td>
        <Td className="whitespace-nowrap">{formatDate(inv.created_at)}</Td>
        <Td className="text-gray-600">
          {inv.items.length} item{inv.items.length !== 1 && 's'}
        </Td>
        <Td className="text-right whitespace-nowrap">
          {formatMoney(inv.total_int)}
        </Td>
        <Td className="text-right whitespace-nowrap">
          {formatMoney(inv.amount_paid_int)}
        </Td>
        <Td className="text-right whitespace-nowrap">
          <span
            className={cn(invBalance > 0 && 'font-semibold text-danger-600')}
          >
            {formatMoney(invBalance)}
          </span>
        </Td>
        <Td>
          <Badge variant={statusVariant}>
            {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
          </Badge>
        </Td>
        <Td>
          {invBalance > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onRecordPayment();
              }}
            >
              Record Payment
            </Button>
          )}
        </Td>
      </Tr>
      {isExpanded && (
        <Tr>
          <Td colSpan={8} className="!bg-gray-50/80 !p-0">
            <div className="space-y-3 px-8 py-4">
              <h4 className="text-sm font-semibold text-gray-700">
                Line Items
              </h4>
              <div className="space-y-1">
                {inv.items.map((item) => (
                  <div
                    key={item.item_id}
                    className="flex items-center justify-between rounded border border-gray-100 bg-white px-3 py-2"
                  >
                    <div>
                      <span className="text-sm text-gray-800">
                        {item.description}
                      </span>
                      <span className="ml-2 text-xs text-gray-400">
                        x{item.qty}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {formatMoney(item.line_total_int)}
                    </span>
                  </div>
                ))}
              </div>
              {inv.discount_int > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Discount</span>
                  <span className="text-success-600">
                    -{formatMoney(inv.discount_int)}
                  </span>
                </div>
              )}
              {inv.payment_terms === 'installment' && (
                <div className="mt-3 rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3">
                  <p className="text-sm font-medium text-yellow-800">
                    Hulugan (Installment Plan)
                  </p>
                  <p className="mt-0.5 text-xs text-yellow-600">
                    This invoice is on an installment payment plan.
                  </p>
                  <div className="mt-2">
                    <div className="mb-1 flex justify-between text-xs text-yellow-700">
                      <span>{formatMoney(inv.amount_paid_int)} paid</span>
                      <span>{formatMoney(inv.total_int)} total</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-yellow-200">
                      <div
                        className="h-2 rounded-full bg-yellow-500 transition-all"
                        style={{
                          width: `${Math.min(100, inv.total_int > 0 ? (inv.amount_paid_int / inv.total_int) * 100 : 0)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Td>
        </Tr>
      )}
    </>
  );
}

// ═════════════════════════════════════════════════════════════════
// TAB 6: PRESCRIPTIONS (Rx)
// ═════════════════════════════════════════════════════════════════

type RxFormItem = { drug_name: string; dosage: string; quantity: number; sig: string };

function PrescriptionsTab({
  patientId,
  patient,
  dentists,
}: {
  patientId: number;
  patient: Patient;
  dentists: Dentist[];
}) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [clinicSettings, setClinicSettings] = useState<ClinicSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);
  const [saving, setSaving] = useState(false);

  // Create form state
  const [rxDate, setRxDate] = useState(todayISO());
  const [rxDentistId, setRxDentistId] = useState('');
  const [rxItems, setRxItems] = useState<RxFormItem[]>([
    { drug_name: '', dosage: '', quantity: 1, sig: '' },
  ]);
  const [rxNotes, setRxNotes] = useState('');

  // Drug search state
  const [drugSearches, setDrugSearches] = useState<Record<number, string>>({});
  const [activeDrugDropdown, setActiveDrugDropdown] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [rxList, drugList, settings] = await Promise.all([
        api.getPatientPrescriptions(patientId),
        api.getDrugs(),
        api.getClinicSettings(),
      ]);
      setPrescriptions(rxList);
      setDrugs(drugList.filter((d) => d.is_active));
      setClinicSettings(settings);
    } catch {
      showToast('error', 'Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getDentistName = (dentistId: number): string => {
    const d = dentists.find((doc) => doc.dentist_id === dentistId);
    return d ? `Dr. ${d.first_name} ${d.last_name}` : '--';
  };

  const getDentist = (dentistId: number): Dentist | undefined => {
    return dentists.find((doc) => doc.dentist_id === dentistId);
  };

  const resetForm = () => {
    setRxDate(todayISO());
    setRxDentistId('');
    setRxItems([{ drug_name: '', dosage: '', quantity: 1, sig: '' }]);
    setRxNotes('');
    setDrugSearches({});
    setActiveDrugDropdown(null);
  };

  const handleAddItem = () => {
    setRxItems((prev) => [...prev, { drug_name: '', dosage: '', quantity: 1, sig: '' }]);
  };

  const handleRemoveItem = (index: number) => {
    if (rxItems.length <= 1) return;
    setRxItems((prev) => prev.filter((_, i) => i !== index));
    setDrugSearches((prev) => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };

  const handleItemChange = (index: number, field: keyof RxFormItem, value: string | number) => {
    setRxItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const handleDrugSelect = (index: number, drug: Drug) => {
    const drugLabel = `${drug.generic_name} ${drug.strength} ${drug.form}`;
    handleItemChange(index, 'drug_name', drugLabel);
    handleItemChange(index, 'dosage', drug.strength);
    setDrugSearches((prev) => ({ ...prev, [index]: '' }));
    setActiveDrugDropdown(null);
  };

  const getFilteredDrugs = (index: number): Drug[] => {
    const search = (drugSearches[index] || '').toLowerCase();
    if (!search) return drugs.slice(0, 20);
    return drugs.filter(
      (d) =>
        d.generic_name.toLowerCase().includes(search) ||
        d.brand_name.toLowerCase().includes(search) ||
        d.form.toLowerCase().includes(search),
    ).slice(0, 20);
  };

  const handleSavePrescription = async () => {
    if (!rxDentistId) {
      showToast('warning', 'Please select a dentist');
      return;
    }
    const validItems = rxItems.filter((item) => item.drug_name.trim());
    if (validItems.length === 0) {
      showToast('warning', 'Please add at least one drug');
      return;
    }
    setSaving(true);
    try {
      await api.createPrescription({
        patient_id: patientId,
        dentist_id: parseInt(rxDentistId, 10),
        date: rxDate,
        items: validItems.map((item) => ({
          drug_name: item.drug_name.trim(),
          dosage: item.dosage.trim(),
          quantity: item.quantity,
          sig: item.sig.trim(),
        })),
        notes: rxNotes.trim(),
      });
      showToast('success', 'Prescription created');
      setShowCreateModal(false);
      resetForm();
      fetchData();
    } catch {
      showToast('error', 'Failed to save prescription');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this prescription?')) return;
    try {
      await api.deletePrescription(id);
      showToast('success', 'Prescription deleted');
      fetchData();
    } catch {
      showToast('error', 'Failed to delete prescription');
    }
  };

  const handlePrint = (rx: Prescription) => {
    setSelectedRx(rx);
    setShowPrintPreview(true);
  };

  // Compute patient info for prescription
  const patientFullName = getFullName(patient);
  const patientAge = computeAge(patient.birthdate);
  const patientAddress = [
    patient.address_street,
    patient.address_barangay,
    patient.address_city,
    patient.address_province,
  ]
    .filter(Boolean)
    .join(', ');
  const patientSex = patient.sex === 'male' ? 'Male' : 'Female';

  const executePrint = (rxOverride?: Prescription) => {
    const rx = rxOverride || selectedRx;
    if (!rx) return;
    const rxDentist = getDentist(rx.dentist_id);
    const dName = rxDentist ? `${rxDentist.first_name} ${rxDentist.last_name}` : 'Unknown';
    const dSpec = rxDentist?.specialization || 'General Dentistry';
    const dLicense = rxDentist?.license_no || '';
    const clinic = clinicSettings;

    const itemsHtml = rx.items.map((item) => `
      <div class="rx-drug">
        <p class="name">${item.drug_name}</p>
        <p class="sig">#${item.quantity}${item.sig ? `<span style="margin-left:6px">Sig: ${item.sig}</span>` : ''}</p>
      </div>
    `).join('');

    const notesHtml = rx.notes
      ? `<div class="rx-note">Note: ${rx.notes}</div>`
      : '';

    const logoSrc = clinic?.logo || '';
    const logoHtml = logoSrc
      ? `<img src="${logoSrc}" style="width:52px;height:52px;object-fit:contain;border-radius:4px;" />`
      : `<div style="width:52px;height:52px;background:#1e3a5f;border-radius:4px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px;font-weight:bold;">${(clinic?.clinic_name || 'DC').split(' ').map((w: string) => w[0]).join('').slice(0, 2)}</div>`;

    const html = `<!DOCTYPE html><html><head>
      <title>Rx - ${patientFullName}</title>
      <style>
        @page { size: 5in 8in; margin: 0; }
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Georgia','Times New Roman',serif; font-size:11px; line-height:1.4; background:#fff; }
        .rx-page {
          width:5in; height:8in; margin:0 auto; padding:10px 14px;
          display:flex; flex-direction:column; overflow:hidden;
          page-break-inside:avoid;
        }
        .rx-header { display:flex; align-items:center; gap:10px; margin-bottom:8px; padding-bottom:8px; border-bottom:2px solid #1e3a5f; }
        .rx-logo { flex-shrink:0; }
        .rx-header-info { flex:1; text-align:right; }
        .rx-header-info h2 { font-size:14px; font-weight:bold; letter-spacing:1px; text-transform:uppercase; margin:0; color:#1e3a5f; }
        .rx-header-info .address { font-size:8px; color:#555; margin:2px 0 0; }
        .rx-header-info .contact { font-size:8px; color:#555; margin:1px 0 0; }
        .rx-header-info .dentist { font-size:11px; font-weight:bold; margin:4px 0 0; }
        .rx-header-info .spec { font-size:9px; color:#555; margin:1px 0 0; }
        .rx-row { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px; }
        .rx-symbol { font-size:36px; font-weight:bold; line-height:1; font-family:'Georgia',serif; }
        .rx-date { text-align:right; font-size:10px; padding-top:6px; }
        .rx-underline { border-bottom:1px solid #333; padding-bottom:1px; display:inline-block; }
        .rx-patient { font-size:10px; margin-bottom:8px; line-height:1.8; }
        .rx-patient .row { display:flex; gap:6px; }
        .rx-patient .field { flex:1; }
        .rx-body { flex:1; padding-left:6px; min-height:100px; }
        .rx-drug { margin-bottom:8px; }
        .rx-drug .name { font-size:12px; font-weight:bold; margin:0; }
        .rx-drug .sig { font-size:10px; margin:1px 0 0 10px; color:#333; }
        .rx-note { margin-top:8px; font-size:9px; color:#555; font-style:italic; }
        .rx-signature { text-align:center; margin-top:auto; padding-top:10px; }
        .rx-signature .line { border-bottom:1px solid #333; min-width:180px; display:inline-block; margin-bottom:2px; padding-bottom:2px; font-size:11px; font-weight:bold; }
        .rx-signature .license { font-size:9px; color:#555; margin:1px 0 0; }
        .rx-footer { margin-top:8px; border-top:1px solid #ccc; padding-top:3px; text-align:center; font-size:7.5px; color:#888; }
        .rx-footer p { margin:1px 0; }
        .rx-toolbar {
          position:fixed; top:0; left:0; right:0; z-index:100;
          background:#1e3a5f; color:#fff; padding:10px 20px;
          display:flex; align-items:center; justify-content:space-between;
          font-family:system-ui,-apple-system,sans-serif; font-size:14px;
          box-shadow:0 2px 8px rgba(0,0,0,0.15);
        }
        .rx-toolbar button {
          padding:8px 20px; border:none; border-radius:6px; cursor:pointer;
          font-size:14px; font-weight:600; margin-left:8px;
        }
        .rx-toolbar .btn-print { background:#fff; color:#1e3a5f; }
        .rx-toolbar .btn-print:hover { background:#e2e8f0; }
        .rx-toolbar .btn-close { background:transparent; color:#fff; border:1px solid rgba(255,255,255,0.3); }
        .rx-toolbar .btn-close:hover { background:rgba(255,255,255,0.1); }
        .rx-content { margin-top:60px; padding:20px; display:flex; justify-content:center; }
        @media print {
          .rx-toolbar { display:none !important; }
          .rx-content { margin-top:0; padding:0; }
        }
      </style>
    </head><body>
      <div class="rx-toolbar">
        <span>Prescription - ${patientFullName}</span>
        <div>
          <button class="btn-close" onclick="window.close()">Close</button>
          <button class="btn-print" onclick="window.print()">Print</button>
        </div>
      </div>
      <div class="rx-content">
        <div class="rx-page">
          <div class="rx-header">
            <div class="rx-logo">${logoHtml}</div>
            <div class="rx-header-info">
              <h2>${clinic?.clinic_name || 'Dental Clinic'}</h2>
              ${clinic?.address ? `<p class="address">${clinic.address}</p>` : ''}
              <p class="contact">${clinic?.phone || ''}${clinic?.phone && clinic?.email ? ' | ' : ''}${clinic?.email || ''}</p>
              <p class="dentist">${dName}, D.M.D.</p>
              <p class="spec">${dSpec}</p>
            </div>
          </div>
          <div class="rx-row">
            <span class="rx-symbol">&#8478;</span>
            <div class="rx-date">
              Date: <span class="rx-underline" style="min-width:90px;text-align:center">${formatDate(rx.date)}</span>
            </div>
          </div>
          <div class="rx-patient">
            <div class="row">
              <div class="field">Name : <span class="rx-underline" style="min-width:160px">${patientFullName}</span></div>
              <div>Age: <span class="rx-underline" style="min-width:30px;text-align:center">${patientAge}</span></div>
            </div>
            <div class="row">
              <div class="field">Address : <span class="rx-underline" style="min-width:160px">${patientAddress || '--'}</span></div>
              <div>Gender: <span class="rx-underline" style="min-width:45px;text-align:center">${patientSex}</span></div>
            </div>
          </div>
          <div class="rx-body">${itemsHtml}${notesHtml}</div>
          <div class="rx-signature">
            <div class="line">${dName}, D.M.D.</div>
            <p class="license">License No.: ${dLicense || '___________'}</p>
          </div>
          <div class="rx-footer">
            <p>This prescription is valid for one (1) year from date of issue.</p>
          </div>
        </div>
      </div>
    </body></html>`;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showToast('error', 'Pop-up blocked. Please allow pop-ups for this site.');
      return;
    }
    printWindow.document.write(html);
    printWindow.document.close();
  };

  // ─── Reusable Rx Pad renderer (modal preview) ───────────────
  const renderRxPad = (rx: Prescription) => {
    const rxDentist = getDentist(rx.dentist_id);
    const dName = rxDentist ? `${rxDentist.first_name} ${rxDentist.last_name}` : 'Unknown';
    const dSpec = rxDentist?.specialization || 'General Dentistry';
    const dLicense = rxDentist?.license_no || '';
    const clinic = clinicSettings;
    const ul = { borderBottom: '1.5px solid #333', paddingBottom: '2px', display: 'inline-block' as const };

    const clinicInitials = (clinic?.clinic_name || 'DC').split(' ').map(w => w[0]).join('').slice(0, 2);

    return (
      <div style={{
        width: '100%',
        aspectRatio: '5 / 8',
        padding: '20px 24px',
        fontFamily: "'Georgia', 'Times New Roman', serif",
        backgroundColor: '#fff',
        fontSize: '13px',
        lineHeight: 1.5,
        display: 'flex',
        flexDirection: 'column' as const,
        border: '1px solid #e5e7eb',
        borderRadius: '4px',
      }}>
        {/* Header: Logo left + Info right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px', paddingBottom: '10px', borderBottom: '2.5px solid #1e3a5f' }}>
          <div style={{ flexShrink: 0 }}>
            {clinic?.logo ? (
              <img src={clinic.logo} alt="Logo" style={{ width: '56px', height: '56px', objectFit: 'contain', borderRadius: '6px' }} />
            ) : (
              <div style={{ width: '56px', height: '56px', background: '#1e3a5f', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '20px', fontWeight: 'bold' }}>
                {clinicInitials}
              </div>
            )}
          </div>
          <div style={{ flex: 1, textAlign: 'right' as const }}>
            <h2 style={{ fontSize: '16px', fontWeight: 'bold', margin: 0, letterSpacing: '1.5px', textTransform: 'uppercase' as const, color: '#1e3a5f' }}>
              {clinic?.clinic_name || 'Dental Clinic'}
            </h2>
            {clinic?.address && <p style={{ fontSize: '10px', color: '#555', margin: '2px 0 0' }}>{clinic.address}</p>}
            <p style={{ fontSize: '10px', color: '#555', margin: '1px 0 0' }}>
              {clinic?.phone || ''}{clinic?.phone && clinic?.email ? ' | ' : ''}{clinic?.email || ''}
            </p>
            <p style={{ fontSize: '13px', fontWeight: 'bold', margin: '5px 0 0' }}>{dName}, D.M.D.</p>
            <p style={{ fontSize: '11px', color: '#555', margin: '1px 0 0' }}>{dSpec}</p>
          </div>
        </div>

        {/* Rx + Date */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
          <span style={{ fontSize: '42px', fontWeight: 'bold', lineHeight: 1, fontFamily: "'Georgia', serif" }}>&#8478;</span>
          <div style={{ textAlign: 'right', fontSize: '13px', paddingTop: '8px' }}>
            Date: <span style={{ ...ul, minWidth: '110px', textAlign: 'center' }}>{formatDate(rx.date)}</span>
          </div>
        </div>

        {/* Patient */}
        <div style={{ fontSize: '13px', marginBottom: '14px', lineHeight: 2 }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>Name : <span style={{ ...ul, minWidth: '180px' }}>{patientFullName}</span></div>
            <div>Age: <span style={{ ...ul, minWidth: '36px', textAlign: 'center' }}>{patientAge}</span></div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>Address : <span style={{ ...ul, minWidth: '180px' }}>{patientAddress || '--'}</span></div>
            <div>Gender: <span style={{ ...ul, minWidth: '55px', textAlign: 'center' }}>{patientSex}</span></div>
          </div>
        </div>

        {/* Drugs */}
        <div style={{ flex: 1, paddingLeft: '8px', minHeight: '80px' }}>
          {rx.items.map((item, idx) => (
            <div key={idx} style={{ marginBottom: '10px' }}>
              <p style={{ fontSize: '14px', fontWeight: 'bold', margin: 0 }}>{item.drug_name}</p>
              <p style={{ fontSize: '12px', margin: '2px 0 0 12px', color: '#333' }}>
                #{item.quantity}{item.sig && <span style={{ marginLeft: '8px' }}>Sig: {item.sig}</span>}
              </p>
            </div>
          ))}
          {rx.notes && <div style={{ marginTop: '10px', fontSize: '11px', color: '#555', fontStyle: 'italic' }}>Note: {rx.notes}</div>}
        </div>

        {/* Signature */}
        <div style={{ textAlign: 'center', marginTop: 'auto', paddingTop: '14px' }}>
          <div style={{ borderBottom: '1.5px solid #333', minWidth: '200px', display: 'inline-block', marginBottom: '3px', paddingBottom: '3px', fontSize: '14px', fontWeight: 'bold' }}>
            {dName}, D.M.D.
          </div>
          <p style={{ fontSize: '11px', color: '#555', margin: '2px 0 0' }}>License No.: {dLicense || '___________'}</p>
        </div>

        {/* Footer */}
        <div style={{ marginTop: '10px', borderTop: '1px solid #ccc', paddingTop: '5px', textAlign: 'center', fontSize: '10px', color: '#888' }}>
          <p style={{ margin: '1px 0' }}>This prescription is valid for one (1) year from date of issue.</p>
        </div>
      </div>
    );
  };

  if (loading) {
    return <LoadingSpinner text="Loading prescriptions..." />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-800">Prescriptions</h3>
        <Button
          size="sm"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setShowCreateModal(true)}
        >
          New Prescription
        </Button>
      </div>

      {prescriptions.length === 0 ? (
        <Card>
          <EmptyState
            icon={FileText}
            title="No prescriptions yet"
            description="Create a prescription for this patient."
            action={
              <Button
                size="sm"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => setShowCreateModal(true)}
              >
                New Prescription
              </Button>
            }
          />
        </Card>
      ) : (
        <Card>
          <Table>
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Dentist</Th>
                <Th>Items</Th>
                <Th>Notes</Th>
                <Th className="text-right">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {prescriptions.map((rx) => (
                <Tr key={rx.prescription_id}>
                  <Td className="whitespace-nowrap">{formatDate(rx.date)}</Td>
                  <Td className="whitespace-nowrap">{getDentistName(rx.dentist_id)}</Td>
                  <Td>
                    <Badge variant="info">{rx.items.length} item{rx.items.length !== 1 ? 's' : ''}</Badge>
                    <div className="mt-1 text-xs text-gray-500">
                      {rx.items.map((item) => item.drug_name).join(', ')}
                    </div>
                  </Td>
                  <Td className="max-w-[200px] truncate text-xs text-gray-500">{rx.notes || '--'}</Td>
                  <Td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePrint(rx)}
                        title="View Prescription"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => executePrint(rx)}
                        title="Print Prescription"
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(rx.prescription_id)}
                        title="Delete Prescription"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Card>
      )}

      {/* ── Create Prescription Modal ───────────────────────────── */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        title="New Prescription"
        size="lg"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateModal(false);
                resetForm();
              }}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button onClick={handleSavePrescription} loading={saving}>
              Save Prescription
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          {/* Date & Dentist */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Date *</label>
              <input
                type="date"
                value={rxDate}
                onChange={(e) => setRxDate(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <Select
              label="Dentist *"
              value={rxDentistId}
              onChange={(e) => setRxDentistId(e.target.value)}
              options={dentists
                .filter((d) => d.is_active)
                .map((d) => ({
                  value: String(d.dentist_id),
                  label: `Dr. ${d.first_name} ${d.last_name}`,
                }))}
              placeholder="Select dentist"
            />
          </div>

          {/* Drug Items */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Prescription Items *</label>
              <Button variant="ghost" size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={handleAddItem}>
                Add Item
              </Button>
            </div>
            <div className="space-y-3">
              {rxItems.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-gray-50/50 p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-500">Item {index + 1}</span>
                    {rxItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="rounded p-0.5 text-gray-400 hover:bg-gray-200 hover:text-red-500"
                        title="Remove item"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {/* Drug Name with search */}
                    <div className="relative sm:col-span-2">
                      <label className="mb-1 block text-xs font-medium text-gray-600">Drug Name</label>
                      <input
                        type="text"
                        value={activeDrugDropdown === index ? (drugSearches[index] ?? item.drug_name) : item.drug_name}
                        onChange={(e) => {
                          setDrugSearches((prev) => ({ ...prev, [index]: e.target.value }));
                          handleItemChange(index, 'drug_name', e.target.value);
                          setActiveDrugDropdown(index);
                        }}
                        onFocus={() => {
                          setActiveDrugDropdown(index);
                          setDrugSearches((prev) => ({ ...prev, [index]: item.drug_name }));
                        }}
                        onBlur={() => {
                          // Delay to allow click on dropdown
                          setTimeout(() => setActiveDrugDropdown(null), 200);
                        }}
                        placeholder="Search drug catalog..."
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      {activeDrugDropdown === index && getFilteredDrugs(index).length > 0 && (
                        <div className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                          {getFilteredDrugs(index).map((drug) => (
                            <button
                              key={drug.drug_id}
                              type="button"
                              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-primary-50"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleDrugSelect(index, drug);
                              }}
                            >
                              <span className="font-medium text-gray-800">
                                {drug.generic_name} {drug.strength} {drug.form}
                              </span>
                              {drug.brand_name && (
                                <span className="ml-2 text-xs text-gray-400">({drug.brand_name})</span>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">Quantity</label>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity === 0 ? '' : item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value === '' ? 0 : parseInt(e.target.value, 10))}
                        onBlur={(e) => { if (!e.target.value || parseInt(e.target.value, 10) < 1) handleItemChange(index, 'quantity', 1); }}
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-600">
                        Sig (Directions)
                      </label>
                      <input
                        type="text"
                        value={item.sig}
                        onChange={(e) => handleItemChange(index, 'sig', e.target.value)}
                        placeholder="e.g. 1 cap 3x a day for 7 days"
                        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              rows={2}
              value={rxNotes}
              onChange={(e) => setRxNotes(e.target.value)}
              placeholder="Additional instructions or notes..."
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </Modal>

      {/* ── Print Preview Modal ─────────────────────────────────── */}
      <Modal
        isOpen={showPrintPreview}
        onClose={() => {
          setShowPrintPreview(false);
          setSelectedRx(null);
        }}
        title="Prescription Preview"
        size="2xl"
        footer={
          <div className="no-print flex w-full items-center justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setShowPrintPreview(false);
                setSelectedRx(null);
              }}
            >
              Close
            </Button>
            <Button leftIcon={<Printer className="h-4 w-4" />} onClick={executePrint}>
              Print
            </Button>
          </div>
        }
      >
        {selectedRx && renderRxPad(selectedRx)}
      </Modal>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════
// TAB 7: FILES
// ═════════════════════════════════════════════════════════════════
function FilesTab({ patientId }: { patientId: number }) {
  const [files, setFiles] = useState<FileAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    file: null as File | null,
    preview: '',
    category: 'photo' as FileAsset['category'],
    notes: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getPatientFiles(patientId);
      setFiles(data);
    } catch {
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    let preview = '';
    if (file.type.startsWith('image/')) {
      preview = URL.createObjectURL(file);
    }
    setUploadForm((prev) => ({ ...prev, file, preview }));
  };

  const handleUpload = async () => {
    if (!uploadForm.file) {
      showToast('warning', 'Please select a file');
      return;
    }
    setUploading(true);
    try {
      const reader = new FileReader();
      const fileUrl = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(uploadForm.file!);
      });

      const payload: FileAsset = {
        file_id: generateId(),
        patient_id: patientId,
        file_name: uploadForm.file.name,
        file_type: uploadForm.file.type,
        file_url: fileUrl,
        category: uploadForm.category,
        uploaded_at: nowISO(),
        notes: uploadForm.notes.trim(),
      };

      await api.uploadFile(payload);
      showToast('success', 'File uploaded', uploadForm.file.name);
      setUploadModalOpen(false);
      setUploadForm({ file: null, preview: '', category: 'photo', notes: '' });
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchFiles();
    } catch {
      showToast('error', 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case 'xray':
        return 'X-Ray';
      case 'photo':
        return 'Photo';
      case 'document':
        return 'Document';
      default:
        return 'Other';
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading files..." />;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-800">
          Patient Files
        </h3>
        <Button
          size="sm"
          leftIcon={<Upload className="h-4 w-4" />}
          onClick={() => setUploadModalOpen(true)}
        >
          Upload File
        </Button>
      </div>

      {files.length === 0 ? (
        <Card>
          <EmptyState
            icon={FolderOpen}
            title="No files uploaded yet"
            description="Upload X-rays, photos, documents, or other files for this patient."
            action={
              <Button
                size="sm"
                leftIcon={<Upload className="h-4 w-4" />}
                onClick={() => setUploadModalOpen(true)}
              >
                Upload File
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {files.map((file) => (
            <div
              key={file.file_id}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Thumbnail */}
              <div className="flex h-36 items-center justify-center overflow-hidden bg-gray-50">
                {file.file_type.startsWith('image/') ? (
                  <img
                    src={file.file_url}
                    alt={file.file_name}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : file.category === 'xray' ? (
                  <FileImage className="h-8 w-8 text-blue-400" />
                ) : file.category === 'document' ? (
                  <FileText className="h-8 w-8 text-orange-400" />
                ) : (
                  <File className="h-8 w-8 text-gray-400" />
                )}
              </div>
              {/* Info */}
              <div className="p-3">
                <p
                  className="truncate text-sm font-medium text-gray-800"
                  title={file.file_name}
                >
                  {file.file_name}
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <Badge
                    variant={
                      file.category === 'xray'
                        ? 'info'
                        : file.category === 'photo'
                          ? 'success'
                          : file.category === 'document'
                            ? 'warning'
                            : 'default'
                    }
                  >
                    {getCategoryLabel(file.category)}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    {formatDate(file.uploaded_at)}
                  </span>
                </div>
                {file.notes && (
                  <p
                    className="mt-1.5 truncate text-xs text-gray-500"
                    title={file.notes}
                  >
                    {file.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        title="Upload File"
        size="md"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => setUploadModalOpen(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button onClick={handleUpload} loading={uploading}>
              Upload
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {/* File Input Area */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Select File *
            </label>
            {uploadForm.file ? (
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                {uploadForm.preview ? (
                  <img
                    src={uploadForm.preview}
                    alt="Preview"
                    className="h-12 w-12 rounded object-cover"
                  />
                ) : (
                  <File className="h-8 w-8 text-gray-400" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-800">
                    {uploadForm.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(uploadForm.file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (uploadForm.preview) URL.revokeObjectURL(uploadForm.preview);
                    setUploadForm((prev) => ({
                      ...prev,
                      file: null,
                      preview: '',
                    }));
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-8 transition-colors hover:border-primary-400 hover:bg-primary-50"
              >
                <Upload className="mb-2 h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-600">Click to select a file</p>
                <p className="mt-0.5 text-xs text-gray-400">
                  Images, PDFs, documents
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Image Preview */}
          {uploadForm.preview && (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <img
                src={uploadForm.preview}
                alt="Preview"
                className="max-h-48 w-full bg-gray-100 object-contain"
              />
            </div>
          )}

          <Select
            label="Category"
            value={uploadForm.category}
            onChange={(e) =>
              setUploadForm((prev) => ({
                ...prev,
                category: e.target.value as FileAsset['category'],
              }))
            }
            options={[
              { value: 'xray', label: 'X-Ray' },
              { value: 'photo', label: 'Photo' },
              { value: 'document', label: 'Document' },
              { value: 'other', label: 'Other' },
            ]}
          />

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              rows={2}
              value={uploadForm.notes}
              onChange={(e) =>
                setUploadForm((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Optional description..."
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

// ─── Shared Loading Spinner ──────────────────────────────────────
function LoadingSpinner({ text }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-200 border-t-primary-600" />
      {text && <span className="ml-2 text-sm text-gray-500">{text}</span>}
    </div>
  );
}
