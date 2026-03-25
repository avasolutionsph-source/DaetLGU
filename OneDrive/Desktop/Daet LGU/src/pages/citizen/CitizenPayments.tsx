import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CreditCard,
  Landmark,
  Briefcase,
  FileText,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Clock,
  Wallet,
} from 'lucide-react';

interface TaxItem {
  id: string;
  type: string;
  description: string;
  icon: typeof Landmark;
  amount: string;
  dueDate: string;
  status: 'unpaid' | 'partial' | 'paid';
  tdNo?: string;
}

const TAX_ITEMS: TaxItem[] = [
  { id: '1', type: 'Real Property Tax', description: 'Lot 234, Brgy. Alawihao - Residential', icon: Landmark, amount: '₱3,450.00', dueDate: 'Mar 31, 2026', status: 'unpaid', tdNo: 'TD-2026-00234' },
  { id: '2', type: 'Community Tax (Cedula)', description: 'Annual community tax certificate', icon: FileText, amount: '₱105.00', dueDate: 'Mar 31, 2026', status: 'unpaid' },
  { id: '3', type: 'Business Permit Fee', description: 'JDC Sari-Sari Store - Renewal 2026', icon: Briefcase, amount: '₱1,250.00', dueDate: 'Jan 20, 2026', status: 'paid' },
  { id: '4', type: 'Real Property Tax', description: 'Lot 567, Brgy. Lag-on - Commercial', icon: Landmark, amount: '₱8,200.00', dueDate: 'Mar 31, 2026', status: 'partial', tdNo: 'TD-2026-00567' },
];

const PAYMENT_METHODS = [
  { id: 'gcash', name: 'GCash', desc: 'Pay via GCash e-wallet', color: 'bg-blue-600' },
  { id: 'maya', name: 'Maya', desc: 'Pay via Maya e-wallet', color: 'bg-green-600' },
  { id: 'bank', name: 'Bank Transfer', desc: 'BDO, BPI, Landbank', color: 'bg-gray-700' },
  { id: 'otc', name: 'Over-the-Counter', desc: 'Pay at Municipal Treasury', color: 'bg-amber-600' },
];

const STATUS_STYLES: Record<string, { color: string; bg: string; label: string }> = {
  unpaid: { color: 'text-red-700', bg: 'bg-red-50 border-red-200', label: 'Unpaid' },
  partial: { color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', label: 'Partial' },
  paid: { color: 'text-green-700', bg: 'bg-green-50 border-green-200', label: 'Paid' },
};

export default function CitizenPayments() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'list' | 'pay' | 'success'>('list');
  const [selected, setSelected] = useState<TaxItem | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [refNo, setRefNo] = useState('');

  const unpaidItems = TAX_ITEMS.filter(t => t.status !== 'paid');
  const totalDue = unpaidItems.reduce((sum, t) => sum + parseFloat(t.amount.replace(/[₱,]/g, '')), 0);

  const handlePay = (item: TaxItem) => {
    setSelected(item);
    setStep('pay');
  };

  const handleConfirmPayment = () => {
    if (!paymentMethod) return;
    setProcessing(true);
    setTimeout(() => {
      setRefNo(`PAY-${Date.now().toString(36).toUpperCase()}`);
      setProcessing(false);
      setStep('success');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <button onClick={() => step === 'list' ? navigate('/citizen-hub') : setStep('list')} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-gray-900">Pay Taxes & Fees</h1>
            <p className="text-xs text-gray-500">{step === 'list' ? `${unpaidItems.length} unpaid item(s)` : step === 'pay' ? 'Select payment method' : 'Payment confirmed'}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-5 sm:px-6">
        {step === 'list' && (
          <>
            {/* Summary card */}
            <div className="mb-5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-700 p-5 text-white shadow-lg">
              <div className="flex items-center gap-2 text-teal-100">
                <Wallet className="h-4 w-4" />
                <span className="text-xs font-medium">Total Balance Due</span>
              </div>
              <p className="mt-1 text-2xl font-bold">₱{totalDue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</p>
              <p className="mt-1 text-xs text-teal-200">{unpaidItems.length} unpaid items • Deadline: March 31, 2026</p>
            </div>

            {/* Early bird banner */}
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
              <Receipt className="h-5 w-5 text-emerald-600 shrink-0" />
              <p className="text-xs text-emerald-700"><span className="font-semibold">Early bird discount!</span> Pay RPT before March 31 and get 10% off.</p>
            </div>

            {/* Tax items */}
            <div className="space-y-3">
              {TAX_ITEMS.map(item => {
                const sts = STATUS_STYLES[item.status];
                return (
                  <div key={item.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{item.type}</p>
                            <p className="text-xs text-gray-500">{item.description}</p>
                            {item.tdNo && <p className="text-[11px] font-mono text-gray-400">{item.tdNo}</p>}
                          </div>
                          <span className={`shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${sts.bg} ${sts.color}`}>
                            {sts.label}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center gap-3 text-[11px] text-gray-400">
                            <span className="text-base font-bold text-gray-900">{item.amount}</span>
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Due: {item.dueDate}</span>
                          </div>
                          {item.status !== 'paid' && (
                            <button onClick={() => handlePay(item)}
                              className="rounded-lg bg-teal-600 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-teal-700">
                              Pay Now
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {step === 'pay' && selected && (
          <div>
            {/* Payment summary */}
            <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-gray-500">Paying for</p>
              <p className="text-sm font-semibold text-gray-900">{selected.type}</p>
              <p className="text-xs text-gray-500">{selected.description}</p>
              <p className="mt-3 text-2xl font-bold text-gray-900">{selected.amount}</p>
            </div>

            <h3 className="mb-3 text-sm font-semibold text-gray-900">Select Payment Method</h3>
            <div className="space-y-3 mb-5">
              {PAYMENT_METHODS.map(m => (
                <button key={m.id} onClick={() => setPaymentMethod(m.id)}
                  className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                    paymentMethod === m.id ? 'border-teal-400 bg-teal-50 ring-2 ring-teal-100' : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}>
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${m.color} text-white`}>
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{m.name}</p>
                    <p className="text-xs text-gray-500">{m.desc}</p>
                  </div>
                  {paymentMethod === m.id && <CheckCircle2 className="ml-auto h-5 w-5 text-teal-600" />}
                </button>
              ))}
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 mb-5">
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-700">This is a demo. No actual payment will be processed.</p>
              </div>
            </div>

            <button onClick={handleConfirmPayment} disabled={!paymentMethod || processing}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {processing ? (
                <><svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Processing Payment...</>
              ) : (
                <><CreditCard className="h-4 w-4" />Confirm Payment — {selected.amount}</>
              )}
            </button>
          </div>
        )}

        {step === 'success' && (
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Payment Successful!</h2>
            <p className="mt-2 text-sm text-gray-500">Your payment has been received and recorded.</p>
            <p className="mt-3 font-mono text-sm font-medium text-gray-600">Ref: {refNo}</p>
            {selected && <p className="mt-1 text-lg font-bold text-gray-900">{selected.amount}</p>}
            <div className="mt-6 flex gap-3">
              <button onClick={() => { setStep('list'); setSelected(null); setPaymentMethod(''); }}
                className="flex-1 rounded-xl border border-gray-200 bg-white py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">Back to Bills</button>
              <button onClick={() => navigate('/citizen-hub')}
                className="flex-1 rounded-xl bg-gray-900 py-3 text-sm font-medium text-white hover:bg-gray-800">Go Home</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
