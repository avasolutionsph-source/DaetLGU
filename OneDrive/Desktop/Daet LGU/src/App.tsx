import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
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
import type { ReactNode } from 'react';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

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
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="business-permits" element={<BusinessPermitsPage />} />
        <Route path="property-tax" element={<PropertyTaxPage />} />
        <Route path="treasury" element={<TreasuryPage />} />
        <Route path="documents" element={<DocumentTrackingPage />} />
        <Route path="citizen-services" element={<CitizenServicesPage />} />
        <Route path="emergency" element={<EmergencyPage />} />
        <Route path="infrastructure" element={<InfrastructurePage />} />
        <Route path="gis" element={<GISPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="barangay" element={<BarangayPage />} />
        <Route path="hr" element={<HRPage />} />
        <Route path="accounting" element={<AccountingPage />} />
        <Route path="engineering" element={<EngineeringPage />} />
        <Route path="mayors-office" element={<MayorsOfficePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="audit-trail" element={<AuditTrailPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="help" element={<HelpPage />} />
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
