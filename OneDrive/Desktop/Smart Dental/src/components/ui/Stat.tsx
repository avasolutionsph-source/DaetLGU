import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { ComponentType, ReactNode } from 'react';
import type { LucideProps } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────────
type Trend = 'up' | 'down' | 'neutral';

interface StatProps {
  label: string;
  value: string | number;
  change?: string;
  icon?: ComponentType<LucideProps>;
  trend?: Trend;
  className?: string;
}

// ─── Trend Config ─────────────────────────────────────────────────
const trendConfig: Record<Trend, { icon: ComponentType<LucideProps>; color: string }> = {
  up: { icon: TrendingUp, color: 'text-success-600' },
  down: { icon: TrendingDown, color: 'text-danger-500' },
  neutral: { icon: Minus, color: 'text-gray-400' },
};

// ─── Component ────────────────────────────────────────────────────
function Stat({ label, value, change, icon: Icon, trend, className }: StatProps) {
  const TrendIcon = trend ? trendConfig[trend].icon : null;
  const trendColor = trend ? trendConfig[trend].color : '';

  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200 bg-white p-5 shadow-sm',
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>

          {change && (
            <div className={cn('mt-2 flex items-center gap-1 text-xs font-medium', trendColor)}>
              {TrendIcon && <TrendIcon className="h-3.5 w-3.5" />}
              <span>{change}</span>
            </div>
          )}
        </div>

        {Icon && (
          <div className="shrink-0 rounded-lg bg-primary-50 p-2.5">
            <Icon className="h-5 w-5 text-primary-600" />
          </div>
        )}
      </div>
    </div>
  );
}

export { Stat };
export type { StatProps, Trend };
