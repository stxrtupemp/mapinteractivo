import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Trash2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input, Textarea } from '../ui/Input';
import { ColorPicker } from '../ui/ColorPicker';
import { Button } from '../ui/Button';
import { Zone } from '../../types';
import { DEFAULT_ZONE_COLOR, DEFAULT_ZONE_OPACITY } from '../../lib/constants';

const schema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  description: z.string().optional(),
  opacity: z.coerce.number().min(0).max(1),
});

type FormData = z.infer<typeof schema>;

interface ZoneFormModalProps {
  open: boolean;
  zone?: Zone | null;
  pendingGeojson?: GeoJSON.Polygon | null;
  onSave: (data: Omit<Zone, 'id' | 'created_at'>) => Promise<void>;
  onDelete?: (zone: Zone) => Promise<void>;
  onClose: () => void;
}

export function ZoneFormModal({
  open,
  zone,
  pendingGeojson,
  onSave,
  onDelete,
  onClose,
}: ZoneFormModalProps) {
  const [color, setColor] = useState(DEFAULT_ZONE_COLOR);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (open) {
      reset({
        name: zone?.name ?? '',
        description: zone?.description ?? '',
        opacity: zone?.opacity ?? DEFAULT_ZONE_OPACITY,
      });
      setColor(zone?.color ?? DEFAULT_ZONE_COLOR);
    }
  }, [open, zone, reset]);

  const onSubmit = async (data: FormData) => {
    const geojson = zone?.geojson ?? pendingGeojson;
    if (!geojson) return;
    setSaving(true);
    try {
      await onSave({
        name: data.name,
        description: data.description ?? null,
        color,
        opacity: data.opacity,
        geojson,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!zone || !onDelete) return;
    if (!confirm(`¿Borrar zona "${zone.name}"?`)) return;
    await onDelete(zone);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={zone ? 'Editar zona' : 'Nueva zona'}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input label="Nombre *" error={errors.name?.message} {...register('name')} />
        <Textarea label="Descripción" {...register('description')} />
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Opacidad</label>
          <input type="range" min={0} max={1} step={0.05} className="w-full" {...register('opacity')} />
        </div>
        <ColorPicker label="Color de relleno" value={color} onChange={setColor} />
        <div className="flex gap-2 justify-between pt-2">
          {zone && onDelete ? (
            <Button type="button" variant="danger" size="sm" onClick={handleDelete}>
              <Trash2 size={13} />
              Borrar
            </Button>
          ) : <div />}
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button type="submit" loading={saving}>
              {zone ? 'Guardar' : 'Crear zona'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
