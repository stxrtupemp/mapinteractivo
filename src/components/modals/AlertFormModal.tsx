import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Trash2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input, Textarea } from '../ui/Input';
import { Select } from '../ui/Select';
import { ColorPicker } from '../ui/ColorPicker';
import { Button } from '../ui/Button';
import { CoordsPasteField } from '../ui/CoordsPasteField';
import { Alert } from '../../types';
import { DEFAULT_ALERT_COLOR } from '../../lib/constants';

const schema = z.object({
  type: z.string().min(1),
  title: z.string().min(1, 'Título requerido'),
  description: z.string().optional(),
  lat: z.coerce.number(),
  lon: z.coerce.number(),
});

type FormData = z.infer<typeof schema>;

const ALERT_TYPES = [
  { value: 'radar', label: 'Radar de velocidad' },
  { value: 'danger', label: 'Peligro' },
  { value: 'info', label: 'Información' },
];

interface AlertFormModalProps {
  open: boolean;
  alert?: Alert | null;
  initialLat?: number;
  initialLon?: number;
  onSave: (data: Omit<Alert, 'id' | 'created_at'>) => Promise<void>;
  onDelete?: (alert: Alert) => Promise<void>;
  onClose: () => void;
}

export function AlertFormModal({
  open,
  alert,
  initialLat,
  initialLon,
  onSave,
  onDelete,
  onClose,
}: AlertFormModalProps) {
  const [color, setColor] = useState(DEFAULT_ALERT_COLOR);
  const [saving, setSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (open) {
      reset({
        type: alert?.type ?? 'radar',
        title: alert?.title ?? '',
        description: alert?.description ?? '',
        lat: alert?.lat ?? initialLat ?? 0,
        lon: alert?.lon ?? initialLon ?? 0,
      });
      setColor(alert?.color ?? DEFAULT_ALERT_COLOR);
    }
  }, [open, alert, initialLat, initialLon, reset]);

  const onSubmit = async (data: FormData) => {
    setSaving(true);
    try {
      await onSave({
        type: data.type,
        title: data.title,
        description: data.description ?? null,
        lat: data.lat,
        lon: data.lon,
        color,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!alert || !onDelete) return;
    if (!confirm(`¿Borrar alerta "${alert.title}"?`)) return;
    await onDelete(alert);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={alert ? 'Editar alerta' : 'Nueva alerta'}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Select label="Tipo" options={ALERT_TYPES} {...register('type')} />
        <Input label="Título *" error={errors.title?.message} {...register('title')} />
        <Textarea label="Descripción" {...register('description')} />
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
        <ColorPicker label="Color" value={color} onChange={setColor} />
        <div className="flex gap-2 justify-between pt-2">
          {alert && onDelete ? (
            <Button type="button" variant="danger" size="sm" onClick={handleDelete}>
              <Trash2 size={13} />
              Borrar
            </Button>
          ) : <div />}
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
            <Button type="submit" loading={saving}>
              {alert ? 'Guardar' : 'Crear alerta'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
