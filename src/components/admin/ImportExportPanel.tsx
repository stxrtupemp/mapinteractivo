import { useRef, useState } from 'react';
import { Download, Upload, AlertTriangle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { exportBackup, downloadBackup, importBackup, Backup } from '../../lib/jsonBackup';

const BackupSummarySchema = {
  parse(raw: unknown): Backup {
    const b = raw as Record<string, unknown>;
    if (b.version !== 1) throw new Error('Versión de backup incompatible');
    if (!Array.isArray(b.categories)) throw new Error('categories no es un array');
    if (!Array.isArray(b.points)) throw new Error('points no es un array');
    if (!Array.isArray(b.alerts)) throw new Error('alerts no es un array');
    if (!Array.isArray(b.zones)) throw new Error('zones no es un array');
    return raw as Backup;
  },
};

interface ImportExportPanelProps {
  open: boolean;
  onClose: () => void;
}

export function ImportExportPanel({ open, onClose }: ImportExportPanelProps) {
  const [exporting, setExporting] = useState(false);
  const [importPreview, setImportPreview] = useState<{ data: Backup; mode: 'replace' | 'merge' } | null>(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    setExporting(true);
    try {
      const backup = await exportBackup();
      downloadBackup(backup);
    } catch (e) {
      setError(String(e));
    } finally {
      setExporting(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    try {
      const text = await file.text();
      const raw = JSON.parse(text) as unknown;
      const data = BackupSummarySchema.parse(raw);
      setImportPreview({ data, mode: 'merge' });
    } catch (err) {
      setError('Archivo inválido: ' + String(err));
    }
    e.target.value = '';
  };

  const handleImport = async () => {
    if (!importPreview) return;
    setImporting(true);
    try {
      await importBackup(importPreview.data, importPreview.mode);
      setImportPreview(null);
      onClose();
    } catch (e) {
      setError(String(e));
    } finally {
      setImporting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Importar / Exportar datos">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-gray-700">Exportar</p>
          <p className="text-xs text-gray-500">
            Descarga un JSON con todas las categorías, puntos, alertas y zonas (sin archivos de fotos).
          </p>
          <Button variant="secondary" loading={exporting} onClick={handleExport} className="self-start">
            <Download size={14} />
            Exportar JSON
          </Button>
        </div>

        <hr />

        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-gray-700">Importar</p>
          <p className="text-xs text-gray-500">Selecciona un JSON exportado previamente.</p>
          <Button variant="secondary" onClick={() => fileRef.current?.click()} className="self-start">
            <Upload size={14} />
            Seleccionar archivo
          </Button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleFileSelect} />
        </div>

        {error && (
          <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
            <AlertTriangle size={14} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        {importPreview && (
          <div className="flex flex-col gap-3 border rounded-lg p-4 bg-amber-50">
            <p className="text-sm font-semibold text-amber-800">Resumen del archivo</p>
            <ul className="text-xs text-amber-700 space-y-0.5">
              <li>Categorías: <strong>{importPreview.data.categories.length}</strong></li>
              <li>Puntos: <strong>{importPreview.data.points.length}</strong></li>
              <li>Alertas: <strong>{importPreview.data.alerts.length}</strong></li>
              <li>Zonas: <strong>{importPreview.data.zones.length}</strong></li>
            </ul>

            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="import-mode"
                  value="merge"
                  checked={importPreview.mode === 'merge'}
                  onChange={() => setImportPreview((p) => p ? { ...p, mode: 'merge' } : p)}
                />
                <span><strong>Fusionar</strong> — añadir sin borrar lo existente</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="import-mode"
                  value="replace"
                  checked={importPreview.mode === 'replace'}
                  onChange={() => setImportPreview((p) => p ? { ...p, mode: 'replace' } : p)}
                />
                <span>
                  <strong className="text-red-600">Reemplazar todo</strong> — borra el contenido actual primero
                </span>
              </label>
            </div>

            {importPreview.mode === 'replace' && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                <AlertTriangle size={13} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-red-700">
                  ¡Atención! Esta acción borrará <strong>todos</strong> los datos actuales.
                  Haz una exportación antes si quieres un backup.
                </p>
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <Button variant="secondary" size="sm" onClick={() => setImportPreview(null)}>
                Cancelar
              </Button>
              <Button
                size="sm"
                variant={importPreview.mode === 'replace' ? 'danger' : 'primary'}
                loading={importing}
                onClick={handleImport}
              >
                Confirmar importación
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
