import { Menu, X, MapPin } from 'lucide-react';
import { Category, Point } from '../../types';
import { useUIStore } from '../../store/uiStore';
import { CategoryItem } from './CategoryItem';

interface SidebarProps {
  categories: Category[];
  points: Point[];
  onPointClick: (point: Point) => void;
}

export function Sidebar({ categories, points, onPointClick }: SidebarProps) {
  const { sidebarOpen, toggleSidebar } = useUIStore();

  const rootCategories = categories.filter((c) => !c.parent_id);

  const handlePointClick = (point: Point) => {
    onPointClick(point);
    // Auto-close on mobile when a point is selected
    if (window.innerWidth < 768) toggleSidebar();
  };

  return (
    <>
      {/* Mobile/desktop backdrop when open */}
      {sidebarOpen && (
        <div
          className="absolute inset-0 z-[695] bg-black/30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Floating open button — visible only when sidebar is closed */}
      <button
        onClick={toggleSidebar}
        className={`absolute top-20 left-2 z-[700] bg-white rounded-xl shadow-lg p-2.5
          border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all duration-200
          ${sidebarOpen ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 scale-100'}`}
        title="Abrir panel"
        aria-label="Abrir panel lateral"
      >
        <Menu size={20} />
      </button>

      {/* Sidebar panel — slides in from left */}
      <div
        className={`absolute inset-y-0 left-0 z-[700] flex flex-col bg-white shadow-2xl
          transition-transform duration-300 ease-in-out
          w-[85vw] max-w-sm md:w-80
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <MapPin size={18} className="shrink-0" />
            <span className="font-semibold text-sm truncate">San Pedro del Pinatar</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors shrink-0 ml-2"
            aria-label="Cerrar panel"
          >
            <X size={18} />
          </button>
        </div>

        {/* Category tree */}
        <div className="overflow-y-auto flex-1 py-2">
          {rootCategories.length === 0 ? (
            <p className="px-4 py-6 text-sm text-gray-400 text-center">
              Sin categorías todavía.
            </p>
          ) : (
            rootCategories.map((cat) => (
              <CategoryItem
                key={cat.id}
                category={cat}
                allCategories={categories}
                points={points}
                onPointClick={handlePointClick}
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
