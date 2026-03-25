import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth, type UserRole } from './lib/auth';
import { ToastProvider } from './components/ui/Toast';
import AppShell from './components/layout/AppShell';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BusinessPermitsPage from './pages/BusinessPermitsPage';
import PropertyTaxPage from './pages/PropertyTaxPage';
import TreasuryPage from './pages/TreasuryPage';
import DocumentTrackingPage from './pages/DocumentTrackingPage';
import CitizenServicesPage from './pages/CitizenServicesPage';
import EmergencyPage from './pages/EmergencyPage';
import InfrastructurePage from './pages/InfrastructurePage';
import GISPage from './pages/GISPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ReportsPage from './pages/ReportsPage';
import BarangayPage from './pages/BarangayPage';
import HRPage from './pages/HRPage';
import AccountingPage from './pages/AccountingPage';
import EngineeringPage from './pages/EngineeringPage';
import MayorsOfficePage from './pages/MayorsOfficePage';
import SettingsPage from './pages/SettingsPage';
import AuditTrailPage from './pages/AuditTrailPage';
import UserManagementPage from './pages/UserManagementPage';
import HelpPage from './pages/HelpPage';
import CitizenReportPage from './pages/CitizenReportPage';
import type { ReactNode } from 'react';

// ─── Role-based access map ──────────────────────────────────────────────────
// Defines which roles can access each route path

const ROUTE_ACCESS: Record<string, UserRole[]> = {
  '/dashboard':        ['mayor', 'treasury', 'bplo', 'engineering', 'mdrrmo', 'barangay', 'admin'],
  '/business-permits': ['mayor', 'bplo', 'admin'],
  '/property-tax':     ['mayor', 'treasury', 'admin'],
  '/treasury':         ['mayor', 'treasury', 'admin'],
  '/documents':        ['mayor', 'admin', 'bplo', 'treasury', 'engineering'],
  '/citizen-services': ['mayor', 'bplo', 'barangay', 'admin'],
  '/emergency':        ['mayor', 'mdrrmo', 'barangay', 'admin'],
  '/infrastructure':   ['mayor', 'engineering', 'admin'],
  '/gis':              ['mayor', 'engineering', 'mdrrmo', 'admin'],
  '/analytics':        ['mayor', 'treasury', 'admin'],
  '/reports':          ['mayor', 'treasury', 'bplo', 'engineering', 'mdrrmo', 'admin'],
  '/barangay':         ['mayor', 'barangay', 'admin'],
  '/hr':               ['mayor', 'admin'],
  '/accounting':       ['mayor', 'treasury', 'admin'],
  '/engineering':      ['mayor', 'engineering', 'admin'],
  '/mayors-office':    ['mayor', 'admin'],
  '/settings':         ['mayor', 'admin'],
  '/audit-trail':      ['mayor', 'admin'],
  '/users':            ['admin'],
  '/help':             ['mayor', 'treasury', 'bplo', 'engineering', 'mdrrmo', 'barangay', 'admin'],
  '/citizen-report':   ['citizen'],
};

// Default landing page per role
const ROLE_HOME: Record<UserRole, string> = {
  mayor:       '/dashboard',
  treasury:    '/treasury',
  bplo:        '/business-permits',
  engineering: '/infrastructure',
  mdrrmo:      '/emergency',
  barangay:    '/barangay',
  admin:       '/dashboard',
  citizen:     '/citizen-report',
};

// ─── Route guards ────────────────────────────────────────────────────────────

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, currentUser } = useAuth();
  if (isAuthenticated && currentUser) {
    return <Navigate to={ROLE_HOME[currentUser.role]} replace />;
  }
  return <>{children}</>;
}

function RoleRoute({ path, children }: { path: string; children: ReactNode }) {
  const { currentUser } = useAuth();
  const allowedRoles = ROUTE_ACCESS[path];
  if (!currentUser || !allowedRoles?.includes(currentUser.role)) {
    return <Navigate to={ROLE_HOME[currentUser?.role || 'mayor']} replace />;
  }
  return <>{children}</>;
}

function RoleIndex() {
  const { currentUser } = useAuth();
  return <Navigate to={ROLE_HOME[currentUser?.role || 'mayor']} replace />;
}

// ─── App Routes ──────────────────────────────────────────────────────────────

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      {/* Citizen portal — standalone layout, no sidebar */}
      <Route
        path="/citizen-report"
        element={
          <ProtectedRoute>
            <CitizenReportPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<RoleIndex />} />
        <Route path="dashboard" element={<RoleRoute path="/dashboard"><DashboardPage /></RoleRoute>} />
        <Route path="business-permits" element={<RoleRoute path="/business-permits"><BusinessPermitsPage /></RoleRoute>} />
        <Route path="property-tax" element={<RoleRoute path="/property-tax"><PropertyTaxPage /></RoleRoute>} />
        <Route path="treasury" element={<RoleRoute path="/treasury"><TreasuryPage /></RoleRoute>} />
        <Route path="documents" element={<RoleRoute path="/documents"><DocumentTrackingPage /></RoleRoute>} />
        <Route path="citizen-services" element={<RoleRoute path="/citizen-services"><CitizenServicesPage /></RoleRoute>} />
        <Route path="emergency" element={<RoleRoute path="/emergency"><EmergencyPage /></RoleRoute>} />
        <Route path="infrastructure" element={<RoleRoute path="/infrastructure"><InfrastructurePage /></RoleRoute>} />
        <Route path="gis" element={<RoleRoute path="/gis"><GISPage /></RoleRoute>} />
        <Route path="analytics" element={<RoleRoute path="/analytics"><AnalyticsPage /></RoleRoute>} />
        <Route path="reports" element={<RoleRoute path="/reports"><ReportsPage /></RoleRoute>} />
        <Route path="barangay" element={<RoleRoute path="/barangay"><BarangayPage /></RoleRoute>} />
        <Route path="hr" element={<RoleRoute path="/hr"><HRPage /></RoleRoute>} />
        <Route path="accounting" element={<RoleRoute path="/accounting"><AccountingPage /></RoleRoute>} />
        <Route path="engineering" element={<RoleRoute path="/engineering"><EngineeringPage /></RoleRoute>} />
        <Route path="mayors-office" element={<RoleRoute path="/mayors-office"><MayorsOfficePage /></RoleRoute>} />
        <Route path="settings" element={<RoleRoute path="/settings"><SettingsPage /></RoleRoute>} />
        <Route path="audit-trail" element={<RoleRoute path="/audit-trail"><AuditTrailPage /></RoleRoute>} />
        <Route path="users" element={<RoleRoute path="/users"><UserManagementPage /></RoleRoute>} />
        <Route path="help" element={<RoleRoute path="/help"><HelpPage /></RoleRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
