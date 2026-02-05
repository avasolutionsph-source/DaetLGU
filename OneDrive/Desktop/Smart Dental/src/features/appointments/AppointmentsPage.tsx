import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Plus,
  CalendarDays,
  List,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  UserX,
  Search,
  X,
  MoreHorizontal,
} from 'lucide-react';
import type {
  Appointment,
  Patient,
  Dentist,
  TreatmentRecord,
  AppointmentStatus,
} from '@/types/models';
import {
  formatDate,
  cn,
  getShortName,
  getFullName,
  todayISO,
  getStatusColor,
} from '@/lib/utils';
import * as api from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Table, Thead, Tbody, Tr, Th, Td } from '@/components/ui/Table';
import { EmptyState } from '@/components/ui/EmptyState';
import { Tabs } from '@/components/ui/Tabs';
import { SearchInput } from '@/components/ui/SearchInput';
import { DatePicker } from '@/components/ui/DatePicker';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/components/ui/Toast';
import { Link } from 'react-router-dom';
import {
  format,
  addMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  parseISO,
  isToday,
  isBefore,
  startOfWeek,
  endOfWeek,
  addDays,
} from 'date-fns';

// ─── Types ───────────────────────────────────────────────────────

type ViewMode = 'calendar' | 'list';
type StatusFilter = 'all' | AppointmentStatus;
type BadgeVar = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';

interface NewAppointmentForm {
  patientId: string;
  patientSearch: string;
  dentistId: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  treatmentId: string;
  notes: string;
}

// ─── Helpers ─────────────────────────────────────────────────────

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function statusBadgeVariant(status: string): BadgeVar {
  const map: Record<string, BadgeVar> = {
    scheduled: 'info',
    confirmed: 'purple',
    done: 'success',
    no_show: 'danger',
    cancelled: 'default',
  };
  return map[status] ?? 'default';
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    scheduled: 'Scheduled',
    confirmed: 'Confirmed',
    done: 'Done',
    no_show: 'No Show',
    cancelled: 'Cancelled',
  };
  return map[status] ?? status;
}

function statusDotColor(status: string): string {
  const map: Record<string, string> = {
    scheduled: 'bg-blue-500',
    confirmed: 'bg-purple-500',
    done: 'bg-green-500',
    no_show: 'bg-red-500',
    cancelled: 'bg-gray-400',
  };
  return map[status] ?? 'bg-gray-400';
}

function resolvePatientName(patients: Patient[], id: number): string {
  const p = patients.find((pt) => pt.patient_id === id);
  return p ? getShortName(p) : `Patient #${id}`;
}

function resolveDentistName(dentists: Dentist[], id: number): string {
  const d = dentists.find((dt) => dt.dentist_id === id);
  return d ? `Dr. ${d.last_name}` : `Dentist #${id}`;
}

function formatTime12(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
}

// ═══════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════

