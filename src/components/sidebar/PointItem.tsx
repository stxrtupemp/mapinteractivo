import { MapPin } from 'lucide-react';
import { Point } from '../../types';

interface PointItemProps {
  point: Point;
  color: string;
  onPointClick: (point: Point) => void;
}

export function PointItem({ point, color, onPointClick }: PointItemProps) {
  return (
    <button
      onClick={() => onPointClick(point)}
      className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-blue-50 transition-colors group"
    >
      <MapPin size={13} style={{ color }} className="shrink-0" />
      <span className="text-xs text-gray-700 group-hover:text-blue-700 truncate">{point.title}</span>
    </button>
  );
}
