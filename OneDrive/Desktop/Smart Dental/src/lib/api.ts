import type {
  Patient,
  Dentist,
  MedicalHistory,
  ConsentForm,
  ToothRecord,
  DentalChart,
  TreatmentRecord,
  Invoice,
  InstallmentPlan,
  InstallmentScheduleItem,
  Payment,
  Appointment,
  FileAsset,
  ServiceItem,
  PaymentTermOption,
  ClinicSettings,
  Notification,
  Drug,
  Prescription,
} from '@/types/models';

import { delay, generateId, generateInvoiceNo, nowISO } from '@/lib/utils';

import {
  patients as seedPatients,
  dentists as seedDentists,
  treatments as seedTreatments,
  invoices as seedInvoices,
  installmentPlans as seedInstallmentPlans,
  payments as seedPayments,
  appointments as seedAppointments,
  medicalHistories as seedMedicalHistories,
  consentForms as seedConsentForms,
  dentalCharts as seedDentalCharts,
  fileAssets as seedFileAssets,
  notifications as seedNotifications,
  clinicSettings as seedClinicSettings,
  services as seedServices,
  paymentTermOptions as seedPaymentTermOptions,
  drugs as seedDrugs,
  prescriptions as seedPrescriptions,
} from '@/data/seed';

// ════════════════════════════════════════════════════════════════════
//  Backward-compatible type exports (used by GlobalSearch & TopBar)
// ════════════════════════════════════════════════════════════════════

export type SearchResultItem = {
  id: number;
  type: 'patient' | 'invoice' | 'appointment';
  title: string;
  subtitle: string;
  url: string;
};

export type SearchResults = {
  patients: SearchResultItem[];
  invoices: SearchResultItem[];
  appointments: SearchResultItem[];
};

export type NotificationItem = {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  created_at: string;
};

// ════════════════════════════════════════════════════════════════════
//  In-Memory Data Store (mutable deep copies of seed data)
// ════════════════════════════════════════════════════════════════════

let _patients: Patient[] = structuredClone(seedPatients);
let _dentists: Dentist[] = structuredClone(seedDentists);
let _treatments: TreatmentRecord[] = structuredClone(seedTreatments);
let _invoices: Invoice[] = structuredClone(seedInvoices);
let _installmentPlans: InstallmentPlan[] = structuredClone(seedInstallmentPlans);
let _payments: Payment[] = structuredClone(seedPayments);
let _appointments: Appointment[] = structuredClone(seedAppointments);
let _medicalHistories: MedicalHistory[] = structuredClone(seedMedicalHistories);
let _consentForms: ConsentForm[] = structuredClone(seedConsentForms);
let _dentalCharts: DentalChart[] = structuredClone(seedDentalCharts);
let _fileAssets: FileAsset[] = structuredClone(seedFileAssets);
let _notifications: Notification[] = structuredClone(seedNotifications);
let _clinicSettings: ClinicSettings = structuredClone(seedClinicSettings);
let _services: ServiceItem[] = structuredClone(seedServices);
let _paymentTerms: PaymentTermOption[] = structuredClone(seedPaymentTermOptions);
let _drugs: Drug[] = structuredClone(seedDrugs);
let _prescriptions: Prescription[] = structuredClone(seedPrescriptions);

// ────────────────────────────────────────────────────────────────────
//  Helpers
// ────────────────────────────────────────────────────────────────────

/** Random delay between min and max ms (inclusive). */
function randomDelay(min = 200, max = 400): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Deep-clone so callers never receive a direct store reference. */
function clone<T>(value: T): T {
  return structuredClone(value);
}

// ════════════════════════════════════════════════════════════════════
//  PATIENTS
// ════════════════════════════════════════════════════════════════════

export async function getPatients(): Promise<Patient[]> {
  await delay(randomDelay());
  return clone(_patients);
}

export async function getPatient(id: number): Promise<Patient | undefined> {
  await delay(randomDelay());
  const patient = _patients.find((p) => p.patient_id === id);
  return patient ? clone(patient) : undefined;
}

export async function createPatient(
  data: Omit<Patient, 'patient_id' | 'created_at' | 'updated_at'>,
): Promise<Patient> {
  await delay(randomDelay());
  const now = nowISO();
  const newPatient: Patient = {
    ...data,
    patient_id: generateId(),
    created_at: now,
    updated_at: now,
  };
  _patients.push(newPatient);
  return clone(newPatient);
}

