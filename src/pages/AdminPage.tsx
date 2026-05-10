import { useState, useCallback } from 'react';
import { MapView } from '../components/map/MapView';
import { Sidebar } from '../components/sidebar/Sidebar';
import { LayerToggle } from '../components/map/LayerToggle';
import { AdminToolbar } from '../components/admin/AdminToolbar';
import { PointDetailModal } from '../components/modals/PointDetailModal';
import { PointFormModal } from '../components/modals/PointFormModal';
import { AlertFormModal } from '../components/modals/AlertFormModal';
import { ZoneFormModal } from '../components/modals/ZoneFormModal';
import { useCategories } from '../hooks/useCategories';
import { usePoints } from '../hooks/usePoints';
import { useAlerts } from '../hooks/useAlerts';
import { useZones } from '../hooks/useZones';
import { useAuth } from '../hooks/useAuth';
import { useUIStore } from '../store/uiStore';
import { Point, Alert, Zone } from '../types';
import { PenLine, X } from 'lucide-react';

export default function AdminPage() {
  const { categories, createCategory, updateCategory, deleteCategory } = useCategories();
  const { points, createPoint, updatePoint, deletePoint } = usePoints();
  const { alerts, createAlert, updateAlert, deleteAlert } = useAlerts();
  const { zones, createZone, updateZone, deleteZone } = useZones();
  const { signOut } = useAuth();

  const {
    addingPointMode,
    addingAlertMode,
    drawingZoneMode,
    clearInteractionModes,
    setSelectedPointId,
    selectedPointId,
    setDrawingZoneMode,
  } = useUIStore();

  const [detailPoint, setDetailPoint] = useState<Point | null>(null);
  const [editPoint, setEditPoint] = useState<Point | null>(null);
  const [pointFormOpen, setPointFormOpen] = useState(false);
  const [pendingLatLon, setPendingLatLon] = useState<{ lat: number; lon: number } | null>(null);

  const [editAlert, setEditAlert] = useState<Alert | null>(null);
  const [alertFormOpen, setAlertFormOpen] = useState(false);
  const [pendingAlertLatLon, setPendingAlertLatLon] = useState<{ lat: number; lon: number } | null>(null);

  const [editZone, setEditZone] = useState<Zone | null>(null);
  const [zoneFormOpen, setZoneFormOpen] = useState(false);
  const [pendingGeojson, setPendingGeojson] = useState<GeoJSON.Polygon | null>(null);

  const handleMapClick = useCallback(
    (lat: number, lon: number) => {
      if (addingPointMode) {
        setPendingLatLon({ lat, lon });
        setPointFormOpen(true);
        clearInteractionModes();
      } else if (addingAlertMode) {
        setPendingAlertLatLon({ lat, lon });
        setAlertFormOpen(true);
        clearInteractionModes();
      }
    },
    [addingPointMode, addingAlertMode, clearInteractionModes]
  );

  const handleZoneDrawn = useCallback(
    (geojson: GeoJSON.Polygon) => {
      setPendingGeojson(geojson);
      setZoneFormOpen(true);
      setDrawingZoneMode(false);
    },
    [setDrawingZoneMode]
  );

  const handlePointClick = useCallback(
    (point: Point) => {
      setDetailPoint(point);
      setSelectedPointId(point.id);
    },
    [setSelectedPointId]
  );

  const handleAlertClick = useCallback((alert: Alert) => {
    setEditAlert(alert);
    setAlertFormOpen(true);
  }, []);

  const handleZoneClick = useCallback((zone: Zone) => {
    setEditZone(zone);
    setZoneFormOpen(true);
  }, []);

  const handleSavePoint = async (data: Omit<Point, 'id' | 'created_at'>, pointId: string) => {
    if (editPoint) {
      await updatePoint(editPoint.id, data);
    } else {
      await createPoint(data, pointId);
    }
  };

  const handleDeletePoint = async (point: Point) => {
    if (!confirm(`¿Borrar "${point.title}"? También se borrarán sus fotos.`)) return;
    await deletePoint(point.id);
    setDetailPoint(null);
    setSelectedPointId(null);
  };

  const handleSaveAlert = async (data: Omit<Alert, 'id' | 'created_at'>) => {
    if (editAlert) {
      await updateAlert(editAlert.id, data);
    } else {
      await createAlert(data);
    }
  };

  const handleSaveZone = async (data: Omit<Zone, 'id' | 'created_at'>) => {
    if (editZone) {
      await updateZone(editZone.id, data);
    } else {
      await createZone(data);
    }
  };

  const closeAlertForm = () => {
    setAlertFormOpen(false);
    setEditAlert(null);
    setPendingAlertLatLon(null);
  };

  const closeZoneForm = () => {
    setZoneFormOpen(false);
    setEditZone(null);
    setPendingGeojson(null);
  };

  return (
    <div className="relative overflow-hidden" style={{ height: '100dvh', width: '100dvw' }}>
      {/* Map fills everything */}
      <div className="absolute inset-0">
        <MapView
          points={points}
          alerts={alerts}
          zones={zones}
          categories={categories}
          isAdmin={true}
          onPointClick={handlePointClick}
          onAlertClick={handleAlertClick}
          onZoneClick={handleZoneClick}
          onMapClick={handleMapClick}
          onZoneDrawn={handleZoneDrawn}
          focusPointId={selectedPointId}
        />
      </div>

      {/* Drawing mode banner */}
      {drawingZoneMode && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[700] flex items-center gap-2
          bg-gray-900/90 text-white text-sm px-4 py-2.5 rounded-full shadow-lg backdrop-blur-sm">
          <PenLine size={15} className="shrink-0" />
          <span>Haz clic en el mapa para trazar el polígono. Cierra con doble clic.</span>
          <button onClick={() => setDrawingZoneMode(false)} className="ml-1 hover:text-gray-300">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Overlay UI */}
      <Sidebar categories={categories} points={points} onPointClick={handlePointClick} />
      <LayerToggle />
      <AdminToolbar
        categories={categories}
        onCreateCategory={createCategory}
        onUpdateCategory={updateCategory}
        onDeleteCategory={deleteCategory}
        onSignOut={signOut}
      />

      {/* Modals */}
      <PointDetailModal
        point={detailPoint}
        categories={categories}
        isAdmin={true}
        onClose={() => { setDetailPoint(null); setSelectedPointId(null); }}
        onEdit={(p) => {
          setDetailPoint(null);
          setEditPoint(p);
          setPointFormOpen(true);
        }}
        onDelete={handleDeletePoint}
      />

      <PointFormModal
        open={pointFormOpen}
        point={editPoint}
        initialLat={pendingLatLon?.lat}
        initialLon={pendingLatLon?.lon}
        categories={categories}
        onSave={handleSavePoint}
        onClose={() => {
          setPointFormOpen(false);
          setEditPoint(null);
          setPendingLatLon(null);
        }}
      />

      <AlertFormModal
        open={alertFormOpen}
        alert={editAlert}
        initialLat={pendingAlertLatLon?.lat}
        initialLon={pendingAlertLatLon?.lon}
        onSave={handleSaveAlert}
        onDelete={async (a) => { await deleteAlert(a.id); }}
        onClose={closeAlertForm}
      />

      <ZoneFormModal
        open={zoneFormOpen}
        zone={editZone}
        pendingGeojson={pendingGeojson}
        onSave={handleSaveZone}
        onDelete={async (z) => { await deleteZone(z.id); }}
        onClose={closeZoneForm}
      />
    </div>
  );
}
