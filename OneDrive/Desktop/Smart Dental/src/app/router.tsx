import React, { Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';

// ─── Loading Fallback ─────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary-600" />
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  );
}

// ─── Lazy-loaded Pages ────────────────────────────────────────────
const LoginPage = React.lazy(() => import('@/features/auth/LoginPage'));
const DashboardPage = React.lazy(() => import('@/features/dashboard/DashboardPage'));
const PatientsPage = React.lazy(() => import('@/features/patients/PatientsPage'));
const PatientProfilePage = React.lazy(() => import('@/features/patients/PatientProfilePage'));
const AppointmentsPage = React.lazy(() => import('@/features/appointments/AppointmentsPage'));
const BillingPage = React.lazy(() => import('@/features/billing/BillingPage'));
const ReportsPage = React.lazy(() => import('@/features/reports/ReportsPage'));
const SettingsPage = React.lazy(() => import('@/features/settings/SettingsPage'));

// ─── Suspense Wrapper ─────────────────────────────────────────────
function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>;
}

// ─── Router ───────────────────────────────────────────────────────
export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Lazy>
        <LoginPage />
      </Lazy>
    ),
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: (
          <Lazy>
            <DashboardPage />
          </Lazy>
        ),
      },
      {
        path: 'patients',
        element: (
          <Lazy>
            <PatientsPage />
          </Lazy>
        ),
      },
      {
        path: 'patients/:id',
        element: (
          <Lazy>
            <PatientProfilePage />
          </Lazy>
        ),
      },
      {
        path: 'appointments',
        element: (
          <Lazy>
            <AppointmentsPage />
          </Lazy>
        ),
      },
      {
        path: 'billing',
        element: (
          <Lazy>
            <BillingPage />
          </Lazy>
        ),
      },
      {
        path: 'reports',
        element: (
          <Lazy>
            <ReportsPage />
          </Lazy>
        ),
      },
      {
        path: 'settings',
        element: (
          <Lazy>
            <SettingsPage />
          </Lazy>
        ),
      },
    ],
  },
]);
