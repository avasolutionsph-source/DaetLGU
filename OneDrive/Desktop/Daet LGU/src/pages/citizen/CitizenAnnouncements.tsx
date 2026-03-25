import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bell,
  AlertTriangle,
  Droplets,
  Calendar,
  Megaphone,
  ShieldAlert,
  Construction,
  Clock,
  Pin,
} from 'lucide-react';

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'advisory' | 'emergency' | 'event' | 'maintenance' | 'general';
  pinned: boolean;
  department: string;
}

const CATEGORY_STYLES: Record<string, { icon: typeof Bell; color: string; bg: string; label: string }> = {
  advisory: { icon: AlertTriangle, color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200', label: 'Advisory' },
  emergency: { icon: ShieldAlert, color: 'text-red-700', bg: 'bg-red-50 border-red-200', label: 'Emergency' },
  event: { icon: Calendar, color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200', label: 'Event' },
  maintenance: { icon: Construction, color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200', label: 'Maintenance' },
  general: { icon: Megaphone, color: 'text-gray-700', bg: 'bg-gray-50 border-gray-200', label: 'General' },
};

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'Typhoon Warning: Signal No. 2 Raised Over Camarines Norte',
    content: 'MDRRMO advises all residents to stay indoors and prepare emergency kits. Evacuation centers are open at Daet National High School and Municipal Gym. Classes suspended at all levels.',
    date: '2026-03-26',
    category: 'emergency',
    pinned: true,
    department: 'MDRRMO',
  },
  {
    id: '2',
    title: 'Scheduled Water Interruption - March 28',
    content: 'The Daet Water District will conduct pipe repair works along Vinzons Avenue. Affected barangays: Alawihao, Lag-on, Borabod. Duration: 8:00 AM to 5:00 PM. Please store enough water for the day.',
    date: '2026-03-25',
    category: 'advisory',
    pinned: true,
    department: 'Daet Water District',
  },
  {
    id: '3',
    title: 'Free Medical Mission - April 2, 2026',
    content: 'The Municipal Health Office in partnership with DOH Region 5 will conduct a free medical and dental mission at the Municipal Gym. Services include: General check-up, dental extraction, free medicines, and blood pressure monitoring.',
    date: '2026-03-25',
    category: 'event',
    pinned: false,
    department: 'Municipal Health Office',
  },
  {
    id: '4',
    title: 'Road Closure: J.P. Rizal Street Rehabilitation',
    content: 'Phase 2 of the road rehabilitation project will begin on March 30. J.P. Rizal Street from the Municipal Hall to the Public Market will be closed to traffic. Alternate route: Use Burgos Street. Expected completion: April 15, 2026.',
    date: '2026-03-24',
    category: 'maintenance',
    pinned: false,
    department: 'Municipal Engineering Office',
  },
  {
    id: '5',
    title: 'Business Permit Renewal Deadline Extended',
    content: 'The deadline for 2026 business permit renewal has been extended to April 30, 2026. No penalties will be imposed for renewals completed before the new deadline. Visit the BPLO office or apply online.',
    date: '2026-03-23',
    category: 'general',
    pinned: false,
    department: 'BPLO',
  },
  {
    id: '6',
    title: 'Real Property Tax Payment - Early Bird Discount',
    content: 'Pay your 2026 Real Property Tax before March 31 and get a 10% discount. Payment can be made at the Municipal Treasury Office or through authorized payment centers.',
    date: '2026-03-22',
    category: 'advisory',
    pinned: false,
    department: 'Municipal Treasury Office',
  },
  {
    id: '7',
    title: 'Barangay Assembly Schedule - April 2026',
    content: 'All barangays are required to conduct their quarterly Barangay Assembly on the first Saturday of April (April 4, 2026). Residents are encouraged to attend and participate in community discussions.',
    date: '2026-03-21',
    category: 'event',
    pinned: false,
    department: "Mayor's Office",
  },
  {
    id: '8',
    title: 'System Maintenance Notice',
    content: 'The Maogmang Daet Smart System will undergo scheduled maintenance on March 29, 2026, from 10 PM to 2 AM. Online services will be temporarily unavailable during this period.',
    date: '2026-03-20',
    category: 'maintenance',
    pinned: false,
    department: 'IT Division',
  },
];

export default function CitizenAnnouncements() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = ANNOUNCEMENTS.filter(a => filter === 'all' || a.category === filter);
  const pinned = filtered.filter(a => a.pinned);
  const regular = filtered.filter(a => !a.pinned);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-30 border-b border-gray-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <button onClick={() => navigate('/citizen-hub')} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-gray-900">Announcements</h1>
            <p className="text-xs text-gray-500">News and advisories from the LGU</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-5 sm:px-6">
        {/* Category filters */}
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'emergency', label: 'Emergency' },
            { id: 'advisory', label: 'Advisory' },
            { id: 'event', label: 'Events' },
            { id: 'maintenance', label: 'Maintenance' },
            { id: 'general', label: 'General' },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                filter === f.id ? 'border-blue-300 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Pinned */}
        {pinned.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <Pin className="h-3 w-3" />Pinned
            </p>
            <div className="space-y-3">
              {pinned.map(a => <AnnouncementCard key={a.id} item={a} expanded={expanded === a.id} onToggle={() => setExpanded(expanded === a.id ? null : a.id)} />)}
            </div>
          </div>
        )}

        {/* Regular */}
        <div className="space-y-3">
          {regular.map(a => <AnnouncementCard key={a.id} item={a} expanded={expanded === a.id} onToggle={() => setExpanded(expanded === a.id ? null : a.id)} />)}
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <Bell className="mx-auto mb-3 h-10 w-10 text-gray-300" />
            <p className="text-sm text-gray-500">No announcements found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function AnnouncementCard({ item, expanded, onToggle }: { item: Announcement; expanded: boolean; onToggle: () => void }) {
  const cat = CATEGORY_STYLES[item.category];
  return (
    <button onClick={onToggle} className={`w-full rounded-xl border bg-white p-4 text-left shadow-sm transition hover:shadow-md ${item.pinned ? 'border-blue-200' : 'border-gray-200'}`}>
      <div className="flex items-start gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${cat.bg}`}>
          <cat.icon className={`h-4 w-4 ${cat.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-gray-900">{item.title}</p>
          </div>
          <div className="mt-1 flex items-center gap-3 text-[11px] text-gray-400">
            <span className={`rounded-full border px-2 py-0.5 font-medium ${cat.bg} ${cat.color}`}>{cat.label}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{item.date}</span>
            <span>{item.department}</span>
          </div>
          {expanded && (
            <p className="mt-3 text-sm leading-relaxed text-gray-600 whitespace-pre-line">{item.content}</p>
          )}
        </div>
      </div>
    </button>
  );
}
