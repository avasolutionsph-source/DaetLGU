import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { Button, Input } from '@/components/ui';

// ─── LoginPage ────────────────────────────────────────────────────
export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@smartdental.ph');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate brief auth delay
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    navigate('/dashboard');
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 px-4">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-primary-400/10 blur-3xl" />
        <div className="absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-primary-300/5 blur-2xl" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-white shadow-2xl">
          {/* Header */}
          <div className="rounded-t-2xl bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-8 text-center">
            {/* Logo / Icon */}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 shadow-lg backdrop-blur-sm">
              <svg
                viewBox="0 0 24 24"
                className="h-9 w-9 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2C8.5 2 6 4.5 6 7c0 1.5.5 3 1.5 4L12 22l4.5-11c1-1 1.5-2.5 1.5-4 0-2.5-2.5-5-6-5z" />
                <circle cx="12" cy="7.5" r="2" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">SmartDental</h1>
            <p className="mt-1 text-sm text-primary-100">Dental Clinic Management System</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 px-8 py-8">
            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="h-4 w-4" />}
              autoComplete="email"
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
              autoComplete="current-password"
              required
            />

            <Button
              type="submit"
              size="lg"
              loading={loading}
              leftIcon={<LogIn className="h-5 w-5" />}
              className="w-full"
            >
              Sign In
            </Button>

            {/* Demo notice */}
            <div className="rounded-lg border border-primary-100 bg-primary-50 px-4 py-3 text-center">
              <p className="text-xs font-medium text-primary-700">
                Demo Mode &mdash; Click Sign In to continue
              </p>
              <p className="mt-0.5 text-xs text-primary-500">
                No real authentication is required
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-primary-200">
          SmartDental &copy; {new Date().getFullYear()} &mdash; v1.0 Demo
        </p>
      </div>
    </div>
  );
}
