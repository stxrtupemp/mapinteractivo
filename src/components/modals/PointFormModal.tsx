import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '../ui/Modal';
import { Input, Textarea } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { CoordsPasteField } from '../ui/CoordsPasteField';
import { PhotoUploader } from '../admin/PhotoUploader';
import { Point, Category } from '../../types';
import { uploadPointPhoto, deletePointPhoto } from '../../lib/storage';

const schema = z.object({
  title: z.string().min(1, 'Título requerido'),
  description: z.string().optional(),
  suggestion: z.string().optional(),
  category_id: z.string().optional(),
  subcategory_id: z.string().optional(),
  lat: z.coerce.number(),
  lon: z.coerce.number(),
});

type FormData = z.infer<typeof schema>;

interface PointFormModalProps {
  open: boolean;
  point?: Point | null;
  initialLat?: number;
  initialLon?: number;
  categories: Category[];
  /** Called with the payload and a pre-generated UUID for new points */
  onSave: (data: Omit<Point, 'id' | 'created_at'>, pointId: string) => Promise<void>;
  onClose: () => void;
}

export function PointFormModal({
  open,
  point,
  initialLat,
  initialLon,
  categories,
  onSave,
  onClose,
}: PointFormModalProps) {
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [removedPhotos, setRemovedPhotos] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const watchedCategoryId = watch('category_id');

  useEffect(() => {
    if (open) {
      reset({
        title: point?.title ?? '',
        description: point?.description ?? '',
        suggestion: point?.suggestion ?? '',
        category_id: point?.category_id ?? '',
        subcategory_id: point?.subcategory_id ?? '',
        lat: point?.lat ?? initialLat ?? 0,
        lon: point?.lon ?? initialLon ?? 0,
      });
      setExistingPhotos(point?.photo_urls ?? []);
      setPhotoFiles([]);
      setRemovedPhotos([]);
      setSelectedCategoryId(point?.category_id ?? '');
    }
  }, [open, point, initialLat, initialLon, reset]);

  useEffect(() => {
    setSelectedCategoryId(watchedCategoryId ?? '');
    setValue('subcategory_id', '');
  }, [watchedCategoryId, setValue]);

  const rootCategories = categories.filter((c) => !c.parent_id);
  const subcategories = categories.filter((c) => c.parent_id === selectedCategoryId);

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      // Use existing ID when editing, or pre-generate one for new points
      const pointId = point?.id ?? crypto.randomUUID();

      for (const url of removedPhotos) {
        await deletePointPhoto(url);
      }

      const uploadedUrls: string[] = [];
      for (const file of photoFiles) {
        const url = await uploadPointPhoto(pointId, file);
        uploadedUrls.push(url);
      }

      const finalPhotos = [...existingPhotos, ...uploadedUrls];

      await onSave(
        {
          title: data.title,
          description: data.description ?? null,
          suggestion: data.suggestion ?? null,
          lat: data.lat,
          lon: data.lon,
          category_id: data.category_id ?? null,
          subcategory_id: data.subcategory_id ?? null,
          photo_urls: finalPhotos,
        },
        pointId
      );
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const removeExistingPhoto = (url: string) => {
    setExistingPhotos((prev) => prev.filter((u) => u !== url));
    setRemovedPhotos((prev) => [...prev, url]);
  };

  return (
    <Modal open={open} onClose={onClose} title={point ? 'Editar punto' : 'Nuevo punto'} maxWidth="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Título *" error={errors.title?.message} {...register('title')} />
        <Textarea label="Descripción" {...register('description')} />
        <Textarea label="Sugerencia de Carlos" {...register('suggestion')} />

        <CoordsPasteField
          onParse={(lat, lon) => {
            setValue('lat', lat);
            setValue('lon', lon);
          }}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Latitud" type="number" step="any" {...register('lat')} />
          <Input label="Longitud" type="number" step="any" {...register('lon')} />
        </div>

        <Select
          label="Categoría"
          placeholder="Sin categoría"
          options={rootCategories.map((c) => ({ value: c.id, label: c.name }))}
          {...register('category_id')}
        />

        {subcategories.length > 0 && (
          <Select
            label="Subcategoría"
            placeholder="Sin subcategoría"
            options={subcategories.map((c) => ({ value: c.id, label: c.name }))}
            {...register('subcategory_id')}
          />
        )}

        {existingPhotos.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Fotos actuales</p>
            <div className="flex flex-wrap gap-2">
              {existingPhotos.map((url) => (
                <div key={url} className="relative group">
                  <img src={url} alt="" className="w-16 h-16 object-cover rounded-lg border" />
                  <button
                    type="button"
                    onClick={() => removeExistingPhoto(url)}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <PhotoUploader files={photoFiles} onChange={setPhotoFiles} />

        <div className="flex gap-2 pt-2 justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={saving}>
            {point ? 'Guardar cambios' : 'Crear punto'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
