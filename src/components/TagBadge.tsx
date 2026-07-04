import { X } from 'lucide-react';

interface Props {
  name: string;
  color: string;
  onRemove?: () => void;
  onClick?: () => void;
  selected?: boolean;
  size?: 'sm' | 'md';
}

export default function TagBadge({ name, color, onRemove, onClick, selected, size = 'sm' }: Props) {
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-full font-medium ${sizeClass} transition-all
        ${onClick ? 'cursor-pointer hover:opacity-80' : ''}
        ${selected ? 'ring-2 ring-offset-1' : ''}`}
      style={{
        backgroundColor: `${color}20`,
        color: color,
        ...(selected ? { ringColor: color } : {}),
      }}
    >
      {name}
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="ml-0.5 rounded-full p-0.5 hover:bg-black/10 transition-colors"
        >
          <X size={10} />
        </button>
      )}
    </span>
  );
}
