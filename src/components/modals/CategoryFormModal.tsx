import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { ColorPicker } from '../ui/ColorPicker';
import { Button } from '../ui/Button';
import { Category } from '../../types';
import { DEFAULT_CATEGORY_COLOR } from '../../lib/constants';

interface CategoryFormModalProps {
  open: boolean;
  categories: Category[];
  onCreate: (data: Omit<Category, 'id' | 'created_at'>) => Promise<void>;
  onUpdate: (id: string, data: Partial<Omit<Category, 'id' | 'created_at'>>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onClose: () => void;
}

interface FormState {
  name: string;
  color: string;
  icon: string;
  parent_id: string;
}

const emptyForm = (): FormState => ({
  name: '',
  color: DEFAULT_CATEGORY_COLOR,
  icon: '',
  parent_id: '',
});

export function CategoryFormModal({
  open,
  categories,
  onCreate,
  onUpdate,
  onDelete,
  onClose,
}: CategoryFormModalProps) {
  const [form, setForm] = useState<FormState>(emptyForm());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const rootCategories = categories.filter((c) => !c.parent_id);

  useEffect(() => {
    if (!open) {
      setForm(emptyForm());
      setEditingId(null);
    }
  }, [open]);

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      color: cat.color,
      icon: cat.icon ?? '',
      parent_id: cat.parent_id ?? '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm());
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        color: form.color,
        icon: form.icon || null,
        parent_id: form.parent_id || null,
      };
      if (editingId) {
        await onUpdate(editingId, payload);
      } else {
        await onCreate(payload);
      }
      setForm(emptyForm());
      setEditingId(null);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Borrar esta categoría? Los puntos asociados quedarán sin categoría.')) return;
    await onDelete(id);
  };

  return (
    <Modal open={open} onClose={onClose} title="Gestionar categorías" maxWidth="lg">
      <div className="flex flex-col gap-5">
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center justify-between">
            <span>Categorías existentes</span>
            {categories.length > 0 && (
              <span className="text-gray-400 font-normal normal-case">{categories.length}</span>
            )}
          </div>
          {categories.length === 0 ? (
            <p className="px-3 py-4 text-sm text-gray-400">Sin categorías.</p>
          ) : (
            <ul className="divide-y max-h-48 overflow-y-auto overscroll-contain">
              {categories.map((cat) => (
                <li key={cat.id} className="flex items-center gap-2 px-3 py-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="flex-1 text-sm text-gray-700 truncate">
                    {cat.parent_id ? (
                      <span className="text-gray-400 mr-1">↳</span>
                    ) : null}
                    {cat.name}
                  </span>
                  <button
                    onClick={() => startEdit(cat)}
                    className="p-1 hover:bg-gray-100 rounded text-gray-500"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-1 hover:bg-red-50 rounded text-red-500"
                  >
                    <Trash2 size={13} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border rounded-lg p-4 flex flex-col gap-3">
          <p className="text-sm font-semibold text-gray-700">
            {editingId ? 'Editando categoría' : 'Nueva categoría'}
          </p>

          <Input
            label="Nombre *"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Ej. Restaurantes"
          />

          <Input
            label="Icono (nombre lucide, opcional)"
            value={form.icon}
            onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
            placeholder="Ej. utensils"
          />

          <Select
            label="Subcategoría de"
            placeholder="Es categoría raíz"
            options={rootCategories.map((c) => ({ value: c.id, label: c.name }))}
            value={form.parent_id}
            onChange={(e) => setForm((f) => ({ ...f, parent_id: e.target.value }))}
          />

          <ColorPicker
            label="Color"
            value={form.color}
            onChange={(c) => setForm((f) => ({ ...f, color: c }))}
          />

          <div className="flex gap-2 justify-end">
            {editingId && (
              <Button variant="secondary" size="sm" onClick={cancelEdit}>
                Cancelar
              </Button>
            )}
            <Button size="sm" loading={saving} onClick={handleSave}>
              <Plus size={14} />
              {editingId ? 'Guardar' : 'Crear'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
