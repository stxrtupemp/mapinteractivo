import { useState } from 'react';
import { MapPin, AlertTriangle, PenLine, Tags, FileJson, LogOut, X, Settings } from 'lucide-react';
import { Button } from '../ui/Button';
import { useUIStore } from '../../store/uiStore';
import { CategoryFormModal } from '../modals/CategoryFormModal';
import { ImportExportPanel } from './ImportExportPanel';
import { Category } from '../../types';

interface AdminToolbarProps {
  categories: Category[];
  onCreateCategory: (data: Omit<Category, 'id' | 'created_at'>) => Promise<void>;
  onUpdateCategory: (id: string, data: Partial<Omit<Category, 'id' | 'created_at'>>) => Promise<void>;
  onDeleteCategory: (id: string) => Promise<void>;
  onSignOut: () => void;
}

export function AdminToolbar({
  categories,
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  onSignOut,
}: AdminToolbarProps) {
  const {
    addingPointMode,
    addingAlertMode,
    drawingZoneMode,
    setAddingPointMode,
    setAddingAlertMode,
    setDrawingZoneMode,
    clearInteractionModes,
  } = useUIStore();

  const [panelOpen, setPanelOpen] = useState(false);
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [ieModalOpen, setIeModalOpen] = useState(false);

  const anyMode = addingPointMode || addingAlertMode || drawingZoneMode;

  return (
    <>
      {/* Mobile backdrop */}
      {panelOpen && (
        <div
          className="absolute inset-0 z-[695] bg-black/30 md:hidden"
          onClick={() => setPanelOpen(false)}
        />
      )}

      {/* Floating toggle button — top right */}
      <button
        onClick={() => setPanelOpen((o) => !o)}
        className={`absolute top-20 right-2 z-[700] bg-gray-900 text-white rounded-xl shadow-lg p-2.5
          border border-gray-700 hover:bg-gray-800 transition-all duration-200
          ${panelOpen ? 'opacity-0 pointer-events-none scale-90' : 'opacity-100 scale-100'}`}
        title="Panel admin"
        aria-label="Abrir panel admin"
      >
        <Settings size={20} />
      </button>

      {/* Slide-in panel from right */}
      <div
        className={`absolute inset-y-0 right-0 z-[700] flex flex-col bg-white shadow-2xl
          transition-transform duration-300 ease-in-out
          w-[85vw] max-w-xs
          ${panelOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-gray-900 text-white px-4 py-3 shrink-0">
          <span className="text-sm font-semibold">Panel Admin</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onSignOut}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              title="Cerrar sesión"
            >
              <LogOut size={15} />
            </button>
            <button
              onClick={() => setPanelOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              aria-label="Cerrar panel"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-3 flex flex-col gap-2 overflow-y-auto">
          {anyMode && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-700 flex items-center justify-between">
              <span>
                {addingPointMode && 'Toca el mapa para añadir un punto'}
                {addingAlertMode && 'Toca el mapa para añadir una alerta'}
                {drawingZoneMode && 'Dibuja el polígono en el mapa'}
              </span>
              <button onClick={clearInteractionModes} className="ml-2 hover:text-blue-900 shrink-0">
                <X size={13} />
              </button>
            </div>
          )}

          <Button
            variant={addingPointMode ? 'primary' : 'secondary'}
            size="sm"
            className="w-full justify-start"
            onClick={() => { setAddingPointMode(!addingPointMode); setPanelOpen(false); }}
          >
            <MapPin size={15} />
            Añadir punto
          </Button>

          <Button
            variant={addingAlertMode ? 'primary' : 'secondary'}
            size="sm"
            className="w-full justify-start"
            onClick={() => { setAddingAlertMode(!addingAlertMode); setPanelOpen(false); }}
          >
            <AlertTriangle size={15} />
            Añadir alerta
          </Button>

          <Button
            variant={drawingZoneMode ? 'primary' : 'secondary'}
            size="sm"
            className="w-full justify-start"
            onClick={() => { setDrawingZoneMode(!drawingZoneMode); setPanelOpen(false); }}
          >
            <PenLine size={15} />
            Dibujar zona
          </Button>

          <hr className="my-1" />

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => { setCatModalOpen(true); setPanelOpen(false); }}
          >
            <Tags size={15} />
            Gestionar categorías
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => { setIeModalOpen(true); setPanelOpen(false); }}
          >
            <FileJson size={15} />
            Importar / Exportar
          </Button>
        </div>
      </div>

      <CategoryFormModal
        open={catModalOpen}
        categories={categories}
        onCreate={onCreateCategory}
        onUpdate={onUpdateCategory}
        onDelete={onDeleteCategory}
        onClose={() => setCatModalOpen(false)}
      />

      <ImportExportPanel open={ieModalOpen} onClose={() => setIeModalOpen(false)} />
    </>
  );
}
