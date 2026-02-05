import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Users, TrendingUp, AlertTriangle,
  Clock, UserPlus, CalendarPlus, FileText, BarChart3,
  Loader2, ChevronRight,
} from 'lucide-react';
import type { Patient, Appointment, Invoice, Dentist } from '@/types/models';
import { api } from '@/lib/api';
import { formatMoney, getShortName, getInitials, formatDate, todayISO } from '@/lib/utils';
import { Stat, Card, Badge, Avatar, Button, EmptyState } from '@/components/ui';

// ─── Helpers ──────────────────────────────────────────────────────

function formatTime12h(time24: string): string {
  const [h, m] = time24.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${suffix}`;
}

function daysOverdue(dueDate: string): number {
  const due = new Date(dueDate);
  const now = new Date();
  const diff = Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';

function statusBadgeVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    scheduled: 'info',
    confirmed: 'purple',
    done: 'success',
    no_show: 'danger',
    cancelled: 'default',
  };
  return map[status] || 'default';
}

// ─── DashboardPage ────────────────────────────────────────────────

export default function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [dentists, setDentists] = useState<Dentist[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [p, a, i, d] = await Promise.all([
          api.getPatients(),
          api.getAppointments(),
          api.getInvoices(),
          api.getDentists(),
        ]);
        if (!cancelled) {
          setPatients(p);
          setAppointments(a);
          setInvoices(i);
          setDentists(d);
          setLoading(false);
        }
      } catch {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  // ─── Derived Data ────────────────────────────────────────────

  const today = todayISO();

  const todayAppointments = appointments
    .filter((a) => a.date === today && a.status !== 'cancelled')
    .sort((a, b) => a.time_start.localeCompare(b.time_start));

  const recentPatients = [...patients]
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
    .slice(0, 5);

  const revenueThisMonth = invoices.reduce((sum, inv) => sum + inv.amount_paid_int, 0);
  const outstandingBalance = invoices.reduce((sum, inv) => sum + inv.balance_int, 0);

  const overdueInvoices = invoices
    .filter((inv) => inv.status === 'overdue')
    .map((inv) => ({
      ...inv,
      patient: patients.find((p) => p.patient_id === inv.patient_id),
      days: daysOverdue(inv.due_date),
    }));

  const getDentistName = (id: number) => {
    const d = dentists.find((dt) => dt.dentist_id === id);
    return d ? `Dr. ${d.last_name}` : 'Unassigned';
  };

  // ─── Loading State ──────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here is your clinic overview for today.
        </p>
      </div>

      {/* ─── Stat Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="Today's Appointments"
          value={todayAppointments.length}
          icon={Calendar}
          change={`${todayAppointments.filter((a) => a.status === 'confirmed').length} confirmed`}
          trend="up"
        />
        <Stat
          label="Total Patients"
          value={patients.length}
          icon={Users}
          change="Active records"
          trend="up"
        />
        <Stat
          label="Revenue This Month"
          value={formatMoney(revenueThisMonth)}
          icon={TrendingUp}
          change="+12% from last month"
          trend="up"
        />
        <Stat
          label="Outstanding Balance"
          value={formatMoney(outstandingBalance)}
          icon={AlertTriangle}
          change={`${overdueInvoices.length} overdue`}
          trend={overdueInvoices.length > 0 ? 'down' : 'neutral'}
        />
      </div>

      {/* ─── Middle Section ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Today's Schedule */}
        <Card
          title="Today's Schedule"
          headerAction={
            <Button variant="ghost" size="sm" onClick={() => navigate('/appointments')}>
              View All <ChevronRight className="h-4 w-4" />
            </Button>
          }
        >
          {todayAppointments.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="No appointments today"
              description="Your schedule is clear for today."
            />
          ) : (
            <div className="divide-y divide-gray-100">
              {todayAppointments.map((appt) => {
                const patient = patients.find((p) => p.patient_id === appt.patient_id);
                return (
                  <div key={appt.appointment_id} className="flex items-center gap-4 py-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {patient ? getShortName(patient) : 'Unknown Patient'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTime12h(appt.time_start)} &ndash; {formatTime12h(appt.time_end)}
                        {' '}&middot;{' '}{getDentistName(appt.dentist_id)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{appt.notes || 'General'}</p>
                      <Badge variant={statusBadgeVariant(appt.status)} className="mt-1">
                        {appt.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Recent Patients */}
        <Card
          title="Recent Patients"
          headerAction={
            <Button variant="ghost" size="sm" onClick={() => navigate('/patients')}>
              View All <ChevronRight className="h-4 w-4" />
            </Button>
          }
        >
          {recentPatients.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No patients yet"
              description="Add your first patient to get started."
            />
          ) : (
            <div className="divide-y divide-gray-100">
              {recentPatients.map((patient) => (
                <div key={patient.patient_id} className="flex items-center gap-3 py-3">
                  <Avatar
                    name={getShortName(patient)}
                    initials={getInitials(patient.first_name, patient.last_name)}
                    size="md"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {getShortName(patient)}
                    </p>
                    <p className="text-xs text-gray-500">{patient.mobile_number}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Last updated</p>
                    <p className="text-xs font-medium text-gray-700">
                      {formatDate(patient.updated_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* ─── Bottom Section ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Overdue Payments */}
        <Card
          title="Overdue Payments"
          headerAction={
            overdueInvoices.length > 0 ? (
              <Badge variant="danger">{overdueInvoices.length} overdue</Badge>
            ) : undefined
          }
        >
          {overdueInvoices.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No overdue payments"
              description="All invoices are up to date. Great job!"
            />
          ) : (
            <div className="divide-y divide-gray-100">
              {overdueInvoices.map((inv) => (
                <div key={inv.invoice_id} className="flex items-center gap-4 py-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-danger-50 text-danger-500">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {inv.patient ? getShortName(inv.patient) : 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-500">{inv.invoice_no}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-danger-600">
                      {formatMoney(inv.balance_int)}
                    </p>
                    <p className="text-xs text-danger-500">
                      {inv.days} day{inv.days !== 1 ? 's' : ''} overdue
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card title="Quick Actions">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/patients?action=new')}
              className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-primary-200 hover:bg-primary-50 hover:shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
                <UserPlus className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium text-gray-700">New Patient</span>
            </button>

            <button
              onClick={() => navigate('/appointments?action=new')}
              className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-primary-200 hover:bg-primary-50 hover:shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
                <CalendarPlus className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium text-gray-700">New Appointment</span>
            </button>

            <button
              onClick={() => navigate('/billing?action=new')}
              className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-primary-200 hover:bg-primary-50 hover:shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <FileText className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium text-gray-700">Create Invoice</span>
            </button>

            <button
              onClick={() => navigate('/reports')}
              className="flex flex-col items-center gap-2 rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-primary-200 hover:bg-primary-50 hover:shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                <BarChart3 className="h-6 w-6" />
              </div>
              <span className="text-sm font-medium text-gray-700">View Reports</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
