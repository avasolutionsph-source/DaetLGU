interface ProgressBarProps {
  value: number;
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

const colorMap = {
  blue: 'bg-blue-500',
  green: 'bg-emerald-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
};

const trackColorMap = {
  blue: 'bg-blue-100',
  green: 'bg-emerald-100',
  amber: 'bg-amber-100',
  red: 'bg-red-100',
  purple: 'bg-purple-100',
};

const sizeMap = {
  sm: 'h-1.5',
  md: 'h-2.5',
};

export default function ProgressBar({
  value,
  color = 'blue',
  size = 'md',
  showLabel = false,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="flex items-center gap-3">
      <div className={`flex-1 rounded-full overflow-hidden ${trackColorMap[color]} ${sizeMap[size]}`}>
        <div
          className={`${sizeMap[size]} rounded-full ${colorMap[color]} transition-all duration-500 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-gray-600 tabular-nums w-10 text-right">
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
}
