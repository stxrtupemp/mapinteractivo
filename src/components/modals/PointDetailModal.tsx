import { ExternalLink, Navigation, Pencil, Trash2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { PhotoGallery } from '../ui/PhotoGallery';
import { Button } from '../ui/Button';
import { Point, Category } from '../../types';
import { googleMapsUrl, wazeUrl } from '../../lib/navigation';

interface PointDetailModalProps {
  point: Point | null;
  categories: Category[];
  isAdmin: boolean;
  onClose: () => void;
  onEdit: (point: Point) => void;
  onDelete: (point: Point) => void;
}

export function PointDetailModal({
  point,
  categories,
  isAdmin,
  onClose,
  onEdit,
  onDelete,
}: PointDetailModalProps) {
  if (!point) return null;

  const category = categories.find((c) => c.id === point.category_id);
  const subcategory = categories.find((c) => c.id === point.subcategory_id);

  return (
    <Modal open={!!point} onClose={onClose} title={point.title} maxWidth="lg">
      <div className="flex flex-col gap-4">
        {(category || subcategory) && (
          <div className="flex gap-2 flex-wrap">
            {category && (
              <span
                className="px-2 py-0.5 rounded-full text-xs text-white font-medium"
                style={{ backgroundColor: category.color }}
              >
                {category.name}
              </span>
            )}
            {subcategory && (
              <span
                className="px-2 py-0.5 rounded-full text-xs text-white font-medium"
                style={{ backgroundColor: subcategory.color }}
              >
                {subcategory.name}
              </span>
            )}
          </div>
        )}

        {point.description && (
          <p className="text-sm text-gray-700 leading-relaxed">{point.description}</p>
        )}

        {point.suggestion && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
            <p className="text-xs font-semibold text-amber-700 mb-1">Sugerencia</p>
            <p className="text-sm text-amber-800">{point.suggestion}</p>
          </div>
        )}

        {point.photo_urls?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Fotos</p>
            <PhotoGallery urls={point.photo_urls} />
          </div>
        )}

        <div className="flex gap-2 flex-wrap pt-1">
          <a
            href={googleMapsUrl(point.lat, point.lon)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <ExternalLink size={14} />
            Google Maps
          </a>
          <a
            href={wazeUrl(point.lat, point.lon)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Navigation size={14} />
            Waze
          </a>
        </div>

        {isAdmin && (
          <div className="flex gap-2 pt-2 border-t">
            <Button variant="secondary" size="sm" onClick={() => onEdit(point)}>
              <Pencil size={13} />
              Editar
            </Button>
            <Button variant="danger" size="sm" onClick={() => onDelete(point)}>
              <Trash2 size={13} />
              Borrar
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}
