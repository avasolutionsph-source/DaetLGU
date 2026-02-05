import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────
interface Tab {
  key: string;
  label: string;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (key: string) => void;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────
function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  return (
    <div className={cn('border-b border-gray-200', className)}>
      <nav className="-mb-px flex gap-6" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onTabChange(tab.key)}
              className={cn(
                'inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-1 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium',
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'bg-gray-100 text-gray-600',
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

export { Tabs };
export type { TabsProps, Tab };