export async function updatePatient(
  id: number,
  data: Partial<Patient>,
): Promise<Patient> {
  await delay(randomDelay());
  const idx = _patients.findIndex((p) => p.patient_id === id);
  if (idx === -1) throw new Error(`Patient with id ${id} not found`);
  _patients[idx] = { ..._patients[idx], ...data, updated_at: nowISO() };
  return clone(_patients[idx]);
}

// ════════════════════════════════════════════════════════════════════
//  MEDICAL HISTORY
// ════════════════════════════════════════════════════════════════════

export async function getMedicalHistory(
  patientId: number,
): Promise<MedicalHistory | undefined> {
  await delay(randomDelay());
  const record = _medicalHistories.find((m) => m.patient_id === patientId);
  return record ? clone(record) : undefined;
}

export async function saveMedicalHistory(
  data: MedicalHistory,
): Promise<MedicalHistory> {
  await delay(randomDelay());
  const idx = _medicalHistories.findIndex(
    (m) => m.patient_id === data.patient_id,
  );
  const updated: MedicalHistory = { ...data, updated_at: nowISO() };
  if (idx === -1) {
    _medicalHistories.push(updated);
  } else {
    _medicalHistories[idx] = updated;
  }
  return clone(updated);
}

// ════════════════════════════════════════════════════════════════════
//  CONSENT FORM
// ════════════════════════════════════════════════════════════════════

export async function getConsentForm(
  patientId: number,
): Promise<ConsentForm | undefined> {
  await delay(randomDelay());
  const record = _consentForms.find((c) => c.patient_id === patientId);
  return record ? clone(record) : undefined;
}

export async function saveConsentForm(
  data: ConsentForm,
): Promise<ConsentForm> {
  await delay(randomDelay());
  const idx = _consentForms.findIndex(
    (c) => c.patient_id === data.patient_id,
  );
  if (idx === -1) {
    const newConsent: ConsentForm = { ...data, consent_id: generateId() };
    _consentForms.push(newConsent);
    return clone(newConsent);
  }
  _consentForms[idx] = { ..._consentForms[idx], ...data };
  return clone(_consentForms[idx]);
}

// ════════════════════════════════════════════════════════════════════
//  DENTAL CHART
// ════════════════════════════════════════════════════════════════════

export async function getDentalChart(
  patientId: number,
): Promise<DentalChart | undefined> {
  await delay(randomDelay());
  const chart = _dentalCharts.find((c) => c.patient_id === patientId);
  return chart ? clone(chart) : undefined;
}

export async function updateToothRecord(
  patientId: number,
  tooth: ToothRecord,
): Promise<DentalChart> {
  await delay(randomDelay());
  let chart = _dentalCharts.find((c) => c.patient_id === patientId);

  if (!chart) {
    chart = { patient_id: patientId, teeth: [], updated_at: nowISO() };
    _dentalCharts.push(chart);
  }

  const toothIdx = chart.teeth.findIndex(
    (t) => t.tooth_number === tooth.tooth_number,
  );
  const updatedTooth: ToothRecord = { ...tooth, updated_at: nowISO() };

  if (toothIdx === -1) {
    chart.teeth.push(updatedTooth);
  } else {
    chart.teeth[toothIdx] = updatedTooth;
  }

  chart.updated_at = nowISO();
  return clone(chart);
}

// ════════════════════════════════════════════════════════════════════
//  TREATMENTS
// ════════════════════════════════════════════════════════════════════

export async function getPatientTreatments(
  patientId: number,
): Promise<TreatmentRecord[]> {
  await delay(randomDelay());
  return clone(_treatments.filter((t) => t.patient_id === patientId));
}

export async function createTreatment(
  data: Omit<TreatmentRecord, 'treatment_id' | 'created_at'>,
): Promise<TreatmentRecord> {
  await delay(randomDelay());
  const newTreatment: TreatmentRecord = {
    ...data,
    treatment_id: generateId(),
    created_at: nowISO(),
  };
  _treatments.push(newTreatment);
  return clone(newTreatment);
}

export async function updateTreatment(
  id: number,
  data: Partial<TreatmentRecord>,
): Promise<TreatmentRecord> {
  await delay(randomDelay());
  const idx = _treatments.findIndex((t) => t.treatment_id === id);
  if (idx === -1) throw new Error(`Treatment with id ${id} not found`);
  _treatments[idx] = { ..._treatments[idx], ...data };
  return clone(_treatments[idx]);
}

// ════════════════════════════════════════════════════════════════════
//  INVOICES
// ════════════════════════════════════════════════════════════════════

export async function getInvoices(): Promise<Invoice[]> {
  await delay(randomDelay());
  return clone(_invoices);
}

