import { useState } from 'react';
import {
  HelpCircle,
  BookOpen,
  MessageCircle,
  Send,
  ChevronDown,
  ChevronUp,
  Rocket,
  FileQuestion,
  Phone,
  Mail,
  Info,
  Keyboard,
  ExternalLink,
  Search,
  CheckCircle2,
} from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';

/* ------------------------------------------------------------------ */
/*  DATA                                                                */
/* ------------------------------------------------------------------ */
interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: 'How do I process a new business permit application?',
    answer: 'Navigate to the Business Permits page from the sidebar, click "New Application", fill in the required business information including owner details, business type, and barangay. Attach the required documents and submit for review. The permit will go through the approval workflow automatically.',
  },
  {
    question: 'How do I generate a revenue report?',
    answer: 'Go to Reports Center, select "Revenue Reports" from the categories or use the Generate New Report form. Choose the date range, select your preferred format (PDF, Excel, or CSV), and click Generate. The report will appear in the Recent Reports section once ready.',
  },
  {
    question: 'What should I do if I forgot my password?',
    answer: 'On the login page, click "Forgot Password" and enter your registered email address. A password reset link will be sent to your email. If you do not receive it within 5 minutes, contact your system administrator or the IT Division.',
  },
  {
    question: 'How do I record a real property tax payment?',
    answer: 'Go to Treasury, select "Real Property Tax" tab, click "Record Payment". Enter the Tax Declaration Number, verify the property owner details, input the payment amount and mode of payment, then confirm. An official receipt will be generated automatically.',
  },
  {
    question: 'Can I export data from tables?',
    answer: 'Yes, most data tables in the system support exporting. Look for the "Export" or "Download" button near the top of each table. You can export data in PDF, Excel, or CSV format depending on the module.',
  },
  {
    question: 'How do I file an emergency report?',
    answer: 'Navigate to Emergency Management from the sidebar, click "File Report", select the emergency type (fire, flood, accident, etc.), enter the location details and description, and submit. The report will be routed to the appropriate response team immediately.',
  },
  {
    question: 'Who can access the Audit Trail?',
    answer: 'The Audit Trail is accessible to Administrators and Department Heads only. It tracks all user actions including logins, data modifications, approvals, and system changes for accountability and compliance purposes.',
  },
  {
    question: 'How do I change system settings?',
    answer: 'Only administrators can modify system settings. Go to Settings from the sidebar, where you can configure organization information, notification preferences, security policies, and system maintenance options. All changes are logged in the Audit Trail.',
  },
];

const shortcuts = [
  { keys: ['Ctrl', 'K'], action: 'Open global search' },
  { keys: ['Ctrl', 'N'], action: 'Create new record' },
  { keys: ['Ctrl', 'S'], action: 'Save current form' },
  { keys: ['Ctrl', 'P'], action: 'Print current view' },
  { keys: ['Ctrl', '/'], action: 'Open keyboard shortcuts' },
  { keys: ['Esc'], action: 'Close modal / drawer' },
  { keys: ['Alt', '1'], action: 'Go to Dashboard' },
  { keys: ['Alt', '2'], action: 'Go to Business Permits' },
];

const quickHelp = [
  { icon: Rocket, title: 'Getting Started', desc: 'Learn the basics of the Maogmang Daet Smart System', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: FileQuestion, title: 'FAQ', desc: 'Find answers to commonly asked questions', color: 'text-amber-600', bg: 'bg-amber-50' },
  { icon: BookOpen, title: 'User Guide', desc: 'Detailed documentation for all modules', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: MessageCircle, title: 'Contact Support', desc: 'Get help from the IT support team', color: 'text-purple-600', bg: 'bg-purple-50' },
];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                           */
/* ------------------------------------------------------------------ */
export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqs.filter((f) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
  });

  const inputClass =
    'w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all';

  return (
    <div className="p-6">
      <PageHeader
        title="Help & Support"
        subtitle="Find answers, guides, and contact support"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Help & Support' },
        ]}
      />

      {/* Quick Help Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickHelp.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.title}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 text-left hover:shadow-md transition-shadow group"
            >
              <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{item.title}</h3>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FAQ Section - 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" /> Frequently Asked Questions
              </h3>
            </div>

            {/* FAQ Search */}
            <div className="relative mb-5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search FAQ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`${inputClass} pl-10`}
              />
            </div>

            {/* Accordion */}
            <div className="space-y-2">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className={`border rounded-xl transition-colors ${isOpen ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100'}`}>
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between px-4 py-3.5 text-left"
                    >
                      <span className={`text-sm font-medium ${isOpen ? 'text-blue-700' : 'text-gray-900'}`}>
                        {faq.question}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-blue-500 flex-shrink-0 ml-2" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4">
                        <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                );
              })}
              {filteredFaqs.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-8">No FAQ matches your search.</p>
              )}
            </div>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Keyboard className="w-5 h-5 text-blue-600" /> Keyboard Shortcuts
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {shortcuts.map((s, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{s.action}</span>
                  <div className="flex items-center gap-1">
                    {s.keys.map((key, ki) => (
                      <span key={ki}>
                        <kbd className="px-2 py-0.5 text-xs font-mono font-semibold text-gray-700 bg-white border border-gray-200 rounded-md shadow-sm">
                          {key}
                        </kbd>
                        {ki < s.keys.length - 1 && <span className="text-gray-400 mx-0.5">+</span>}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Send className="w-5 h-5 text-blue-600" /> Contact Support
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input className={inputClass} placeholder="Your name" value={contactName} onChange={(e) => setContactName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input className={inputClass} placeholder="your.email@daet.gov.ph" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input className={inputClass} placeholder="Brief description" value={contactSubject} onChange={(e) => setContactSubject(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea rows={4} className={inputClass} placeholder="Describe your issue..." value={contactMessage} onChange={(e) => setContactMessage(e.target.value)} />
              </div>
              <button className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </div>
          </div>

          {/* System Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" /> System Information
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Version</span>
                <span className="text-gray-900 font-medium">v2.4.1</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last Updated</span>
                <span className="text-gray-900 font-medium">March 15, 2026</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Build</span>
                <span className="text-gray-900 font-medium">#2026.03.1521</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Environment</span>
                <span className="text-gray-900 font-medium">Production</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">License</span>
                <span className="text-gray-900 font-medium">Government Use</span>
              </div>
            </div>
          </div>

          {/* Quick Contact */}
          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
            <h3 className="text-sm font-semibold text-blue-900 mb-3">IT Division Support</h3>
            <div className="space-y-2">
              <a href="tel:054-721-1234" className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-800 transition-colors">
                <Phone className="w-4 h-4" /> (054) 721-1234 local 105
              </a>
              <a href="mailto:itsupport@daet.gov.ph" className="flex items-center gap-2 text-sm text-blue-700 hover:text-blue-800 transition-colors">
                <Mail className="w-4 h-4" /> itsupport@daet.gov.ph
              </a>
            </div>
            <p className="text-xs text-blue-600 mt-3">Available Mon-Fri, 8:00 AM - 5:00 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
}
