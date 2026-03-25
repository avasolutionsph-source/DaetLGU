/**
 * Format a number as Philippine Peso currency.
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a date string into a human-readable form.
 * Accepts ISO strings or any value the Date constructor understands.
 */
export function formatDate(date: string): string {
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return new Intl.DateTimeFormat('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

/**
 * Format a number with comma separators.
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-PH').format(num);
}

/**
 * Merge class names, filtering out falsy values.
 */
export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Return Tailwind color utility classes for common statuses.
 */
export function getStatusColor(status: string): string {
  const normalized = status.toLowerCase().replace(/[\s_-]/g, '');
  const map: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    approved: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    completed: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    resolved: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    paid: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    processing: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    inprogress: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    ongoing: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    review: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    rejected: 'bg-red-50 text-red-700 ring-red-600/20',
    denied: 'bg-red-50 text-red-700 ring-red-600/20',
    overdue: 'bg-red-50 text-red-700 ring-red-600/20',
    cancelled: 'bg-red-50 text-red-700 ring-red-600/20',
    expired: 'bg-red-50 text-red-700 ring-red-600/20',
    inactive: 'bg-gray-50 text-gray-600 ring-gray-500/20',
    draft: 'bg-gray-50 text-gray-600 ring-gray-500/20',
    closed: 'bg-gray-50 text-gray-600 ring-gray-500/20',
    urgent: 'bg-rose-50 text-rose-700 ring-rose-600/20',
    critical: 'bg-rose-50 text-rose-700 ring-rose-600/20',
  };
  return map[normalized] ?? 'bg-gray-50 text-gray-600 ring-gray-500/20';
}

/**
 * Get initials from a full name (up to 2 characters).
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/**
 * Truncate a string to a max length, appending an ellipsis if truncated.
 */
export function truncate(str: string, len: number): string {
  if (str.length <= len) return str;
  return str.slice(0, len).trimEnd() + '...';
}
