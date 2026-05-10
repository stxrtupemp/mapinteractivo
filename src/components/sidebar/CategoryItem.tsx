import { useState } from 'react';
import { ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { Category, Point } from '../../types';
import { useUIStore } from '../../store/uiStore';
import { SubcategoryItem } from './SubcategoryItem';
import { PointItem } from './PointItem';

interface CategoryItemProps {
  category: Category;
  allCategories: Category[];
  points: Point[];
  onPointClick: (point: Point) => void;
}

export function CategoryItem({ category, allCategories, points, onPointClick }: CategoryItemProps) {
  const [open, setOpen] = useState(false);
  const { hiddenCategoryIds, toggleCategoryVisibility } = useUIStore();
  const hidden = hiddenCategoryIds.has(category.id);

  const subcategories = allCategories.filter((c) => c.parent_id === category.id);
  const directPoints = points.filter(
    (p) => p.category_id === category.id && !p.subcategory_id
  );
  const hasChildren = subcategories.length > 0 || directPoints.length > 0;

  return (
    <div>
      <div className="flex items-center hover:bg-gray-50 transition-colors">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex-1 flex items-center gap-2 px-4 py-2.5 text-left min-w-0"
        >
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0 transition-colors"
            style={{ backgroundColor: hidden ? '#cbd5e1' : category.color }}
          />
          <span className={`flex-1 text-sm font-medium truncate transition-colors ${hidden ? 'text-gray-400' : 'text-gray-800'}`}>
            {category.name}
          </span>
          {hasChildren && (
            <span className="text-gray-400 shrink-0">
              {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
          )}
        </button>
        <button
          onClick={() => toggleCategoryVisibility(category.id)}
          title={hidden ? 'Mostrar en mapa' : 'Ocultar en mapa'}
          className="pr-4 pl-1 py-2.5 transition-colors"
        >
          {hidden
            ? <EyeOff size={14} className="text-gray-300" />
            : <Eye size={14} style={{ color: category.color }} />
          }
        </button>
      </div>

      {open && (
        <div className="pl-3">
          {subcategories.map((sub) => (
            <SubcategoryItem
              key={sub.id}
              subcategory={sub}
              points={points}
              onPointClick={onPointClick}
            />
          ))}
          {directPoints.map((point) => (
            <PointItem key={point.id} point={point} onPointClick={onPointClick} color={category.color} />
          ))}
        </div>
      )}
    </div>
  );
}
