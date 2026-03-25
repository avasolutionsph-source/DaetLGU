import { useState } from 'react';
import {
  Settings,
  Building2,
  Bell,
  Shield,
  Server,
  Upload,
  Save,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  Lock,
  Key,
  Database,
  HardDrive,
  Info,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Tabs from '../components/ui/Tabs';

/* ------------------------------------------------------------------ */
/*  TOGGLE COMPONENT                                                    */
/* ------------------------------------------------------------------ */
function Toggle({ enabled, onChange, label }: { enabled: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="flex items-center gap-3 w-full py-3 group"
    >
      {enabled ? (
        <ToggleRight className="w-9 h-9 text-blue-600 flex-shrink-0" />
      ) : (
        <ToggleLeft className="w-9 h-9 text-gray-300 flex-shrink-0" />
      )}
      <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{label}</span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  SETTINGS PAGE                                                       */
/* ------------------------------------------------------------------ */
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  // General
  const [orgName, setOrgName] = useState('Municipality of Daet');
  const [address, setAddress] = useState('Municipal Hall, F. Pimentel Ave, Daet, Camarines Norte 4600');
  const [email, setEmail] = useState('admin@daet.gov.ph');
  const [phone, setPhone] = useState('(054) 721-1234');
  const [timezone, setTimezone] = useState('Asia/Manila');

  // Notifications
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(false);
  const [notifPush, setNotifPush] = useState(true);
  const [notifPermitApproval, setNotifPermitApproval] = useState(true);
  const [notifPaymentReceived, setNotifPaymentReceived] = useState(true);
  const [notifNewApplication, setNotifNewApplication] = useState(true);
  const [notifSystemAlert, setNotifSystemAlert] = useState(true);
  const [notifEmergency, setNotifEmergency] = useState(true);
  const [notifReportReady, setNotifReportReady] = useState(false);

  // Security
  const [minPassword, setMinPassword] = useState('8');
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [twoFa, setTwoFa] = useState(false);
  const [ipWhitelist, setIpWhitelist] = useState('192.168.1.0/24\n10.0.0.0/8');

  // System
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const tabs = [
    { key: 'general', label: 'General' },
    { key: 'notifications', label: 'Notifications' },
    { key: 'security', label: 'Security' },
    { key: 'system', label: 'System' },
  ];

  const inputClass =
    'w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all';

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <PageHeader
        title="System Settings"
        subtitle="Configure system-wide preferences and options"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Settings' },
        ]}
        actions={
          <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        }
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="mt-6">
        {/* ---- GENERAL TAB ---- */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" /> Organization Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Organization Name</label>
                  <input className={inputClass} value={orgName} onChange={(e) => setOrgName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input className={`${inputClass} pl-10`} value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input className={`${inputClass} pl-10`} value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Timezone</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select className={`${inputClass} pl-10`} value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                      <option value="Asia/Manila">Asia/Manila (GMT+8)</option>
                      <option value="Asia/Hong_Kong">Asia/Hong Kong (GMT+8)</option>
                      <option value="UTC">UTC (GMT+0)</option>
                    </select>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <textarea rows={2} className={`${inputClass} pl-10`} value={address} onChange={(e) => setAddress(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-600" /> Organization Logo
              </h3>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, or SVG up to 2MB</p>
              </div>
            </div>
          </div>
        )}

        {/* ---- NOTIFICATIONS TAB ---- */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" /> Notification Channels
              </h3>
              <div className="divide-y divide-gray-100">
                <Toggle enabled={notifEmail} onChange={setNotifEmail} label="Email Notifications" />
                <Toggle enabled={notifSms} onChange={setNotifSms} label="SMS Notifications" />
                <Toggle enabled={notifPush} onChange={setNotifPush} label="Push Notifications" />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" /> Event Notifications
              </h3>
              <div className="divide-y divide-gray-100">
                <Toggle enabled={notifPermitApproval} onChange={setNotifPermitApproval} label="Permit Approvals" />
                <Toggle enabled={notifPaymentReceived} onChange={setNotifPaymentReceived} label="Payment Received" />
                <Toggle enabled={notifNewApplication} onChange={setNotifNewApplication} label="New Applications" />
                <Toggle enabled={notifSystemAlert} onChange={setNotifSystemAlert} label="System Alerts" />
                <Toggle enabled={notifEmergency} onChange={setNotifEmergency} label="Emergency Notifications" />
                <Toggle enabled={notifReportReady} onChange={setNotifReportReady} label="Report Generation Complete" />
              </div>
            </div>
          </div>
        )}

        {/* ---- SECURITY TAB ---- */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" /> Password Policy
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Minimum Password Length</label>
                  <input type="number" className={inputClass} value={minPassword} onChange={(e) => setMinPassword(e.target.value)} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Session Timeout (minutes)</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="number" className={`${inputClass} pl-10`} value={sessionTimeout} onChange={(e) => setSessionTimeout(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Key className="w-5 h-5 text-blue-600" /> Two-Factor Authentication
              </h3>
              <Toggle enabled={twoFa} onChange={setTwoFa} label="Require 2FA for all admin accounts" />
              <p className="text-xs text-gray-400 mt-1 ml-12">Users will be prompted to set up 2FA on next login</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" /> IP Whitelist
              </h3>
              <p className="text-sm text-gray-500 mb-3">Only allow access from these IP ranges (one per line)</p>
              <textarea
                rows={4}
                className={inputClass}
                value={ipWhitelist}
                onChange={(e) => setIpWhitelist(e.target.value)}
                placeholder="e.g. 192.168.1.0/24"
              />
            </div>
          </div>
        )}

        {/* ---- SYSTEM TAB ---- */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <Database className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Database Status</p>
                    <p className="text-xs text-emerald-600 font-semibold">Connected</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Host</span><span className="text-gray-900 font-medium">db.daet-lgu.local</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Engine</span><span className="text-gray-900 font-medium">PostgreSQL 16.1</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Size</span><span className="text-gray-900 font-medium">2.4 GB</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Uptime</span><span className="text-gray-900 font-medium">45 days</span></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <HardDrive className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Storage Usage</p>
                    <p className="text-xs text-blue-600 font-semibold">18.3 GB / 50 GB</p>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 mb-3">
                  <div className="bg-blue-500 h-3 rounded-full" style={{ width: '36.6%' }} />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Documents</span><span className="text-gray-900 font-medium">8.1 GB</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Backups</span><span className="text-gray-900 font-medium">6.4 GB</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Logs</span><span className="text-gray-900 font-medium">3.8 GB</span></div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" /> System Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-500 mb-1">System Version</p>
                  <p className="text-gray-900 font-semibold">SMART LGU ERP v2.4.1</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-500 mb-1">Last Updated</p>
                  <p className="text-gray-900 font-semibold">March 15, 2026</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-500 mb-1">Environment</p>
                  <p className="text-gray-900 font-semibold">Production</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                    <Server className="w-5 h-5 text-amber-600" /> Maintenance Mode
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">When enabled, only administrators can access the system</p>
                </div>
                <button onClick={() => setMaintenanceMode(!maintenanceMode)}>
                  {maintenanceMode ? (
                    <ToggleRight className="w-11 h-11 text-amber-600" />
                  ) : (
                    <ToggleLeft className="w-11 h-11 text-gray-300" />
                  )}
                </button>
              </div>
              {maintenanceMode && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                  Maintenance mode is currently active. Regular users cannot access the system.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Save */}
      <div className="mt-8 flex justify-end">
        <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
          <Save className="w-4 h-4" />
          Save All Settings
        </button>
      </div>
    </div>
  );
}