export async function getPatientInvoices(
  patientId: number,
): Promise<Invoice[]> {
  await delay(randomDelay());
  return clone(_invoices.filter((inv) => inv.patient_id === patientId));
}

export async function createInvoice(
  data: Omit<
    Invoice,
    | 'invoice_id'
    | 'invoice_no'
    | 'created_at'
    | 'amount_paid_int'
    | 'balance_int'
    | 'status'
  >,
): Promise<Invoice> {
  await delay(randomDelay());
  const newInvoice: Invoice = {
    ...data,
    invoice_id: generateId(),
    invoice_no: generateInvoiceNo(),
    amount_paid_int: 0,
    balance_int: data.total_int,
    status: 'sent',
    created_at: nowISO(),
  };
  _invoices.push(newInvoice);
  return clone(newInvoice);
}

// ════════════════════════════════════════════════════════════════════
//  INSTALLMENT PLANS
// ════════════════════════════════════════════════════════════════════

export async function getInstallmentPlan(
  invoiceId: number,
): Promise<InstallmentPlan | undefined> {
  await delay(randomDelay());
  const plan = _installmentPlans.find((p) => p.invoice_id === invoiceId);
  return plan ? clone(plan) : undefined;
}

export async function createInstallmentPlan(
  data: Omit<InstallmentPlan, 'plan_id' | 'schedule'> & {
    schedule?: InstallmentScheduleItem[];
  },
): Promise<InstallmentPlan> {
  await delay(randomDelay());

  // Auto-generate schedule when not provided
  let schedule: InstallmentScheduleItem[] = [];
  if (data.schedule && data.schedule.length > 0) {
    schedule = data.schedule;
  } else {
    const balanceAfterDown = data.total_amount_int - data.downpayment_int;
    const monthlyAmount = Math.floor(balanceAfterDown / data.months);
    const remainder = balanceAfterDown - monthlyAmount * data.months;

    for (let i = 0; i < data.months; i++) {
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + i + 1);
      dueDate.setDate(data.due_day_of_month);

      const isLast = i === data.months - 1;
      schedule.push({
        schedule_id: generateId(),
        due_date: dueDate.toISOString().split('T')[0],
        amount_int: isLast ? monthlyAmount + remainder : monthlyAmount,
        status: 'pending',
        paid_date: null,
      });
    }
  }

  const newPlan: InstallmentPlan = {
    ...data,
    plan_id: generateId(),
    schedule,
  };
  _installmentPlans.push(newPlan);
  return clone(newPlan);
}

// ════════════════════════════════════════════════════════════════════
//  PAYMENTS
// ════════════════════════════════════════════════════════════════════

export async function getInvoicePayments(
  invoiceId: number,
): Promise<Payment[]> {
  await delay(randomDelay());
  return clone(_payments.filter((p) => p.invoice_id === invoiceId));
}

export async function getPatientPayments(
  patientId: number,
): Promise<Payment[]> {
  await delay(randomDelay());
  return clone(_payments.filter((p) => p.patient_id === patientId));
}

export async function createPayment(
  data: Omit<Payment, 'payment_id' | 'created_at'>,
): Promise<Payment> {
  await delay(randomDelay());

  const newPayment: Payment = {
    ...data,
    payment_id: generateId(),
    created_at: nowISO(),
  };
  _payments.push(newPayment);

  // Update the corresponding invoice balance and status
  const invoiceIdx = _invoices.findIndex(
    (inv) => inv.invoice_id === data.invoice_id,
  );
  if (invoiceIdx !== -1) {
    const invoice = _invoices[invoiceIdx];
    const newAmountPaid = invoice.amount_paid_int + data.amount_int;
    const newBalance = invoice.total_int - newAmountPaid;

    let newStatus = invoice.status;
    if (newBalance <= 0) {
      newStatus = 'paid';
    } else if (newAmountPaid > 0) {
      newStatus = 'partial';
    }

    _invoices[invoiceIdx] = {
      ...invoice,
      amount_paid_int: newAmountPaid,
      balance_int: Math.max(0, newBalance),
      status: newStatus,
    };
  }

  return clone(newPayment);
}

// ════════════════════════════════════════════════════════════════════
//  APPOINTMENTS
// ════════════════════════════════════════════════════════════════════

export async function getAppointments(): Promise<Appointment[]> {
  await delay(randomDelay());
  return clone(_appointments);
}

export async function getPatientAppointments(
  patientId: number,
): Promise<Appointment[]> {
  await delay(randomDelay());
  return clone(_appointments.filter((a) => a.patient_id === patientId));
}

