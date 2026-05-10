import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Category, Point } from '../../types';
import { PointItem } from './PointItem';

interface SubcategoryItemProps {
  subcategory: Category;
  points: Point[];
  onPointClick: (point: Point) => void;
}

export function SubcategoryItem({ subcategory, points, onPointClick }: SubcategoryItemProps) {
  const [open, setOpen] = useState(false);

  const subPoints = points.filter((p) => p.subcategory_id === subcategory.id);

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-4 py-2 text-left hover:bg-gray-50 transition-colors"
      >
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: subcategory.color }}
        />
        <span className="flex-1 text-xs font-medium text-gray-700 truncate">{subcategory.name}</span>
        {subPoints.length > 0 && (
          <>
            <span className="text-xs text-gray-400">{subPoints.length}</span>
            <span className="text-gray-400 shrink-0">
              {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            </span>
          </>
        )}
      </button>

      {open && (
        <div className="pl-3">
          {subPoints.map((point) => (
            <PointItem key={point.id} point={point} onPointClick={onPointClick} color={subcategory.color} />
          ))}
        </div>
      )}
    </div>
  );
}
