import { useNavigate } from 'react-router-dom';
import { useAuth, type UserRole } from '../lib/auth';
import {
  Crown,
  Wallet,
  Briefcase,
  HardHat,
  ShieldAlert,
  Building2,
  CheckCircle2,
  Zap,
  BarChart3,
  Globe,
  Lock,
  Mail,
} from 'lucide-react';

interface RoleCard {
  role: UserRole;
  label: string;
  department: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const ROLE_CARDS: RoleCard[] = [
  {
    role: 'mayor',
    label: 'Mayor',
    department: "Mayor's Office",
    icon: Crown,
    color: 'from-amber-500 to-orange-600',
  },
  {
    role: 'treasury',
    label: 'Treasury Officer',
    department: 'Municipal Treasury',
    icon: Wallet,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    role: 'bplo',
    label: 'BPLO Officer',
    department: 'Business Permits & Licensing',
    icon: Briefcase,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    role: 'engineering',
    label: 'Engineering Office',
    department: 'Municipal Engineering',
    icon: HardHat,
    color: 'from-violet-500 to-purple-600',
  },
  {
    role: 'mdrrmo',
    label: 'MDRRMO',
    department: 'Disaster Risk Reduction',
    icon: ShieldAlert,
    color: 'from-red-500 to-rose-600',
  },
  {
    role: 'barangay',
    label: 'Barangay Officer',
    department: 'Barangay Operations',
    icon: Building2,
    color: 'from-cyan-500 to-blue-600',
  },
];

const SYSTEM_HIGHLIGHTS = [
  { icon: Zap, text: 'Real-time revenue tracking & budget management' },
  { icon: BarChart3, text: 'AI-powered analytics & predictive reporting' },
  { icon: Globe, text: 'Citizen services portal with document tracking' },
  { icon: ShieldAlert, text: 'Emergency operations & disaster response center' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleLogin = (role: UserRole) => {
    login(role);
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Branding Panel */}
      <div className="relative hidden w-[480px] shrink-0 overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:w-[540px]">
        {/* Decorative shapes */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute right-10 top-1/2 h-40 w-40 -translate-y-1/2 rounded-full bg-white/[0.03]" />

        <div className="relative">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 text-lg font-bold backdrop-blur-sm">
              D
            </div>
            <div>
              <p className="text-sm font-medium text-blue-200">Municipality of Daet</p>
              <p className="text-xs text-blue-300">Camarines Norte, Philippines</p>
            </div>
          </div>

          <h1 className="text-3xl font-bold leading-tight xl:text-4xl">
            SMART LGU
            <br />
            ERP System
          </h1>
          <p className="mt-3 text-lg font-medium text-blue-200">
            Digital Command Center for Municipal Operations
          </p>

          {/* System Highlights */}
          <div className="mt-10 space-y-4">
            {SYSTEM_HIGHLIGHTS.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <item.icon className="h-4 w-4 text-blue-200" />
                </div>
                <p className="pt-1 text-sm leading-snug text-blue-100">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Daet Needs This */}
        <div className="relative mt-10 rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
          <h3 className="mb-2 text-sm font-semibold text-blue-200">Why Daet Needs This</h3>
          <p className="text-sm leading-relaxed text-blue-200/80">
            As the capital of Camarines Norte, Daet serves over 130,000 constituents across 25
            barangays. This ERP system modernizes municipal operations, enabling transparent
            governance, faster service delivery, and data-driven decision-making for every
            department.
          </p>
        </div>

        <p className="relative mt-6 text-xs text-blue-300/60">
          &copy; 2026 Municipality of Daet. All rights reserved.
        </p>
      </div>

      {/* Right Login Panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-lg">
          {/* Mobile branding */}
          <div className="mb-8 text-center lg:hidden">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
              D
            </div>
            <h1 className="text-xl font-bold text-gray-900">SMART LGU ERP</h1>
            <p className="text-sm text-gray-500">Municipality of Daet</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
            <p className="mt-1 text-sm text-gray-500">
              Select a role to explore the system, or sign in with your credentials.
            </p>
          </div>

          {/* Demo Role Cards */}
          <div className="mb-8">
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                <Zap className="h-3 w-3" />
                Demo Mode
              </span>
              <span className="text-xs text-gray-400">Quick access</span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {ROLE_CARDS.map((card) => (
                <button
                  key={card.role}
                  onClick={() => handleRoleLogin(card.role)}
                  className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-lg active:translate-y-0"
                >
                  <div
                    className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${card.color} text-white shadow-sm`}
                  >
                    <card.icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{card.label}</p>
                  <p className="mt-0.5 text-[11px] leading-tight text-gray-500">
                    {card.department}
                  </p>
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-gray-50 px-3 text-gray-400 lg:bg-white">or sign in with credentials</span>
            </div>
          </div>

          {/* Traditional Login Form (non-functional, UI only) */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="space-y-4"
          >
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  placeholder="you@daet.gov.ph"
                  className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 outline-none transition-colors focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Remember me
              </label>
              <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 active:bg-blue-800"
            >
              <CheckCircle2 className="h-4 w-4" />
              Sign in
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-gray-400">
            Protected system. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}
