import type { JobStatus } from '../types';
import { STATUS_CONFIG } from '../types';

interface Props {
  status: JobStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'sm' }: Props) {
  const config = STATUS_CONFIG[status];
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClass} ${config.bg} ${config.color}`}>
      {config.label}
    </span>
  );
}