export default function AppointmentsPage() {
  const toast = useToast();

  // ─── Data ────────────────────────────────────────────────────────
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [dentists, setDentists] = useState<Dentist[]>([]);
  const [treatments, setTreatments] = useState<TreatmentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // ─── View ────────────────────────────────────────────────────────
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');

  // ─── Calendar State ──────────────────────────────────────────────
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());

  // ─── List Filters ────────────────────────────────────────────────
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [dentistFilter, setDentistFilter] = useState('');

  // ─── Modals ─────────────────────────────────────────────────────
  const [showCreate, setShowCreate] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    id: number;
    action: AppointmentStatus;
  } | null>(null);

  // ─── Patient dropdown ──────────────────────────────────────────
  const [patientDropOpen, setPatientDropOpen] = useState(false);
  const patientDropRef = useRef<HTMLDivElement>(null);
  const [actionMenuId, setActionMenuId] = useState<number | null>(null);

  // Close patient dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (patientDropRef.current && !patientDropRef.current.contains(e.target as Node)) {
        setPatientDropOpen(false);
      }
    };
    if (patientDropOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [patientDropOpen]);

  // ─── Fetch data ─────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const [appts, pts, dts] = await Promise.all([
          api.getAppointments(),
          api.getPatients(),
          api.getDentists(),
        ]);
        if (cancelled) return;
        setAppointments(appts);
        setPatients(pts);
        setDentists(dts);
      } catch {
        toast.error('Failed to load appointments');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Calendar Grid ──────────────────────────────────────────────
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    return eachDayOfInterval({ start: calStart, end: calEnd });
  }, [currentMonth]);

  // ─── Appointments by date lookup ───────────────────────────────
  const appointmentsByDate = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    appointments.forEach((a) => {
      const key = a.date;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(a);
    });
    // Sort each day's appointments by time
    map.forEach((list) => list.sort((a, b) => a.time_start.localeCompare(b.time_start)));
    return map;
  }, [appointments]);

  // ─── Selected day's appointments ───────────────────────────────
  const selectedDayAppts = useMemo(() => {
    if (!selectedDay) return [];
    const key = format(selectedDay, 'yyyy-MM-dd');
    return appointmentsByDate.get(key) ?? [];
  }, [selectedDay, appointmentsByDate]);

  // ─── Today's appointments ──────────────────────────────────────
  const todaysAppts = useMemo(() => {
    const key = todayISO();
    return appointmentsByDate.get(key) ?? [];
  }, [appointmentsByDate]);

  // ─── Status tab counts ─────────────────────────────────────────
  const tabCounts = useMemo(
    () => ({
      all: appointments.length,
      scheduled: appointments.filter((a) => a.status === 'scheduled').length,
      confirmed: appointments.filter((a) => a.status === 'confirmed').length,
      done: appointments.filter((a) => a.status === 'done').length,
      no_show: appointments.filter((a) => a.status === 'no_show').length,
      cancelled: appointments.filter((a) => a.status === 'cancelled').length,
    }),
    [appointments],
  );

  // ─── Filtered list ─────────────────────────────────────────────
  const filteredList = useMemo(() => {
    let list = [...appointments];

    if (statusFilter !== 'all')
      list = list.filter((a) => a.status === statusFilter);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((a) => {
        const name = resolvePatientName(patients, a.patient_id).toLowerCase();
        const dName = resolveDentistName(dentists, a.dentist_id).toLowerCase();
        return (
          name.includes(q) ||
          dName.includes(q) ||
          a.notes.toLowerCase().includes(q)
        );
      });
    }

    if (dentistFilter) {
      const dId = parseInt(dentistFilter);
      list = list.filter((a) => a.dentist_id === dId);
    }

    if (dateFrom) {
      const from = parseISO(dateFrom);
      list = list.filter((a) => !isBefore(parseISO(a.date), from));
    }
    if (dateTo) {
      const to = parseISO(dateTo);
      list = list.filter((a) => {
        const d = parseISO(a.date);
        return !isBefore(to, startOfMonth(d)) && !isBefore(d, to) ? false : d <= to;
      });
    }

    // Sort: upcoming first
    list.sort((a, b) => {
      const cmp = a.date.localeCompare(b.date);
      if (cmp !== 0) return cmp;
      return a.time_start.localeCompare(b.time_start);
    });

    return list;
  }, [appointments, statusFilter, search, patients, dentists, dentistFilter, dateFrom, dateTo]);

  // ─── Calendar Navigation ───────────────────────────────────────
  const prevMonth = () => setCurrentMonth((m) => addMonths(m, -1));
  const nextMonth = () => setCurrentMonth((m) => addMonths(m, 1));

  // ─── Appointment Status Actions ────────────────────────────────
  const handleStatusChange = async (id: number, newStatus: AppointmentStatus) => {
    try {
      const updated = await api.updateAppointment(id, { status: newStatus });
      setAppointments((prev) =>
        prev.map((a) => (a.appointment_id === id ? updated : a)),
      );
      toast.success(`Appointment marked as ${statusLabel(newStatus)}`);
    } catch {
      toast.error('Failed to update appointment');
    }
    setConfirmAction(null);
    setActionMenuId(null);
  };

  // ═══════════════════════════════════════════════════════════════
  // NEW APPOINTMENT FORM
  // ═══════════════════════════════════════════════════════════════

  const freshForm = useCallback(
    (): NewAppointmentForm => ({
      patientId: '',
      patientSearch: '',
      dentistId: dentists.length > 0 ? String(dentists[0].dentist_id) : '',
      date: selectedDay ? format(selectedDay, 'yyyy-MM-dd') : todayISO(),
      timeStart: '09:00',
      timeEnd: '09:30',
      treatmentId: '',
      notes: '',
    }),
    [dentists, selectedDay],
  );

  const [form, setForm] = useState<NewAppointmentForm>(freshForm);
  const [formErr, setFormErr] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const resetForm = useCallback(() => {
    setForm(freshForm());
    setFormErr({});
    setTreatments([]);
  }, [freshForm]);

  // Filtered patients for autocomplete
  const filteredPatients = useMemo(() => {
    if (!form.patientSearch.trim()) return patients;
    const q = form.patientSearch.toLowerCase();
    return patients.filter(
      (p) =>
        p.first_name.toLowerCase().includes(q) ||
        p.last_name.toLowerCase().includes(q) ||
        getFullName(p).toLowerCase().includes(q),
    );
  }, [patients, form.patientSearch]);

  // Load treatments when patient changes
  useEffect(() => {
    if (!form.patientId) {
      setTreatments([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const ts = await api.getPatientTreatments(parseInt(form.patientId));
        if (!cancelled) setTreatments(ts.filter((t) => t.status === 'planned' || t.status === 'in_progress'));
      } catch {
        // silent
      }
    })();
    return () => { cancelled = true; };
  }, [form.patientId]);

  const handleCreate = async () => {
    const err: Record<string, string> = {};
    if (!form.patientId) err.patientId = 'Patient is required';
    if (!form.dentistId) err.dentistId = 'Dentist is required';
    if (!form.date) err.date = 'Date is required';
    if (!form.timeStart) err.timeStart = 'Start time is required';
    if (!form.timeEnd) err.timeEnd = 'End time is required';
    if (form.timeStart && form.timeEnd && form.timeStart >= form.timeEnd)
      err.timeEnd = 'End time must be after start';
    if (Object.keys(err).length) {
      setFormErr(err);
      return;
    }

    setSaving(true);
    try {
      const appt = await api.createAppointment({
        patient_id: parseInt(form.patientId),
        dentist_id: parseInt(form.dentistId),
        treatment_id: form.treatmentId ? parseInt(form.treatmentId) : null,
        date: form.date,
        time_start: form.timeStart,
        time_end: form.timeEnd,
        status: 'scheduled',
        notes: form.notes,
      });
      setAppointments((prev) => [...prev, appt]);
      setShowCreate(false);
      resetForm();
      toast.success('Appointment created successfully');
    } catch {
      toast.error('Failed to create appointment');
    } finally {
      setSaving(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="mt-1 text-sm text-gray-500">
            Schedule and manage patient appointments
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="inline-flex rounded-lg border border-gray-300 p-0.5">
            <button
              type="button"
              onClick={() => setViewMode('calendar')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                viewMode === 'calendar'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100',
              )}
            >
              <CalendarDays className="h-4 w-4" />
              Calendar
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                viewMode === 'list'
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100',
              )}
            >
              <List className="h-4 w-4" />
              List
            </button>
          </div>
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => {
              resetForm();
              setShowCreate(true);
            }}
          >
            New Appointment
          </Button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          CALENDAR VIEW
          ═══════════════════════════════════════════════════════════ */}
      {viewMode === 'calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-2">
            <Card padding={false}>
              {/* Month Navigation */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h3 className="text-lg font-semibold text-gray-900">
                  {format(currentMonth, 'MMMM yyyy')}
                </h3>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 border-b border-gray-200">
                {DAYS.map((day) => (
                  <div
                    key={day}
                    className="px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Cells */}
              <div className="grid grid-cols-7">
                {calendarDays.map((day, idx) => {
                  const dateStr = format(day, 'yyyy-MM-dd');
                  const dayAppts = appointmentsByDate.get(dateStr) ?? [];
                  const isCurrentMonth =
                    day.getMonth() === currentMonth.getMonth();
                  const isSelected = selectedDay
                    ? isSameDay(day, selectedDay)
                    : false;
                  const today = isToday(day);
                  const isPast =
                    isBefore(day, new Date()) && !isToday(day);

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className={cn(
                        'relative flex flex-col items-start p-2 min-h-[80px] border-b border-r border-gray-100 text-left transition-colors',
                        !isCurrentMonth && 'bg-gray-50/50',
                        isPast && isCurrentMonth && 'bg-gray-50/30',
                        isSelected && 'bg-primary-50 ring-2 ring-inset ring-primary-500',
                        !isSelected && 'hover:bg-gray-50',
                      )}
                    >
                      <span
                        className={cn(
                          'inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium',
                          today && !isSelected && 'bg-primary-600 text-white',
                          today && isSelected && 'bg-primary-600 text-white',
                          !today && isCurrentMonth && 'text-gray-900',
                          !today && !isCurrentMonth && 'text-gray-400',
                        )}
                      >
                        {format(day, 'd')}
                      </span>

                      {/* Appointment dots */}
                      {dayAppts.length > 0 && (
                        <div className="mt-1 flex flex-wrap gap-0.5">
                          {dayAppts.slice(0, 3).map((a) => (
                            <span
                              key={a.appointment_id}
                              className={cn(
                                'h-1.5 w-1.5 rounded-full',
                                statusDotColor(a.status),
                              )}
                              title={`${formatTime12(a.time_start)} - ${resolvePatientName(patients, a.patient_id)}`}
                            />
                          ))}
                          {dayAppts.length > 3 && (
                            <span className="text-[10px] text-gray-400 leading-none">
                              +{dayAppts.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Day Detail Panel */}
          <div className="lg:col-span-1">
            <Card>
              <div className="mb-4">
                <h3 className="text-base font-semibold text-gray-900">
                  {selectedDay
                    ? format(selectedDay, 'EEEE, MMMM d, yyyy')
                    : 'Select a day'}
                </h3>
                {selectedDay && (
                  <p className="text-sm text-gray-500 mt-0.5">
                    {selectedDayAppts.length} appointment
                    {selectedDayAppts.length !== 1 && 's'}
                  </p>
                )}
              </div>

              {!selectedDay ? (
                <p className="text-sm text-gray-400 text-center py-8">
                  Click a day on the calendar to view appointments.
                </p>
              ) : selectedDayAppts.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarDays className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">
                    No appointments on this day.
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3"
                    leftIcon={<Plus className="h-3.5 w-3.5" />}
                    onClick={() => {
                      resetForm();
                      setForm((p) => ({
                        ...p,
                        date: format(selectedDay, 'yyyy-MM-dd'),
                      }));
                      setShowCreate(true);
                    }}
                  >
                    Add Appointment
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDayAppts.map((a) => (
                    <div
                      key={a.appointment_id}
                      className="rounded-lg border border-gray-200 p-3 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                          <Clock className="h-3.5 w-3.5 text-gray-400" />
                          {formatTime12(a.time_start)} -{' '}
                          {formatTime12(a.time_end)}
                        </div>
                        <Badge variant={statusBadgeVariant(a.status)}>
                          {statusLabel(a.status)}
                        </Badge>
                      </div>
                      <div className="text-sm">
                        <Link
                          to={`/patients/${a.patient_id}`}
                          className="font-medium text-primary-600 hover:text-primary-700"
                        >
                          {resolvePatientName(patients, a.patient_id)}
                        </Link>
                      </div>
                      <div className="text-xs text-gray-500">
                        {resolveDentistName(dentists, a.dentist_id)}
                      </div>
                      {a.notes && (
                        <p className="text-xs text-gray-500 italic">
                          {a.notes}
                        </p>
                      )}

                      {/* Actions */}
                      {(a.status === 'scheduled' ||
                        a.status === 'confirmed') && (
                        <div className="flex items-center gap-1 pt-1 border-t border-gray-100">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleStatusChange(a.appointment_id, 'done')
                            }
                            className="text-success-600"
                          >
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            Done
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleStatusChange(
                                a.appointment_id,
                                'no_show',
                              )
                            }
                            className="text-warning-600"
                          >
                            <UserX className="h-3.5 w-3.5 mr-1" />
                            No Show
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setConfirmAction({
                                id: a.appointment_id,
                                action: 'cancelled',
                              })
                            }
                            className="text-danger-500"
                          >
                            <XCircle className="h-3.5 w-3.5 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          LIST VIEW
          ═══════════════════════════════════════════════════════════ */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {/* Today's Reminders */}
          {todaysAppts.length > 0 && (
            <Card className="border-primary-200 bg-primary-50/30">
              <div className="flex items-center gap-2 mb-3">
                <CalendarDays className="h-5 w-5 text-primary-600" />
                <h3 className="text-sm font-semibold text-primary-700">
                  Today's Appointments
                </h3>
                <Badge variant="info">{todaysAppts.length}</Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {todaysAppts.map((a) => (
                  <div
                    key={a.appointment_id}
                    className="flex items-center gap-3 rounded-lg border border-primary-100 bg-white p-2.5"
                  >
                    <div
                      className={cn(
                        'h-2 w-2 rounded-full shrink-0',
                        statusDotColor(a.status),
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {formatTime12(a.time_start)} -{' '}
                        {resolvePatientName(patients, a.patient_id)}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {resolveDentistName(dentists, a.dentist_id)}
                        {a.notes ? ` - ${a.notes}` : ''}
                      </p>
                    </div>
                    <Badge variant={statusBadgeVariant(a.status)}>
                      {statusLabel(a.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Filters */}
          <Tabs
            tabs={[
              { key: 'all', label: 'All', count: tabCounts.all },
              {
                key: 'scheduled',
                label: 'Scheduled',
                count: tabCounts.scheduled,
              },
              {
                key: 'confirmed',
                label: 'Confirmed',
                count: tabCounts.confirmed,
              },
              { key: 'done', label: 'Done', count: tabCounts.done },
              {
                key: 'no_show',
                label: 'No Show',
                count: tabCounts.no_show,
              },
              {
                key: 'cancelled',
                label: 'Cancelled',
                count: tabCounts.cancelled,
              },
            ]}
            activeTab={statusFilter}
            onTabChange={(k) => setStatusFilter(k as StatusFilter)}
          />

          <div className="flex flex-wrap items-end gap-3">
            <div className="w-72">
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search patient, dentist, or notes..."
              />
            </div>
            <div className="w-48">
              <Select
                label="Dentist"
                value={dentistFilter}
                onChange={(e) => setDentistFilter(e.target.value)}
                placeholder="All dentists"
                options={[
                  { value: '', label: 'All Dentists' },
                  ...dentists.map((d) => ({
                    value: String(d.dentist_id),
                    label: `Dr. ${d.last_name}`,
                  })),
                ]}
              />
            </div>
            <DatePicker
              label="From"
              value={dateFrom}
              onChange={setDateFrom}
            />
            <DatePicker label="To" value={dateTo} onChange={setDateTo} />
            {(dateFrom || dateTo || dentistFilter) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDateFrom('');
                  setDateTo('');
                  setDentistFilter('');
                }}
              >
                Clear filters
              </Button>
            )}
          </div>

          {/* Table */}
          <Card padding={false}>
            {filteredList.length === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title="No appointments found"
                description={
                  search
                    ? 'Try adjusting your search or filters.'
                    : 'Schedule your first appointment to get started.'
                }
                action={
                  !search ? (
                    <Button
                      leftIcon={<Plus className="h-4 w-4" />}
                      onClick={() => {
                        resetForm();
                        setShowCreate(true);
                      }}
                    >
                      New Appointment
                    </Button>
                  ) : undefined
                }
              />
            ) : (
              <Table>
                <Thead>
                  <Tr>
                    <Th>Date</Th>
                    <Th>Time</Th>
                    <Th>Patient</Th>
                    <Th>Dentist</Th>
                    <Th>Procedure / Notes</Th>
                    <Th>Status</Th>
                    <Th className="text-right">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredList.map((a) => (
                    <Tr key={a.appointment_id}>
                      <Td>
                        <span
                          className={cn(
                            'text-sm',
                            isToday(parseISO(a.date)) &&
                              'font-semibold text-primary-600',
                          )}
                        >
                          {formatDate(a.date)}
                        </span>
                      </Td>
                      <Td>
                        <span className="text-sm">
                          {formatTime12(a.time_start)} -{' '}
                          {formatTime12(a.time_end)}
                        </span>
                      </Td>
                      <Td>
                        <Link
                          to={`/patients/${a.patient_id}`}
                          className="font-medium text-primary-600 hover:text-primary-700 text-sm"
                        >
                          {resolvePatientName(patients, a.patient_id)}
                        </Link>
                      </Td>
                      <Td>
                        <span className="text-sm">
                          {resolveDentistName(dentists, a.dentist_id)}
                        </span>
                      </Td>
                      <Td>
                        <span className="text-sm text-gray-500 max-w-[200px] truncate block">
                          {a.notes || '--'}
                        </span>
                      </Td>
                      <Td>
                        <Badge variant={statusBadgeVariant(a.status)}>
                          {statusLabel(a.status)}
                        </Badge>
                      </Td>
                      <Td className="text-right">
                        {(a.status === 'scheduled' ||
                          a.status === 'confirmed') && (
                          <div className="relative inline-block">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setActionMenuId(
                                  actionMenuId === a.appointment_id
                                    ? null
                                    : a.appointment_id,
                                )
                              }
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                            {actionMenuId === a.appointment_id && (
                              <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                                <button
                                  type="button"
                                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  onClick={() =>
                                    handleStatusChange(
                                      a.appointment_id,
                                      'done',
                                    )
                                  }
                                >
                                  <CheckCircle className="h-4 w-4 text-success-600" />
                                  Mark as Done
                                </button>
                                <button
                                  type="button"
                                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                  onClick={() =>
                                    handleStatusChange(
                                      a.appointment_id,
                                      'no_show',
                                    )
                                  }
                                >
                                  <UserX className="h-4 w-4 text-warning-600" />
                                  No Show
                                </button>
                                <button
                                  type="button"
                                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger-600 hover:bg-danger-50"
                                  onClick={() =>
                                    setConfirmAction({
                                      id: a.appointment_id,
                                      action: 'cancelled',
                                    })
                                  }
                                >
                                  <XCircle className="h-4 w-4" />
                                  Cancel
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </Card>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════
          CLOSE ACTIONS MENU ON CLICK OUTSIDE
          ═══════════════════════════════════════════════════════════ */}
      {actionMenuId !== null && (
        <div
          className="fixed inset-0 z-[5]"
          onClick={() => setActionMenuId(null)}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════
          NEW APPOINTMENT MODAL
          ═══════════════════════════════════════════════════════════ */}
      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="New Appointment"
        size="lg"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} loading={saving}>
              Create Appointment
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {/* Patient autocomplete */}
          <div className="relative" ref={patientDropRef}>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Patient <span className="text-danger-500">*</span>
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search patient..."
                value={
                  form.patientId
                    ? resolvePatientName(
                        patients,
                        parseInt(form.patientId),
                      )
                    : form.patientSearch
                }
                onChange={(e) => {
                  setForm((p) => ({
                    ...p,
                    patientSearch: e.target.value,
                    patientId: '',
                    treatmentId: '',
                  }));
                  setPatientDropOpen(true);
                }}
                onFocus={() => setPatientDropOpen(true)}
                className={cn(
                  'block w-full rounded-lg border bg-white py-2 pl-10 pr-8 text-sm text-gray-900 placeholder-gray-400',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                  formErr.patientId
                    ? 'border-danger-500'
                    : 'border-gray-300',
                )}
              />
              {form.patientId && (
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() =>
                    setForm((p) => ({
                      ...p,
                      patientId: '',
                      patientSearch: '',
                      treatmentId: '',
                    }))
                  }
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {patientDropOpen && !form.patientId && (
              <div className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                {filteredPatients.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    No patients found
                  </div>
                ) : (
                  filteredPatients.map((p) => (
                    <button
                      key={p.patient_id}
                      type="button"
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                      onClick={() => {
                        setForm((prev) => ({
                          ...prev,
                          patientId: String(p.patient_id),
                          patientSearch: '',
                          treatmentId: '',
                        }));
                        setPatientDropOpen(false);
                      }}
                    >
                      <span className="font-medium">{getShortName(p)}</span>
                      <span className="text-gray-400 text-xs">
                        #{p.patient_id}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
            {formErr.patientId && (
              <p className="mt-1 text-xs text-danger-500">
                {formErr.patientId}
              </p>
            )}
          </div>

          {/* Dentist */}
          <Select
            label="Dentist"
            value={form.dentistId}
            onChange={(e) =>
              setForm((p) => ({ ...p, dentistId: e.target.value }))
            }
            options={dentists.map((d) => ({
              value: String(d.dentist_id),
              label: `Dr. ${d.first_name} ${d.last_name} (${d.specialization})`,
            }))}
            placeholder="Select dentist..."
            error={formErr.dentistId}
          />

          {/* Date */}
          <DatePicker
            label="Date"
            value={form.date}
            onChange={(v) => setForm((p) => ({ ...p, date: v }))}
            error={formErr.date}
          />

          {/* Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Start Time <span className="text-danger-500">*</span>
              </label>
              <input
                type="time"
                value={form.timeStart}
                onChange={(e) =>
                  setForm((p) => ({ ...p, timeStart: e.target.value }))
                }
                className={cn(
                  'block w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                  formErr.timeStart
                    ? 'border-danger-500'
                    : 'border-gray-300',
                )}
              />
              {formErr.timeStart && (
                <p className="mt-1 text-xs text-danger-500">
                  {formErr.timeStart}
                </p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                End Time <span className="text-danger-500">*</span>
              </label>
              <input
                type="time"
                value={form.timeEnd}
                onChange={(e) =>
                  setForm((p) => ({ ...p, timeEnd: e.target.value }))
                }
                className={cn(
                  'block w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900',
                  'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
                  formErr.timeEnd
                    ? 'border-danger-500'
                    : 'border-gray-300',
                )}
              />
              {formErr.timeEnd && (
                <p className="mt-1 text-xs text-danger-500">
                  {formErr.timeEnd}
                </p>
              )}
            </div>
          </div>

          {/* Link to Treatment */}
          {form.patientId && treatments.length > 0 && (
            <Select
              label="Link to Treatment (optional)"
              value={form.treatmentId}
              onChange={(e) =>
                setForm((p) => ({ ...p, treatmentId: e.target.value }))
              }
              placeholder="No linked treatment"
              options={[
                { value: '', label: 'None' },
                ...treatments.map((t) => ({
                  value: String(t.treatment_id),
                  label: `${t.procedure_type} (${t.status})`,
                })),
              ]}
            />
          )}

          {/* Notes */}
          <Textarea
            label="Notes"
            value={form.notes}
            onChange={(e) =>
              setForm((p) => ({ ...p, notes: e.target.value }))
            }
            placeholder="Procedure details, special instructions..."
            rows={3}
          />
        </div>
      </Modal>

      {/* ═══════════════════════════════════════════════════════════
          CANCEL CONFIRMATION MODAL
          ═══════════════════════════════════════════════════════════ */}
      <Modal
        isOpen={confirmAction !== null}
        onClose={() => setConfirmAction(null)}
        title="Cancel Appointment"
        size="sm"
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>
              Go Back
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (confirmAction)
                  handleStatusChange(
                    confirmAction.id,
                    confirmAction.action,
                  );
              }}
            >
              Yes, Cancel Appointment
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to cancel this appointment? This action cannot
          be undone.
        </p>
      </Modal>
    </div>
  );
}