export async function createAppointment(
  data: Omit<Appointment, 'appointment_id' | 'created_at'>,
): Promise<Appointment> {
  await delay(randomDelay());
  const newAppointment: Appointment = {
    ...data,
    appointment_id: generateId(),
    created_at: nowISO(),
  };
  _appointments.push(newAppointment);
  return clone(newAppointment);
}

export async function updateAppointment(
  id: number,
  data: Partial<Appointment>,
): Promise<Appointment> {
  await delay(randomDelay());
  const idx = _appointments.findIndex((a) => a.appointment_id === id);
  if (idx === -1) throw new Error(`Appointment with id ${id} not found`);
  _appointments[idx] = { ..._appointments[idx], ...data };
  return clone(_appointments[idx]);
}

// ════════════════════════════════════════════════════════════════════
//  FILES
// ════════════════════════════════════════════════════════════════════

export async function getPatientFiles(
  patientId: number,
): Promise<FileAsset[]> {
  await delay(randomDelay());
  return clone(_fileAssets.filter((f) => f.patient_id === patientId));
}

export async function uploadFile(
  data: Omit<FileAsset, 'file_id' | 'uploaded_at'>,
): Promise<FileAsset> {
  await delay(randomDelay());
  const newFile: FileAsset = {
    ...data,
    file_id: generateId(),
    uploaded_at: nowISO(),
  };
  _fileAssets.push(newFile);
  return clone(newFile);
}

// ════════════════════════════════════════════════════════════════════
//  SETTINGS / DENTISTS / SERVICES / PAYMENT TERMS
// ════════════════════════════════════════════════════════════════════

export async function getClinicSettings(): Promise<ClinicSettings> {
  await delay(randomDelay());
  return clone(_clinicSettings);
}

export async function getDentists(): Promise<Dentist[]> {
  await delay(randomDelay());
  return clone(_dentists);
}

export async function getServices(): Promise<ServiceItem[]> {
  await delay(randomDelay());
  return clone(_services);
}

export async function getPaymentTerms(): Promise<PaymentTermOption[]> {
  await delay(randomDelay());
  return clone(_paymentTerms);
}

// ════════════════════════════════════════════════════════════════════
//  DRUGS (Catalog)
// ════════════════════════════════════════════════════════════════════

export async function getDrugs(): Promise<Drug[]> {
  await delay(randomDelay());
  return clone(_drugs);
}

export async function createDrug(
  data: Omit<Drug, 'drug_id'>,
): Promise<Drug> {
  await delay(randomDelay());
  const newDrug: Drug = { ...data, drug_id: generateId() };
  _drugs.push(newDrug);
  return clone(newDrug);
}

export async function updateDrug(
  id: number,
  data: Partial<Drug>,
): Promise<Drug> {
  await delay(randomDelay());
  const idx = _drugs.findIndex((d) => d.drug_id === id);
  if (idx === -1) throw new Error(`Drug with id ${id} not found`);
  _drugs[idx] = { ..._drugs[idx], ...data };
  return clone(_drugs[idx]);
}

export async function deleteDrug(id: number): Promise<void> {
  await delay(randomDelay());
  _drugs = _drugs.filter((d) => d.drug_id !== id);
}

// ════════════════════════════════════════════════════════════════════
//  PRESCRIPTIONS
// ════════════════════════════════════════════════════════════════════

export async function getPatientPrescriptions(
  patientId: number,
): Promise<Prescription[]> {
  await delay(randomDelay());
  return clone(
    _prescriptions
      .filter((p) => p.patient_id === patientId)
      .sort((a, b) => b.date.localeCompare(a.date)),
  );
}

export async function createPrescription(
  data: Omit<Prescription, 'prescription_id' | 'created_at'>,
): Promise<Prescription> {
  await delay(randomDelay());
  const newRx: Prescription = {
    ...data,
    prescription_id: generateId(),
    created_at: nowISO(),
  };
  _prescriptions.push(newRx);
  return clone(newRx);
}

export async function deletePrescription(id: number): Promise<void> {
  await delay(randomDelay());
  _prescriptions = _prescriptions.filter((p) => p.prescription_id !== id);
}

// ════════════════════════════════════════════════════════════════════
//  NOTIFICATIONS
// ════════════════════════════════════════════════════════════════════

/**
 * Returns notifications synchronously for backward compatibility with
 * TopBar, which calls `getNotifications()` without `await`.
 */
export function getNotifications(): NotificationItem[] {
  return clone(_notifications);
}

