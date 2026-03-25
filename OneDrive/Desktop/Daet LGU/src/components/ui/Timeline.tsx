interface TimelineItem {
  date: string;
  title: string;
  description?: string;
  status?: 'completed' | 'current' | 'upcoming';
}

interface TimelineProps {
  items: TimelineItem[];
}

const dotStyles = {
  completed: 'bg-emerald-500 ring-emerald-100',
  current: 'bg-blue-500 ring-blue-100',
  upcoming: 'bg-gray-300 ring-gray-100',
};

export default function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative">
      {items.map((item, idx) => {
        const status = item.status || 'upcoming';
        const isLast = idx === items.length - 1;

        return (
          <div key={idx} className="relative flex gap-4 pb-8 last:pb-0">
            {/* Connector line */}
            {!isLast && (
              <div className="absolute left-[9px] top-5 w-0.5 h-full bg-gray-200" />
            )}

            {/* Dot */}
            <div className="relative flex-shrink-0 mt-1">
              <div
                className={`w-[18px] h-[18px] rounded-full ring-4 ${dotStyles[status]}`}
              />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                <time className="text-xs text-gray-400 flex-shrink-0">{item.date}</time>
              </div>
              {item.description && (
                <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
