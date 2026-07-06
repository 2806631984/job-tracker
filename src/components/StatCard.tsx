import type { ReactNode } from 'react';

interface Props {
  label: string;
  value: number | string;
  icon?: ReactNode;
  color?: string;
  subtitle?: string;
}

export default function StatCard({ label, value, icon, color, subtitle }: Props) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
        {icon && (
          <span className="p-1.5 rounded-lg" style={{ backgroundColor: `${color}15`, color }}>
            {icon}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</div>
      {subtitle && <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</div>}
    </div>
  );
}
