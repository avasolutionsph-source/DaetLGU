import { type ReactNode } from 'react';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  children: ReactNode;
  size?: 'sm' | 'md';
}

const variantMap = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-700 ring-amber-200',
  danger: 'bg-red-50 text-red-700 ring-red-200',
  info: 'bg-blue-50 text-blue-700 ring-blue-200',
  neutral: 'bg-gray-50 text-gray-600 ring-gray-200',
};

const sizeMap = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
};

export default function Badge({
  variant = 'neutral',
  children,
  size = 'sm',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ring-1 ring-inset ${variantMap[variant]} ${sizeMap[size]}`}
    >
      {children}
    </span>
  );
}