// ════════════════════════════════════════════════════════════════════
//  GLOBAL SEARCH
//  Returns SearchResults with SearchResultItem shape for backward
//  compatibility with the GlobalSearch component.
// ════════════════════════════════════════════════════════════════════

export async function globalSearch(
  query: string,
): Promise<SearchResults> {
  await delay(randomDelay());
  const q = query.toLowerCase().trim();

  if (!q) {
    return { patients: [], invoices: [], appointments: [] };
  }

  // ── Matching patients ───────────────────────────────────────────
  const matchedPatients = _patients.filter(
    (p) =>
      p.first_name.toLowerCase().includes(q) ||
      p.last_name.toLowerCase().includes(q) ||
      p.middle_name.toLowerCase().includes(q) ||
      p.mobile_number.includes(q) ||
      p.email.toLowerCase().includes(q) ||
      `${p.first_name} ${p.last_name}`.toLowerCase().includes(q) ||
      `${p.last_name}, ${p.first_name}`.toLowerCase().includes(q),
  );

  const matchedPatientIds = new Set(matchedPatients.map((p) => p.patient_id));

  // ── Matching invoices (by invoice_no or patient match) ──────────
  const matchedInvoices = _invoices.filter(
    (inv) =>
      inv.invoice_no.toLowerCase().includes(q) ||
      matchedPatientIds.has(inv.patient_id),
  );

  // ── Matching appointments (by patient, notes, or date) ──────────
  const matchedAppointments = _appointments.filter(
    (a) =>
      matchedPatientIds.has(a.patient_id) ||
      a.notes.toLowerCase().includes(q) ||
      a.date.includes(q),
  );

  // ── Convert to SearchResultItem for GlobalSearch component ──────
  const patientResults: SearchResultItem[] = matchedPatients.map((p) => ({
    id: p.patient_id,
    type: 'patient' as const,
    title: `${p.first_name} ${p.last_name}`,
    subtitle: `${p.sex === 'male' ? 'Male' : 'Female'}, ${p.mobile_number}`,
    url: `/patients/${p.patient_id}`,
  }));

  const invoiceResults: SearchResultItem[] = matchedInvoices.map((inv) => {
    const patient = _patients.find((p) => p.patient_id === inv.patient_id);
    const patientName = patient
      ? `${patient.first_name} ${patient.last_name}`
      : 'Unknown';
    const pesos = (inv.total_int / 100).toLocaleString('en-PH', {
      minimumFractionDigits: 2,
    });
    return {
      id: inv.invoice_id,
      type: 'invoice' as const,
      title: inv.invoice_no,
      subtitle: `${patientName} - PHP ${pesos}`,
      url: '/billing',
    };
  });

  const appointmentResults: SearchResultItem[] = matchedAppointments.map(
    (a) => {
      const patient = _patients.find((p) => p.patient_id === a.patient_id);
      const patientName = patient
        ? `${patient.first_name} ${patient.last_name}`
        : 'Unknown';
      return {
        id: a.appointment_id,
        type: 'appointment' as const,
        title: `${a.notes || 'Appointment'} - ${patientName}`,
        subtitle: `${a.date} at ${a.time_start}`,
        url: '/appointments',
      };
    },
  );

  return {
    patients: patientResults,
    invoices: invoiceResults,
    appointments: appointmentResults,
  };
}

// ════════════════════════════════════════════════════════════════════
//  UNIFIED API OBJECT (backward-compatible named export)
// ════════════════════════════════════════════════════════════════════

export const api = {
  // Patients
  getPatients,
  getPatient,
  createPatient,
  updatePatient,
  // Medical History
  getMedicalHistory,
  saveMedicalHistory,
  // Consent
  getConsentForm,
  saveConsentForm,
  // Dental Chart
  getDentalChart,
  updateToothRecord,
  // Treatments
  getPatientTreatments,
  createTreatment,
  updateTreatment,
  // Invoices
  getInvoices,
  getPatientInvoices,
  createInvoice,
  // Installments
  getInstallmentPlan,
  createInstallmentPlan,
  // Payments
  getInvoicePayments,
  getPatientPayments,
  createPayment,
  // Appointments
  getAppointments,
  getPatientAppointments,
  createAppointment,
  updateAppointment,
  // Files
  getPatientFiles,
  uploadFile,
  // Settings
  getClinicSettings,
  getDentists,
  getServices,
  getPaymentTerms,
  // Drugs
  getDrugs,
  createDrug,
  updateDrug,
  deleteDrug,
  // Prescriptions
  getPatientPrescriptions,
  createPrescription,
  deletePrescription,
  // Notifications
  getNotifications,
  // Search
  globalSearch,
};
