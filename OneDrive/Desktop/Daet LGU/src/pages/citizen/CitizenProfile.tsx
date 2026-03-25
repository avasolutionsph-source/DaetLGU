import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Save,
  CheckCircle2,
  Camera,
  Shield,
} from 'lucide-react';

const BARANGAYS = [
  'Alawihao', 'Awitan', 'Bagasbas', 'Bibirao', 'Borabod',
  'Calasgasan', 'Camambugan', 'Cobangbang', 'Dogongan', 'Gahonon',
  'Lag-on', 'Mancruz', 'Pamorangon', 'San Isidro',
];

export default function CitizenProfile() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [saved, setSaved] = useState(false);

  const [fullName, setFullName] = useState(currentUser?.name || 'Juan Dela Cruz');
  const [email, setEmail] = useState('juan.delacruz@gmail.com');
  const [phone, setPhone] = useState('0917-123-4567');
  const [address, setAddress] = useState('123 Vinzons Avenue');
  const [barangay, setBarangay] = useState('Alawihao');
  const [birthdate, setBirthdate] = useState('1990-05-15');
  const [gender, setGender] = useState('male');

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <button onClick={() => navigate('/citizen-hub')} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-gray-900">My Profile</h1>
            <p className="text-xs text-gray-500">Update your personal information</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-5 sm:px-6">
        {/* Avatar section */}
        <div className="mb-6 flex flex-col items-center">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
              {currentUser?.avatar || 'JD'}
            </div>
            <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-white border-2 border-gray-200 text-gray-600 shadow-sm hover:bg-gray-50">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-3 text-base font-semibold text-gray-900">{fullName}</p>
          <p className="text-xs text-gray-500">Citizen • Brgy. {barangay}, Daet</p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <User className="h-4 w-4 text-gray-400" />Full Name
            </label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <Mail className="h-4 w-4 text-gray-400" />Email Address
            </label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <Phone className="h-4 w-4 text-gray-400" />Contact Number
            </label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Birthdate</label>
              <input type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Gender</label>
              <select value={gender} onChange={e => setGender(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <MapPin className="h-4 w-4 text-gray-400" />Home Address
            </label>
            <input type="text" value={address} onChange={e => setAddress(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <Building2 className="h-4 w-4 text-gray-400" />Barangay
            </label>
            <select value={barangay} onChange={e => setBarangay(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100">
              {BARANGAYS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <button onClick={handleSave}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
            {saved ? (
              <><CheckCircle2 className="h-4 w-4" />Saved!</>
            ) : (
              <><Save className="h-4 w-4" />Save Changes</>
            )}
          </button>
        </div>

        {/* Account info */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
            <Shield className="h-4 w-4 text-gray-400" />Account Information
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between"><span className="text-gray-500">Account ID</span><span className="font-mono text-gray-700">CIT-2026-0001</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Role</span><span className="text-gray-700">Citizen</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Member Since</span><span className="text-gray-700">March 2026</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="text-green-600 font-medium">Active</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
