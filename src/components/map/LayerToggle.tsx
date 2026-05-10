import { AlertTriangle, Layers } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

export function LayerToggle() {
  const { showAlerts, showZones, toggleAlerts, toggleZones } = useUIStore();

  return (
    <div className="absolute bottom-8 right-4 z-[600] flex flex-col gap-2">
      <button
        onClick={toggleAlerts}
        title={showAlerts ? 'Ocultar alertas' : 'Mostrar alertas'}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl shadow-lg text-xs font-semibold
          border transition-colors
          ${showAlerts
            ? 'bg-red-500 text-white border-red-600 hover:bg-red-600'
            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
      >
        <AlertTriangle size={14} />
        Alertas
      </button>
      <button
        onClick={toggleZones}
        title={showZones ? 'Ocultar zonas' : 'Mostrar zonas'}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl shadow-lg text-xs font-semibold
          border transition-colors
          ${showZones
            ? 'bg-purple-600 text-white border-purple-700 hover:bg-purple-700'
            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
      >
        <Layers size={14} />
        Zonas
      </button>
    </div>
  );
}
