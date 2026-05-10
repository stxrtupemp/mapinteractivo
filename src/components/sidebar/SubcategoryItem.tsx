import { useState } from 'react';
import { ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { Category, Point } from '../../types';
import { useUIStore } from '../../store/uiStore';
import { PointItem } from './PointItem';

interface SubcategoryItemProps {
  subcategory: Category;
  points: Point[];
  onPointClick: (point: Point) => void;
}

export function SubcategoryItem({ subcategory, points, onPointClick }: SubcategoryItemProps) {
  const [open, setOpen] = useState(false);
  const { hiddenCategoryIds, toggleCategoryVisibility } = useUIStore();
  const hidden = hiddenCategoryIds.has(subcategory.id);

  const subPoints = points.filter((p) => p.subcategory_id === subcategory.id);

  return (
    <div>
      <div className="flex items-center hover:bg-gray-50 transition-colors">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex-1 flex items-center gap-2 px-4 py-2 text-left min-w-0"
        >
          <span
            className="w-2 h-2 rounded-full shrink-0 transition-colors"
            style={{ backgroundColor: hidden ? '#cbd5e1' : subcategory.color }}
          />
          <span className={`flex-1 text-xs font-medium truncate transition-colors ${hidden ? 'text-gray-400' : 'text-gray-700'}`}>
            {subcategory.name}
          </span>
          {subPoints.length > 0 && (
            <>
              <span className="text-xs text-gray-400">{subPoints.length}</span>
              <span className="text-gray-400 shrink-0">
                {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </span>
            </>
          )}
        </button>
        <button
          onClick={() => toggleCategoryVisibility(subcategory.id)}
          title={hidden ? 'Mostrar en mapa' : 'Ocultar en mapa'}
          className="pr-4 pl-1 py-2 transition-colors"
        >
          {hidden
            ? <EyeOff size={13} className="text-gray-300" />
            : <Eye size={13} style={{ color: subcategory.color }} />
          }
        </button>
      </div>

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
