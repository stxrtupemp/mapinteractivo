import { useState, useCallback } from 'react';
import { MapView } from '../components/map/MapView';
import { Sidebar } from '../components/sidebar/Sidebar';
import { LayerToggle } from '../components/map/LayerToggle';
import { PointDetailModal } from '../components/modals/PointDetailModal';
import { useCategories } from '../hooks/useCategories';
import { usePoints } from '../hooks/usePoints';
import { useAlerts } from '../hooks/useAlerts';
import { useZones } from '../hooks/useZones';
import { useUIStore } from '../store/uiStore';
import { Point } from '../types';

export default function VisitorPage() {
  const { categories } = useCategories();
  const { points } = usePoints();
  const { alerts } = useAlerts();
  const { zones } = useZones();

  const { setSelectedPointId, selectedPointId } = useUIStore();
  const [detailPoint, setDetailPoint] = useState<Point | null>(null);

  const handlePointClick = useCallback((point: Point) => {
    setDetailPoint(point);
    setSelectedPointId(point.id);
  }, [setSelectedPointId]);

  return (
    <div className="relative overflow-hidden" style={{ height: '100dvh', width: '100dvw' }}>
      {/* Map fills everything */}
      <div className="absolute inset-0">
        <MapView
          points={points}
          alerts={alerts}
          zones={zones}
          categories={categories}
          isAdmin={false}
          onPointClick={handlePointClick}
          onAlertClick={() => {}}
          onZoneClick={() => {}}
          onMapClick={() => {}}
          onZoneDrawn={() => {}}
          focusPointId={selectedPointId}
        />
      </div>

      {/* Overlay UI */}
      <Sidebar categories={categories} points={points} onPointClick={handlePointClick} />
      <LayerToggle />

      <PointDetailModal
        point={detailPoint}
        categories={categories}
        isAdmin={false}
        onClose={() => { setDetailPoint(null); setSelectedPointId(null); }}
        onEdit={() => {}}
        onDelete={() => {}}
      />
    </div>
  );
}
