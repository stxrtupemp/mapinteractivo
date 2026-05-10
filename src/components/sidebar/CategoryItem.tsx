import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Category, Point } from '../../types';
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

  const subcategories = allCategories.filter((c) => c.parent_id === category.id);
  const directPoints = points.filter(
    (p) => p.category_id === category.id && !p.subcategory_id
  );
  const hasChildren = subcategories.length > 0 || directPoints.length > 0;

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors"
      >
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ backgroundColor: category.color }}
        />
        <span className="flex-1 text-sm font-medium text-gray-800 truncate">{category.name}</span>
        {hasChildren && (
          <span className="text-gray-400 shrink-0">
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        )}
      </button>

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
